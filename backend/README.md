# Nexus Backend

Contains information and instructions for Nexus Backend

## Technologies Used:

- **Go** - A statically typed programming language that is fast, simple with concurreny, which is ideal for scalable web applications and APIs.
- **Gin** - Web framework for building APIs in Go
- **PostgreSQL** - Relational database management system
- **JWT** - JSON Web Token authentication for secure transmission of information
- **GraphQL** - Query language for APIs, which allows for client to requests only the data needed
- **gqlgen** - Helps with building GraphQL servers, which automates schema and resolver generation
- **GraphQL Playground** - Playground for testing GraphQL queries
<!-- - **MongoDB** - Optional NoSQL database -->

## Setup Instructions

### 1. Install Dependencies

Before running the project, you'll need to install all required dependencies.

In your terminal:
Run go get for each dependency in the require section of go.mod, then run go mod tidy.

```bash
go get
go mod tidy
```

### 2. Set up .env file

Example of .env file set up:

```bash
POSTGRES_URL=connection_url
MONGO_URI=connection_uri
JWT_SECRET_KEY=your_jwt_secret_key
```

### 3. Run the application

You can run the application using the following command:

```bash
go run main.go
```

#### Alternatively, you can use Air, a live-reloading go tool that automatically reloads on code change.

Install air via go get, then simply do air to run it.

```bash
go install github.com/cosmtrek/air@latest
air
```

### 4. Access GraphQL Playground

This will open the GraphQL Playground, where you can test your GraphQL queries.

```bash
http://localhost:8080/
```

#### Run queries with valid authorization token to test against the server.

Use the /query endpoint for sending GraphQL requests.

Be sure to put this under Headers with the correct token:

```bash
"Authorization": "Bearer <token>"
```

Profile Query Example:

```bash
query {
  profile {
    uuid
    username
    email
    profileImg
    profileMessage
    status
    reputation
    rank
    createdAt
    preferences {
      region
      playstyle
    }
  }
}
```

Another Profile Query Example (showing you can choose what you need):

```bash
query {
  profile {
    uuid
    username
    email
    profileImg
    profileMessage
    status
    reputation
    rank
  }
}
```

Update User Mutation Example:

```bash
mutation {
  updateUser(
    username: "NewUsername"
    email: "newemail@example.com"
    profileImg: "https://example.com/new-image.jpg"
    profileMessage: "Hello, world!"
    status: "online"
    rank: "gold"
  ) {
    uuid
    username
    email
    profileImg
    profileMessage
    status
    rank
  }
}
```
