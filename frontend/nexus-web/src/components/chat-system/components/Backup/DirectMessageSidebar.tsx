"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import { useLazyQuery, useMutation } from "@apollo/client"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useChatContext } from "../contexts/chat-context"
import { SEARCH_USER, START_CONVERSATION } from "@/graphql/chat/dm.graphql"
import {
  Search,
  X,
  Plus,
  Users,
  MoreVertical,
  Star,
  Trash2,
  Bell,
  BellOff,
  UserPlus,
  MessageSquare,
} from "lucide-react"
import { ConversationSkeleton } from "../ui/conversation-skeleton"

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
  const { conversations, loading, refetchConversations, setConversations } = useChatContext()
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()
  const [term, setTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
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

  // Remote search for new users when no local matches
  const [runSearch, { data: searchData, loading: loadingSearch }] = useLazyQuery(SEARCH_USER, {
    fetchPolicy: "no-cache",
  })

  useEffect(() => {
    if (isSearching && debouncedTerm.length >= 2) {
      runSearch({ variables: { search: debouncedTerm } })
    }
  }, [isSearching, debouncedTerm, runSearch])

  const [startConversation] = useMutation(START_CONVERSATION)
  const handleStartConversation = async (userId: string) => {
    try {
      const { data } = await startConversation({
        variables: { participantIds: [userId] },
      })
      const newConvId = data?.startConversation?.id
      await refetchConversations()
      setTerm("")
      setIsSearching(false)
      if (newConvId) navigate(`/chat/dms/${newConvId}`)
    } catch (e) {
      console.error("Start conversation failed", e)
    }
  }

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

  // Handle keyboard navigation in the conversation list
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocusedIndex(Math.min(index + 1, filteredConversations.length - 1))
      const nextElement = document.querySelector(`[data-conversation-index="${index + 1}"]`)
      if (nextElement) {
        ;(nextElement as HTMLElement).focus()
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusedIndex(Math.max(index - 1, 0))
      const prevElement = document.querySelector(`[data-conversation-index="${index - 1}"]`)
      if (prevElement) {
        ;(prevElement as HTMLElement).focus()
      }
    }
  }

  // Handle keyboard navigation in search results
  const handleSearchKeyDown = (e: React.KeyboardEvent, index: number) => {
    const searchResults = searchData?.searchUser || []

    if (e.key === "ArrowDown") {
      e.preventDefault()
      const nextIndex = Math.min(index + 1, searchResults.length - 1)
      const nextElement = document.querySelector(`[data-search-index="${nextIndex}"]`)
      if (nextElement) {
        ;(nextElement as HTMLElement).focus()
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const prevIndex = Math.max(index - 1, 0)
      const prevElement = document.querySelector(`[data-search-index="${prevIndex}"]`)
      if (prevElement) {
        ;(prevElement as HTMLElement).focus()
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const user = searchResults[index]
      if (user) {
        handleStartConversation(user.uuid || user.id)
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      setIsSearching(false)
      setTerm("")
    }
  }

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

    // If the removed conversation was active, navigate to the default view
    if (conversationId === id) {
      navigate("/chat/dms")
    }
  }

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
  const toggleFavorite = (userId: string) => {
    const favorites = JSON.parse(localStorage.getItem("chat-favorites") || "[]")
    if (isFavorite(userId)) {
      const newFavorites = favorites.filter((id: string) => id !== userId)
      localStorage.setItem("chat-favorites", JSON.stringify(newFavorites))
    } else {
      favorites.push(userId)
      localStorage.setItem("chat-favorites", JSON.stringify(favorites))
    }
    // Force re-render
    setConversations(prev => [...prev])
  }

  // Toggle muted status
  const toggleMuted = (userId: string) => {
    const muted = JSON.parse(localStorage.getItem("chat-muted") || "[]")
    if (isMuted(userId)) {
      const newMuted = muted.filter((id: string) => id !== userId)
      localStorage.setItem("chat-muted", JSON.stringify(newMuted))
    } else {
      muted.push(userId)
      localStorage.setItem("chat-muted", JSON.stringify(muted))
    }
    // Force re-render
    setConversations(prev => [...prev])
  }

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

      {/* Local DM List */}
      <div className="flex-1 overflow-auto px-2 scrollbar-none">
        {loading ? (
          <div className="space-y-2 px-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <ConversationSkeleton key={i} />
            ))}
          </div>
        ) : filteredConversations.length > 0 ? (
          <div role="list" aria-labelledby="conversations-heading" className="space-y-2">
            {/* Favorites section */}
            {groupedConversations.favorites.length > 0 && (
              <div className="mb-2">
                <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <Star size={12} className="mr-1 text-yellow-500" />
                  Favorites
                </div>
                {groupedConversations.favorites.map(
                  (
                    conv: { id: string; user: { username: string; id: string }; lastMessage: string },
                    index: number,
                  ) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={conversationId === conv.id}
                      index={index}
                      onContextMenu={handleContextMenu}
                      onKeyDown={handleKeyDown}
                      isMuted={isMuted(conv.user?.id || "")}
                    />
                  ),
                )}
              </div>
            )}

            {/* Unread section */}
            {groupedConversations.unread.length > 0 && (
              <div className="mb-2">
                <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <MessageSquare size={12} className="mr-1 text-blue-500" />
                  Unread
                </div>
                {groupedConversations.unread.map(
                  (
                    conv: { id: string; user: { username: string; id: string }; lastMessage: string },
                    index: number,
                  ) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={conversationId === conv.id}
                      index={index + groupedConversations.favorites.length}
                      onContextMenu={handleContextMenu}
                      onKeyDown={handleKeyDown}
                      isMuted={isMuted(conv.user?.id || "")}
                    />
                  ),
                )}
              </div>
            )}

            {/* Regular conversations */}
            <div>
              {groupedConversations.regular.length > 0 && (
                <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  Messages
                </div>
              )}
              {groupedConversations.regular.map(
                (conv: { id: string; user: { username: string; id: string }; lastMessage: string }, index: number) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conversationId === conv.id}
                    index={index + groupedConversations.favorites.length + groupedConversations.unread.length}
                    onContextMenu={handleContextMenu}
                    onKeyDown={handleKeyDown}
                    isMuted={isMuted(conv.user?.id || "")}
                  />
                ),
              )}
            </div>
          </div>
        ) : (
          <div className="px-2 py-4 text-sm italic text-gray-500 dark:text-gray-400 text-center">
            No conversations yet.
          </div>
        )}

        {/* Removed users section - with option to restore */}
        {removedUsers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#2a2d3e]">
            <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center justify-between">
              <span>Hidden Conversations</span>
              <button
                className="text-xs text-indigo-500 dark:text-[#6c5ce7] hover:underline"
                onClick={() => {
                  localStorage.removeItem("chat-removed-users")
                  setRemovedUsers([])
                }}
              >
                Restore All
              </button>
            </div>
            <div className="mt-1 space-y-1">
              {conversations
                .filter((conv: any) => removedUsers.includes(conv?.user?.id))
                .map((conv: any) => (
                  <div
                    key={conv.id}
                    className="px-3 py-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"
                  >
                    <span className="truncate">{conv?.user?.username}</span>
                    <button
                      className="text-xs text-indigo-500 dark:text-[#6c5ce7] hover:underline"
                      onClick={() => {
                        const newRemoved = removedUsers.filter((id) => id !== conv?.user?.id)
                        localStorage.setItem("chat-removed-users", JSON.stringify(newRemoved))
                        setRemovedUsers(newRemoved)
                      }}
                    >
                      Restore
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          ref={menuRef}
          className="fixed bg-white dark:bg-[#2a2d3e] shadow-lg rounded-md py-1 z-50 border border-gray-200 dark:border-[#3f4259] w-48"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {(() => {
            // Find the conversation to get user details
            const conversation = conversations.find((conv: any) => conv.id === contextMenu.conversationId)
            const userId = conversation?.user?.id || ""
            const userFavorited = isFavorite(userId)
            const userMuted = isMuted(userId)

            return (
              <>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
                  onClick={() => {
                    // Mark as read logic
                    setContextMenu((prev) => ({ ...prev, visible: false }))
                  }}
                >
                  <MessageSquare size={14} className="mr-2" />
                  Mark as Read
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
                  onClick={() => {
                    toggleFavorite(userId)
                    setContextMenu((prev) => ({ ...prev, visible: false }))
                  }}
                >
                  <Star size={14} className="mr-2" />
                  {userFavorited ? "Remove Favorite" : "Add Favorite"}
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
                  onClick={() => {
                    toggleMuted(userId)
                    setContextMenu((prev) => ({ ...prev, visible: false }))
                  }}
                >
                  {userMuted ? <Bell size={14} className="mr-2" /> : <BellOff size={14} className="mr-2" />}
                  {userMuted ? "Unmute" : "Mute"}
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
                  onClick={() => {
                    // Add to group logic
                    setContextMenu((prev) => ({ ...prev, visible: false }))
                  }}
                >
                  <Users size={14} className="mr-2" />
                  Add to Group
                </button>
                <div className="border-t border-gray-200 dark:border-[#3f4259] my-1"></div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
                  onClick={() => handleRemoveConversation(contextMenu.conversationId)}
                >
                  <Trash2 size={14} className="mr-2" />
                  Remove
                </button>
              </>
            )
          })()}
        </div>
      )}

      {/* Search Overlay */}
      {isSearching && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/30 dark:bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-dialog-title"
        >
          <div className="w-full max-w-md mx-4 rounded-md overflow-hidden bg-white dark:bg-[#1e2030] border-2 border-gray-200 dark:border-[#2a2d3e] shadow-xl">
            {/* Search Input */}
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-[#2a2d3e] bg-indigo-600 dark:bg-[#6c5ce7]">
              <Search className="w-5 h-5 text-white mr-2" />
              <input
                autoFocus
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full px-3 py-2 rounded-md focus:outline-none bg-white/20 text-white placeholder-white/70 focus:bg-white/30"
                aria-label="Search users"
                id="search-dialog-title"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsSearching(false)
                    setTerm("")
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault()
                    // Focus first search result
                    const firstResult = document.querySelector('[data-search-index="0"]')
                    if (firstResult) {
                      ;(firstResult as HTMLElement).focus()
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  setIsSearching(false)
                  setTerm("")
                }}
                className="ml-2 p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto scrollbar-none">
              {loadingSearch ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center animate-pulse">
                      <div className="w-10 h-10 rounded-md bg-gray-200 dark:bg-[#2a2d3e] mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-[#2a2d3e] rounded-md mb-2"></div>
                        <div className="h-3 w-48 bg-gray-200 dark:bg-[#2a2d3e] rounded-md"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : debouncedTerm.length < 2 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-700 dark:text-gray-300 mb-2 font-bold">
                    Type at least 2 characters to search
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Search for users by username or email</p>
                </div>
              ) : (
                <>
                  {/* Previous Conversations Section */}
                  {filteredConversations.length > 0 && (
                    <div className="py-2" role="list" aria-label="Previous conversations">
                      <h3 className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-[#2a2d3e]">
                        Previous Conversations
                      </h3>
                      {filteredConversations.map(
                        (
                          conv: { id: string; user: { username: string; id: string }; lastMessage: string },
                          index: number,
                        ) => {
                          const id = conv?.id || ""
                          const username = conv?.user?.username || "Unknown"
                          const userId = conv?.user?.id || ""
                          const lastMessage = conv?.lastMessage || ""
                          const userFavorited = isFavorite(userId)

                          return (
                            <button
                              key={id}
                              onClick={() => {
                                navigate(`/chat/dms/${id}`)
                                setIsSearching(false)
                              }}
                              className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-[#2a2d3e] focus:outline-none focus:bg-gray-100 dark:focus:bg-[#2a2d3e] focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-[#6c5ce7]"
                              data-search-index={`prev-${index}`}
                              tabIndex={0}
                              role="listitem"
                              aria-label={`Previous conversation with ${username}`}
                            >
                              <div className="relative">
                                <div className="w-10 h-10 rounded-md flex items-center justify-center mr-3 text-sm font-bold text-white bg-emerald-500 dark:bg-[#00b894]">
                                  {username.charAt(0).toUpperCase()}
                                </div>
                                {userFavorited && (
                                  <div className="absolute -top-1 -right-1 text-yellow-500">
                                    <Star size={10} fill="currentColor" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-800 dark:text-gray-200">{username}</div>
                                {lastMessage && (
                                  <div className="text-xs truncate text-gray-500 dark:text-gray-400">{lastMessage}</div>
                                )}
                              </div>
                            </button>
                          )
                        },
                      )}
                    </div>
                  )}

                  {/* New Users Section */}
                  {(searchData?.searchUser?.length ?? 0) > 0 && (
                    <div className="py-2" role="list" aria-label="New users">
                      <h3 className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-[#2a2d3e]">
                        New Conversations
                      </h3>
                      {searchData.searchUser.map(
                        (user: { uuid: any; id: any; username: string; email: string }, index: number) => {
                          const id = user?.uuid || user?.id || ""
                          const name = user?.username || "Unknown"
                          const email = user?.email || ""

                          // Skip users that are already in conversations
                          const isExisting = filteredConversations.some((conv: any) => conv.user?.username === name)
                          if (isExisting) return null

                          return (
                            <button
                              key={id}
                              onClick={() => handleStartConversation(id)}
                              className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-[#2a2d3e] focus:outline-none focus:bg-gray-100 dark:focus:bg-[#2a2d3e] focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-[#6c5ce7]"
                              data-search-index={index}
                              tabIndex={0}
                              onKeyDown={(e) => handleSearchKeyDown(e, index)}
                              role="listitem"
                              aria-label={`User ${name}`}
                            >
                              <div className="w-10 h-10 rounded-md flex items-center justify-center mr-3 text-sm font-bold text-white bg-indigo-500 dark:bg-[#6c5ce7]">
                                {name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-800 dark:text-gray-200">{name}</div>
                                <div className="text-xs truncate text-gray-500 dark:text-gray-400">{email}</div>
                              </div>
                              <UserPlus size={16} className="text-gray-400 dark:text-gray-500" />
                            </button>
                          )
                        },
                      )}
                    </div>
                  )}

                  {/* No Results */}
                  {filteredConversations.length === 0 && (searchData?.searchUser?.length ?? 0) === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 px-4">
                      <div className="w-16 h-16 rounded-md bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center mb-4">
                        <Users size={24} className="text-gray-500 dark:text-gray-400" />
                      </div>
                      <p className="text-center text-gray-700 dark:text-gray-300 mb-1 font-bold">No users found</p>
                      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                        Try a different search term
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Extracted conversation item component
function ConversationItem({
  conversation,
  isActive,
  index,
  onContextMenu,
  onKeyDown,
  isMuted,
}: {
  conversation: any
  isActive: boolean
  index: number
  onContextMenu: (e: React.MouseEvent, id: string) => void
  onKeyDown: (e: React.KeyboardEvent, index: number) => void
  isMuted: boolean
}) {
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
