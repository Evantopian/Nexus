package jwt

import (
	"errors"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

// Secret key for signing JWT tokens (loaded from environment variables)
var jwtSecret []byte

func init() {
	// Load the .env file from backend/.env (relative to project root)
	if err := godotenv.Load(".env"); err != nil {
		log.Printf("Could not load backend/.env: %v", err)
	}

	// Log for sanity
	log.Printf("Loaded JWT_SECRET_KEY: %q", os.Getenv("JWT_SECRET_KEY"))

	// Set the jwtSecret
	secret := os.Getenv("JWT_SECRET_KEY")
	if secret == "" {
		log.Fatal("JWT_SECRET_KEY is not set in environment")
	}
	jwtSecret = []byte(secret)
}

// GenerateToken creates a JWT token with a custom expiration time (in minutes)
func GenerateToken(uuid string, expiryMinutes int) (string, error) {
	claims := jwt.MapClaims{
		"uuid": uuid,
		"exp":  time.Now().Add(time.Duration(expiryMinutes) * time.Minute).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// ValidateToken verifies a JWT token and extracts the user UUID
func ValidateToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return "", errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || claims["uuid"] == nil {
		return "", errors.New("invalid token claims")
	}

	return claims["uuid"].(string), nil
}
