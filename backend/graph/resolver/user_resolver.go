package resolver

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
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

func GetRandomUsers(ctx context.Context) ([]*model.User, error) {
	const limit = 5
	query := `
		SELECT uuid, username, email, COALESCE(profile_img, ''), COALESCE(profile_message, ''),
		       COALESCE(status, ''), COALESCE(rank, ''), COALESCE(reputation, 0),
		       created_at, preferences, age
		FROM users
		ORDER BY RANDOM()
		LIMIT $1;
	`

	rows, err := postgres.DB.Query(ctx, query, limit)
	if err != nil {
		return nil, fmt.Errorf("error fetching random users: %v", err)
	}
	defer rows.Close()

	var users []*model.User

	for rows.Next() {
		var user model.User
		var createdAt time.Time
		var age sql.NullInt32

		err := rows.Scan(
			&user.UUID, &user.Username, &user.Email, &user.ProfileImg,
			&user.ProfileMessage, &user.Status, &user.Rank, &user.Reputation,
			&createdAt, &user.Preferences, &age,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning random user row: %v", err)
		}

		createdAtStr := createdAt.Format(time.RFC3339)
		user.CreatedAt = &createdAtStr

		if age.Valid {
			user.Age = &age.Int32
		} else {
			user.Age = nil
		}

		users = append(users, &user)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("row iteration error: %v", err)
	}

	return users, nil
}

func SearchUser(ctx context.Context, search string) ([]*model.User, error) {
	// Limited search, which can be increased
	const limit = 5
	query := `
		SELECT uuid, username, email, COALESCE(profile_img, ''), COALESCE(profile_message, ''),
		       COALESCE(status, ''), COALESCE(rank, ''), COALESCE(reputation, 0),
		       created_at, preferences, age
		FROM users
		WHERE LOWER(username) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1)
		LIMIT $2;
	`

	rows, err := postgres.DB.Query(ctx, query, "%"+search+"%", limit)
	if err != nil {
		return nil, fmt.Errorf("error searching users: %v", err)
	}
	defer rows.Close()

	var users []*model.User

	for rows.Next() {
		var user model.User
		var createdAt time.Time
		var age sql.NullInt32

		err := rows.Scan(
			&user.UUID, &user.Username, &user.Email, &user.ProfileImg,
			&user.ProfileMessage, &user.Status, &user.Rank, &user.Reputation,
			&createdAt, &user.Preferences, &age,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning user: %v", err)
		}

		createdAtStr := createdAt.Format(time.RFC3339)
		user.CreatedAt = &createdAtStr

		if age.Valid {
			user.Age = &age.Int32
		} else {
			user.Age = nil
		}

		users = append(users, &user)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("row iteration error: %v", err)
	}

	return users, nil
}

func GetRecommendations(ctx context.Context, userID uuid.UUID, numRecommendations int) ([]*model.UserRecommendation, error) {
	baseURL := os.Getenv("RECOMMENDER_BASE_URL")
	if baseURL == "" {
		return nil, fmt.Errorf("RECOMMENDER_BASE_URL is not set")
	}

	url := fmt.Sprintf("%s/recommendations/%s?num_recommendations=%d", baseURL, userID.String(), numRecommendations)

	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to call recommendation service: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("recommendation service returned status: %v", resp.Status)
	}

	var rawRecs []struct {
		UUID       string  `json:"uuid"`
		Username   string  `json:"username"`
		Email      string  `json:"email"`
		ProfileImg string  `json:"profile_img"`
		Region     string  `json:"region"`
		Genre      string  `json:"genre"`
		Platform   string  `json:"platform"`
		Playstyle  string  `json:"playstyle"`
		Rank       string  `json:"rank"`
		Reputation float64 `json:"reputation"`
		Age        float64 `json:"age"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&rawRecs); err != nil {
		return nil, fmt.Errorf("failed to decode recommendation response: %v", err)
	}

	recommendations := make([]*model.UserRecommendation, 0, len(rawRecs))

	for _, rec := range rawRecs {
		uuid, err := uuid.Parse(rec.UUID)
		if err != nil {
			continue // skip invalid UUIDs
		}

		rep := int32(rec.Reputation)
		age := int32(rec.Age)

		recommendations = append(recommendations, &model.UserRecommendation{
			UUID:       uuid,
			Email:      &rec.Email,
			Username:   &rec.Username,
			ProfileImg: &rec.ProfileImg,
			Region:     &rec.Region,
			Genre:      &rec.Genre,
			Platform:   &rec.Platform,
			Playstyle:  &rec.Playstyle,
			Rank:       &rec.Rank,
			Reputation: &rep,
			Age:        &age,
		})
	}

	return recommendations, nil
}
