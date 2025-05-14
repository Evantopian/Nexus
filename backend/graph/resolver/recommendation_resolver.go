package resolver

import (
	"context"
	"fmt"
	"os"

	"github.com/Evantopian/Nexus/graph/model"
	contextkey "github.com/Evantopian/Nexus/internal/services"
	"github.com/Evantopian/Nexus/internal/matchmaking"
	"github.com/google/uuid"
)

func GetRecommendations(ctx context.Context, id uuid.UUID, limit *int32) ([]*model.Recommendation, error) {
	userUUID, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || userUUID == "" {
		return nil, fmt.Errorf("authorization token missing or invalid")
	}

	if userUUID != id.String() {
		return nil, fmt.Errorf("unauthorized: you can only view your own recommendations")
	}

	numRecs := 10
	if limit != nil {
		numRecs = int(*limit)
	}

	recURL := os.Getenv("RECOMMENDATION_API_URL")
	if recURL == "" {
		return nil, fmt.Errorf("RECOMMENDATION_API_URL not configured")
	}
	recClient := matchmaking.FullRecommendationClient(recURL)

	users, err := recClient.GetRecommendations(id.String(), numRecs)
	if err != nil {
		return nil, fmt.Errorf("failed to get recommendations: %v", err)
	}

	recommendations := make([]*model.Recommendation, 0, len(users))
	for _, u := range users {
		userID, err := uuid.Parse(u.PlayerID)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID in recommendation: %v", err)
		}

		rec := &model.Recommendation{
			ID:         userID,
			Region:     u.Region,
			Rank:       u.Rank,
			Reputation: int32(u.Reputation),
		}

		if u.Genre != "" {
			genre := u.Genre
			rec.Genre = &genre
		}
		if u.Platform != "" {
			platform := u.Platform
			rec.Platform = &platform
		}
		if u.Age > 0 {
			rec.Age = int32(u.Age)
		}

		var playstyle model.Playstyle
		switch u.Playstyle {
		case "COMPETITIVE":
			playstyle = model.PlaystyleCompetitive
		case "CASUAL":
			playstyle = model.PlaystyleCasual

		default:
			playstyle = model.PlaystyleCasual
		}
		rec.Playstyle = playstyle

		recommendations = append(recommendations, rec)
	}

	return recommendations, nil
}


func RefreshRecommendations(ctx context.Context) (bool, error) {
	userUUID, exists := ctx.Value(contextkey.UserUUIDKey).(string)
	if !exists || userUUID == "" {
		return false, fmt.Errorf("authorization token missing or invalid")
	}
	
	recURL := os.Getenv("RECOMMENDATION_API_URL")
	if recURL == "" {
		return false, fmt.Errorf("RECOMMENDATION_API_URL not configured")
	}
	recClient := matchmaking.FullRecommendationClient(recURL)

	err := recClient.RefreshRecommendations()
	if err != nil {
		return false, fmt.Errorf("failed to refresh recommendation model: %v", err)
	}

	return true, nil
}