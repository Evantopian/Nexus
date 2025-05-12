"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import type { Message } from "@/hooks/useMessageFeed"
import { MoreHorizontal, Reply, Smile } from "lucide-react"

interface MessageListProps {
  messages: Message[]
  typingUsers: string[]
  userNames: Record<string, string>
}

const MessageList: React.FC<MessageListProps> = ({ messages, typingUsers, userNames }) => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Helper function to get username from user ID
  const getUsernameFromId = (id: string): string | undefined => {
    return userNames[id]
  }

  // Group messages by user and date
  const groupedMessages = messages.reduce((groups: any[], message, index) => {
    const prevMessage = index > 0 ? messages[index - 1] : null
    const isSameUser = prevMessage && prevMessage.user_id === message.user_id
    const timeDiff = prevMessage
      ? new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()
      : Number.POSITIVE_INFINITY
    const isCloseTime = timeDiff < 5 * 60 * 1000 // 5 minutes

    if (isSameUser && isCloseTime) {
      // Add to the last group
      groups[groups.length - 1].messages.push(message)
    } else {
      // Create a new group
      groups.push({
        user_id: message.user_id,
        timestamp: message.timestamp,
        messages: [message],
      })
    }
    return groups
  }, [])

  // Format date for message groups
  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString()

    if (isToday) {
      return "Today at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (isYesterday) {
      return "Yesterday at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return (
        date.toLocaleDateString([], { month: "short", day: "numeric" }) +
        " at " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      )
    }
  }

  return (
    <div className="flex-1 overflow-y-auto chat-scrollbar-hide py-2 space-y-4 bg-white dark:bg-[#121a2f] text-gray-800 dark:text-[#e0e4f0]">      {/* Date separator */}
      <div className="relative px-4 py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-[#1e2a45]"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-[#121a2f] px-3 text-xs text-gray-500 dark:text-[#8a92b2]">
            {new Date().toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>

      {groupedMessages.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className="px-4 hover:bg-gray-50 dark:hover:bg-[#182238] py-0.5 transition-colors duration-200"
        >
          <div className="flex items-start gap-4 pt-2 group">
            <div className="w-10 h-10 rounded-full bg-blue-500 dark:bg-[#4a65f2] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
              {getUsernameFromId(group.user_id)?.[0] ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-gray-900 dark:text-white">{getUsernameFromId(group.user_id)}</span>
                <span className="text-xs text-gray-500 dark:text-[#8a92b2]">{formatMessageDate(group.timestamp)}</span>
              </div>
              <div className="space-y-1">
                {group.messages.map((msg: Message, i: number) => (
                  <div
                    key={i}
                    className="relative group/message"
                    onMouseEnter={() => setHoveredMessageId(i)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                  >
                    <p className="text-gray-800 dark:text-[#e0e4f0] break-words pr-16">{msg.body}</p>

                    {/* Message actions that appear on hover */}
                    <div
                      className={`absolute right-0 top-0 flex items-center gap-1 ${
                        hoveredMessageId === i ? "opacity-100" : "opacity-0"
                      } transition-opacity duration-200 bg-gray-100 dark:bg-[#182238] rounded-md p-0.5`}
                    >
                      <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#1e2a45] text-gray-500 dark:text-[#8a92b2] hover:text-gray-700 dark:hover:text-[#e0e4f0]">
                        <Smile className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#1e2a45] text-gray-500 dark:text-[#8a92b2] hover:text-gray-700 dark:hover:text-[#e0e4f0]">
                        <Reply className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#1e2a45] text-gray-500 dark:text-[#8a92b2] hover:text-gray-700 dark:hover:text-[#e0e4f0]">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-sm italic text-gray-500 dark:text-[#8a92b2]">
          <div className="flex items-center gap-2">
            <span className="flex gap-1">
              <span className="animate-bounce">•</span>
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                •
              </span>
              <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                •
              </span>
            </span>
            {typingUsers.map((userId) => getUsernameFromId(userId)).join(", ")} typing...
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}

export default MessageList
