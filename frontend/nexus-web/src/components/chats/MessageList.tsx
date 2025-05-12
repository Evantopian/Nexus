// src/components/chats/MessageList.tsx
import React, { useEffect, useRef } from "react";
import { Message } from "@/hooks/useMessageFeed";

interface MessageListProps {
  messages: Message[];
  typingUsers: string[];
}

const MessageList: React.FC<MessageListProps> = ({ messages, typingUsers }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
      {messages.map((msg, i) => (
        <div key={i} className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
            {msg.user_id?.[0] ?? "?"}
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="font-medium text-indigo-600 dark:text-indigo-300">
                {msg.user_id}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="mt-1 text-gray-700 dark:text-gray-300">{msg.body}</p>
          </div>
        </div>
      ))}

      {typingUsers.length > 0 && (
        <div className="py-2 text-sm italic text-gray-500 dark:text-gray-400">
          {typingUsers.join(", ")} typing...
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
