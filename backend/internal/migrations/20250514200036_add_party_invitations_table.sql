-- +goose Up
-- Create the invitations table
CREATE TABLE party_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_id UUID REFERENCES parties(id) ON DELETE CASCADE,  -- The party being invited to
    inviter_id UUID REFERENCES users(uuid),                   -- The user who sent the invitation
    invitee_id UUID REFERENCES users(uuid),                   -- The user who was invited
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),                       -- Time when the invitation was sent
    UNIQUE (party_id, invitee_id)                             -- Ensure only one invite per user per party
);

-- +goose Down
-- Drop the invitations table
DROP TABLE IF EXISTS party_invitations;
