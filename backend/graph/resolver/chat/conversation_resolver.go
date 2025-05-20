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


func GetGroupConversations(ctx context.Context, limit *int32, after *time.Time) ([]*model.GroupConversation, error) {
	userStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userStr == "" {
		return nil, fmt.Errorf("unauthorized: user ID missing")
	}
	userID, err := uuid.Parse(userStr)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID: %v", err)
	}

	query := `
		SELECT
			c.id,
			COALESCE(m.body, '') AS last_message,
			COALESCE(m.created_at, c.created_at) AS last_active
		FROM conversations c
		JOIN conversation_participants cp ON cp.conversation_id = c.id
		LEFT JOIN LATERAL (
			SELECT body, created_at
			FROM messages
			WHERE conversation_id = c.id
			ORDER BY created_at DESC
			LIMIT 1
		) m ON true
		WHERE c.is_group = true AND cp.user_id = $1
	`
	args := []interface{}{userID}
	argIndex := 2

	if after != nil {
		query += fmt.Sprintf(" AND COALESCE(m.created_at, c.created_at) < $%d", argIndex)
		args = append(args, *after)
		argIndex++
	}

	query += " ORDER BY last_active DESC"
	if limit != nil {
		query += fmt.Sprintf(" LIMIT %d", *limit)
	}

	rows, err := postgres.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch group conversations: %w", err)
	}
	defer rows.Close()

	var groups []*model.GroupConversation

	for rows.Next() {
		var convID uuid.UUID
		var lastMsg string
		var lastActive time.Time

		if err := rows.Scan(&convID, &lastMsg, &lastActive); err != nil {
			return nil, err
		}

		// Fetch participants
		pRows, err := postgres.DB.Query(ctx, `
			SELECT u.uuid, u.username
			FROM users u
			JOIN conversation_participants cp ON cp.user_id = u.uuid
			WHERE cp.conversation_id = $1
		`, convID)
		if err != nil {
			return nil, fmt.Errorf("failed to fetch participants: %w", err)
		}

		var participants []*model.User
		for pRows.Next() {
			var u model.User
			if err := pRows.Scan(&u.UUID, &u.Username); err != nil {
				pRows.Close()
				return nil, err
			}
			participants = append(participants, &u)
		}
		pRows.Close()

		groups = append(groups, &model.GroupConversation{
			ID:           convID,
			Name:         "", // You can enhance this later
			Participants: participants,
			LastMessage:  lastMsg,
			LastActive:   lastActive,
		})
	}

	return groups, nil
}
