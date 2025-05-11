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

func SendMessage(ctx context.Context, conversationID uuid.UUID, body string) (*model.Message, error) {
	userUUIDStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userUUIDStr == "" {
		return nil, fmt.Errorf("unauthorized: user ID missing in context")
	}

	userUUID, err := uuid.Parse(userUUIDStr)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID: %v", err)
	}

	// Confirm user is a participant in the conversation
	var participantExists bool
	err = postgres.DB.QueryRow(ctx,
		`SELECT EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2)`,
		conversationID, userUUID,
	).Scan(&participantExists)
	if err != nil {
		return nil, fmt.Errorf("failed to validate conversation participant: %v", err)
	}
	if !participantExists {
		return nil, fmt.Errorf("forbidden: user is not a participant in the conversation")
	}

	// Insert message
	timestamp := time.Now().UTC().Format(time.RFC3339)
	var messageID uuid.UUID
	insert := `INSERT INTO messages (conversation_id, sender_id, body, created_at) VALUES ($1, $2, $3, $4) RETURNING id`
	err = postgres.DB.QueryRow(ctx, insert, conversationID, userUUID, body, timestamp).Scan(&messageID)
	if err != nil {
		return nil, fmt.Errorf("failed to insert message: %v", err)
	}

	return &model.Message{
		ID: messageID,
		Body: body,
		Timestamp: timestamp,
		Pinned: false,
		Sender: &model.ChatUser{
			ID: userUUID,
		},
	}, nil
}

func EditMessage(ctx context.Context, messageID uuid.UUID, body string) (*model.Message, error) {
	userUUIDStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userUUIDStr == "" {
		return nil, fmt.Errorf("unauthorized: user ID missing in context")
	}

	userUUID, err := uuid.Parse(userUUIDStr)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID: %v", err)
	}

	// Ensure user is the author
	var exists bool
	err = postgres.DB.QueryRow(ctx,
		`SELECT EXISTS (SELECT 1 FROM messages WHERE id = $1 AND sender_id = $2)`,
		messageID, userUUID,
	).Scan(&exists)
	if err != nil || !exists {
		return nil, fmt.Errorf("unauthorized or message not found")
	}

	timestamp := time.Now().UTC().Format(time.RFC3339)
	update := `UPDATE messages SET body = $1 WHERE id = $2`
	_, err = postgres.DB.Exec(ctx, update, body, messageID)
	if err != nil {
		return nil, fmt.Errorf("failed to update message: %v", err)
	}

	return &model.Message{
		ID: messageID,
		Body: body,
		Timestamp: timestamp,
		Pinned: false,
		Sender: &model.ChatUser{
			ID: userUUID,
		},
	}, nil
}

func DeleteMessage(ctx context.Context, messageID uuid.UUID) (bool, error) {
	userUUIDStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userUUIDStr == "" {
		return false, fmt.Errorf("unauthorized: user ID missing in context")
	}

	userUUID, err := uuid.Parse(userUUIDStr)
	if err != nil {
		return false, fmt.Errorf("invalid user UUID: %v", err)
	}

	// Check ownership
	var exists bool
	err = postgres.DB.QueryRow(ctx,
		`SELECT EXISTS (SELECT 1 FROM messages WHERE id = $1 AND sender_id = $2)`,
		messageID, userUUID,
	).Scan(&exists)
	if err != nil || !exists {
		return false, fmt.Errorf("unauthorized or message not found")
	}

	_, err = postgres.DB.Exec(ctx, `DELETE FROM messages WHERE id = $1`, messageID)
	if err != nil {
		return false, fmt.Errorf("failed to delete message: %v", err)
	}

	return true, nil
}
