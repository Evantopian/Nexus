"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useLazyQuery, useMutation } from "@apollo/client"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useChatContext } from "../contexts/chat-context"
import { SEARCH_USER, START_CONVERSATION } from "@/graphql/chat/dm.graphql"
import { Search, X, Plus, Users } from "lucide-react"
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
  const { conversations, loading, refetchConversations } = useChatContext()
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()
  const [term, setTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  // Debounced input to avoid flooding queries
  const debouncedTerm = useDebounce(term, 300)

  // Local filter of existing DMs
  const filteredConversations = useMemo(() => {
    if (!debouncedTerm) return conversations
    return conversations.filter((conv: { user: { username: string } }) => {
      const username = conv?.user?.username || ""
      return username.toLowerCase().includes(debouncedTerm.toLowerCase())
    })
  }, [conversations, debouncedTerm])

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

  return (
    <div className="relative w-full h-full flex flex-col bg-white dark:bg-[#1e2030] text-gray-800 dark:text-gray-200">
      {/* Search trigger */}
      <div className="p-4">
        <button
          onClick={() => setIsSearching(true)}
          className="w-full text-left px-3 py-2.5 rounded-md text-sm flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#2a2d3e] dark:hover:bg-[#3f4259] text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#6c5ce7]"
          aria-label="Find or start a conversation"
        >
          <Search size={18} />
          <span>Find or start a conversation</span>
        </button>
      </div>

      {/* Direct Messages Header */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <h2
            className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
            id="conversations-heading"
          >
            Direct Messages
          </h2>
          <button
            onClick={() => setIsSearching(true)}
            className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3f4259] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#6c5ce7]"
            aria-label="Add new conversation"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Local DM List */}
      <div className="flex-1 overflow-auto px-2">
        {loading ? (
          <div className="space-y-2 px-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <ConversationSkeleton key={i} />
            ))}
          </div>
        ) : filteredConversations.length > 0 ? (
          <div role="list" aria-labelledby="conversations-heading" className="space-y-1">
            {filteredConversations.map(
              (conv: { id: string; user: { username: string }; lastMessage: string }, index: number) => {
                const id = conv?.id || ""
                const username = conv?.user?.username || "Unknown"
                const lastMessage = conv?.lastMessage || ""
                const isActive = conversationId === id

                return (
                  <Link
                    key={id}
                    to={`/chat/dms/${id}`}
                    className={`w-full px-3 py-3 flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#6c5ce7] rounded-md ${
                      isActive
                        ? "bg-indigo-100 dark:bg-[#6c5ce7]/20 border-l-4 border-indigo-500 dark:border-[#6c5ce7]"
                        : "hover:bg-gray-100 dark:hover:bg-[#2a2d3e] border-l-4 border-transparent"
                    }`}
                    data-conversation-index={index}
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    role="listitem"
                    aria-label={`Conversation with ${username}`}
                  >
                    <div className="w-10 h-10 rounded-md flex items-center justify-center mr-3 text-sm font-bold text-white bg-emerald-500 dark:bg-[#00b894]">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 dark:text-gray-200">{username}</div>
                      {lastMessage && (
                        <div className="text-xs truncate text-gray-500 dark:text-gray-400 mt-0.5">{lastMessage}</div>
                      )}
                    </div>
                    {isActive && <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-[#6c5ce7] mr-1"></div>}
                  </Link>
                )
              },
            )}
          </div>
        ) : (
          <div className="px-2 py-4 text-sm italic text-gray-500 dark:text-gray-400 text-center">
            No conversations yet.
          </div>
        )}
      </div>

      {/* Search Overlay */}
      {isSearching && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/30 dark:bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-dialog-title"
        >
          <div className="w-full max-w-md mx-4 rounded-md overflow-hidden bg-white dark:bg-[#1e2030] border-2 border-gray-200 dark:border-[#2a2d3e]">
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
            <div className="max-h-[60vh] overflow-y-auto">
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
                        (conv: { id: string; user: { username: string }; lastMessage: string }, index: number) => {
                          const id = conv?.id || ""
                          const username = conv?.user?.username || "Unknown"
                          const lastMessage = conv?.lastMessage || ""

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
                              <div className="w-10 h-10 rounded-md flex items-center justify-center mr-3 text-sm font-bold text-white bg-emerald-500 dark:bg-[#00b894]">
                                {username.charAt(0).toUpperCase()}
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
