export interface Message {
  user: string;
  body: string;
  timestamp?: string;
}

export type MessageMap = Record<string, Message[]>;

const STORAGE_KEY = "chat_messages";

export const MessageStorage = {
  load(): MessageMap {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },
  save(messagesMap: MessageMap) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesMap));
  },
};
