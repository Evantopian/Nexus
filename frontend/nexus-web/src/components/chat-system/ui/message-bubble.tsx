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

  // Determine message bubble styling based on position in group
  const bubbleClasses = `text-gray-700 dark:text-gray-200 text-sm break-words p-3 rounded-lg ${
    isCurrentUser
      ? `bg-blue-500 text-white dark:bg-blue-600 ${isFirstInGroup ? "rounded-tl-sm" : "rounded-tl-lg"} ${isLastInGroup ? "rounded-bl-sm" : "rounded-bl-lg"}`
      : `bg-gray-200 dark:bg-gray-700 ${isFirstInGroup ? "rounded-tl-sm" : "rounded-tl-lg"} ${isLastInGroup ? "rounded-bl-sm" : "rounded-bl-lg"}`
  }`

  return (
    <div
      className={`group flex items-start gap-3 py-0.5 px-1 rounded-md transition-colors duration-200 ${
        isFocused ? "bg-gray-100/50 dark:bg-gray-800/50" : ""
      }`}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={onKeyDown}
      role="listitem"
      aria-label={`Message from ${sender.username}: ${body}`}
    >
      {showAvatar ? (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center text-xs font-medium text-white shadow-sm">
          {initial}
        </div>
      ) : (
        <div className="flex-shrink-0 w-9 h-9 opacity-0">{/* Invisible placeholder to maintain alignment */}</div>
      )}

      <div className="flex flex-col max-w-[85%]">
        {isFirstInGroup && showTimestamp && (
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{sender.username}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formattedTime}</span>
          </div>
        )}

        <div className={bubbleClasses}>{body}</div>
      </div>
    </div>
  )
}
