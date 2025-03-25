package contextkey

// Key is a custom type for the context key
// Used to explicitly define a string type for gin and http context differences
type Key string

// Define the UserUUIDKey constant using the custom Key type
const UserUUIDKey Key = "userUUID"
