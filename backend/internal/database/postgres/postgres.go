package postgres

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

// ConnectPostgres initializes a connection to the PostgreSQL database
func ConnectPostgres() {
	// Retrieve the PostgreSQL connection URL from environment variables
	// Example format: "postgres://<user>:<password>@localhost:5432/<db_name>"
	dbURL := os.Getenv("POSTGRES_URL")
	if dbURL == "" {
		log.Fatal("POSTGRES_URL is not set or found in the environment")
	}

	// Parse the database URL into a configuration object
	config, err := pgxpool.ParseConfig(dbURL)
	if err != nil {
		log.Fatalf("Unable to parse PostgreSQL config: %v", err)
	}

	// Create a context with a timeout to avoid hanging connections
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Establish a connection pool using the parsed config
	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Fatalf("Unable to connect to PostgreSQL connection pool: %v", err)
	}

	// Ping the database to ensure the connection is active
	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("PostgreSQL ping failed: %v", err)
	}

	// Assign the connected pool to the global variable for reuse
	DB = pool
	log.Println("Connected to PostgreSQL!")
}

// ClosePostgres gracefully closes the database connection pool
func ClosePostgres() {
	if DB != nil {
		DB.Close()
		log.Println("PostgreSQL connection pool closed.")
	}
}
