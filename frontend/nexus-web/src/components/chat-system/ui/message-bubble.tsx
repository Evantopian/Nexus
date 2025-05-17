"use client"

import type React from "react"

import { formatTime } from "../utils/format-time"
import { useState } from "react"

interface MessageBubbleProps {
  id: string | number
  sender: {
    username: string
    id?: string
  }
  timestamp: string | number | Date
  body: string
  isCurrentUser?: boolean
  showAvatar?: boolean
  showTimestamp?: boolean
  isFirstInGroup?: boolean
  isLastInGroup?: boolean
  onKeyDown?: (e: React.KeyboardEvent) => void
}

export function MessageBubble({
  id,
  sender,
  timestamp,
  body,
  isCurrentUser = false,
  showAvatar = true,
  showTimestamp = true,
  isFirstInGroup = true,
  isLastInGroup = true,
  onKeyDown,
}: MessageBubbleProps) {
  const formattedTime = formatTime(timestamp)
  const initial = typeof sender.username === "string" ? sender.username.charAt(0).toUpperCase() : ""
  const [isFocused, setIsFocused] = useState(false)

  // Discord-style message - no bubble, just text on background with a subtle left border for non-user messages
  return (
    <div
      className={`group flex items-start gap-3 py-1.5 px-2 ${
        isFocused ? "bg-gray-100/70 dark:bg-[#2a2d3e]/70" : "hover:bg-gray-100/50 dark:hover:bg-[#2a2d3e]/40"
      } ${isCurrentUser ? "pl-4" : "border-l-2 border-transparent hover:border-indigo-300 dark:hover:border-[#6c5ce7]"}`}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={onKeyDown}
      role="listitem"
      aria-label={`Message from ${sender.username}: ${body}`}
    >
      {showAvatar ? (
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center text-sm font-bold text-white ${
            isCurrentUser ? "bg-indigo-500 dark:bg-[#6c5ce7]" : "bg-emerald-500 dark:bg-[#00b894]"
          }`}
        >
          {initial}
        </div>
      ) : (
        <div className="flex-shrink-0 w-10 opacity-0">{/* Invisible placeholder to maintain alignment */}</div>
      )}

      <div className="flex flex-col max-w-[90%] pt-0.5">
        {isFirstInGroup && (
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`font-bold text-sm ${
                isCurrentUser ? "text-indigo-600 dark:text-indigo-400" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {sender.username}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formattedTime}</span>
          </div>
        )}

        <div className={`text-gray-800 dark:text-gray-200 text-sm leading-relaxed ${isFirstInGroup ? "" : "pl-0"}`}>
          {body}
        </div>

        {/* Message actions that appear on hover */}
        <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100">
          <button className="w-6 h-6 rounded-sm bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-[#3f4259]">
            <span className="text-xs">👍</span>
          </button>
          <button className="w-6 h-6 rounded-sm bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-[#3f4259]">
            <span className="text-xs">⋯</span>
          </button>
        </div>
      </div>
    </div>
  )
}
