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

// CreateLFGPost creates a LFGPost for a game
func CreateLFGPost(
	ctx context.Context,
	gameID uuid.UUID,
	title string,
	description string,
	requirements []string,
	tags []string,
	expirationHour int,
) (*model.LFGPost, error) {

	userUUID, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || userUUID == "" {
		return nil, fmt.Errorf("authorization token missing or invalid")
	}

	// Check if user exists before inserting
	var userExists bool
	checkQuery := "SELECT EXISTS (SELECT 1 FROM users WHERE uuid=$1)"
	err := postgres.DB.QueryRow(ctx, checkQuery, userUUID).Scan(&userExists)
	if err != nil {
		return nil, fmt.Errorf("error checking user existence: %v", err)
	}
	if !userExists {
		return nil, fmt.Errorf("user not found")
	}

	expirationTime := time.Now().Add(time.Duration(expirationHour) * time.Hour)

	var lfgPost model.LFGPost

	// Insert new LFG post
	insertQuery := `
		INSERT INTO lfg_posts (game_id, title, description, author_id, requirements, tags, expires_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, game_id, title, description, author_id, requirements, tags, created_at::TEXT, expires_at::TEXT
	`

	err = postgres.DB.QueryRow(
		ctx, insertQuery, gameID, title, description, userUUID, requirements, tags, expirationTime,
	).Scan(
		&lfgPost.ID, &lfgPost.GameID, &lfgPost.Title, &lfgPost.Description, &lfgPost.AuthorID,
		&lfgPost.Requirements, &lfgPost.Tags, &lfgPost.CreatedAt, &lfgPost.ExpiresAt,
	)

	if err != nil {
		return nil, fmt.Errorf("error inserting LFG post: %v", err)
	}

	return &lfgPost, nil
}

// UpdateLFGPost updates an LFGPost
func UpdateLFGPost(
	ctx context.Context,
	postID uuid.UUID,
	title string,
	description string,
	requirements []string,
	tags []string,
	expirationHour int,
) (*model.LFGPost, error) {

	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return nil, fmt.Errorf("authorization token missing or invalid")
	}

	// Check if post exists and belongs to the user
	var postExists bool
	checkQuery := "SELECT EXISTS (SELECT 1 FROM lfg_posts WHERE id=$1 AND author_id=$2)"
	err := postgres.DB.QueryRow(ctx, checkQuery, postID, uuid).Scan(&postExists)
	if err != nil {
		return nil, fmt.Errorf("error checking LFG post existence: %v", err)
	}
	if !postExists {
		return nil, fmt.Errorf("post not found or unauthorized")
	}

	expirationTime := time.Now().Add(time.Duration(expirationHour) * time.Hour)

	var updatedPost model.LFGPost
	updateQuery := `
			UPDATE lfg_posts
			SET title=$1, description=$2, requirements=$3, tags=$4, expires_at=$5
			WHERE id=$6
			RETURNING id, game_id, title, description, author_id, requirements, tags, created_at::TEXT, expires_at::TEXT
	`

	err = postgres.DB.QueryRow(
		ctx, updateQuery, title, description, requirements, tags, expirationTime, postID,
	).Scan(
		&updatedPost.ID, &updatedPost.GameID, &updatedPost.Title, &updatedPost.Description, &updatedPost.AuthorID,
		&updatedPost.Requirements, &updatedPost.Tags, &updatedPost.CreatedAt, &updatedPost.ExpiresAt,
	)

	if err != nil {
		return nil, fmt.Errorf("error updating LFG post: %v", err)
	}

	return &updatedPost, nil
}

// DeleteLFGPost deletes a LFGPost based on uuid
func DeleteLFGPost(ctx context.Context, postID uuid.UUID) (bool, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return false, fmt.Errorf("authorization token missing or invalid")
	}

	// Check if post exists and belongs to the user
	var postExists bool
	checkQuery := "SELECT EXISTS (SELECT 1 FROM lfg_posts WHERE id=$1 AND author_id=$2)"
	err := postgres.DB.QueryRow(ctx, checkQuery, postID, uuid).Scan(&postExists)
	if err != nil {
		return false, fmt.Errorf("error checking LFG post existence: %v", err)
	}
	if !postExists {
		return false, fmt.Errorf("post not found or unauthorized")
	}

	deleteQuery := "DELETE FROM lfg_posts WHERE id=$1"
	_, err = postgres.DB.Exec(ctx, deleteQuery, postID)
	if err != nil {
		return false, fmt.Errorf("error deleting LFG post: %v", err)
	}

	return true, nil
}

