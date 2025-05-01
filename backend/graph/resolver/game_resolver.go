package resolver

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/Evantopian/Nexus/graph/model"
	"github.com/Evantopian/Nexus/internal/database/postgres"
)

// CreateGame inserts a new game into the database
func CreateGame(
	ctx context.Context,
	slug string,
	title string,
	description *string,
	shortDescription *string,
	image *string,
	banner *string,
	logo *string,
	players *string,
	releaseDate *string,
	developer *string,
	publisher *string,
	platforms []string,
	tags []string,
	rating *float64) (*model.Game, error) {

	query := `
		INSERT INTO games (
			slug, title, description, short_description, image, banner, logo, 
			players, release_date, developer, publisher, platforms, tags, rating
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::text[], $13::text[], $14
		) RETURNING 
			id, slug, title, description, short_description, image, 
			banner, logo, players, release_date::TEXT, developer, publisher, platforms, tags, rating
	`

	game := &model.Game{}
	err := postgres.DB.QueryRow(ctx, query,
		slug, title, description, shortDescription,
		image, banner, logo, players, releaseDate,
		developer, publisher, platforms, tags, rating,
	).Scan(
		&game.ID, &game.Slug, &game.Title, &game.Description, &game.ShortDescription,
		&game.Image, &game.Banner, &game.Logo, &game.Players, &game.ReleaseDate,
		&game.Developer, &game.Publisher, &game.Platforms, &game.Tags, &game.Rating,
	)

	if err != nil {
		return nil, fmt.Errorf("error inserting game: %v", err)
	}

	// // Initialize empty lists for related data
	// game.Servers = []*model.Server{}
	// game.LfgPosts = []*model.LFGPost{}

	return game, nil
}

// UpdateGame updates a game's information based on the slug
func UpdateGame(
	ctx context.Context,
	slug string,
	title string,
	description *string,
	shortDescription *string,
	image *string,
	banner *string,
	logo *string,
	players *string,
	releaseDate *string,
	developer *string,
	publisher *string,
	platforms []string,
	tags []string,
	rating *float64) (*model.Game, error) {

	query := `
		UPDATE games 
		SET title = $1, description = $2, short_description = $3, image = $4, 
			banner = $5, logo = $6, players = $7, release_date = $8, developer = $9, 
			publisher = $10, platforms = $11::text[], tags = $12::text[], rating = $13
		WHERE slug = $14
		RETURNING 
			id, slug, title, description, short_description, image, 
			banner, logo, players, release_date::TEXT, developer, publisher, 
			platforms, tags, rating
	`

	game := &model.Game{}
	err := postgres.DB.QueryRow(ctx, query,
		title, description, shortDescription, image, banner, logo,
		players, releaseDate, developer, publisher, platforms, tags, rating, slug,
	).Scan(
		&game.ID, &game.Slug, &game.Title, &game.Description, &game.ShortDescription,
		&game.Image, &game.Banner, &game.Logo, &game.Players, &game.ReleaseDate,
		&game.Developer, &game.Publisher, &game.Platforms, &game.Tags, &game.Rating,
	)

	if err != nil {
		return nil, fmt.Errorf("error updating game: %v", err)
	}

	// game.Servers = []*model.Server{}
	// game.LfgPosts = []*model.LFGPost{}

	return game, nil
}

// DeleteGame deletes a game based on the slug
func DeleteGame(ctx context.Context, slug string) (bool, error) {
	query := `DELETE FROM games WHERE slug = $1`

	// Execute the delete query
	result, err := postgres.DB.Exec(ctx, query, slug)
	if err != nil {
		fmt.Println("Error deleting game:", err)
		return false, err
	}

	// Check if any row was affected
	rowsAffected := result.RowsAffected()
	if rowsAffected == 0 {
		return false, fmt.Errorf("game not found")
	}

	return true, nil
}

// GetGame gets the information for a game based on the slug
func GetGame(ctx context.Context, slug string) (*model.Game, error) {
	query := `
		SELECT 
			g.id, g.slug, g.title, g.description, g.short_description, g.image, 
			g.banner, g.logo, g.players, g.release_date::TEXT, g.developer, 
			g.publisher, g.rating, g.platforms, g.tags
		FROM games g
		WHERE g.slug = $1
	`

	var game model.Game
	var platforms, tags []string

	err := postgres.DB.QueryRow(ctx, query, slug).Scan(
		&game.ID, &game.Slug, &game.Title, &game.Description, &game.ShortDescription,
		&game.Image, &game.Banner, &game.Logo, &game.Players, &game.ReleaseDate,
		&game.Developer, &game.Publisher, &game.Rating,
		&platforms, &tags,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("game not found")
		}
		return nil, fmt.Errorf("error fetching game: %w", err)
	}

	// Assign non-nil arrays
	game.Platforms = platforms
	game.Tags = tags

	return &game, nil
}
