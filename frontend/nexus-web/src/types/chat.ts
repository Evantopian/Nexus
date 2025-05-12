export interface Message {
  id: string;
  body: string;
  user_id: string;
  conversation_id: string;
  created_at: string;
  timestamp: string;
  pending?: boolean;
}
