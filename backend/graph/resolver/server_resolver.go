package resolver

import (
	"context"
	"fmt"
	"time"

	"github.com/Evantopian/Nexus/graph/model"
	"github.com/Evantopian/Nexus/internal/database/postgres"
	contextkey "github.com/Evantopian/Nexus/internal/services"
	"github.com/google/uuid"
)

// CreateServer creates a new server for a game
func CreateServer(ctx context.Context, gameID *uuid.UUID, name string, image *string, description *string) (*model.Server, error) {
	query := `
		INSERT INTO servers (game_id, name, image, description)
		VALUES ($1, $2, $3, $4)
		RETURNING id, name, image, description, created_at::TEXT
	`

	server := &model.Server{}
	err := postgres.DB.QueryRow(ctx, query, gameID, name, image, description).Scan(
		&server.ID, &server.Name, &server.Image, &server.Description, &server.CreatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("error creating server: %v", err)
	}

	// Initialize an empty members list
	server.Members = []*model.User{}

	return server, nil
}

// JoinServer lets user join a server
func JoinServer(ctx context.Context, serverID uuid.UUID) (bool, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return false, fmt.Errorf("authorization token missing or invalid from resolver")
	}

	query := `
		INSERT INTO server_members (server_id, user_id)
		VALUES ($1, $2)
		ON CONFLICT (server_id, user_id) DO NOTHING
	`

	_, err := postgres.DB.Exec(ctx, query, serverID, uuid)
	if err != nil {
		return false, fmt.Errorf("error joining server: %v", err)
	}

	return true, nil
}

// LeaveServer lets user leave the server
func LeaveServer(ctx context.Context, serverID uuid.UUID) (bool, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return false, fmt.Errorf("authorization token missing or invalid from resolver")
	}

	query := `
		DELETE FROM server_members
		WHERE server_id = $1 AND user_id = $2
	`

	result, err := postgres.DB.Exec(ctx, query, serverID, uuid)
	if err != nil {
		return false, fmt.Errorf("error leaving server: %v", err)
	}

	rowsAffected := result.RowsAffected()
	if rowsAffected == 0 {
		return false, fmt.Errorf("user not found in server")
	}

	return true, nil
}

// DeleteServer deletes server if no members
func DeleteServer(ctx context.Context, serverID uuid.UUID) (bool, error) {
	// Check if the server has members
	checkQuery := `SELECT COUNT(*) FROM server_members WHERE server_id = $1`
	var memberCount int
	err := postgres.DB.QueryRow(ctx, checkQuery, serverID).Scan(&memberCount)
	if err != nil {
		return false, fmt.Errorf("error checking server members: %v", err)
	}

	if memberCount > 0 {
		return false, fmt.Errorf("server cannot be deleted while members exist")
	}

	// Proceed with deletion
	query := `DELETE FROM servers WHERE id = $1`
	result, err := postgres.DB.Exec(ctx, query, serverID)
	if err != nil {
		return false, fmt.Errorf("error deleting server: %v", err)
	}

	rowsAffected := result.RowsAffected()
	if rowsAffected == 0 {
		return false, fmt.Errorf("server not found")
	}

	return true, nil
}

// GetServers gets all servers for a game based on slug
func GetServers(ctx context.Context, slug string) ([]*model.Server, error) {
	var createdAt time.Time

	query := `
		SELECT s.id, s.name, s.image, s.description, s.created_at
		FROM servers s
		JOIN games g ON s.game_id = g.id
		WHERE g.slug = $1
	`

	rows, err := postgres.DB.Query(ctx, query, slug)
	if err != nil {
		return nil, fmt.Errorf("error fetching servers: %v", err)
	}
	defer rows.Close()

	var servers []*model.Server
	for rows.Next() {
		var server model.Server
		if err := rows.Scan(&server.ID, &server.Name, &server.Image, &server.Description, &createdAt); err != nil {
			return nil, fmt.Errorf("error scanning server: %v", err)
		}
		server.CreatedAt = createdAt.Format(time.RFC3339) // Convert time to string

		servers = append(servers, &server)
	}

	return servers, nil
}
