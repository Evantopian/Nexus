package resolver

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/Evantopian/Nexus/graph/model"
	"github.com/Evantopian/Nexus/internal/database/postgres"
	contextkey "github.com/Evantopian/Nexus/internal/services"
	"github.com/google/uuid"
)

// GetParty gets the party info based on partyId
func GetParty(ctx context.Context, partyId uuid.UUID) (*model.Party, error) {
	userUUID, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || userUUID == "" {
		return nil, fmt.Errorf("unauthorized")
	}

	var party model.Party
	var memberUUIDs []uuid.UUID
	var createdAt time.Time

	// Get party details
	query := `SELECT id, name, leader_id, members, max_members, created_at FROM parties WHERE id=$1`
	err := postgres.DB.QueryRow(ctx, query, partyId).Scan(&party.ID, &party.Name, &party.LeaderID, &memberUUIDs, &party.MaxMembers, &createdAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("party not found")
		}
		return nil, fmt.Errorf("error fetching party: %v", err)
	}
	party.CreatedAt = createdAt.Format(time.RFC3339)

	// Fetch leader info
	var leader model.User
	err = postgres.DB.QueryRow(ctx, `SELECT uuid, username FROM users WHERE uuid=$1`, party.LeaderID).Scan(&leader.UUID, &leader.Username)
	if err != nil {
		return nil, fmt.Errorf("error fetching leader info: %v", err)
	}
	party.Leader = &leader

	// Fetch members info
	var members []*model.User
	for _, memberUUID := range memberUUIDs {
		var member model.User
		err := postgres.DB.QueryRow(ctx, `SELECT uuid, username, profile_img FROM users WHERE uuid=$1`, memberUUID).Scan(&member.UUID, &member.Username, &member.ProfileImg)
		if err != nil {
			return nil, fmt.Errorf("error fetching member info for %v: %v", memberUUID, err)
		}
		members = append(members, &member)
	}
	party.Members = members

	return &party, nil
}

// GetPartyByUser gets the party info the user is currently in
func GetPartyByUser(ctx context.Context, userId uuid.UUID) (*model.Party, error) {
	// Ensure the user is authorized
	requesterUUID, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || requesterUUID == "" {
		return nil, fmt.Errorf("unauthorized")
	}

	var partyId uuid.UUID

	// Query to find the party that contains the userId in the members array
	query := `SELECT id FROM parties WHERE $1 = ANY(members)`
	err := postgres.DB.QueryRow(ctx, query, userId).Scan(&partyId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// no party found, return nil with no error
			return nil, nil
		}
		return nil, fmt.Errorf("error finding user's party: %v", err)
	}

	// Reuse existing GetParty logic to build full party details
	return GetParty(ctx, partyId)
}

// CreateParty creates a new party with the current user as the leader and first member
func CreateParty(ctx context.Context, name string) (*model.Party, error) {
	userUUIDStr, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || userUUIDStr == "" {
		return nil, fmt.Errorf("authorization token missing or invalid")
	}

	// Parse userUUID to uuid.UUID
	userUUID, err := uuid.Parse(userUUIDStr)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID: %v", err)
	}

	// Check if user exists
	var userExists bool
	checkQuery := "SELECT EXISTS (SELECT 1 FROM users WHERE uuid=$1)"
	err = postgres.DB.QueryRow(ctx, checkQuery, userUUID).Scan(&userExists)
	if err != nil {
		return nil, fmt.Errorf("error checking user existence: %v", err)
	}
	if !userExists {
		return nil, fmt.Errorf("user not found")
	}

	// Insert new party with leader as the first member
	var party model.Party
	var memberUUIDs []uuid.UUID
	insertQuery := `
		INSERT INTO parties (name, leader_id, members)
		VALUES ($1, $2, ARRAY[$2::UUID])
		RETURNING id, name, leader_id, members
	`

	err = postgres.DB.QueryRow(ctx, insertQuery, name, userUUID).Scan(
		&party.ID,
		&party.Name,
		&party.LeaderID,
		&memberUUIDs, // Scan the UUIDs of the members here
	)
	if err != nil {
		return nil, fmt.Errorf("error creating party: %v", err)
	}

	// Fetch user info for leader
	var user model.User
	err = postgres.DB.QueryRow(ctx, `SELECT uuid, username FROM users WHERE uuid=$1`, userUUID).
		Scan(&user.UUID, &user.Username)
	if err != nil {
		return nil, fmt.Errorf("error loading leader user info: %v", err)
	}

	// Set leader info in party
	party.Leader = &user

	// Fetch the member users for the party using the member UUIDs
	var members []*model.User
	for _, memberUUID := range memberUUIDs {
		var member model.User
		err := postgres.DB.QueryRow(ctx, `SELECT uuid, username FROM users WHERE uuid=$1`, memberUUID).Scan(&member.UUID, &member.Username)
		if err != nil {
			return nil, fmt.Errorf("error loading member user info: %v", err)
		}
		members = append(members, &member)
	}

	// Set the members field in the party
	party.Members = members

	return &party, nil
}

