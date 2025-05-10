import React from "react";
import ChatSidebar from "@/components/chats/ChatSidebar";
import { Outlet } from "react-router-dom";

const ChatLayout: React.FC = () => (
  <div className="flex h-[calc(100vh-6rem)] bg-gray-50 dark:bg-gray-900">
    <ChatSidebar />
    <Outlet />
  </div>
);

export default ChatLayout;