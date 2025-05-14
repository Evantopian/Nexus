-- +goose Up
-- Create the parties table with an array of members (UUIDs)
CREATE TABLE parties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    leader_id UUID REFERENCES users(uuid),  -- The leader of the party (references users table)
    members UUID[],                        -- Array of user IDs representing party members
    max_members INT DEFAULT 5,             -- Maximum members allowed in the party
    created_at TIMESTAMPTZ DEFAULT now(),  -- When the party was created
    CHECK (array_length(members, 1) <= 5)  -- Ensure no more than 5 members in the array
);

-- +goose Down
-- Drop the parties table
DROP TABLE IF EXISTS parties;
