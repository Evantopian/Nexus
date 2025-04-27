// for local testing (map to cloud in the future when we do use a db)

const STORAGE_KEY = "chat_messages";

interface Message {
  user: string;
  body: string;
}

type MessageMap = Record<string, Message[]>;  
export const MessageStorage = {
  load(): MessageMap {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  save(messagesMap: MessageMap) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesMap));
  },

  addMessage(topic: string, message: Message) {
    const map = MessageStorage.load();
    const updated = [...(map[topic] || []), message].slice(-10);
    map[topic] = updated;
    MessageStorage.save(map);
  }
};
