package resolver

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/Evantopian/Nexus/graph/model"
	"github.com/Evantopian/Nexus/internal/database/postgres"
	contextkey "github.com/Evantopian/Nexus/internal/services"
	"github.com/google/uuid"
)

// UpdateUser updates user with information and returns user
func UpdateUser(
	ctx context.Context,
	username *string,
	email *string,
	password *string,
	profileImg *string,
	profileMessage *string,
	status *string,
	rank *string,
	age *int32,
) (*model.User, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return nil, fmt.Errorf("authorization token missing or invalid from resolver")
	}

	// Check if user exists before query
	var check bool
	checkQuery := "SELECT EXISTS (SELECT 1 FROM users WHERE uuid=$1)"
	err := postgres.DB.QueryRow(ctx, checkQuery, uuid).Scan(&check)
	if err != nil {
		return nil, fmt.Errorf("error checking user existence: %v", err)
	}
	if !check {
		return nil, fmt.Errorf("user not found")
	}

	var user model.User

	query := `UPDATE users 
		SET username = COALESCE($1, username), 
			email = COALESCE($2, email), 
			profile_img = COALESCE($3, profile_img), 
			profile_message = COALESCE($4, profile_message), 
			status = COALESCE($5, status), 
			rank = COALESCE($6, rank),
			age = COALESCE($7, age)
		WHERE uuid = $8
		RETURNING uuid, username, email, profile_img, profile_message, status, rank, age`

	err = postgres.DB.QueryRow(ctx, query,
		username, email, profileImg, profileMessage, status, rank, age, uuid,
	).Scan(
		&user.UUID,
		&user.Username,
		&user.Email,
		&user.ProfileImg,
		&user.ProfileMessage,
		&user.Status,
		&user.Rank,
		&user.Age,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("error fetching user: %v", err)
	}

	return &user, nil
}

// DeleteUser deletes the current user and returns if it worked
func DeleteUser(ctx context.Context) (bool, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return false, fmt.Errorf("authorization token missing or invalid from resolver")
	}

	// Check if user exists before deletion
	var check bool
	checkQuery := "SELECT EXISTS (SELECT 1 FROM users WHERE uuid=$1)"
	err := postgres.DB.QueryRow(ctx, checkQuery, uuid).Scan(&check)
	if err != nil {
		return false, fmt.Errorf("error checking user existence: %v", err)
	}
	if !check {
		return false, fmt.Errorf("user not found")
	}

	// Delete user from the database using the UUID
	deleteQuery := "DELETE FROM users WHERE uuid=$1"
	_, err = postgres.DB.Exec(ctx, deleteQuery, uuid)
	if err != nil {
		return false, fmt.Errorf("error deleting user: %v", err)
	}

	// Return true for successful deletion
	return true, nil
}

// Profile fetches the profile information of the user and returns them.
func Profile(ctx context.Context) (*model.User, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return nil, fmt.Errorf("authorization token missing or invalid from resolver")
	}

	// Check if user exists before fetching
	var check bool
	checkQuery := "SELECT EXISTS (SELECT 1 FROM users WHERE uuid=$1)"
	err := postgres.DB.QueryRow(ctx, checkQuery, uuid).Scan(&check)
	if err != nil {
		return nil, fmt.Errorf("error checking user existence: %v", err)
	}
	if !check {
		return nil, fmt.Errorf("user not found")
	}

	var user model.User
	var createdAt time.Time
	var age sql.NullInt32

	// Updated query to include age
	query := `SELECT uuid, username, email, COALESCE(profile_img, ''), COALESCE(profile_message, ''), 
							COALESCE(status, ''), COALESCE(rank, ''), COALESCE(reputation, 0), created_at, preferences, age
						FROM users WHERE uuid=$1;`

	err = postgres.DB.QueryRow(ctx, query, uuid).Scan(
		&user.UUID, &user.Username, &user.Email, &user.ProfileImg,
		&user.ProfileMessage, &user.Status, &user.Rank, &user.Reputation, &createdAt, &user.Preferences, &age,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("error fetching user: %v", err)
	}

	createdAtStr := createdAt.Format(time.RFC3339)
	user.CreatedAt = &createdAtStr

	// Convert age if valid
	if age.Valid {
		user.Age = &age.Int32 // Correctly assign the age to user.Age
	} else {
		user.Age = nil // Set to nil if age is NULL in the database
	}

	return &user, nil
}

// GetUser fetches info for a user based on uuid
func GetUser(ctx context.Context, userID uuid.UUID) (*model.User, error) {
	var user model.User
	var createdAt time.Time
	var age sql.NullInt32

	if userID == uuid.Nil {
		return nil, fmt.Errorf("user UUID is required")
	}

	// Check if user exists before fetching
	var exists bool
	checkQuery := "SELECT EXISTS (SELECT 1 FROM users WHERE uuid=$1)"
	err := postgres.DB.QueryRow(ctx, checkQuery, userID).Scan(&exists)
	if err != nil {
		return nil, fmt.Errorf("error checking user existence: %v", err)
	}
	if !exists {
		return nil, fmt.Errorf("user not found")
	}

	// Query user fields
	query := `SELECT uuid, username, email, COALESCE(profile_img, ''), COALESCE(profile_message, ''),
							COALESCE(status, ''), COALESCE(rank, ''), COALESCE(reputation, 0), created_at, preferences, age
						FROM users WHERE uuid=$1;`

	err = postgres.DB.QueryRow(ctx, query, userID).Scan(
		&user.UUID, &user.Username, &user.Email, &user.ProfileImg,
		&user.ProfileMessage, &user.Status, &user.Rank, &user.Reputation, &createdAt, &user.Preferences, &age,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("error fetching user: %v", err)
	}

	createdAtStr := createdAt.Format(time.RFC3339)
	user.CreatedAt = &createdAtStr

	if age.Valid {
		user.Age = &age.Int32
	} else {
		user.Age = nil
	}

	return &user, nil
}
