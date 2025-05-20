-- +goose Up
-- +goose StatementBegin
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    profile_img TEXT, 
    profile_message TEXT,
    status TEXT, -- e.g., "online", "offline", "busy"
    reputation INT NOT NULL DEFAULT 0 CHECK (reputation >= -100 AND reputation <= 1000), -- Reputation starts at 0 with floor -100 and 1000 as ceiling
    rank TEXT, -- User's rank (optional)
    age INT -- User's age (nullable field, use NULL for unset age)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Account creation time
    preferences JSONB -- User's game preferences (you can store preferences as a JSON object)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE users;
-- +goose StatementEnd
