-- +goose Up
-- +goose StatementBegin
CREATE TABLE friend_requests (
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'accepted', 'rejected'
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (sender_id, receiver_id),
    FOREIGN KEY (sender_id) REFERENCES users(uuid) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(uuid) ON DELETE CASCADE,
    CHECK (sender_id != receiver_id)  -- Prevent self-requests
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS friend_requests;
-- +goose StatementEnd
