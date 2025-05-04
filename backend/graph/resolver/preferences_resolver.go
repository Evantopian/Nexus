package resolver

import (
	"context"
	"fmt"

	"github.com/Evantopian/Nexus/graph/model"
	"github.com/Evantopian/Nexus/internal/database/postgres"
	contextkey "github.com/Evantopian/Nexus/internal/services"
)

// Playstyle is an enum of user playstyles
type Playstyle string

const (
	Competitive Playstyle = "COMPETITIVE"
	Casual      Playstyle = "CASUAL"
)

func UpdatePreference(ctx context.Context, region *string, playstyle *model.Playstyle) (*model.Preferences, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return nil, fmt.Errorf("authorization token missing or invalid from resolver")
	}

	// Check if user exists before updating
	var check bool
	checkQuery := "SELECT EXISTS (SELECT 1 FROM users WHERE uuid=$1)"
	err := postgres.DB.QueryRow(ctx, checkQuery, uuid).Scan(&check)
	if err != nil {
		return nil, fmt.Errorf("error checking user existence: %v", err)
	}
	if !check {
		return nil, fmt.Errorf("user not found")
	}

	// Prepare the query to update preferences stored as JSONB in the 'preferences' column
	query := `UPDATE users 
						SET preferences = COALESCE(preferences, '{}'::jsonb) || jsonb_build_object(
								'region', COALESCE($1, preferences->>'region'), 
								'playstyle', COALESCE($2, preferences->>'playstyle')
						)
						WHERE uuid = $3
						RETURNING preferences`

	var updatedPrefs model.Preferences

	// default playstyle value
	playstyleValue := "CASUAL"
	if playstyle != nil {
		playstyleValue = string(*playstyle)
	}

	// Execute the query and scan the preferences JSONB column into updatedPrefs
	err = postgres.DB.QueryRow(ctx, query, region, playstyleValue, uuid).Scan(&updatedPrefs)
	if err != nil {
		return nil, fmt.Errorf("error updating preferences: %v", err)
	}

	return &updatedPrefs, nil
}
