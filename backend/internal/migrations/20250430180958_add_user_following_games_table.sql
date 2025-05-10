-- +goose Up
-- +goose StatementBegin
CREATE TABLE user_following_games (
    user_id UUID NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    followed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, game_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS user_following_games;
-- +goose StatementEnd
