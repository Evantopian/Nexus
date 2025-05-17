"use client"

// components/ChatPanel.tsx
import { useRef, useEffect, useState } from "react"
import { ArrowDown, Search, Users, Settings } from "lucide-react"
import { MessageList } from "./MessageList"
import { MessageInput } from "./MessageInput"
import { useChatContext } from "../contexts/chat-context"
import { useParams } from "react-router-dom"

export function ChatPanel({
  messages,
  onSend,
  isConnected,
  currentUserId,
}: {
  messages: any[]
  onSend: (text: string) => void
  isConnected: boolean
  currentUserId: string
}) {
  const endRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showScroll, setShowScroll] = useState(false)
  const { conversationId } = useParams<{ conversationId: string }>()
  const { getConversationById } = useChatContext()

  // Get the conversation to display the other user's name in the header
  const conversation = getConversationById(conversationId || "")
  const otherUserName = conversation?.user?.username || "Chat"

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      setShowScroll(scrollHeight - scrollTop - clientHeight > 100)
    }
    el.addEventListener("scroll", onScroll)
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1a1b26]">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-[#2a2d3e] bg-white dark:bg-[#1e2030] py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <h2 className="font-bold text-gray-800 dark:text-gray-200">{otherUserName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-md bg-gray-100 dark:bg-[#2a2d3e] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3f4259]">
            <Search size={16} />
          </button>
          <button className="w-8 h-8 rounded-md bg-gray-100 dark:bg-[#2a2d3e] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3f4259]">
            <Users size={16} />
          </button>
          <button className="w-8 h-8 rounded-md bg-gray-100 dark:bg-[#2a2d3e] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3f4259]">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-400 dark:text-gray-400">
            <div className="text-center">
              <div className="mb-4 opacity-70">
                <div className="w-16 h-16 mx-auto rounded-md bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-lg font-bold mb-2 text-gray-700 dark:text-gray-300">No messages yet</p>
              <p className="text-sm opacity-70">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            <MessageList messages={messages} currentUserId={currentUserId} />
            <div ref={endRef} />
          </>
        )}
      </div>

      {/* Scroll Button */}
      {showScroll && (
        <button
          onClick={() => endRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-24 right-4 p-2.5 rounded-md bg-indigo-600 dark:bg-[#6c5ce7] text-white hover:bg-indigo-700 dark:hover:bg-[#5b4dd1] focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-[#6c5ce7] focus:ring-opacity-50 z-10"
          aria-label="Scroll to bottom"
        >
          <ArrowDown size={20} />
        </button>
      )}

      {/* Input */}
      <MessageInput onSend={onSend} disabled={!isConnected} />
    </div>
  )
}
