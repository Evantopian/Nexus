"use client"
import { useParams } from "react-router-dom"
import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useDirectMessages } from "@/hooks/chat/useDirectMessages"
import { MessageBubble } from "../ui/message-bubble"
import { useAuth } from "@/contexts/AuthContext" 
import { Send, Paperclip, Smile, ArrowDown } from "lucide-react"
import { MessageSkeleton } from "../ui/message-skeleton"
import { DateSeparator } from "../ui/date-separator"
import { shouldShowTimestamp, getDateSeparator } from "../utils/date-helpers"

export default function DirectMessageView() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const { messages, loadingMessages, sendMessage } = useDirectMessages(conversationId)
  const { user } = useAuth() // Get current user to determine message alignment
  const [input, setInput] = useState("")
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!loadingMessages && messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, loadingMessages])

  // Handle scroll events to show/hide scroll-to-bottom button
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      // Show button if not at bottom (with some threshold)
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput("")
    // Focus back on input after sending
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Prepare messages with grouping information
  const preparedMessages = messages.map((msg: { sender?: any; timestamp?: string | number | Date }, index: number) => {
    const prevMsg = index > 0 ? messages[index - 1] : undefined
    const nextMsg = index < messages.length - 1 ? messages[index + 1] : undefined

    const isFirstInGroup = !prevMsg || prevMsg.sender.id !== msg.sender.id
    const isLastInGroup = !nextMsg || nextMsg.sender.id !== msg.sender.id
    const showTimestamp = msg.timestamp ? shouldShowTimestamp(msg as { timestamp: string | number | Date; sender: { id: string } }, prevMsg as { timestamp: string | number | Date; sender: { id: string } }) : false
    const dateSeparator = msg.timestamp && prevMsg?.timestamp
      ? getDateSeparator(
          { timestamp: msg.timestamp },
          { timestamp: prevMsg.timestamp }
        )
      : null

    return {
      ...msg,
      isFirstInGroup,
      isLastInGroup,
      showTimestamp,
      dateSeparator,
    }
  })

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#111827] transition-colors duration-200">
      {/* Chat header */}
      <div className="h-16 min-h-[64px] border-b border-gray-200 dark:border-gray-800 flex items-center px-6 shadow-sm bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {conversationId ? `Chat ${conversationId}` : "Direct Message"}
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
        role="list"
        aria-label="Message list"
      >
        {loadingMessages ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <MessageSkeleton key={i} isCurrentUser={false} />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {preparedMessages.map((msg: { id: React.Key | null | undefined; dateSeparator: any; sender: { id: string | undefined; username: any }; timestamp: string | number | Date; body: string; isFirstInGroup: boolean | undefined; showTimestamp: any; isLastInGroup: boolean | undefined }, index: number) => (
              <div key={msg.id}>
                {msg.dateSeparator && <DateSeparator date={msg.dateSeparator} />}
                <MessageBubble
                  id={typeof msg.id === "string" || typeof msg.id === "number" ? msg.id : "unknown-id"}
                  sender={{
                    id: msg.sender.id,
                    username: msg.sender.username,
                  }}
                  timestamp={msg.timestamp}
                  body={msg.body}
                  isCurrentUser={user?.uuid === msg.sender.id}
                  showAvatar={msg.isFirstInGroup}
                  showTimestamp={msg.showTimestamp || msg.isFirstInGroup}
                  isFirstInGroup={msg.isFirstInGroup}
                  isLastInGroup={msg.isLastInGroup}
                  onKeyDown={(e) => {
                    // Handle keyboard navigation
                    if (e.key === "ArrowDown") {
                      e.preventDefault()
                      const nextElement = document.querySelector(`[data-index="${index + 1}"]`)
                      if (nextElement) {
                        ;(nextElement as HTMLElement).focus()
                      } else {
                        inputRef.current?.focus()
                      }
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault()
                      const prevElement = document.querySelector(`[data-index="${index - 1}"]`)
                      if (prevElement) {
                        ;(prevElement as HTMLElement).focus()
                      }
                    }
                  }}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-4 p-2 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all animate-in fade-in duration-200"
          aria-label="Scroll to bottom"
        >
          <ArrowDown size={20} />
        </button>
      )}

      {/* Message input */}
      <div
        className={`p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 transition-colors duration-200 ${isMobile ? "sticky bottom-0 z-10" : ""}`}
      >
        <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 transition-colors duration-200 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400">
          <div className="flex items-center">
            <button
              className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:focus:ring-blue-400 rounded-l-lg"
              aria-label="Add attachment"
            >
              <Paperclip size={20} />
            </button>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              aria-label="Message input"
              className="w-full border-none p-3 focus:outline-none bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:focus:ring-blue-400 rounded-r-lg"
              aria-label="Add emoji"
            >
              <Smile size={20} />
            </button>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            aria-label="Send message"
            className="px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <span>Send</span>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
