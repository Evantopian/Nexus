-- +goose Up
-- +goose StatementBegin
CREATE TABLE servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE SET NULL, -- Links to a game (optional)
    name TEXT NOT NULL UNIQUE,
    image TEXT,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS servers;
-- +goose StatementEnd
