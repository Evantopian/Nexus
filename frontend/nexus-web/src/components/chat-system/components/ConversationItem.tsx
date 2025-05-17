"use client"

import type React from "react"

import { Link } from "react-router-dom"
import { BellOff, MoreVertical } from "lucide-react"

interface ConversationItemProps {
  conversation: any
  isActive: boolean
  index: number
  onContextMenu: (e: React.MouseEvent, id: string) => void
  onKeyDown: (e: React.KeyboardEvent, index: number) => void
  isMuted: boolean
}

export function ConversationItem({
  conversation,
  isActive,
  index,
  onContextMenu,
  onKeyDown,
  isMuted,
}: ConversationItemProps) {
  const id = conversation?.id || ""
  const username = conversation?.user?.username || "Unknown"
  const lastMessage = conversation?.lastMessage || ""

  return (
    <div className="relative group conversation-item" onContextMenu={(e) => onContextMenu(e, id)}>
      <Link
        to={`/chat/dms/${id}`}
        className={`w-full px-2 py-2 flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#6c5ce7] rounded-md ${
          isActive
            ? "bg-indigo-100 dark:bg-[#6c5ce7]/20 border-l-4 border-indigo-500 dark:border-[#6c5ce7]"
            : "hover:bg-gray-100 dark:hover:bg-[#2a2d3e] border-l-4 border-transparent"
        }`}
        data-conversation-index={index}
        tabIndex={0}
        onKeyDown={(e) => onKeyDown(e, index)}
        role="listitem"
        aria-label={`Conversation with ${username}`}
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-md flex items-center justify-center mr-2 text-sm font-bold text-white bg-emerald-500 dark:bg-[#00b894]">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center">
            {username}
            {isMuted && <BellOff size={12} className="ml-1 text-gray-400" />}
          </div>
          {lastMessage && <div className="text-xs truncate text-gray-500 dark:text-gray-400 mt-0.5">{lastMessage}</div>}
        </div>
        {isActive && <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-[#6c5ce7] mr-1"></div>}
      </Link>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-md opacity-0 group-hover:opacity-100 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3f4259] transition-opacity duration-200"
        onClick={(e) => {
          e.stopPropagation()
          onContextMenu(e, id)
        }}
      >
        <MoreVertical size={14} />
      </button>
    </div>
  )
}
