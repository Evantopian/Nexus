package resolver

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/Evantopian/Nexus/internal/database/postgres"
	"github.com/google/uuid"
)

// AdjustRep adjusts the reputation of a user with the given UUID and returns if it worked
func AdjustRep(ctx context.Context, userID uuid.UUID, value int) (bool, error) {
	if userID == uuid.Nil {
		return false, fmt.Errorf("user UUID is required")
	}

	var currentRep int
	err := postgres.DB.QueryRow(ctx, `SELECT reputation FROM users WHERE uuid = $1`, userID).Scan(&currentRep)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, fmt.Errorf("user not found")
		}
		return false, fmt.Errorf("error fetching reputation: %v", err)
	}

	currentRep += value

	if currentRep < -100 {
		currentRep = -100
	} else if currentRep > 1000 {
		currentRep = 1000
	}

	_, err = postgres.DB.Exec(ctx, `UPDATE users SET reputation = $1 WHERE uuid = $2`, currentRep, userID)
	if err != nil {
		return false, fmt.Errorf("failed to update reputation: %v", err)
	}

	return true, nil
}
