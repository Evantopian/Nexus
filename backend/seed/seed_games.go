package main

import (
	"context"
	"log"

	"github.com/Evantopian/Nexus/graph/model"
	"github.com/Evantopian/Nexus/internal/database/postgres"
	"github.com/joho/godotenv"
)

func init() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found")
	}
}

func main() {
	// Initialize the DB connection
	postgres.ConnectPostgres()
	// Ensure the connection is closed after seeding
	defer postgres.ClosePostgres()

	// Define games slice
	games := []model.Game{
		{
			Slug:             "marvel-rivals",
			Title:            "Marvel Rivals",
			Description:      StringPointer("A strategic multiplayer battle game featuring Marvel superheroes."),
			ShortDescription: StringPointer("Marvel heroes face off in intense battles."),
			Image:            StringPointer("https://example.com/marvel-rivals-image.jpg"),
			Banner:           StringPointer("https://example.com/marvel-rivals-banner.jpg"),
			Logo:             StringPointer("https://example.com/marvel-rivals-logo.jpg"),
			Players:          StringPointer("2-4"),
			ReleaseDate:      StringPointer("2025-05-15"),
			Developer:        StringPointer("Marvel Studios"),
			Publisher:        StringPointer("Marvel Entertainment"),
			Platforms:        []string{"PC", "Console"},
			Tags:             []string{"action", "multiplayer", "strategy"},
			Rating:           FloatPointer(4.6),
		},
		{
			Slug:             "league-of-legends",
			Title:            "League of Legends",
			Description:      StringPointer("Multiplayer online battle arena (MOBA) by Riot Games."),
			ShortDescription: StringPointer("A fast-paced competitive game of strategy."),
			Image:            StringPointer("https://example.com/league-of-legends-image.jpg"),
			Banner:           StringPointer("https://example.com/league-of-legends-banner.jpg"),
			Logo:             StringPointer("https://example.com/league-of-legends-logo.jpg"),
			Players:          StringPointer("5v5"),
			ReleaseDate:      StringPointer("2009-10-27"),
			Developer:        StringPointer("Riot Games"),
			Publisher:        StringPointer("Riot Games"),
			Platforms:        []string{"PC"},
			Tags:             []string{"MOBA", "competitive", "multiplayer"},
			Rating:           FloatPointer(4.7),
		},
		{
			Slug:             "minecraft",
			Title:            "Minecraft",
			Description:      StringPointer("A sandbox game where players can build and explore in a blocky, procedurally generated world."),
			ShortDescription: StringPointer("Build and survive in a pixelated world."),
			Image:            StringPointer("https://example.com/minecraft-image.jpg"),
			Banner:           StringPointer("https://example.com/minecraft-banner.jpg"),
			Logo:             StringPointer("https://example.com/minecraft-logo.jpg"),
			Players:          StringPointer("1+"),
			ReleaseDate:      StringPointer("2011-11-18"),
			Developer:        StringPointer("Mojang Studios"),
			Publisher:        StringPointer("Mojang Studios"),
			Platforms:        []string{"PC", "Console", "Mobile"},
			Tags:             []string{"sandbox", "adventure", "multiplayer"},
			Rating:           FloatPointer(4.8),
		},
		{
			Slug:             "call-of-duty",
			Title:            "Call of Duty",
			Description:      StringPointer("A series of first-person shooter video games developed by Infinity Ward and Treyarch."),
			ShortDescription: StringPointer("Intense FPS gameplay with various modes."),
			Image:            StringPointer("https://example.com/cod-image.jpg"),
			Banner:           StringPointer("https://example.com/cod-banner.jpg"),
			Logo:             StringPointer("https://example.com/cod-logo.jpg"),
			Players:          StringPointer("1-16"),
			ReleaseDate:      StringPointer("2003-10-29"),
			Developer:        StringPointer("Infinity Ward"),
			Publisher:        StringPointer("Activision"),
			Platforms:        []string{"PC", "Console"},
			Tags:             []string{"FPS", "action", "multiplayer"},
			Rating:           FloatPointer(4.3),
		},
		{
			Slug:             "valorant",
			Title:            "Valorant",
			Description:      StringPointer("5v5 tactical shooter by Riot Games."),
			ShortDescription: StringPointer("A tactical shooter with hero-based abilities."),
			Image:            StringPointer("https://example.com/valorant-image.jpg"),
			Banner:           StringPointer("https://example.com/valorant-banner.jpg"),
			Logo:             StringPointer("https://example.com/valorant-logo.jpg"),
			Players:          StringPointer("5v5"),
			ReleaseDate:      StringPointer("2020-06-02"),
			Developer:        StringPointer("Riot Games"),
			Publisher:        StringPointer("Riot Games"),
			Platforms:        []string{"PC"},
			Tags:             []string{"FPS", "multiplayer", "strategy"},
			Rating:           FloatPointer(4.5),
		},
		{
			Slug:             "fortnite",
			Title:            "Fortnite",
			Description:      StringPointer("A battle royale game by Epic Games featuring a unique building mechanic."),
			ShortDescription: StringPointer("Battle royale with building mechanics."),
			Image:            StringPointer("https://example.com/fortnite-image.jpg"),
			Banner:           StringPointer("https://example.com/fortnite-banner.jpg"),
			Logo:             StringPointer("https://example.com/fortnite-logo.jpg"),
			Players:          StringPointer("1-100"),
			ReleaseDate:      StringPointer("2017-09-26"),
			Developer:        StringPointer("Epic Games"),
			Publisher:        StringPointer("Epic Games"),
			Platforms:        []string{"PC", "Console", "Mobile"},
			Tags:             []string{"battle royale", "multiplayer", "action"},
			Rating:           FloatPointer(4.2),
		},
		{
			Slug:             "apex-legends",
			Title:            "Apex Legends",
			Description:      StringPointer("A free-to-play battle royale game developed by Respawn Entertainment."),
			ShortDescription: StringPointer("A fast-paced battle royale with unique characters."),
			Image:            StringPointer("https://example.com/apex-legends-image.jpg"),
			Banner:           StringPointer("https://example.com/apex-legends-banner.jpg"),
			Logo:             StringPointer("https://example.com/apex-legends-logo.jpg"),
			Players:          StringPointer("3v3"),
			ReleaseDate:      StringPointer("2019-02-04"),
			Developer:        StringPointer("Respawn Entertainment"),
			Publisher:        StringPointer("Electronic Arts"),
			Platforms:        []string{"PC", "Console"},
			Tags:             []string{"battle royale", "multiplayer", "action"},
			Rating:           FloatPointer(4.4),
		},
		{
			Slug:             "genshin-impact",
			Title:            "Genshin Impact",
			Description:      StringPointer("An open-world action role-playing game by miHoYo, featuring exploration and combat."),
			ShortDescription: StringPointer("Explore a vast world with elemental combat mechanics."),
			Image:            StringPointer("https://example.com/genshin-impact-image.jpg"),
			Banner:           StringPointer("https://example.com/genshin-impact-banner.jpg"),
			Logo:             StringPointer("https://example.com/genshin-impact-logo.jpg"),
			Players:          StringPointer("1+"),
			ReleaseDate:      StringPointer("2020-09-28"),
			Developer:        StringPointer("miHoYo"),
			Publisher:        StringPointer("miHoYo"),
			Platforms:        []string{"PC", "Console", "Mobile"},
			Tags:             []string{"action", "RPG", "open-world"},
			Rating:           FloatPointer(4.7),
		},
	}

	// Loop through and insert each game into the database
	for _, game := range games {
		query := `
			INSERT INTO games (
				slug, title, description, short_description, image, banner, logo, 
				players, release_date, developer, publisher, platforms, tags, rating
			) VALUES (
				$1, $2, $3, $4, $5, $6, $7, 
				$8, $9, $10, $11, $12::text[], $13::text[], $14
			) RETURNING 
				id, slug, title, description, short_description, image, 
				banner, logo, players, release_date::TEXT, developer, publisher, platforms, tags, rating
		`

		// Insert game into the database
		_, err := postgres.DB.Exec(context.Background(), query,
			game.Slug, game.Title, game.Description, game.ShortDescription, game.Image,
			game.Banner, game.Logo, game.Players, game.ReleaseDate, game.Developer,
			game.Publisher, game.Platforms, game.Tags, game.Rating,
		)
		if err != nil {
			log.Printf("Error inserting game %s: %v", game.Title, err)
			continue
		}

		log.Printf("Successfully inserted game: %s", game.Title)
	}
}

// Utility function to return a pointer to a string
func StringPointer(s string) *string {
	return &s
}

// Utility function to return a pointer to a float64
func FloatPointer(f float64) *float64 {
	return &f
}
