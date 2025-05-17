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
    // Extract sender UUID from context
    userUUIDStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
    if !ok || userUUIDStr == "" {
        return nil, fmt.Errorf("unauthorized: user ID missing in context")
    }
    userUUID, err := uuid.Parse(userUUIDStr)
    if err != nil {
        return nil, fmt.Errorf("invalid user UUID: %v", err)
    }

    // Confirm participant
    var participantExists bool
    err = postgres.DB.QueryRow(ctx,
        `SELECT EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2)`,
        conversationID, userUUID,
    ).Scan(&participantExists)
    if err != nil {
        return nil, fmt.Errorf("failed to validate participant: %v", err)
    }
    if !participantExists {
        return nil, fmt.Errorf("forbidden: user is not a participant")
    }

    // Insert message and get its ID
    timestamp := time.Now().UTC().Format(time.RFC3339)
    var messageID uuid.UUID
    insert := `
        INSERT INTO messages (conversation_id, sender_id, body, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `
    if err := postgres.DB.QueryRow(ctx, insert, conversationID, userUUID, body, timestamp).Scan(&messageID); err != nil {
        return nil, fmt.Errorf("failed to insert message: %v", err)
    }

    // Fetch sender's username
    var username string
    if err := postgres.DB.QueryRow(ctx,
        `SELECT username FROM users WHERE uuid = $1`, userUUID,
    ).Scan(&username); err != nil {
        return nil, fmt.Errorf("failed to load sender username: %v", err)
    }

    return &model.Message{
        ID:        messageID,
        Body:      body,
        Timestamp: timestamp,
        Pinned:    false,
        Sender:    &model.ChatUser{ID: userUUID, Username: username},
    }, nil
}

func GetMessages(ctx context.Context, conversationID uuid.UUID) ([]*model.Message, error) {
    query := `
        SELECT
            m.id,
            m.sender_id,
            m.body,
            m.created_at,
            u.username
        FROM messages m
        JOIN users u ON u.uuid = m.sender_id
        WHERE m.conversation_id = $1
        ORDER BY m.created_at ASC
    `
    rows, err := postgres.DB.Query(ctx, query, conversationID)
    if err != nil {
        return nil, fmt.Errorf("failed to get messages: %v", err)
    }
    defer rows.Close()

    var messages []*model.Message
    for rows.Next() {
        var (
            msg       model.Message
            senderID  uuid.UUID
            ts        time.Time
            username  string
        )
        if err := rows.Scan(&msg.ID, &senderID, &msg.Body, &ts, &username); err != nil {
            return nil, err
        }
        msg.Timestamp = ts.Format(time.RFC3339)
        msg.Sender    = &model.ChatUser{ID: senderID, Username: username}
        msg.Pinned    = false
        messages     = append(messages, &msg)
    }

    return messages, nil
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

func SendChannelMessage(ctx context.Context, channelID uuid.UUID, body string, replyToID *uuid.UUID) (*model.Message, error) {
	userStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userStr == "" {
		return nil, fmt.Errorf("unauthorized: user ID missing")
	}
	userUUID, err := uuid.Parse(userStr)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID")
	}

	messageID := uuid.New()
	timestamp := time.Now().UTC().Format(time.RFC3339)
	insert := `INSERT INTO messages (id, channel_id, sender_id, body, created_at, reply_to) VALUES ($1, $2, $3, $4, $5, $6)`
	_, err = postgres.DB.Exec(ctx, insert, messageID, channelID, userUUID, body, timestamp, replyToID)
	if err != nil {
		return nil, fmt.Errorf("failed to send channel message: %v", err)
	}

	return &model.Message{
		ID:        messageID,
		Body:      body,
		Timestamp: timestamp,
		Pinned:    false,
		Sender:    &model.ChatUser{ID: userUUID},
	}, nil
}

func PinMessage(ctx context.Context, messageID uuid.UUID) (bool, error) {
	userStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userStr == "" {
		return false, fmt.Errorf("unauthorized: user ID missing")
	}

	query := `UPDATE messages SET pinned = true WHERE id = $1`
	res, err := postgres.DB.Exec(ctx, query, messageID)
	if err != nil {
		return false, fmt.Errorf("failed to pin message: %v", err)
	}
	return res.RowsAffected() > 0, nil
}

func UnpinMessage(ctx context.Context, messageID uuid.UUID) (bool, error) {
	userStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userStr == "" {
		return false, fmt.Errorf("unauthorized: user ID missing")
	}

	query := `UPDATE messages SET pinned = false WHERE id = $1`
	res, err := postgres.DB.Exec(ctx, query, messageID)
	if err != nil {
		return false, fmt.Errorf("failed to unpin message: %v", err)
	}
	return res.RowsAffected() > 0, nil
}



func GetPinnedMessagesByChannel(ctx context.Context, channelID uuid.UUID) ([]*model.Message, error) {
	query := `SELECT id, sender_id, body, created_at FROM messages WHERE channel_id = $1 AND pinned = true ORDER BY created_at ASC`
	rows, err := postgres.DB.Query(ctx, query, channelID)
	if err != nil {
		return nil, fmt.Errorf("failed to get pinned messages for channel: %v", err)
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
		msg.Pinned = true
		msg.Sender = &model.ChatUser{ID: senderID}
		messages = append(messages, &msg)
	}
	return messages, nil
}

func GetPinnedMessagesByConversation(ctx context.Context, conversationID uuid.UUID) ([]*model.Message, error) {
	query := `SELECT id, sender_id, body, created_at FROM messages WHERE conversation_id = $1 AND pinned = true ORDER BY created_at ASC`
	rows, err := postgres.DB.Query(ctx, query, conversationID)
	if err != nil {
		return nil, fmt.Errorf("failed to get pinned messages for conversation: %v", err)
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
		msg.Pinned = true
		msg.Sender = &model.ChatUser{ID: senderID}
		messages = append(messages, &msg)
	}
	return messages, nil
}
