package resolver

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/Evantopian/Nexus/graph/model"
	"github.com/Evantopian/Nexus/internal/database/postgres"
	contextkey "github.com/Evantopian/Nexus/internal/services"
)

// UpdateUser updates user with information and returns user
func UpdateUser(ctx context.Context, username *string, email *string, password *string, profileImg *string, profileMessage *string, status *string, rank *string) (*model.User, error) {
	// Extract the user UUID from the context
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

	// Update user in the database using the UUID
	query := `UPDATE users 
						SET username = COALESCE($1, username), 
								email = COALESCE($2, email), 
								profile_img = COALESCE($3, profile_img), 
								profile_message = COALESCE($4, profile_message), 
								status = COALESCE($5, status), 
								rank = COALESCE($6, rank) 
						WHERE uuid = $7
						RETURNING uuid, username, email, profile_img, profile_message, status, rank`

	// Execute the query and retrieve the updated user data
	err = postgres.DB.QueryRow(ctx, query, username, email, profileImg, profileMessage, status, rank, uuid).Scan(
		&user.UUID, &user.Username, &user.Email, &user.ProfileImg,
		&user.ProfileMessage, &user.Status, &user.Rank,
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
	var createdAt time.Time // time.Time to handle timestamp fields

	// Query the user from the database using the UUID
	query := `SELECT uuid, username, email, COALESCE(profile_img, ''), COALESCE(profile_message, ''), 
							COALESCE(status, ''), COALESCE(rank, ''), friends_list, friends_request, created_at, preferences
						FROM users WHERE uuid=$1;`

	err = postgres.DB.QueryRow(ctx, query, uuid).Scan(
		&user.UUID, &user.Username, &user.Email, &user.ProfileImg,
		&user.ProfileMessage, &user.Status, &user.Rank, &user.FriendsList, &user.FriendRequests, &createdAt, &user.Preferences,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("error fetching user: %v", err)
	}

	// Convert time.Time to string or handle formatting
	createdAtStr := createdAt.Format(time.RFC3339)
	user.CreatedAt = &createdAtStr

	return &user, nil
}
