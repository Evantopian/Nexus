package resolver

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/Evantopian/Nexus/internal/database/postgres"
	contextkey "github.com/Evantopian/Nexus/internal/services"
)

func AdjustRep(ctx context.Context, value int) (bool, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return false, fmt.Errorf("authorization token missing or invalid from resolver")
	}

	var currentRep int

	// Query the current reputation from the database
	err := postgres.DB.QueryRow(ctx, `SELECT reputation FROM users WHERE uuid = $1`, uuid).Scan(&currentRep)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, fmt.Errorf("user not found")
		}
		return false, err
	}

	currentRep += value

	if currentRep < -100 {
		currentRep = -100
	} else if currentRep > 1000 {
		currentRep = 1000
	}

	_, err = postgres.DB.Exec(ctx, `UPDATE users SET reputation = $1 WHERE uuid = $2`, currentRep, uuid)
	if err != nil {
		return false, fmt.Errorf("failed to update reputation: %v", err)
	}

	return true, nil
}
