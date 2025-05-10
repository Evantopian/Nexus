package matchmaking
import (
    "encoding/json"
    "fmt"
    "net/http"
    "time"
)

type RecommendationClient struct {
    BaseURL string
    Client  *http.Client
}

type user struct {
    PlayerID string `json:"uuid"`
}

func FullRecommendationClient(baseURL string) *RecommendationClient {
    return &RecommendationClient{
        BaseURL: baseURL,
        Client: &http.Client{
            Timeout: 10 * time.Second,
        },
    }
}

func (rc *RecommendationClient) GetRecommendations(playerID string, numRecommendations int) ([]user, error) {
    url := fmt.Sprintf("%s/recommendations/%s?num_recommendations=%d", rc.BaseURL, playerID, numRecommendations)

    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        return nil, fmt.Errorf("failed to create request: %w", err)
    }

    resp, err := rc.Client.Do(req)
    if err != nil {
        return nil, fmt.Errorf("failed to send request: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        var errResp struct {
            Detail string `json:"detail"`
        }
        if err := json.NewDecoder(resp.Body).Decode(&errResp); err != nil {
            return nil, fmt.Errorf("received non-200 status code: %d", resp.StatusCode)
        }
        return nil, fmt.Errorf("recommendation service error: %s", errResp.Detail)
    }

    var recommendations []user
    if err := json.NewDecoder(resp.Body).Decode(&recommendations); err != nil {
        return nil, fmt.Errorf("failed to decode response: %w", err)
    }

    return recommendations, nil
}

func (rc *RecommendationClient) RefreshRecommendations() error {
    url := fmt.Sprintf("%s/refresh", rc.BaseURL)

    req, err := http.NewRequest("POST", url, nil)
    if err != nil {
        return fmt.Errorf("failed to create refresh request: %w", err)
    }

    resp, err := rc.Client.Do(req)
    if err != nil {
        return fmt.Errorf("failed to send refresh request: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        var errResp struct {
            Detail string `json:"detail"`
        }
        if err := json.NewDecoder(resp.Body).Decode(&errResp); err != nil {
            return fmt.Errorf("received non-200 status code: %d", resp.StatusCode)
        }
        return fmt.Errorf("refresh service error: %s", errResp.Detail)
    }

    return nil
}