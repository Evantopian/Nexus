package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/Evantopian/Nexus/internal/jwt"

	"github.com/gin-gonic/gin"
)

// TokenAuthMiddleware validates JWT and extracts user info
func TokenAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from the "Authorization" header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token required"})
			c.Abort()
			return
		}

		// Expect format: "Bearer <token>"
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			c.Abort()
			return
		}

		// Validate the token
		userUUID, err := jwt.ValidateToken(tokenParts[1])
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Store user UUID in the request context
		c.Set("uuid", userUUID)

		// Debug log to ensure the UUID is set
		fmt.Println("UUID set in context:", userUUID)

		// Proceed to the next middleware/handler
		c.Next()
	}
}
