package jwt

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Secret key for signing JWT tokens (loaded from environment variables)
var jwtSecret []byte

// init function loads the JWT secret from the .env file when the package is initialized
func init() {
	// Load the JWT secret key from the environment variable
	jwtSecret = []byte(os.Getenv("JWT_SECRET_KEY"))
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
