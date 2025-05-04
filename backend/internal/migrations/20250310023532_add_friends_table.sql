-- +goose Up
-- +goose StatementBegin
CREATE TABLE friends (
    user_id UUID NOT NULL,
    friend_id UUID NOT NULL,
    since TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(uuid) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(uuid) ON DELETE CASCADE,
    CHECK (user_id != friend_id)  -- Prevent self-friendship
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS friends;
-- +goose StatementEnd
