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

func UpdatePreference(ctx context.Context, region *string, playstyle *model.Playstyle, favoritePlatform *model.Platform, favoriteGameGenre *model.GameGenre) (*model.User, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return nil, fmt.Errorf("authorization token missing or invalid from resolver")
	}

	// Set default values if no value provided
	playstyleValue := "CASUAL"
	if playstyle != nil {
		playstyleValue = string(*playstyle)
	}

	platformValue := "PC"
	if favoritePlatform != nil {
		platformValue = string(*favoritePlatform)
	}

	gameGenreValue := "RPG"
	if favoriteGameGenre != nil {
		gameGenreValue = string(*favoriteGameGenre)
	}

	// SQL query to update the user's preferences
	query := `UPDATE users 
		SET preferences = COALESCE(preferences, '{}'::jsonb) || jsonb_build_object(
			'region', COALESCE($1, preferences->>'region'),
			'playstyle', COALESCE($2, preferences->>'playstyle'),
			'favoritePlatform', COALESCE($3, preferences->>'favoritePlatform'),
			'favoriteGameGenre', COALESCE($4, preferences->>'favoriteGameGenre')
		)
		WHERE uuid = $5
		RETURNING uuid, username, rank, profile_message, preferences`

	var updatedUser model.User

	// Execute the query and scan the result into updatedUser
	err := postgres.DB.QueryRow(ctx, query, region, playstyleValue, platformValue, gameGenreValue, uuid).Scan(
		&updatedUser.UUID,
		&updatedUser.Username,
		&updatedUser.Rank,
		&updatedUser.ProfileMessage,
		&updatedUser.Preferences,
	)
	if err != nil {
		return nil, fmt.Errorf("error updating preferences: %v", err)
	}

	return &updatedUser, nil
}
