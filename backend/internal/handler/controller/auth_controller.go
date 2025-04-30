package controller

import (
	"context"
	"net/http"
	"time"

	"github.com/Evantopian/Nexus/internal/database/postgres"
	"github.com/Evantopian/Nexus/internal/jwt"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Token expiration (can be configured via env variables)
var tokenExpiryMinutes = 120

// User represents a user account.
type User struct {
	UUID           string    `json:"uuid" db:"uuid" bson:"uuid"`    // Unique identifier for the user.
	Email          string    `json:"email" db:"email" bson:"email"` // User email.
	Password       string    `json:"password,omitempty" db:"password" bson:"password"`
	Username       string    `json:"username" db:"username" bson:"username"`                                          // Unique username.
	ProfileImg     string    `json:"profile_img,omitempty" db:"profile_img" bson:"profile_img,omitempty"`             // URL or path to profile image.
	ProfileMessage string    `json:"profile_message,omitempty" db:"profile_message" bson:"profile_message,omitempty"` // A short bio or status message.
	Status         string    `json:"status,omitempty" db:"status" bson:"status,omitempty"`                            // e.g., "online", "offline", "busy".
	Reputation     int       `json:"reputation" db:"reputation" bson:"reputation"`                                    // Player's reputation (-100 to 1000).
	Rank           string    `json:"rank,omitempty" db:"rank" bson:"rank,omitempty"`                                  // User rank (optional).
	CreatedAt      time.Time `json:"created_at" db:"created_at" bson:"created_at"`                                    // Account creation time.
	Preferences    string    `json:"preferences,omitempty" db:"preferences" bson:"preferences,omitempty"`             // JSONB field for user preferences.
}

// SignupRequest - Struct for signup request
type SignupRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginRequest - Struct for login request
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Signup - Registers new users
func Signup(c *gin.Context) {
	var req SignupRequest

	// Bind and validate JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	// Generate UUID
	user := User{
		UUID:      uuid.New().String(),
		Username:  req.Username,
		Email:     req.Email,
		CreatedAt: time.Now(),
	}

	// Hash the password
	hashedPass, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error. Please try again later."})
		return
	}
	user.Password = string(hashedPass)

	// Create DB context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Insert user into database
	query := "INSERT INTO users (uuid, username, email, password, created_at) VALUES ($1, $2, $3, $4, $5)"
	_, err = postgres.DB.Exec(ctx, query, user.UUID, user.Username, user.Email, user.Password, user.CreatedAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	// Generate JWT token
	token, err := jwt.GenerateToken(user.UUID, tokenExpiryMinutes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate authentication token"})
		return
	}

	// After generating the JWT token in the login route
	// c.SetCookie("token", token, tokenExpiryMinutes*60, "/", "", false, true)

	// Respond with success message and token
	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully", "token": token})
}

// Login - Authenticates users
func Login(c *gin.Context) {
	var req LoginRequest

	// Bind and validate JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	var user User
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Query database for user
	query := "SELECT uuid, password FROM users WHERE email=$1"
	err := postgres.DB.QueryRow(ctx, query, req.Email).Scan(&user.UUID, &user.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Generate JWT token
	token, err := jwt.GenerateToken(user.UUID, tokenExpiryMinutes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate authentication token"})
		return
	}

	// After generating the JWT token in the login route
	// c.SetCookie("token", token, tokenExpiryMinutes*60, "/", "", false, true)

	// Respond with token
	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "token": token})
}

// Logout - Logs out the user by clearing the token in the cookie
func Logout(c *gin.Context) {
	// Clear the authentication token in the cookie by setting it to an empty value
	// Cookie parameters: name, value, max age, path, domain, secure(true for production), httpOnly
	// c.SetCookie("token", "", -1, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}
