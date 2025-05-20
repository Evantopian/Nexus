"use client"

import type React from "react"

import { useLazyQuery, useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"
import { Search, X, UserPlus, Users } from "lucide-react"
import { SEARCH_USER, START_CONVERSATION } from "@/graphql/chat/dm.graphql"
import { useChatContext } from "../contexts/chat-context"

// Check if a conversation is favorited
const isFavorite = (userId: string) => {
  const favorites = JSON.parse(localStorage.getItem("chat-favorites") || "[]")
  return favorites.includes(userId)
}

interface SearchOverlayProps {
  term: string
  setTerm: (term: string) => void
  debouncedTerm: string
  onClose: () => void
}

export function SearchOverlay({ term, setTerm, debouncedTerm, onClose }: SearchOverlayProps) {
  const navigate = useNavigate()
  const { conversations, refetchConversations } = useChatContext()

  // Remote search for new users when no local matches
  const [runSearch, { data: searchData, loading: loadingSearch }] = useLazyQuery(SEARCH_USER, {
    fetchPolicy: "no-cache",
  })

  // Start a new conversation
  const [startConversation] = useMutation(START_CONVERSATION)
  const handleStartConversation = async (userId: string) => {
    try {
      const { data } = await startConversation({
        variables: { participantIds: [userId] },
      })
      const newConvId = data?.startConversation?.id
      await refetchConversations()
      onClose()
      if (newConvId) navigate(`/chat/dms/${newConvId}`)
    } catch (e) {
      console.error("Start conversation failed", e)
    }
  }

  // Filter existing conversations based on search term
  const filteredConversations = debouncedTerm
    ? conversations.filter((conv: { user: { username: string } }) => {
        const username = conv?.user?.username || ""
        return username.toLowerCase().includes(debouncedTerm.toLowerCase())
      })
    : []

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
      onClose()
    }
  }

  return (
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
            onChange={(e) => {
              setTerm(e.target.value)
              if (e.target.value.length >= 2) {
                runSearch({ variables: { search: e.target.value } })
              }
            }}
            placeholder="Search users..."
            className="w-full px-3 py-2 rounded-md focus:outline-none bg-white/20 text-white placeholder-white/70 focus:bg-white/30"
            aria-label="Search users"
            id="search-dialog-title"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onClose()
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
            onClick={onClose}
            className="ml-2 p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto scrollbar-none">
          {loadingSearch ? (
            <SearchLoadingState />
          ) : debouncedTerm.length < 2 ? (
            <SearchInitialState />
          ) : (
            <SearchResults
              filteredConversations={filteredConversations}
              searchData={searchData}
              onSelectConversation={(id) => {
                navigate(`/chat/dms/${id}`)
                onClose()
              }}
              onStartConversation={handleStartConversation}
              onKeyDown={handleSearchKeyDown}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function SearchLoadingState() {
  return (
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
  )
}

function SearchInitialState() {
  return (
    <div className="p-6 text-center">
      <p className="text-gray-700 dark:text-gray-300 mb-2 font-bold">Type at least 2 characters to search</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">Search for users by username or email</p>
    </div>
  )
}

interface SearchResultsProps {
  filteredConversations: any[]
  searchData: any
  onSelectConversation: (id: string) => void
  onStartConversation: (userId: string) => void
  onKeyDown: (e: React.KeyboardEvent, index: number) => void
}

function SearchResults({
  filteredConversations,
  searchData,
  onSelectConversation,
  onStartConversation,
  onKeyDown,
}: SearchResultsProps) {
  if (filteredConversations.length === 0 && (!searchData?.searchUser || searchData.searchUser.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <div className="w-16 h-16 rounded-md bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center mb-4">
          <Users size={24} className="text-gray-500 dark:text-gray-400" />
        </div>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-1 font-bold">No users found</p>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">Try a different search term</p>
      </div>
    )
  }

  return (
    <>
      {/* Previous Conversations Section */}
      {filteredConversations.length > 0 && (
        <div className="py-2" role="list" aria-label="Previous conversations">
          <h3 className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-[#2a2d3e]">
            Previous Conversations
          </h3>
          {filteredConversations.map(
            (conv: { id: string; user: { username: string; id: string }; lastMessage: string }, index: number) => {
              const id = conv?.id || ""
              const username = conv?.user?.username || "Unknown"
              const userId = conv?.user?.id || ""
              const lastMessage = conv?.lastMessage || ""
              const userFavorited = isFavorite(userId)

              return (
                <button
                  key={id}
                  onClick={() => onSelectConversation(id)}
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
      {searchData?.searchUser && searchData.searchUser.length > 0 && (
        <div className="py-2" role="list" aria-label="New users">
          <h3 className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-[#2a2d3e]">
            New Conversations
          </h3>
          {searchData.searchUser.map((user: { uuid: any; id: any; username: string; email: string }, index: number) => {
            const id = user?.uuid || user?.id || ""
            const name = user?.username || "Unknown"
            const email = user?.email || ""

            // Skip users that are already in conversations
            const isExisting = filteredConversations.some((conv: any) => conv.user?.username === name)
            if (isExisting) return null

            return (
              <button
                key={id}
                onClick={() => onStartConversation(id)}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-[#2a2d3e] focus:outline-none focus:bg-gray-100 dark:focus:bg-[#2a2d3e] focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-[#6c5ce7]"
                data-search-index={index}
                tabIndex={0}
                onKeyDown={(e) => onKeyDown(e, index)}
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
          })}
        </div>
      )}
    </>
  )
}

// Missing Star component for the SearchResults
function Star({ size, fill }: { size: number; fill: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
