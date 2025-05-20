"use client"

import { forwardRef } from "react"
import { MessageSquare, Star, Bell, BellOff, Users, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Check if a conversation is favorited
const isFavorite = (userId: string) => {
  const favorites = JSON.parse(localStorage.getItem("chat-favorites") || "[]")
  return favorites.includes(userId)
}

// Check if a conversation is muted
const isMuted = (userId: string) => {
  const muted = JSON.parse(localStorage.getItem("chat-muted") || "[]")
  return muted.includes(userId)
}

// Toggle favorite status
const toggleFavorite = (userId: string, _conversations: any[]) => {
  const favorites = JSON.parse(localStorage.getItem("chat-favorites") || "[]")
  if (isFavorite(userId)) {
    const newFavorites = favorites.filter((id: string) => id !== userId)
    localStorage.setItem("chat-favorites", JSON.stringify(newFavorites))
  } else {
    favorites.push(userId)
    localStorage.setItem("chat-favorites", JSON.stringify(favorites))
  }
}

// Toggle muted status
const toggleMuted = (userId: string, _conversations: any[]) => {
  const muted = JSON.parse(localStorage.getItem("chat-muted") || "[]")
  if (isMuted(userId)) {
    const newMuted = muted.filter((id: string) => id !== userId)
    localStorage.setItem("chat-muted", JSON.stringify(newMuted))
  } else {
    muted.push(userId)
    localStorage.setItem("chat-muted", JSON.stringify(muted))
  }
}

interface ContextMenuProps {
  contextMenu: {
    visible: boolean
    x: number
    y: number
    conversationId: string
  }
  conversations: any[]
  onRemove: (id: string) => void
  onClose: () => void
}

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ contextMenu, conversations, onRemove, onClose }, ref) => {
    const navigate = useNavigate()

    // Find the conversation to get user details
    const conversation = conversations.find((conv: any) => conv.id === contextMenu.conversationId)
    const userId = conversation?.user?.id || ""
    const userFavorited = isFavorite(userId)
    const userMuted = isMuted(userId)

    return (
      <div
        ref={ref}
        className="fixed bg-white dark:bg-[#2a2d3e] shadow-lg rounded-md py-1 z-50 border border-gray-200 dark:border-[#3f4259] w-48"
        style={{ top: contextMenu.y, left: contextMenu.x }}
      >
        <button
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
          onClick={() => {
            // Mark as read logic
            onClose()
          }}
        >
          <MessageSquare size={14} className="mr-2" />
          Mark as Read
        </button>
        <button
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
          onClick={() => {
            toggleFavorite(userId, conversations)
            onClose()
          }}
        >
          <Star size={14} className="mr-2" />
          {userFavorited ? "Remove Favorite" : "Add Favorite"}
        </button>
        <button
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
          onClick={() => {
            toggleMuted(userId, conversations)
            onClose()
          }}
        >
          {userMuted ? <Bell size={14} className="mr-2" /> : <BellOff size={14} className="mr-2" />}
          {userMuted ? "Unmute" : "Mute"}
        </button>
        <button
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
          onClick={() => {
            // Add to group logic
            onClose()
          }}
        >
          <Users size={14} className="mr-2" />
          Add to Group
        </button>
        <div className="border-t border-gray-200 dark:border-[#3f4259] my-1"></div>
        <button
          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
          onClick={() => {
            onRemove(contextMenu.conversationId)
            // If the removed conversation was active, navigate to the default view
            if (contextMenu.conversationId === window.location.pathname.split("/").pop()) {
              navigate("/chat/dms")
            }
          }}
        >
          <Trash2 size={14} className="mr-2" />
          Remove
        </button>
      </div>
    )
  },
)

ContextMenu.displayName = "ContextMenu"
