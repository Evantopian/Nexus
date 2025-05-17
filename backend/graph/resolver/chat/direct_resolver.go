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
func GetDirectConversations(ctx context.Context, limit int, after *time.Time) ([]*model.DirectConversation, error) {
	userUUIDStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userUUIDStr == "" {
		return nil, fmt.Errorf("unauthorized: user ID missing")
	}

	userUUID, err := uuid.Parse(userUUIDStr)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID: %v", err)
	}

	baseQuery := `
		SELECT DISTINCT ON (u.uuid)
			c.id,
			u.uuid AS user_uuid,
			u.username,
			COALESCE(m.body, '') AS last_message,
			COALESCE(m.created_at, c.created_at) AS last_active
		FROM conversations c
		JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
		JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
		JOIN users u ON u.uuid = cp2.user_id
		LEFT JOIN LATERAL (
			SELECT body, created_at 
			FROM messages 
			WHERE conversation_id = c.id 
			ORDER BY created_at DESC 
			LIMIT 1
		) m ON true
		WHERE cp1.user_id = $1
			AND cp2.user_id != $1
			AND (
				SELECT COUNT(*) 
				FROM conversation_participants 
				WHERE conversation_id = c.id
			) = 2
	`

	args := []interface{}{userUUID}
	argIndex := 2

	if after != nil {
		baseQuery += fmt.Sprintf(" AND COALESCE(m.created_at, c.created_at) < $%d", argIndex)
		args = append(args, *after)
		argIndex++
	}

	// Use DISTINCT ON ordering clause to ensure latest per user
	baseQuery += fmt.Sprintf(`
		ORDER BY u.uuid, COALESCE(m.created_at, c.created_at) DESC
		LIMIT $%d
	`, argIndex)
	args = append(args, limit)

	rows, err := postgres.DB.Query(ctx, baseQuery, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query direct conversations: %v", err)
	}
	defer rows.Close()

	var results []*model.DirectConversation
	for rows.Next() {
		var convID, otherUserID uuid.UUID
		var username, lastMessage string
		var lastActive time.Time

		if err := rows.Scan(&convID, &otherUserID, &username, &lastMessage, &lastActive); err != nil {
			return nil, fmt.Errorf("row scan error: %v", err)
		}

		results = append(results, &model.DirectConversation{
			ID: convID,
			User: &model.ChatUser{
				ID:       otherUserID,
				Username: username,
			},
			LastMessage: lastMessage,
			LastActive:  lastActive,
		})
	}

	return results, nil
}
