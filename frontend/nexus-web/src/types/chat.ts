// src/types/chat.ts

// 1️⃣ A little helper for any user that shows up in chat
export interface ChatUser {
  id: string
  username: string
}

// 2️⃣ Your Message type now carries the full sender object
export interface Message {
  id: string
  sender: ChatUser            // ← instead of sender_id
  body: string
  timestamp: string           // matches your RFC3339 timestamp
  channelId?: string | null
  conversationId?: string | null
  replyTo?: string | null
  pinned: boolean
}

// 3️⃣ And your conversation type can carry a full `user` as well
export interface DirectConversation {
  id: string
  user: ChatUser              // the “other” user in a 1:1 DM
  lastMessage: string
  lastActive: string          // again, ISO timestamp
}

// If you ever need a group convo shape:
export interface GroupConversation {
  id: string
  participants: ChatUser[]
  lastMessage: string
  lastActive: string
}

// And your target stays the same
export type ChatTarget =
  | { type: "dm"; id: string }
  | { type: "group"; id: string }
  | { type: "channel"; id: string }