// GetLFGPosts gets all LFGPosts for a game based on the slug, including author information
func GetLFGPosts(ctx context.Context, slug string) ([]*model.LFGPost, error) {
	var lfgPosts []*model.LFGPost

	// Modified SQL query to join users table and fetch author details
	query := `
		SELECT p.id, p.game_id, p.title, p.description, p.author_id, p.requirements, p.tags, p.created_at::TEXT, p.expires_at::TEXT,
		       u.username, COALESCE(u.profile_img, '')
		FROM lfg_posts p
		JOIN games g ON p.game_id = g.id
		JOIN users u ON p.author_id = u.uuid
		WHERE g.slug = $1
		ORDER BY p.created_at DESC
	`

	rows, err := postgres.DB.Query(ctx, query, slug)
	if err != nil {
		return nil, fmt.Errorf("error retrieving LFG posts: %v", err)
	}
	defer rows.Close()

	// Iterate through rows and scan results into the LFGPost struct
	for rows.Next() {
		var post model.LFGPost
		var authorUsername, authorProfileImg string

		err := rows.Scan(
			&post.ID, &post.GameID, &post.Title, &post.Description, &post.AuthorID,
			&post.Requirements, &post.Tags, &post.CreatedAt, &post.ExpiresAt,
			&authorUsername, &authorProfileImg,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning LFG post: %v", err)
		}

		// Add author details to the post
		post.Author = &model.User{
			UUID:       post.AuthorID,
			Username:   authorUsername,
			ProfileImg: &authorProfileImg,
		}

		// Append the post to the list of LFGPosts
		lfgPosts = append(lfgPosts, &post)
	}

	return lfgPosts, nil
}

// GetAllLFGPosts retrieves all LFGPosts across all games with pagination
func GetAllLFGPosts(ctx context.Context, limit int, offset int) ([]*model.LFGPost, error) {
	var lfgPosts []*model.LFGPost

	// Modified SQL query to include limit and offset for pagination
	query := `
		SELECT p.id, p.game_id, p.title, p.description, p.author_id, p.requirements, p.tags, p.created_at::TEXT, p.expires_at::TEXT,
		       u.username, COALESCE(u.profile_img, '')
		FROM lfg_posts p
		JOIN users u ON p.author_id = u.uuid
		ORDER BY p.created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := postgres.DB.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("error retrieving LFG posts: %v", err)
	}
	defer rows.Close()

	// Iterate through rows and scan results into the LFGPost struct
	for rows.Next() {
		var post model.LFGPost
		var authorUsername, authorProfileImg string

		err := rows.Scan(
			&post.ID, &post.GameID, &post.Title, &post.Description, &post.AuthorID,
			&post.Requirements, &post.Tags, &post.CreatedAt, &post.ExpiresAt,
			&authorUsername, &authorProfileImg,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning LFG post: %v", err)
		}

		// Add author details to the post
		post.Author = &model.User{
			UUID:       post.AuthorID,
			Username:   authorUsername,
			ProfileImg: &authorProfileImg,
		}

		// Append the post to the list of LFGPosts
		lfgPosts = append(lfgPosts, &post)
	}

	return lfgPosts, nil
}

// GetUserLFGPosts retrieves LFGPosts created by the logged-in user with pagination
func GetUserLFGPosts(ctx context.Context, limit int, offset int) ([]*model.LFGPost, error) {
	userUUID, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || userUUID == "" {
		fmt.Println("User UUID is missing in context!")
		return nil, fmt.Errorf("authorization token missing or invalid")
	}

	var lfgPosts []*model.LFGPost

	query := `
		SELECT p.id, p.game_id, p.title, p.description, p.author_id, p.requirements, p.tags, p.created_at::TEXT, p.expires_at::TEXT,
		       u.username, COALESCE(u.profile_img, '')
		FROM lfg_posts p
		JOIN users u ON p.author_id = u.uuid
		WHERE p.author_id = $1
		ORDER BY p.created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := postgres.DB.Query(ctx, query, userUUID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("error retrieving user LFG posts: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var post model.LFGPost
		var authorUsername, authorProfileImg string

		err := rows.Scan(
			&post.ID, &post.GameID, &post.Title, &post.Description, &post.AuthorID,
			&post.Requirements, &post.Tags, &post.CreatedAt, &post.ExpiresAt,
			&authorUsername, &authorProfileImg,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning user LFG post: %v", err)
		}

		post.Author = &model.User{
			UUID:       post.AuthorID,
			Username:   authorUsername,
			ProfileImg: &authorProfileImg,
		}

		lfgPosts = append(lfgPosts, &post)
	}

	return lfgPosts, nil
}
