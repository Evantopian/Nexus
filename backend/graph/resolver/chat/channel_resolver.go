package chat

import (
	"context"
	"fmt"
	"time"

	"github.com/Evantopian/Nexus/graph/model"
	"github.com/Evantopian/Nexus/internal/database/postgres"
	contextkey "github.com/Evantopian/Nexus/internal/services"
	"github.com/google/uuid"
)

func CreateChannel(ctx context.Context, serverID uuid.UUID, name string, typeArg model.ChannelType, categoryID *uuid.UUID) (*model.Channel, error) {
	userStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userStr == "" {
		return nil, fmt.Errorf("unauthorized: user ID missing")
	}
	_, err := uuid.Parse(userStr)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID")
	}

	channelID := uuid.New()
	query := `INSERT INTO channels (id, server_id, name, type, category_id, created_at) VALUES ($1, $2, $3, $4, $5, $6)`
	_, err = postgres.DB.Exec(ctx, query, channelID, serverID, name, typeArg, categoryID, time.Now().UTC())
	if err != nil {
		return nil, fmt.Errorf("failed to create channel: %v", err)
	}

	return &model.Channel{
		ID:         channelID,
		Name:       name,
		Type:       typeArg,
		ServerID:   serverID,
		CategoryID: categoryID,
	}, nil
}

func DeleteChannel(ctx context.Context, channelID uuid.UUID) (bool, error) {
	query := `DELETE FROM channels WHERE id = $1`
	_, err := postgres.DB.Exec(ctx, query, channelID)
	if err != nil {
		return false, fmt.Errorf("failed to delete channel: %v", err)
	}
	return true, nil
}

func LeaveChannel(ctx context.Context, channelID uuid.UUID) (bool, error) {
	userStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userStr == "" {
		return false, fmt.Errorf("unauthorized: user ID missing")
	}
	userUUID, err := uuid.Parse(userStr)
	if err != nil {
		return false, fmt.Errorf("invalid user UUID")
	}

	query := `DELETE FROM channel_members WHERE channel_id = $1 AND user_id = $2`
	_, err = postgres.DB.Exec(ctx, query, channelID, userUUID)
	if err != nil {
		return false, fmt.Errorf("failed to leave channel: %v", err)
	}
	return true, nil
}

func GetChannels(ctx context.Context, serverID uuid.UUID) ([]*model.Channel, error) {
	query := `SELECT id, name, type, server_id, category_id FROM channels WHERE server_id = $1`
	rows, err := postgres.DB.Query(ctx, query, serverID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch channels: %v", err)
	}
	defer rows.Close()

	var channels []*model.Channel
	for rows.Next() {
		var c model.Channel
		err := rows.Scan(&c.ID, &c.Name, &c.Type, &c.ServerID, &c.CategoryID)
		if err != nil {
			return nil, err
		}
		channels = append(channels, &c)
	}
	return channels, nil
}

func GetChannelMessages(ctx context.Context, channelID uuid.UUID) ([]*model.Message, error) {
	query := `SELECT id, sender_id, body, created_at FROM messages WHERE channel_id = $1 ORDER BY created_at ASC`
	rows, err := postgres.DB.Query(ctx, query, channelID)
	if err != nil {
		return nil, fmt.Errorf("failed to get messages: %v", err)
	}
	defer rows.Close()

	var messages []*model.Message
	for rows.Next() {
		var msg model.Message
		var senderID uuid.UUID
		var ts time.Time
		err := rows.Scan(&msg.ID, &senderID, &msg.Body, &ts)
		if err != nil {
			return nil, err
		}
		msg.Timestamp = ts.Format(time.RFC3339)
		msg.Sender = &model.ChatUser{ID: senderID}
		messages = append(messages, &msg)
	}
	return messages, nil
}