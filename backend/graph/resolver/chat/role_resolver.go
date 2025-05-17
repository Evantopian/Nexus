package chat

import (
	"context"
	"fmt"

	"github.com/Evantopian/Nexus/graph/model"
	"github.com/Evantopian/Nexus/internal/database/postgres"
	"github.com/google/uuid"
)
func AssignRole(ctx context.Context, userID, serverID, roleID uuid.UUID) (bool, error) {
	query := `INSERT INTO user_roles (user_id, server_id, role_id)
	VALUES ($1, $2, $3)
	ON CONFLICT (user_id, server_id) DO UPDATE SET role_id = $3`
	_, err := postgres.DB.Exec(ctx, query, userID, serverID, roleID)
	if err != nil {
		return false, fmt.Errorf("failed to assign role: %v", err)
	}
	return true, nil
}

func CreateRole(ctx context.Context, serverID uuid.UUID, name string, permissions []string) (*model.Role, error) {
	roleID := uuid.New()
	query := `INSERT INTO roles (id, server_id, name, permissions)
	VALUES ($1, $2, $3, $4)`
	_, err := postgres.DB.Exec(ctx, query, roleID, serverID, name, permissions)
	if err != nil {
		return nil, fmt.Errorf("failed to create role: %v", err)
	}
	return &model.Role{
		ID:          roleID,
		Name:        name,
		Permissions: permissions,
	}, nil
}

func DeleteRole(ctx context.Context, roleID uuid.UUID) (bool, error) {
	query := `DELETE FROM roles WHERE id = $1`
	_, err := postgres.DB.Exec(ctx, query, roleID)
	if err != nil {
		return false, fmt.Errorf("failed to delete role: %v", err)
	}
	return true, nil
}
