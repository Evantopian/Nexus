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

func CreateServer(ctx context.Context, name string) (*model.Server, error) {
	userStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userStr == "" {
		return nil, fmt.Errorf("unauthorized: user ID missing")
	}
	userUUID, err := uuid.Parse(userStr)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID")
	}

	serverID := uuid.New()
	query := `INSERT INTO servers (id, name, owner_id, created_at) VALUES ($1, $2, $3, $4)`
	_, err = postgres.DB.Exec(ctx, query, serverID, name, userUUID, time.Now().UTC())
	if err != nil {
		return nil, fmt.Errorf("failed to create server: %v", err)
	}

	return &model.Server{
		ID:      serverID,
		Name:    name,
		OwnerID: userUUID,
	}, nil
}

func JoinServer(ctx context.Context, serverID uuid.UUID) (bool, error) {
	userStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userStr == "" {
		return false, fmt.Errorf("unauthorized: user ID missing")
	}
	userUUID, err := uuid.Parse(userStr)
	if err != nil {
		return false, fmt.Errorf("invalid user UUID")
	}

	query := `INSERT INTO server_members (server_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`
	_, err = postgres.DB.Exec(ctx, query, serverID, userUUID)
	if err != nil {
		return false, fmt.Errorf("failed to join server: %v", err)
	}
	return true, nil
}

func LeaveServer(ctx context.Context, serverID uuid.UUID) (bool, error) {
	userStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userStr == "" {
		return false, fmt.Errorf("unauthorized: user ID missing")
	}
	userUUID, err := uuid.Parse(userStr)
	if err != nil {
		return false, fmt.Errorf("invalid user UUID")
	}

	query := `DELETE FROM server_members WHERE server_id = $1 AND user_id = $2`
	_, err = postgres.DB.Exec(ctx, query, serverID, userUUID)
	if err != nil {
		return false, fmt.Errorf("failed to leave server: %v", err)
	}
	return true, nil
}

func DeleteServer(ctx context.Context, serverID uuid.UUID) (bool, error) {
	userStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userStr == "" {
		return false, fmt.Errorf("unauthorized: user ID missing")
	}
	userUUID, err := uuid.Parse(userStr)
	if err != nil {
		return false, fmt.Errorf("invalid user UUID")
	}

	// Only allow the owner to delete the server
	query := `DELETE FROM servers WHERE id = $1 AND owner_id = $2`
	res, err := postgres.DB.Exec(ctx, query, serverID, userUUID)
	if err != nil {
		return false, fmt.Errorf("failed to delete server: %v", err)
	}
	if res.RowsAffected() == 0 {
		return false, fmt.Errorf("unauthorized or server not found")
	}
	return true, nil
}

func GetServers(ctx context.Context) ([]*model.Server, error) {
	userStr, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userStr == "" {
		return nil, fmt.Errorf("unauthorized: user ID missing")
	}
	userUUID, err := uuid.Parse(userStr)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID")
	}

	query := `SELECT s.id, s.name, s.owner_id FROM servers s
	JOIN server_members m ON s.id = m.server_id
	WHERE m.user_id = $1`
	rows, err := postgres.DB.Query(ctx, query, userUUID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch servers: %v", err)
	}
	defer rows.Close()

	var servers []*model.Server
	for rows.Next() {
		var s model.Server
		err := rows.Scan(&s.ID, &s.Name, &s.OwnerID)
		if err != nil {
			return nil, err
		}
		servers = append(servers, &s)
	}
	return servers, nil
}

func GetServer(ctx context.Context, id uuid.UUID) (*model.Server, error) {
	query := `SELECT id, name, owner_id FROM servers WHERE id = $1`
	var s model.Server
	err := postgres.DB.QueryRow(ctx, query, id).Scan(&s.ID, &s.Name, &s.OwnerID)
	if err != nil {
		return nil, fmt.Errorf("server not found or inaccessible")
	}
	return &s, nil
}
