package resolver

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/Evantopian/Nexus/graph/model"
	"github.com/Evantopian/Nexus/internal/database/postgres"
	contextkey "github.com/Evantopian/Nexus/internal/services"
	"github.com/google/uuid"
)

// SendFriendRequest creates a friend request from sender to user and returns it
func SendFriendRequest(ctx context.Context, receiverID uuid.UUID) (*model.FriendRequest, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return nil, fmt.Errorf("authorization token missing or invalid from resolver")
	}

	// Check if receiver exists
	var receiverExists bool
	checkQuery := "SELECT EXISTS (SELECT 1 FROM users WHERE uuid=$1)"
	err := postgres.DB.QueryRow(ctx, checkQuery, receiverID).Scan(&receiverExists)
	if err != nil {
		return nil, fmt.Errorf("error checking user existence: %v", err)
	}
	if !receiverExists {
		return nil, fmt.Errorf("receiver not found")
	}

	// Check if already friends
	var alreadyFriends bool
	checkFriendQuery := "SELECT EXISTS (SELECT 1 FROM friends WHERE (user_id=$1 AND friend_id=$2) OR (user_id=$2 AND friend_id=$1))"
	err = postgres.DB.QueryRow(ctx, checkFriendQuery, uuid, receiverID).Scan(&alreadyFriends)
	if err != nil {
		return nil, fmt.Errorf("error checking if already friends: %v", err)
	}
	if alreadyFriends {
		return nil, fmt.Errorf("you are already friends with this user")
	}

	// Check if a friend request already exists
	var requestExists bool
	checkRequestQuery := "SELECT EXISTS (SELECT 1 FROM friend_requests WHERE sender_id=$1 AND receiver_id=$2)"
	err = postgres.DB.QueryRow(ctx, checkRequestQuery, uuid, receiverID).Scan(&requestExists)
	if err != nil {
		return nil, fmt.Errorf("error checking existing friend request: %v", err)
	}
	if requestExists {
		return nil, fmt.Errorf("friend request already sent")
	}

	// Insert new friend request
	insertQuery := `
		INSERT INTO friend_requests (sender_id, receiver_id, status, requested_at)
		VALUES ($1, $2, 'pending', $3) RETURNING sender_id, receiver_id, status, requested_at
	`
	var request model.FriendRequest
	var requestedAt time.Time // Add a variable for the timestamp

	err = postgres.DB.QueryRow(ctx, insertQuery, uuid, receiverID, time.Now()).Scan(&request.Sender, &request.Receiver, &request.Status, &requestedAt)
	if err != nil {
		return nil, fmt.Errorf("error inserting friend request: %v", err)
	}

	// Set the RequestedAt field to the scanned timestamp
	request.RequestedAt = requestedAt.Format(time.RFC3339)

	return &request, nil
}

