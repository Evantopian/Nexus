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
			Description:      StringPointer("Team up with your favorite Marvel heroes in this action-packed multiplayer game. Battle against other players in intense 6v6 matches, each with unique abilities and playstyles. Choose from a roster of iconic characters including Iron Man, Captain America, Spider-Man, and more."),
			ShortDescription: StringPointer("Team up with your favorite Marvel heroes in this action-packed multiplayer game."),
			Image:            StringPointer("https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80"),
			Banner:           StringPointer("https://example.com/marvel-rivals-banner.jpg"),
			Logo:             StringPointer("https://example.com/marvel-rivals-logo.jpg"),
			Players:          StringPointer("600K"),
			ReleaseDate:      StringPointer("2024-12-06"),
			Developer:        StringPointer("Marvel Studios"),
			Publisher:        StringPointer("Marvel Entertainment"),
			Platforms:        []string{"PC", "Console"},
			Tags:             []string{"action", "multiplayer", "strategy"},
			Rating:           FloatPointer(4.6),
		},
		{
			Slug:             "league-of-legends",
			Title:            "League of Legends",
			Description:      StringPointer("League of Legends is a team-based strategy game developed and published by Riot Games. In the game, two teams of five powerful champions face off to destroy the other's base. Choose from over 140 champions to make epic plays, secure kills, and take down towers as you battle your way to victory."),
			ShortDescription: StringPointer("Team-based strategy game where two teams of five compete to destroy the enemy base."),
			Image:            StringPointer("https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&q=80"),
			Banner:           StringPointer("https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1200&q=80"),
			Logo:             StringPointer("https://api.dicebear.com/7.x/identicon/svg?seed=LeagueOfLegends"),
			Players:          StringPointer("131M"),
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
			Description:      StringPointer("Minecraft is a sandbox video game developed by Mojang Studios. The game was created by Markus 'Notch' Persson in the Java programming language. In Minecraft, players explore a blocky, procedurally generated 3D world with virtually infinite terrain, and may discover and extract raw materials, craft tools and items, and build structures or earthworks."),
			ShortDescription: StringPointer("Build, explore, and survive in a blocky, procedurally-generated 3D world."),
			Image:            StringPointer("https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=800&q=80"),
			Banner:           StringPointer("https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&q=80"),
			Logo:             StringPointer("https://api.dicebear.com/7.x/identicon/svg?seed=Minecraft"),
			Players:          StringPointer("1.5M"),
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
			Description:      StringPointer("Call of Duty is a first-person shooter video game franchise published by Activision. Starting out in 2003, it first focused on games set in World War II. Over time, the series has seen games set in the midst of the Cold War, futuristic worlds, and outer space. The games were first developed by Infinity Ward, then also by Treyarch and Sledgehammer Games."),
			ShortDescription: StringPointer("Fast-paced first-person shooter with intense multiplayer action."),
			Image:            StringPointer("https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80"),
			Banner:           StringPointer("https://images.unsplash.com/photo-1616588589676-62b3bd4108f6?w=1200&q=80"),
			Logo:             StringPointer("https://api.dicebear.com/7.x/identicon/svg?seed=CallOfDuty"),
			Players:          StringPointer("150K"),
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
			Description:      StringPointer("Valorant is a free-to-play first-person tactical shooter developed and published by Riot Games. The game operates on an economy-round, objective-based, first-to-13 competitive format where you select a unique agent to play for the entirety of the match. Each agent has their own unique abilities and playstyle."),
			ShortDescription: StringPointer("Character-based tactical shooter with unique abilities and precise gunplay."),
			Image:            StringPointer("https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80"),
			Banner:           StringPointer("https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1200&q=80"),
			Logo:             StringPointer("https://api.dicebear.com/7.x/identicon/svg?seed=Valorant"),
			Players:          StringPointer("25M"),
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
			Description:      StringPointer("Fortnite is a free-to-play Battle Royale game with numerous game modes for every type of game player. Watch a concert, build an island or fight. Fortnite is a Free-to-Play Battle Royale game and so much more. Hang out peacefully with friends while watching a concert or movie. Build and create your own island, or fight to be the last person standing."),
			ShortDescription: StringPointer("The world-famous battle royale game where building and shooting skills combine."),
			Image:            StringPointer("https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80"),
			Banner:           StringPointer("https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=1200&q=80"),
			Logo:             StringPointer("https://api.dicebear.com/7.x/identicon/svg?seed=Fortnite"),
			Players:          StringPointer("15M"),
			ReleaseDate:      StringPointer("2017-07-25"),
			Developer:        StringPointer("Epic Games"),
			Publisher:        StringPointer("Epic Games"),
			Platforms:        []string{"PC", "Console", "Mobile"},
			Tags:             []string{"battle royale", "multiplayer", "action"},
			Rating:           FloatPointer(4.2),
		},
		{
			Slug:             "apex-legends",
			Title:            "Apex Legends",
			Description:      StringPointer("Apex Legends is a free-to-play battle royale-hero shooter game developed by Respawn Entertainment and published by Electronic Arts. It was released for Microsoft Windows, PlayStation 4, and Xbox One in February 2019, for Nintendo Switch in March 2021, and for PlayStation 5 and Xbox Series X/S in March 2022."),
			ShortDescription: StringPointer("Free-to-play battle royale game where legendary characters with powerful abilities team up."),
			Image:            StringPointer("https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80"),
			Banner:           StringPointer("https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=1200&q=80"),
			Logo:             StringPointer("https://api.dicebear.com/7.x/identicon/svg?seed=ApexLegends"),
			Players:          StringPointer("260K"),
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
			Description:      StringPointer("Genshin Impact is an open-world action role-playing game developed and published by miHoYo. The game features a fantasy open-world environment and action-based battle system using elemental magic and character-switching, and uses gacha game monetization for players to obtain new characters, weapons, and other resources."),
			ShortDescription: StringPointer("Open-world action RPG with elemental combat and gacha mechanics."),
			Image:            StringPointer("https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80"),
			Banner:           StringPointer("https://images.unsplash.com/photo-1590845947698-8924d7409b56?w=1200&q=80"),
			Logo:             StringPointer("https://api.dicebear.com/7.x/identicon/svg?seed=GenshinImpact"),
			Players:          StringPointer("5M"),
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
