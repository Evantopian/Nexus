import { useEffect, useState } from "react";

export interface Message {
  id: string;
  body: string;
  user_id: string;
  timestamp: string;
}

export function useMessageFeed(channel: any, topicKey: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!channel) return;

    const handleNew = (msg: Message) => {
      setMessages((prev) => [...prev, msg].slice(-200));
    };

    channel.on("message:new", handleNew);
    return () => {
      channel.off("message:new", handleNew);
    };
  }, [channel]);

  return { messages };
}