// AcceptFriendRequest accepts friend request between receiver and sender, then returns if it worked
func AcceptFriendRequest(ctx context.Context, senderID uuid.UUID) (bool, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return false, fmt.Errorf("authorization token missing or invalid from resolver")
	}

	// Check if sender exists
	var receiverExists bool
	checkQuery := "SELECT EXISTS (SELECT 1 FROM users WHERE uuid=$1)"
	err := postgres.DB.QueryRow(ctx, checkQuery, senderID).Scan(&receiverExists)
	if err != nil {
		return false, fmt.Errorf("error checking user existence: %v", err)
	}
	if !receiverExists {
		return false, fmt.Errorf("receiver not found")
	}

	// Check if a friend request exists between the users (sender -> receiver)
	var requestExists bool
	checkRequestQuery := "SELECT EXISTS (SELECT 1 FROM friend_requests WHERE sender_id=$1 AND receiver_id=$2 AND status='pending')"
	err = postgres.DB.QueryRow(ctx, checkRequestQuery, senderID, uuid).Scan(&requestExists)
	if err != nil {
		return false, fmt.Errorf("error checking existing friend request: %v", err)
	}
	if !requestExists {
		return false, fmt.Errorf("no pending friend request found")
	}

	// Add friendship to friends table (ensure no duplicate entries)
	addFriendQuery := `INSERT INTO friends (user_id, friend_id) 
                    VALUES ($1, $2), ($2, $1) 
                    ON CONFLICT DO NOTHING`
	friendResult, err := postgres.DB.Exec(ctx, addFriendQuery, uuid, senderID)
	if err != nil {
		return false, fmt.Errorf("error adding friends: %v", err)
	}

	// If no updates
	friendRowsAffected := friendResult.RowsAffected()
	if friendRowsAffected == 0 {
		return false, fmt.Errorf("friendship already exists or failed to insert")
	}

	// Delete the friend request after accepting
	deleteRequestQuery := `
		DELETE FROM friend_requests 
		WHERE sender_id = $1 AND receiver_id = $2;
	`
	res, err := postgres.DB.Exec(ctx, deleteRequestQuery, senderID, uuid)
	if err != nil {
		return false, fmt.Errorf("error deleting friend request: %v", err)
	}

	// Check if a request was actually deleted
	rowsAffected := res.RowsAffected()
	if rowsAffected == 0 {
		return false, fmt.Errorf("no pending friend request found")
	}

	return true, nil
}

// RejectFriendRequest changes the friend request between receiver and sender to rejected, then returns if it worked
func RejectFriendRequest(ctx context.Context, senderID uuid.UUID) (bool, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return false, fmt.Errorf("authorization token missing or invalid from resolver")
	}

	// Check if sender exists
	var receiverExists bool
	checkQuery := "SELECT EXISTS (SELECT 1 FROM users WHERE uuid=$1)"
	err := postgres.DB.QueryRow(ctx, checkQuery, senderID).Scan(&receiverExists)
	if err != nil {
		return false, fmt.Errorf("error checking user existence: %v", err)
	}
	if !receiverExists {
		return false, fmt.Errorf("receiver not found")
	}

	// Check if a friend request exists between the users (sender -> receiver)
	var requestExists bool
	checkRequestQuery := "SELECT EXISTS (SELECT 1 FROM friend_requests WHERE sender_id=$1 AND receiver_id=$2 AND status='pending')"
	err = postgres.DB.QueryRow(ctx, checkRequestQuery, senderID, uuid).Scan(&requestExists)
	if err != nil {
		return false, fmt.Errorf("error checking existing friend request: %v", err)
	}
	if !requestExists {
		return false, fmt.Errorf("no pending friend request found")
	}

	// Delete the friend request due to rejecting
	deleteQuery := `
		DELETE FROM friend_requests 
		WHERE sender_id = $1 AND receiver_id = $2 AND status = 'pending';
	`
	res, err := postgres.DB.Exec(ctx, deleteQuery, senderID, uuid)
	if err != nil {
		return false, fmt.Errorf("error rejecting friend request: %v", err)
	}

	// Check if a request was actually deleted
	rowsAffected := res.RowsAffected()
	if rowsAffected == 0 {
		return false, fmt.Errorf("no pending friend request found")
	}

	return true, nil
}

// RemoveFriend deletes the friendship between the user and friend
func RemoveFriend(ctx context.Context, friendId uuid.UUID) (bool, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return false, fmt.Errorf("authorization token missing or invalid from resolver")
	}

	// Delete the friendship (both rows)
	deleteQuery := `
		DELETE FROM friends 
		WHERE (user_id = $1 AND friend_id = $2) 
		   OR (user_id = $2 AND friend_id = $1);
	`
	res, err := postgres.DB.Exec(ctx, deleteQuery, uuid, friendId)
	if err != nil {
		return false, fmt.Errorf("error removing friend: %v", err)
	}

	// Check if any rows were affected
	rowsAffected := res.RowsAffected()
	if rowsAffected == 0 {
		return false, fmt.Errorf("friendship not found")
	}

	return true, nil
}