// Delete a party (only allowed for leader)
func DeleteParty(ctx context.Context, partyID uuid.UUID) (bool, error) {
	userUUID, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || userUUID == "" {
		return false, fmt.Errorf("unauthorized")
	}

	query := `DELETE FROM parties WHERE id=$1 AND leader_id=$2`
	rows, err := postgres.DB.Exec(ctx, query, partyID, userUUID)
	if err != nil {
		return false, fmt.Errorf("error deleting party: %v", err)
	}

	if rows.RowsAffected() == 0 {
		return false, fmt.Errorf("party not found or not authorized")
	}

	return true, nil
}

// LeaveParty removes the current user from their party
func LeaveParty(ctx context.Context, partyID uuid.UUID) (*model.Party, error) {
	userUUID, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userUUID == "" {
		return nil, fmt.Errorf("unauthorized: missing user UUID")
	}

	// Remove current user from party members array
	_, err := postgres.DB.Exec(ctx, `
		UPDATE parties
		SET members = array_remove(members, $1)
		WHERE id = $2
	`, userUUID, partyID)
	if err != nil {
		return nil, fmt.Errorf("failed to leave party: %v", err)
	}

	// Return updated party info
	return GetParty(ctx, partyID)
}

// RemoveFromParty removes a user from a party if the requester is the leader
func RemoveFromParty(ctx context.Context, partyID, userID uuid.UUID) (*model.Party, error) {
	requesterUUID, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || requesterUUID == "" {
		return nil, fmt.Errorf("unauthorized: missing user UUID")
	}

	// Check if requester is party leader
	var isLeader bool
	err := postgres.DB.QueryRow(ctx, `
		SELECT EXISTS (
			SELECT 1 FROM parties WHERE id = $1 AND leader_id = $2
		)
	`, partyID, requesterUUID).Scan(&isLeader)
	if err != nil {
		return nil, fmt.Errorf("error checking leader status: %v", err)
	}
	if !isLeader {
		return nil, fmt.Errorf("only party leader can remove members")
	}

	// Remove user from party members array
	_, err = postgres.DB.Exec(ctx, `
		UPDATE parties
		SET members = array_remove(members, $1)
		WHERE id = $2
	`, userID, partyID)
	if err != nil {
		return nil, fmt.Errorf("failed to remove user from party: %v", err)
	}

	return GetParty(ctx, partyID)
}

// GetPartyInvitiations gets all party invitiations for an user
func GetPartyInvitations(ctx context.Context, userID uuid.UUID) ([]*model.PartyInvitation, error) {
	query := `
		SELECT 
			pi.id, pi.party_id, pi.inviter_id, pi.invitee_id, pi.status, pi.created_at::TEXT,
			inviter.uuid, inviter.username,
			invitee.uuid, invitee.username,
			p.id, p.name
		FROM party_invitations pi
		JOIN users inviter ON pi.inviter_id = inviter.uuid
		JOIN users invitee ON pi.invitee_id = invitee.uuid
		JOIN parties p ON pi.party_id = p.id
		WHERE pi.invitee_id = $1
		ORDER BY pi.created_at DESC
	`

	rows, err := postgres.DB.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get invitations: %v", err)
	}
	defer rows.Close()

	var invitations []*model.PartyInvitation

	for rows.Next() {
		var inv model.PartyInvitation
		var inviter model.User
		var invitee model.User
		var party model.Party

		err := rows.Scan(
			&inv.ID, &inv.PartyID, &inv.InviterID, &inv.InviteeID,
			&inv.Status, &inv.CreatedAt,
			&inviter.UUID, &inviter.Username,
			&invitee.UUID, &invitee.Username,
			&party.ID, &party.Name,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan invitation row: %v", err)
		}

		inv.Inviter = &inviter
		inv.Invitee = &invitee
		inv.Party = &party

		invitations = append(invitations, &inv)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error reading invitations: %v", err)
	}

	return invitations, nil
}

// GetSentPartyInvitations gets all the party invitiation sent by the user
func GetSentPartyInvitations(ctx context.Context, userID uuid.UUID) ([]*model.PartyInvitation, error) {
	query := `
		SELECT 
			pi.id, pi.party_id, pi.inviter_id, pi.invitee_id, pi.status, pi.created_at::TEXT,

			inviter.uuid, inviter.username,
			invitee.uuid, invitee.username,
			p.id, p.name

		FROM party_invitations pi
		JOIN users inviter ON pi.inviter_id = inviter.uuid
		JOIN users invitee ON pi.invitee_id = invitee.uuid
		JOIN parties p ON pi.party_id = p.id

		WHERE pi.inviter_id = $1
		ORDER BY pi.created_at DESC
	`

	rows, err := postgres.DB.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get sent invitations: %v", err)
	}
	defer rows.Close()

	var invitations []*model.PartyInvitation

	for rows.Next() {
		var inv model.PartyInvitation
		var inviter model.User
		var invitee model.User
		var party model.Party

		err := rows.Scan(
			&inv.ID, &inv.PartyID, &inv.InviterID, &inv.InviteeID,
			&inv.Status, &inv.CreatedAt,
			&inviter.UUID, &inviter.Username,
			&invitee.UUID, &invitee.Username,
			&party.ID, &party.Name,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan sent invitation row: %v", err)
		}

		inv.Inviter = &inviter
		inv.Invitee = &invitee
		inv.Party = &party
		invitations = append(invitations, &inv)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error reading sent invitations: %v", err)
	}

	return invitations, nil
}

