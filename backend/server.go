package main

import (
	"context"
	"log"
	"os"

	"github.com/Evantopian/Nexus/internal/database/postgres"
	"github.com/Evantopian/Nexus/internal/handler"

	"github.com/joho/godotenv"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
)

var ginLambda *ginadapter.GinLambda

func init() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found")
	}

	postgres.ConnectPostgres()

	r := handler.SetUpHandler()
	ginLambda = ginadapter.New(r)
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	log.Println("Received request:", req)
	//directly add path from lambda since gin not recognizing
	if proxyPath, ok := req.PathParameters["proxy"]; ok {
		req.Path = "/" + proxyPath
	}
	if req.HTTPMethod == "" {
		// Manually set method since gin not recognizing
		switch req.Path {
		case "/login", "/signup", "/logout", "/query":
			req.HTTPMethod = "POST"
		default:
			req.HTTPMethod = "GET"
		}
	}
	log.Printf("Fixed Request Path: %s, Method: %s", req.Path, req.HTTPMethod)
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	log.Println("STARTING SERVER...")

	if os.Getenv("LAMBDA_TASK_ROOT") != "" {
		// Running on AWS Lambda
		log.Println("Detected Lambda runtime.")
		lambda.Start(Handler)
		//lambda.Start(ginLambda.ProxyWithContext)

	} else {
		// Running locally
		port := os.Getenv("PORT")
		log.Printf("Server running at http://localhost:%s", port)
		log.Fatal(handler.SetUpHandler().Run(":" + port))
	}
}
