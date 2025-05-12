package handler

import (
	"context"
	"time"

	"github.com/Evantopian/Nexus/graph"
	"github.com/gin-contrib/cors"

	"github.com/Evantopian/Nexus/internal/handler/controller"
	"github.com/Evantopian/Nexus/internal/middleware"
	contextkey "github.com/Evantopian/Nexus/internal/services"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-gonic/gin"
)

// SetUpHandler sets up the REST API routes along with the GraphQL server and playground
func SetUpHandler() *gin.Engine {
	r := gin.Default()

	// Configure CORS settings
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173","http://192.168.50.208:8081"}, // Allow frontend URL
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"}, // Allow Authorization header
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour, // Cache CORS response for 12 hours
	}))

	// Set up the GraphQL schema with resolvers
	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	srv.AddTransport(transport.Options{})

	// Add GraphQL transports (HTTP POST/GET for GraphQL queries)
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.Use(extension.Introspection{})

	// GraphQL Playground (for testing)
	r.GET("/", func(c *gin.Context) {
		playground.Handler("GraphQL playground", "/query").ServeHTTP(c.Writer, c.Request)
	})

	// Public routes (no auth)
	publicGroup := r.Group("/")
	{
		publicGroup.POST("/signup", controller.Signup)
		publicGroup.POST("/login", controller.Login)
	}

	// Protected routes (with token auth middleware)
	protectedGroup := r.Group("/")
	{
		protectedGroup.Use(middleware.TokenAuthMiddleware())

		// Protected GraphQL query endpoint
		protectedGroup.POST("/query", func(c *gin.Context) {
			// Access the userUUID from the context by using contextkey
			// Add UUID to context and then to request context for GraphQL
			userUUID, exists := c.Get("uuid")
			if exists && userUUID != nil {
				ctx := context.WithValue(c.Request.Context(), contextkey.UserUUIDKey, userUUID)
				c.Request = c.Request.WithContext(ctx)
			}

			// Serve the GraphQL request with the updated context
			srv.ServeHTTP(c.Writer, c.Request)
		})

		// Other protected routes
		protectedGroup.POST("/logout", controller.Logout)
	}

	return r
}
