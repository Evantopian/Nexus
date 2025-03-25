-- +goose Up
-- +goose StatementBegin
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    image TEXT,
    banner TEXT,
    logo TEXT,
    players TEXT NOT NULL,
    release_date DATE,
    developer TEXT,
    publisher TEXT,
    platforms TEXT[], -- Array of platform names
    tags TEXT[], -- Array of tags
    rating FLOAT DEFAULT 0.0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS games;
-- +goose StatementEnd
