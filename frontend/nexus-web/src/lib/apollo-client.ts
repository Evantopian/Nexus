import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client";

// Assuming you have a method to get the token (e.g., from localStorage)
const getAuthToken = () => {
  return localStorage.getItem("authToken"); // Or from context if you store it there
};

// Create a middleware to attach the authorization token to each request
const authLink = new ApolloLink((operation, forward) => {
  const token = getAuthToken();

  // Add the token to the request header if it exists
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : "", // Include the token in the Authorization header
    },
  });

  return forward(operation);
});

// Create the Apollo Client with the authLink middleware
const client = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: "http://localhost:8080/query" })),
  cache: new InMemoryCache(),
});

export default client;
