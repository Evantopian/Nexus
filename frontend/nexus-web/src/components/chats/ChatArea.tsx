// src/components/chats/ChatArea.tsx
import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useMessageFeed } from "@/hooks/useMessageFeed";
import { useTypingEvents } from "@/hooks/useTypingEvents";

import ChatHeader from "./ChatHeader";
import ChatTabs from "./ChatTabs";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import NoMessagesFallback from "./NoMessagesFallback";

const tabs = ["Direct Messages", "Group Chats"];

const ChatArea: React.FC = () => {
  const { contact } = useParams<{ contact: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const initialTab = location.pathname.includes("/chat/groups/")
    ? tabs[1]
    : tabs[0];
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const route = tab === "Direct Messages" ? "direct" : "groups";
    navigate(`/chat/${route}/${contact}`, { replace: true });
  };

  const token = localStorage.getItem("authToken");
  const readyToConnect = !!user && !!token;

  // Directly use `contact` as the topic ID
  const topic =
    activeTab === "Direct Messages"
      ? contact
        ? `dm:${contact}`
        : null
      : contact
      ? `room:${contact}`
      : null;

  const { channel } = useChatSocket(topic ?? "", readyToConnect && !!topic ? token : null);
  const { messages } = useMessageFeed(channel, topic ?? "");
  const { typingUsers, handleTyping } = useTypingEvents(channel, user?.uuid ?? null);

  if (!readyToConnect || !topic) {
    return <div className="p-4 text-gray-600">Connecting to chat...</div>;
  }

  const sendMessage = () => {
    if (channel && message.trim()) {
      channel.push("message:new", { body: message });
      setMessage("");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden min-h-0">
      <ChatTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      <ChatHeader title={contact ?? "Unknown"} />
      {messages.length === 0 ? (
        <NoMessagesFallback />
      ) : (
        <MessageList messages={messages} typingUsers={typingUsers} />
      )}
      <MessageInput
        value={message}
        onChange={setMessage}
        onSend={sendMessage}
        onTyping={handleTyping}
      />
    </div>
  );
};

export default ChatArea;
