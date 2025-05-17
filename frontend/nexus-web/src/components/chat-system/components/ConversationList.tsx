"use client"

import type React from "react"

import { useMemo } from "react"
import { ConversationSkeleton } from "../ui/conversation-skeleton"
import { ConversationItem } from "./ConversationItem"

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

interface ConversationListProps {
  loading: boolean
  conversations: any[]
  conversationId?: string
  removedUsers: string[]
  debouncedTerm: string
  onContextMenu: (e: React.MouseEvent, id: string) => void
}

export function ConversationList({
  loading,
  conversations,
  conversationId,
  removedUsers,
  debouncedTerm,
  onContextMenu,
}: ConversationListProps) {
  // Filter out removed users
  const filteredByRemovedUsers = useMemo(() => {
    return conversations.filter((conv: any) => {
      const userId = conv?.user?.id || ""
      return !removedUsers.includes(userId)
    })
  }, [conversations, removedUsers])

  // Local filter of existing DMs
  const filteredConversations = useMemo(() => {
    if (!debouncedTerm) return filteredByRemovedUsers
    return filteredByRemovedUsers.filter((conv: { user: { username: string } }) => {
      const username = conv?.user?.username || ""
      return username.toLowerCase().includes(debouncedTerm.toLowerCase())
    })
  }, [filteredByRemovedUsers, debouncedTerm])

  // Group conversations by category
  const groupedConversations = useMemo(() => {
    const favorites: any[] = []
    const unread: any[] = []
    const regular: any[] = []

    filteredConversations.forEach((conv: any) => {
      const userId = conv?.user?.id || ""

      if (isFavorite(userId)) {
        favorites.push(conv)
      } else if (conv.unread) {
        unread.push(conv)
      } else {
        regular.push(conv)
      }
    })

    return { favorites, unread, regular }
  }, [filteredConversations])

  // Handle keyboard navigation in the conversation list
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const nextElement = document.querySelector(`[data-conversation-index="${index + 1}"]`)
      if (nextElement) {
        ;(nextElement as HTMLElement).focus()
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const prevElement = document.querySelector(`[data-conversation-index="${index - 1}"]`)
      if (prevElement) {
        ;(prevElement as HTMLElement).focus()
      }
    }
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-auto px-2 scrollbar-none">
        <div className="space-y-2 px-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <ConversationSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (filteredConversations.length === 0) {
    return (
      <div className="flex-1 overflow-auto px-2 scrollbar-none">
        <div className="px-2 py-4 text-sm italic text-gray-500 dark:text-gray-400 text-center">
          No conversations yet.
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto px-2 scrollbar-none">
      <div role="list" aria-labelledby="conversations-heading" className="space-y-2">
        {/* Favorites section */}
        {groupedConversations.favorites.length > 0 && (
          <ConversationSection
            title="Favorites"
            icon="star"
            conversations={groupedConversations.favorites}
            conversationId={conversationId}
            startIndex={0}
            onContextMenu={onContextMenu}
            onKeyDown={handleKeyDown}
          />
        )}

        {/* Unread section */}
        {groupedConversations.unread.length > 0 && (
          <ConversationSection
            title="Unread"
            icon="message"
            conversations={groupedConversations.unread}
            conversationId={conversationId}
            startIndex={groupedConversations.favorites.length}
            onContextMenu={onContextMenu}
            onKeyDown={handleKeyDown}
          />
        )}

        {/* Regular conversations */}
        {groupedConversations.regular.length > 0 && (
          <ConversationSection
            title="Messages"
            conversations={groupedConversations.regular}
            conversationId={conversationId}
            startIndex={groupedConversations.favorites.length + groupedConversations.unread.length}
            onContextMenu={onContextMenu}
            onKeyDown={handleKeyDown}
          />
        )}
      </div>
    </div>
  )
}

interface ConversationSectionProps {
  title: string
  icon?: "star" | "message"
  conversations: any[]
  conversationId?: string
  startIndex: number
  onContextMenu: (e: React.MouseEvent, id: string) => void
  onKeyDown: (e: React.KeyboardEvent, index: number) => void
}

function ConversationSection({
  title,
  icon,
  conversations,
  conversationId,
  startIndex,
  onContextMenu,
  onKeyDown,
}: ConversationSectionProps) {
  if (conversations.length === 0) return null

  return (
    <div className="mb-2">
      <SectionHeader title={title} icon={icon} />
      {conversations.map((conv, index) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isActive={conversationId === conv.id}
          index={index + startIndex}
          onContextMenu={onContextMenu}
          onKeyDown={onKeyDown}
          isMuted={isMuted(conv.user?.id || "")}
        />
      ))}
    </div>
  )
}

function SectionHeader({ title, icon }: { title: string; icon?: "star" | "message" }) {
  return (
    <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
      {icon === "star" && (
        <svg className="w-3 h-3 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {icon === "message" && (
        <svg className="w-3 h-3 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      )}
      {title}
    </div>
  )
}