// InviteToParty sends an invitation from the current user to another user to join a party
func InviteToParty(ctx context.Context, partyID, inviteeID uuid.UUID) (*model.PartyInvitation, error) {
	inviterUUID, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || inviterUUID == "" {
		return nil, fmt.Errorf("unauthorized: missing user UUID")
	}

	// Check if inviter is the leader of the party
	var isLeader bool
	err := postgres.DB.QueryRow(ctx,
		`SELECT EXISTS (
			SELECT 1 FROM parties WHERE id = $1 AND leader_id = $2
		)`, partyID, inviterUUID).Scan(&isLeader)
	if err != nil {
		return nil, fmt.Errorf("error checking leader status: %v", err)
	}
	if !isLeader {
		return nil, fmt.Errorf("only party leaders can invite")
	}

	// Insert invitation
	var invitation model.PartyInvitation
	insertQuery := `
		INSERT INTO party_invitations (party_id, inviter_id, invitee_id, status, created_at)
		VALUES ($1, $2, $3, 'pending', $4)
		RETURNING id, party_id, inviter_id, invitee_id, status, created_at::TEXT
	`

	err = postgres.DB.QueryRow(ctx, insertQuery, partyID, inviterUUID, inviteeID, time.Now()).
		Scan(&invitation.ID, &invitation.PartyID, &invitation.InviterID,
			&invitation.InviteeID, &invitation.Status, &invitation.CreatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to send invite: %v", err)
	}

	// Fetch inviter details
	var inviter model.User
	err = postgres.DB.QueryRow(ctx, `SELECT uuid, username FROM users WHERE uuid=$1`, inviterUUID).
		Scan(&inviter.UUID, &inviter.Username)
	if err != nil {
		return nil, fmt.Errorf("failed to load inviter user info: %v", err)
	}
	invitation.Inviter = &inviter

	// Fetch invitee details
	var invitee model.User
	err = postgres.DB.QueryRow(ctx, `SELECT uuid, username FROM users WHERE uuid=$1`, inviteeID).
		Scan(&invitee.UUID, &invitee.Username)
	if err != nil {
		return nil, fmt.Errorf("failed to load invitee user info: %v", err)
	}
	invitation.Invitee = &invitee

	// Fetch party details
	var party model.Party
	err = postgres.DB.QueryRow(ctx, `SELECT id, name FROM parties WHERE id=$1`, partyID).
		Scan(&party.ID, &party.Name)
	if err != nil {
		return nil, fmt.Errorf("failed to load party info: %v", err)
	}
	invitation.Party = &party

	return &invitation, nil
}

func HandlePartyInvite(ctx context.Context, inviteID uuid.UUID, accept bool) (*model.Party, error) {
	userUUID, ok := ctx.Value(contextkey.UserUUIDKey).(string)
	if !ok || userUUID == "" {
		return nil, fmt.Errorf("unauthorized: user not found in context")
	}

	// Fetch the invitation and ensure it's for this user and still pending
	var inviteeID, partyID uuid.UUID
	var status string
	err := postgres.DB.QueryRow(ctx, `
		SELECT invitee_id, party_id, status
		FROM party_invitations
		WHERE id = $1
	`, inviteID).Scan(&inviteeID, &partyID, &status)
	if err != nil {
		return nil, fmt.Errorf("invitation not found: %v", err)
	}

	if inviteeID.String() != userUUID {
		return nil, fmt.Errorf("unauthorized: not your invitation")
	}

	if status != "pending" {
		return nil, fmt.Errorf("invitation is no longer pending")
	}

	if accept {
		// Add user to party members
		_, err = postgres.DB.Exec(ctx, `
			UPDATE parties 
			SET members = array_append(members, $1)
			WHERE id = $2
		`, inviteeID, partyID)
		if err != nil {
			return nil, fmt.Errorf("failed to add to party: %v", err)
		}
	}

	// Delete the invitation regardless of accept or reject
	_, err = postgres.DB.Exec(ctx, `
		DELETE FROM party_invitations WHERE id = $1
	`, inviteID)
	if err != nil {
		return nil, fmt.Errorf("failed to delete invitation: %v", err)
	}

	return GetParty(ctx, partyID)
}
