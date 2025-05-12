// components/chats/Sidebar/DirectSidebar.tsx
"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X } from "lucide-react"
import { useChat } from "@/contexts/ChatContext"

interface DirectSidebarProps {
  activeContactId?: string
}

const DirectSidebar: React.FC<DirectSidebarProps> = ({ activeContactId }) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const { conversations } = useChat()

  const filtered = conversations.filter((conv) =>
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
  )

  return (
    <aside className="w-64 bg-gray-100 dark:bg-[#0e1525] flex flex-col h-full border-r border-gray-200 dark:border-[#1e2a45] overflow-hidden">
      <div className="p-3 border-b border-gray-200 dark:border-[#1e2a45] flex-shrink-0">
        <h2 className="text-gray-800 dark:text-white font-bold mb-3">Direct Messages</h2>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="w-full bg-white dark:bg-[#182238] text-gray-800 dark:text-[#e0e4f0] placeholder-gray-500 dark:placeholder-[#8a92b2] rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#4a65f2] border border-gray-300 dark:border-transparent"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#8a92b2]"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-[#8a92b2]" />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto chat-scrollbar-hide px-2 py-2">
        {filtered.length > 0 ? (
          sorted.map((conv) => (
            <button
              key={`${conv.id}-${conv.user.id}`}
              onClick={() => navigate(`/chat/direct/${conv.user.id}`)}
              className={`flex items-center gap-3 w-full p-2 rounded-md transition group mb-1 ${
                conv.user.id === activeContactId
                  ? "bg-gray-200 dark:bg-[#182238]"
                  : "hover:bg-gray-200 dark:hover:bg-[#182238]"
              }`}
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-blue-500 dark:bg-[#4a65f2] text-white flex items-center justify-center shadow-md">
                  {conv.user.username[0]}
                </div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800 dark:text-[#e0e4f0] truncate">
                    {conv.user.username}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-[#8a92b2] truncate block">
                  {conv.lastMessage}
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-[#8a92b2] text-sm">No conversations found</div>
        )}
      </div>
    </aside>
  )
}

export default DirectSidebar
