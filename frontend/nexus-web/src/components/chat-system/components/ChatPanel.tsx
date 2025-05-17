"use client"

// components/ChatPanel.tsx
import { useRef, useEffect, useState } from "react"
import { ArrowDown, Search, Users, Settings, Bell, BellOff, Star } from "lucide-react"
import { MessageList } from "./MessageList"
import { MessageInput } from "./MessageInput"
import { useChatContext } from "../contexts/chat-context"
import { useParams } from "react-router-dom"
import { MembersList } from "./MembersList"

interface ReplyingTo {
  id: string | number
  body: string
  sender: {
    username: string
    id?: string
  }
}

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
  const { getConversationById, setConversations } = useChatContext()
  const [showMembers, setShowMembers] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Get the conversation to display the other user's name in the header
  const conversation = getConversationById(conversationId || "")
  const otherUserName = conversation?.user?.username || "Chat"
  const otherUserId = conversation?.user?.id || ""

  // Check if conversation is muted or favorited
  useEffect(() => {
    if (otherUserId) {
      const muted = JSON.parse(localStorage.getItem("chat-muted") || "[]")
      setIsMuted(muted.includes(otherUserId))

      const favorites = JSON.parse(localStorage.getItem("chat-favorites") || "[]")
      setIsFavorite(favorites.includes(otherUserId))
    }
  }, [otherUserId])

  // Toggle muted status
  const toggleMuted = () => {
    if (!otherUserId) return

    const muted = JSON.parse(localStorage.getItem("chat-muted") || "[]")
    if (isMuted) {
      const newMuted = muted.filter((id: string) => id !== otherUserId)
      localStorage.setItem("chat-muted", JSON.stringify(newMuted))
    } else {
      muted.push(otherUserId)
      localStorage.setItem("chat-muted", JSON.stringify(muted))
    }
    setIsMuted(!isMuted)
  }

  // Toggle favorite status
  const toggleFavorite = () => {
    if (!otherUserId) return

    const favorites = JSON.parse(localStorage.getItem("chat-favorites") || "[]")
    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== otherUserId)
      localStorage.setItem("chat-favorites", JSON.stringify(newFavorites))
    } else {
      favorites.push(otherUserId)
      localStorage.setItem("chat-favorites", JSON.stringify(favorites))
    }
    setIsFavorite(!isFavorite)
  }

  // Handle sending messages with replies
  const handleSendMessage = (text: string, replyingTo: ReplyingTo | null = null) => {
    // In a real app, you would include the reply information in the message
    onSend(text)

    // Store the reply relationship locally
    if (replyingTo) {
      try {
        const replies = JSON.parse(localStorage.getItem("message-replies") || "{}")
        const messageId = Date.now().toString()
        replies[messageId] = {
          messageId: messageId,
          replyToId: replyingTo.id,
          replyToText: replyingTo.body,
          replyToSender: replyingTo.sender,
        }
        localStorage.setItem("message-replies", JSON.stringify(replies))
      } catch (e) {
        console.error("Failed to save reply", e)
      }
    }

    // Move this conversation to the top of the list
    if (conversationId) {
      setConversations((prev: any[]) => {
        const activeIndex = prev.findIndex((conv: { id: string }) => conv.id === conversationId)
        if (activeIndex > 0) {
          const newConversations = [...prev]
          const [activeConv] = newConversations.splice(activeIndex, 1)
          newConversations.unshift(activeConv)
          return newConversations
        }
        return prev
      })
    }
  }

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
    <div className="flex h-full">
      <style>{`
        /* Hide scrollbar for this component only */
        .scrollbar-none {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>

      <div className="flex flex-col flex-1 h-full bg-white dark:bg-[#1a1b26]">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-[#2a2d3e] bg-white dark:bg-[#1e2030] py-3 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="font-bold text-gray-800 dark:text-gray-200 flex items-center">
              {otherUserName}
              {isMuted && <BellOff size={14} className="ml-2 text-gray-400" />}
              {isFavorite && <Star size={14} className="ml-2 text-yellow-500" fill="currentColor" />}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-md bg-gray-100 dark:bg-[#2a2d3e] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3f4259] transition-colors duration-200">
              <Search size={16} />
            </button>
            <button
              className={`w-8 h-8 rounded-md ${
                isFavorite
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                  : "bg-gray-100 dark:bg-[#2a2d3e] text-gray-500 dark:text-gray-400"
              } flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#3f4259] transition-colors duration-200`}
              onClick={toggleFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star size={16} className={isFavorite ? "fill-current" : ""} />
            </button>
            <button
              className={`w-8 h-8 rounded-md ${
                isMuted
                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  : "bg-gray-100 dark:bg-[#2a2d3e] text-gray-500 dark:text-gray-400"
              } flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#3f4259] transition-colors duration-200`}
              onClick={toggleMuted}
              aria-label={isMuted ? "Unmute conversation" : "Mute conversation"}
            >
              {isMuted ? <BellOff size={16} /> : <Bell size={16} />}
            </button>
            <button
              className={`w-8 h-8 rounded-md ${
                showMembers
                  ? "bg-indigo-100 dark:bg-[#6c5ce7]/20 text-indigo-600 dark:text-[#6c5ce7]"
                  : "bg-gray-100 dark:bg-[#2a2d3e] text-gray-500 dark:text-gray-400"
              } flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#3f4259] transition-colors duration-200`}
              onClick={() => setShowMembers(!showMembers)}
            >
              <Users size={16} />
            </button>
            <button className="w-8 h-8 rounded-md bg-gray-100 dark:bg-[#2a2d3e] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3f4259] transition-colors duration-200">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Message List - Hide scrollbar */}
        <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-none">
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


        {/* Input */}
        <MessageInput onSend={handleSendMessage} disabled={!isConnected} />
      </div>

      {/* Members list - right side */}
      {showMembers && <MembersList conversation={conversation} />}
    </div>
  )
}
