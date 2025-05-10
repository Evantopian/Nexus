package resolver

import (
	"context"
	"fmt"

	"github.com/Evantopian/Nexus/graph/model"
	"github.com/Evantopian/Nexus/internal/database/postgres"
	contextkey "github.com/Evantopian/Nexus/internal/services"
	"github.com/google/uuid"
)

// FollowGame is the resolver for the followGame field.
func FollowGame(ctx context.Context, slug string) (bool, error) {
	// Get the current user from the context
	userIDStr, err := getCurrentUserID(ctx)
	if err != nil {
		return false, fmt.Errorf("could not get user ID: %v", err)
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return false, fmt.Errorf("invalid UUID format for user ID: %v", err)
	}

	// Check if the game exists
	game, err := GetGame(ctx, slug)
	if err != nil {
		return false, fmt.Errorf("game not found: %v", err)
	}

	isAlreadyFollowed, err := IsUserFollowingGame(ctx, userID, game.ID)
	if err != nil {
		return false, fmt.Errorf("could not check follow status: %v", err)
	}

	if isAlreadyFollowed {
		return false, fmt.Errorf("user is already following this game")
	}

	err = followGameInDB(ctx, userID, game.ID)
	if err != nil {
		return false, fmt.Errorf("could not follow the game: %v", err)
	}

	return true, nil
}

// UnfollowGame is the resolver for the unfollowGame field.
func UnfollowGame(ctx context.Context, slug string) (bool, error) {
	userIDStr, err := getCurrentUserID(ctx)
	if err != nil {
		return false, fmt.Errorf("could not get user ID: %v", err)
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return false, fmt.Errorf("invalid UUID format for user ID: %v", err)
	}

	// Check if the game exists
	game, err := GetGame(ctx, slug)
	if err != nil {
		return false, fmt.Errorf("game not found: %v", err)
	}

	isFollowing, err := IsUserFollowingGame(ctx, userID, game.ID)
	if err != nil {
		return false, fmt.Errorf("could not check follow status: %v", err)
	}

	if !isFollowing {
		return false, fmt.Errorf("user is not following this game")
	}

	// Remove the game from the user's followed list (delete from the table)
	err = unfollowGameInDB(ctx, userID, game.ID)
	if err != nil {
		return false, fmt.Errorf("could not unfollow the game: %v", err)
	}

	return true, nil
}

// GetUserFollowedGames retrieves the games followed by a user
func GetUserFollowedGames(ctx context.Context, userID uuid.UUID) ([]*model.Game, error) {
	// Query to get the followed games for a user
	query := `
		SELECT 
			g.id, g.slug, g.title, g.description, g.short_description, g.image, 
			g.banner, g.logo, g.players, g.release_date::TEXT, g.developer, 
			g.publisher, g.rating,
			g.platforms, g.tags
		FROM games g
		INNER JOIN user_following_games ufg ON g.id = ufg.game_id
		WHERE ufg.user_id = $1
	`

	rows, err := postgres.DB.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("could not retrieve followed games: %v", err)
	}
	defer rows.Close()

	var games []*model.Game
	for rows.Next() {
		var game model.Game
		var platforms, tags []string

		// Scan the game data
		if err := rows.Scan(
			&game.ID, &game.Slug, &game.Title, &game.Description, &game.ShortDescription,
			&game.Image, &game.Banner, &game.Logo, &game.Players, &game.ReleaseDate,
			&game.Developer, &game.Publisher, &game.Rating, &platforms, &tags,
		); err != nil {
			return nil, fmt.Errorf("error scanning followed games: %v", err)
		}

		// Assign the scanned platforms and tags
		game.Platforms = platforms
		game.Tags = tags

		// Add the game to the list
		games = append(games, &game)
	}

	// Check if any error occurred during iteration
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error during iteration: %v", err)
	}

	// Return the list of followed games (empty slice if none)
	if len(games) == 0 {
		return []*model.Game{}, nil
	}
	return games, nil
}

// IsUserFollowingGame checks if a user is already following a game
func IsUserFollowingGame(ctx context.Context, userID uuid.UUID, gameID uuid.UUID) (bool, error) {
	var count int
	query := `SELECT COUNT(*) FROM user_following_games WHERE user_id = $1 AND game_id = $2`
	err := postgres.DB.QueryRow(ctx, query, userID, gameID).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("could not check if user is following game: %v", err)
	}
	return count > 0, nil
}

// followGameInDB adds a game to the user's followed list in the database
func followGameInDB(ctx context.Context, userID uuid.UUID, gameID uuid.UUID) error {
	query := `
		INSERT INTO user_following_games (user_id, game_id, followed_at)
		VALUES ($1, $2, CURRENT_TIMESTAMP)`
	_, err := postgres.DB.Exec(ctx, query, userID, gameID)
	if err != nil {
		return fmt.Errorf("could not follow the game: %v", err)
	}
	return nil
}

// unfollowGameInDB removes a game from the user's followed list
func unfollowGameInDB(ctx context.Context, userID uuid.UUID, gameID uuid.UUID) error {
	query := `DELETE FROM user_following_games WHERE user_id = $1 AND game_id = $2`
	_, err := postgres.DB.Exec(ctx, query, userID, gameID)
	if err != nil {
		return fmt.Errorf("could not unfollow the game: %v", err)
	}
	return nil
}

// getCurrentUserID gets the user ID from the context
func getCurrentUserID(ctx context.Context) (string, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return "", fmt.Errorf("authorization token missing or invalid")
	}
	return uuid, nil
}
