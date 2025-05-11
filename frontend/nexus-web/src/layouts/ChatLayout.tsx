// src/layouts/ChatLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import ChatSidebar from "@/components/chats/ChatSidebar";

const ChatLayout: React.FC = () => (
  <div className="flex h-[calc(100vh-6rem)] bg-gray-50 dark:bg-gray-900">
    <ChatSidebar />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

export default ChatLayout;
