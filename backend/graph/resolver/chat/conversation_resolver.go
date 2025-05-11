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

func StartConversation(ctx context.Context, participantIDs []uuid.UUID) (*model.Conversation, error) {
	userUUIDStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userUUIDStr == "" {
		return nil, fmt.Errorf("unauthorized: user ID missing")
	}

	creatorUUID, err := uuid.Parse(userUUIDStr)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID: %v", err)
	}

	// Include the creator in the participants if not already present
	included := false
	for _, id := range participantIDs {
		if id == creatorUUID {
			included = true
			break
		}
	}
	if !included {
		participantIDs = append(participantIDs, creatorUUID)
	}

	conversationID := uuid.New()
	isGroup := len(participantIDs) > 2
	tx, err := postgres.DB.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to start transaction: %v", err)
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, `INSERT INTO conversations (id, is_group, created_at) VALUES ($1, $2, $3)`, conversationID, isGroup, time.Now().UTC())
	if err != nil {
		return nil, fmt.Errorf("failed to create conversation: %v", err)
	}

	for _, id := range participantIDs {
		_, err := tx.Exec(ctx, `INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)`, conversationID, id)
		if err != nil {
			return nil, fmt.Errorf("failed to add participant: %v", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %v", err)
	}

	participants := make([]*model.ChatUser, 0, len(participantIDs))
	for _, id := range participantIDs {
		participants = append(participants, &model.ChatUser{ID: id})
	}

	return &model.Conversation{
		ID:           conversationID,
		IsGroup:      isGroup,
		Participants: participants,
	}, nil
}

func GetConversations(ctx context.Context) ([]*model.Conversation, error) {
	userUUIDStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userUUIDStr == "" {
		return nil, fmt.Errorf("unauthorized: user ID missing")
	}
	userUUID, err := uuid.Parse(userUUIDStr)
	if err != nil {
		return nil, fmt.Errorf("invalid UUID: %v", err)
	}

	query := `SELECT c.id, c.is_group FROM conversations c
	JOIN conversation_participants p ON c.id = p.conversation_id
	WHERE p.user_id = $1`

	rows, err := postgres.DB.Query(ctx, query, userUUID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch conversations: %v", err)
	}
	defer rows.Close()

	var conversations []*model.Conversation
	for rows.Next() {
		var conv model.Conversation
		err := rows.Scan(&conv.ID, &conv.IsGroup)
		if err != nil {
			return nil, fmt.Errorf("scan error: %v", err)
		}
		conversations = append(conversations, &conv)
	}

	return conversations, nil
}
