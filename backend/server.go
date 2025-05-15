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

func Handler(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayProxyResponse, error) {
	log.Printf("Incoming (V2): RawPath=%s, Method=%s", req.RawPath, req.RequestContext.HTTP.Method)

	// Manually map into a V1-style request
	v1 := events.APIGatewayProxyRequest{
		HTTPMethod:      req.RequestContext.HTTP.Method,
		Path:            req.RawPath,
		Headers:         req.Headers,
		Body:            req.Body,
		IsBase64Encoded: req.IsBase64Encoded,
	}

	return ginLambda.ProxyWithContext(ctx, v1)
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
