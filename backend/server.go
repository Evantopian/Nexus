package main

import (
    "fmt"
    "github.com/Evantopian/Nexus/internal/matchmaking"
)

func main() {
    client := matchmaking.FullRecommendationClient("http://localhost:8000")
    recommendations, err := client.GetRecommendations("41ed449c-2bf0-42fb-a2c7-03aca710cf46", 10)
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }

    fmt.Printf("Recommended players: %v\n", recommendations)
}
