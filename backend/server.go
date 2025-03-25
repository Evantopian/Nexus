package main

import (
	"log"
	"os"

	"github.com/Evantopian/Nexus/internal/database/postgres"
	"github.com/Evantopian/Nexus/internal/handler"
	"github.com/joho/godotenv"
)

func init() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found")
	}
}

func main() {
	postgres.ConnectPostgres()

	// Set up new gin router
	r := handler.SetUpHandler()

	port := os.Getenv("PORT")
	log.Printf("Server running at http://localhost:%s", port)
	log.Fatal(r.Run(":" + port))
}
