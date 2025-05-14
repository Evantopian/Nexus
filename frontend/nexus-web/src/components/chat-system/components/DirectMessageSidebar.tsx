import React, { useState, useEffect, useMemo } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'
import { useDirectMessages } from '@/hooks/chat/useDirectMessages'
import { SEARCH_USER, START_CONVERSATION } from '@/graphql/chat/dm.graphql'

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
  const {
    conversations,
    loadingConversations,
    refetchConversations,
  } = useDirectMessages()

  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Debounced input to avoid flooding queries
  const debouncedTerm = useDebounce(term, 300)

  // Local filter of existing DMs
  const filteredConversations = useMemo(() => {
    if (!debouncedTerm) return conversations
    return conversations.filter((conv: { user: { username: string } }) => {
      const username = conv?.user?.username || ''
      return username.toLowerCase().includes(debouncedTerm.toLowerCase())
    })
  }, [conversations, debouncedTerm])

  // Remote search for new users when no local matches
  const [runSearch, { data: searchData, loading: loadingSearch }] =
    useLazyQuery(SEARCH_USER, { fetchPolicy: 'no-cache' })

  useEffect(() => {
    if (
      isSearching &&
      debouncedTerm.length >= 2 &&
      filteredConversations.length === 0
    ) {
      runSearch({ variables: { search: debouncedTerm } })
    }
  }, [isSearching, debouncedTerm, filteredConversations, runSearch])

  const [startConversation] = useMutation(START_CONVERSATION)
  const handleStartConversation = async (userId: string) => {
    try {
      const { data } = await startConversation({
        variables: { participantIds: [userId] },
      })
      const newConvId = data?.startConversation?.id
      await refetchConversations()
      setTerm('')
      setIsSearching(false)
      if (newConvId) navigate(`/chat/dms/${newConvId}`)
    } catch (e) {
      console.error('Start conversation failed', e)
    }
  }

  return (
    <div className="relative w-64 bg-[#202225] text-white border-r h-full flex flex-col">
      {/* Search trigger */}
      <div className="p-4 border-b border-[#202225]">
        <button
          onClick={() => setIsSearching(true)}
          className="w-full text-left px-3 py-2 bg-[#202225] rounded-md hover:bg-[#40444b] transition-colors duration-200 text-gray-300 text-sm flex items-center"
        >
          🔍 Find or start a conversation
        </button>
      </div>

      {/* Local DM List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#202225] scrollbar-track-transparent">
        <div className="px-2 py-3">
          <h2 className="text-xs font-semibold text-gray-400 px-2 mb-1 uppercase tracking-wider">
            Direct Messages
          </h2>

          {loadingConversations ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conv: { id: string; user: { username: string }; lastMessage: string }) => {
              const id = conv?.id || ''
              const username = conv?.user?.username || 'Unknown'
              const lastMessage = conv?.lastMessage || ''
              return (
                <Link
                  key={id}
                  to={`/chat/dms/${id}`}
                  className="w-full px-2 py-2 rounded hover:bg-[#42464d] text-left flex items-center group transition-colors duration-150"
                >
                  <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center mr-3 text-xs font-medium">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-200">{username}</div>
                    {lastMessage && (
                      <div className="text-xs text-gray-400 truncate">
                        {lastMessage}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="px-2 py-3 text-sm text-gray-400 italic">
              No conversations yet.
            </div>
          )}
        </div>
      </div>

      {/* Search Overlay */}
      {isSearching && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 backdrop-blur-sm bg-black bg-opacity-30">
          <div className="bg-[#36393f] w-full max-w-md mx-4 rounded-md shadow-lg overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center p-4 border-b border-[#202225]">
              <input
                autoFocus
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full px-3 py-2 bg-[#40444b] text-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#5865f2]"
              />
              <button
                onClick={() => {
                  setIsSearching(false)
                  setTerm('')
                }}
                className="ml-2 text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Results */}
            <div className="max-h-64 overflow-y-auto">
              {loadingSearch ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-5 h-5 border-2 border-t-transparent border-[#5865f2] rounded-full animate-spin"></div>
                </div>
              ) : debouncedTerm.length < 2 ? (
                <p className="p-4 text-gray-400 text-center">
                  Type at least 2 characters to search.
                </p>
              ) : (searchData?.searchUser?.length ?? 0) > 0 ? (
                searchData.searchUser.map((user: { uuid: any; id: any; username: string; email: string }) => {
                  const id = user?.uuid || user?.id || ''
                  const name = user?.username || 'Unknown'
                  const email = user?.email || ''
                  return (
                    <button
                      key={id}
                      onClick={() => handleStartConversation(id)}
                      className="w-full flex items-center px-4 py-3 hover:bg-[#42464d] text-left transition-colors duration-150"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center mr-3 text-xs font-medium">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-200">{name}</div>
                        <div className="text-xs text-gray-400 truncate">{email}</div>
                      </div>
                    </button>
                  )
                })
              ) : (
                <p className="p-4 text-gray-400 text-center">No users found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
