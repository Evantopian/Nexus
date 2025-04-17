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
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Account creation time
    preferences JSONB -- User's game preferences (you can store preferences as a JSON object)
);

CREATE TABLE friends (
    user_id UUID NOT NULL,
    friend_id UUID NOT NULL,
    since TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(uuid) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(uuid) ON DELETE CASCADE,
    CHECK (user_id != friend_id)  -- Prevent self-friendship
);

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

CREATE TABLE servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE SET NULL, -- Links to a game (optional)
    name TEXT NOT NULL UNIQUE,
    image TEXT,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE server_members (
    server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (server_id, user_id)
);

CREATE TABLE lfg_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE, -- Connect LFG to a Game
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(uuid) ON DELETE CASCADE,
    requirements TEXT[], -- Array of custom requirements
    tags TEXT[], -- Array of custom tags
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Dummy data for testing:

INSERT INTO users (
    email,
    password,
    username,
    profile_img,
    profile_message,
    status,
    reputation,
    rank,
    preferences
)
VALUES (
    'testuser@example.com',
    '$2a$12$CpQct0NpAvDJv2LneH7SoOArAZSwnZ/oQbQi86gXLKXTQ0Xg.3nnG', -- password123 in bscrypt (12)
    'testuser',
    'https://example.com/avatar.jpg',
    'Let’s game!',
    'online',
    50,
    'silver',
    '{"region": "NA", "playstyle": "COMPETITIVE"}'
);

INSERT INTO users (
    email,
    password,
    username,
    profile_img,
    profile_message,
    status,
    reputation,
    rank,
    preferences
)
VALUES (
    'testuser2@example.com',
    '$2a$12$cnklf7YybVVNGYByqLk96OB6pvQYnyvXFOJTN2D6hrDhMTPFFuLMm', -- password11a in byscrypt
    'testuser2',
    'https://example.com/avatar2.jpg',
    'Let’s game!',
    'online',
    50,
    'silver',
    '{"region": "NA", "playstyle": "COMPETITIVE"}'
);