-- +goose Up
-- +goose StatementBegin
CREATE TABLE lfg_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE, -- Connect LFG to a Game
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
    requirements TEXT[], -- Array of custom requirements
    tags TEXT[], -- Array of custom tags
    conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS lfg_posts;
-- +goose StatementEnd
