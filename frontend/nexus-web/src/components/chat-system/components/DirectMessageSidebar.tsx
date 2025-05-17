"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { useChatContext } from "../contexts/chat-context"
import { Search, Plus } from "lucide-react"
import { ConversationList } from "./ConversationList"
import { SearchOverlay } from "./SearchOverlay"
import { ContextMenu } from "./ContextMenu"
import { RemovedConversations } from "./RemovedConversations"

// Debounce hook: delays updating value until after delay ms
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export default function DirectMessageSidebar() {
  const { conversations, loading, setConversations } = useChatContext()
  const { conversationId } = useParams<{ conversationId: string }>()
  const [term, setTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [removedUsers, setRemovedUsers] = useState<string[]>([])
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean
    x: number
    y: number
    conversationId: string
  }>({
    visible: false,
    x: 0,
    y: 0,
    conversationId: "",
  })
  const menuRef = useRef<HTMLDivElement>(null)
  const prevMessagesRef = useRef<Record<string, number>>({})

  // Debounced input to avoid flooding queries
  const debouncedTerm = useDebounce(term, 300)

  // Load removed users from localStorage
  useEffect(() => {
    const removed = JSON.parse(localStorage.getItem("chat-removed-users") || "[]")
    setRemovedUsers(removed)
  }, [])

  // Track message counts to detect new messages
  useEffect(() => {
    const messageCounts: Record<string, number> = {}

    conversations.forEach((conv: any) => {
      const id = conv.id
      const messageCount = conv.messages?.length || 0
      messageCounts[id] = messageCount
    })

    // Check if any conversation has new messages
    Object.entries(messageCounts).forEach(([id, count]) => {
      const prevCount = prevMessagesRef.current[id] || 0

      // If there are new messages, move conversation to top
      if (prevCount > 0 && count > prevCount) {
        const activeIndex = conversations.findIndex((conv: { id: string }) => conv.id === id)

        if (activeIndex > 0) {
          // Create a new array with the active conversation at the top
          const newConversations = [...conversations]
          const [activeConv] = newConversations.splice(activeIndex, 1)
          newConversations.unshift(activeConv)

          setConversations(()=>newConversations)
        }
      }
    })

    // Update the ref with current message counts
    prevMessagesRef.current = messageCounts
  }, [conversations, setConversations])

  // Handle right-click on conversation
  const handleContextMenu = (e: React.MouseEvent, conversationId: string) => {
    e.preventDefault()
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      conversationId,
    })
  }

  // Handle clicking outside the context menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setContextMenu((prev) => ({ ...prev, visible: false }))
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle removing a conversation
  const handleRemoveConversation = (id: string) => {
    // Find the conversation to get the user ID
    const conversation = conversations.find((conv: any) => conv.id === id)
    const userId = conversation?.user?.id

    if (userId) {
      // Add to removed users in localStorage
      const removed = JSON.parse(localStorage.getItem("chat-removed-users") || "[]")
      if (!removed.includes(userId)) {
        removed.push(userId)
        localStorage.setItem("chat-removed-users", JSON.stringify(removed))
        setRemovedUsers(removed)
      }
    }

    setContextMenu((prev) => ({ ...prev, visible: false }))
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-white dark:bg-[#1e2030] text-gray-800 dark:text-gray-200">
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

      {/* Search trigger */}
      <div className="p-3">
        <button
          onClick={() => setIsSearching(true)}
          className="w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#2a2d3e] dark:hover:bg-[#3f4259] text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#6c5ce7] transition-colors duration-200"
          aria-label="Find or start a conversation"
        >
          <Search size={16} />
          <span>Find or start a conversation</span>
        </button>
      </div>

      {/* Direct Messages Header */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <h2
            className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            id="conversations-heading"
          >
            Direct Messages
          </h2>
          <button
            onClick={() => setIsSearching(true)}
            className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3f4259] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#6c5ce7] transition-colors duration-200"
            aria-label="Add new conversation"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <ConversationList
        loading={loading}
        conversations={conversations}
        conversationId={conversationId}
        removedUsers={removedUsers}
        debouncedTerm={debouncedTerm}
        onContextMenu={handleContextMenu}
      />

      {/* Removed Conversations */}
      <RemovedConversations
        conversations={conversations}
        removedUsers={removedUsers}
        setRemovedUsers={setRemovedUsers}
      />

      {/* Context Menu */}
      {contextMenu.visible && (
        <ContextMenu
          ref={menuRef}
          contextMenu={contextMenu}
          conversations={conversations}
          onRemove={handleRemoveConversation}
          onClose={() => setContextMenu((prev) => ({ ...prev, visible: false }))}
        />
      )}

      {/* Search Overlay */}
      {isSearching && (
        <SearchOverlay
          term={term}
          setTerm={setTerm}
          debouncedTerm={debouncedTerm}
          onClose={() => {
            setIsSearching(false)
            setTerm("")
          }}
        />
      )}
    </div>
  )
}