// GetFriends retrieves the user's friends from the database
func GetFriends(ctx context.Context) ([]*model.User, error) {
	uuid, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuid == "" {
		return nil, fmt.Errorf("authorization token missing or invalid from resolver")
	}

	// Query to get friend details directly
	query := `
		SELECT u.uuid, u.username, u.email, u.profile_img, u.profile_message, u.status, u.rank 
		FROM friends f
		JOIN users u ON u.uuid = f.friend_id
		WHERE f.user_id = $1
	`
	rows, err := postgres.DB.Query(ctx, query, uuid)
	if err != nil {
		return nil, fmt.Errorf("error fetching friends: %v", err)
	}
	defer rows.Close()

	// Stores corresponding user to uuid into friends
	var friends []*model.User
	for rows.Next() {
		var friend model.User
		if err := rows.Scan(&friend.UUID, &friend.Username, &friend.Email, &friend.ProfileImg, &friend.ProfileMessage, &friend.Status, &friend.Rank); err != nil {
			return nil, fmt.Errorf("error scanning friend details: %v", err)
		}
		friends = append(friends, &friend)
	}

	// Return an empty list if no friends found
	if len(friends) == 0 {
		return []*model.User{}, nil
	}

	return friends, nil
}

// GetFriendRequests retrieves sent and received friend requests
func GetFriendRequests(ctx context.Context) (*model.FriendRequestsList, error) {
	uuidStr, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || uuidStr == "" {
		return nil, fmt.Errorf("authorization token missing or invalid from resolver")
	}

	// Convert string uuid to uuid values
	userUUID, err := uuid.Parse(uuidStr)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID: %v", err)
	}

	// Query for sent friend requests
	sentRows, err := postgres.DB.Query(ctx, `SELECT receiver_id, status, requested_at FROM friend_requests WHERE sender_id = $1`, userUUID)
	if err != nil {
		return nil, fmt.Errorf("error fetching sent friend requests: %v", err)
	}
	defer sentRows.Close()

	// Adding all user sent friend requests to slice
	var sentRequests []*model.FriendRequest
	for sentRows.Next() {
		var request model.FriendRequest
		var receiverUUIDStr string
		var sentRequestTime time.Time

		if err := sentRows.Scan(&receiverUUIDStr, &request.Status, &sentRequestTime); err != nil {
			log.Printf("warning: skipping sent friend request due to error: %v", err)
			continue
		}

		// Convert string uuid to uuid values
		receiverUUID, err := uuid.Parse(receiverUUIDStr)
		if err != nil {
			log.Printf("warning: invalid receiver UUID %v", receiverUUIDStr)
			continue
		}

		request.Receiver = receiverUUID
		request.Sender = userUUID
		request.RequestedAt = sentRequestTime.Format(time.RFC3339)
		sentRequests = append(sentRequests, &request)
	}

	// Query for received friend requests
	receivedRows, err := postgres.DB.Query(ctx, `SELECT sender_id, status, requested_at FROM friend_requests WHERE receiver_id = $1`, userUUID)
	if err != nil {
		return nil, fmt.Errorf("error fetching received friend requests: %v", err)
	}
	defer receivedRows.Close()

	// Adding all received requests to slice
	var receivedRequests []*model.FriendRequest
	for receivedRows.Next() {
		var request model.FriendRequest
		var senderUUIDStr string
		var receivedRequestTime time.Time

		if err := receivedRows.Scan(&senderUUIDStr, &request.Status, &receivedRequestTime); err != nil {
			log.Printf("warning: skipping received friend request due to error: %v", err)
			continue
		}

		senderUUID, err := uuid.Parse(senderUUIDStr)
		if err != nil {
			log.Printf("warning: invalid sender UUID %v", senderUUIDStr)
			continue
		}

		request.Sender = senderUUID
		request.Receiver = userUUID
		request.RequestedAt = receivedRequestTime.Format(time.RFC3339)
		receivedRequests = append(receivedRequests, &request)
	}

	return &model.FriendRequestsList{
		Sent:     sentRequests,
		Received: receivedRequests,
	}, nil
}
