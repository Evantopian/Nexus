"use client"

import { useLazyQuery, useMutation } from "@apollo/client"
import { useState } from "react"
import { Search, X, UserPlus, Trash } from "lucide-react"
import { SEARCH_USER, START_CONVERSATION } from "@/graphql/chat/dm.graphql"
import { useNavigate } from "react-router-dom"

interface FindGroupsOverlayProps {
  onClose: () => void
  onCreate: () => void
}

export function FindGroupsOverlay({ onClose, onCreate }: FindGroupsOverlayProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<Record<string, any>>({})
  const [runSearch, { data: searchData }] = useLazyQuery(SEARCH_USER, {
    fetchPolicy: "no-cache"
  })
  const [startConversation, { loading }] = useMutation(START_CONVERSATION)
  const navigate = useNavigate()

  const handleToggleUser = (user: any) => {
    setSelectedUsers((prev) => {
      const newUsers = { ...prev }
      if (newUsers[user.uuid]) {
        delete newUsers[user.uuid]
      } else {
        newUsers[user.uuid] = user
      }
      return newUsers
    })
  }

  const handleCreateGroup = async () => {
    try {
      const ids = Object.keys(selectedUsers)
      if (ids.length < 2) {
        alert("Please select at least 2 users to start a group.")
        return
      }

      const { data } = await startConversation({
        variables: { participantIds: ids }
      })

      const newConvId = data?.startConversation?.id
      if (newConvId) {
        onCreate()  
        onClose()   
        navigate(`/chat/groups/${newConvId}`)
      }
    } catch (err) {
      console.error("Failed to create group:", err)
    }
  }

  const selectedList = Object.values(selectedUsers)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/30 dark:bg-black/50">
      <div className="w-full max-w-xl mx-4 rounded-md overflow-hidden bg-white dark:bg-[#1e2030] border-2 border-gray-200 dark:border-[#2a2d3e] shadow-xl">
        {/* Search Input */}
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-[#2a2d3e] bg-indigo-600 dark:bg-[#6c5ce7]">
          <Search className="w-5 h-5 text-white mr-2" />
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              if (e.target.value.length >= 2) {
                runSearch({ variables: { search: e.target.value } })
              }
            }}
            placeholder="Search users to add..."
            className="w-full px-3 py-2 rounded-md focus:outline-none bg-white/20 text-white placeholder-white/70 focus:bg-white/30"
            aria-label="Search users"
          />
          <button
            onClick={onClose}
            className="ml-2 p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/20 focus:outline-none"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-200 dark:divide-[#2a2d3e]">
          {/* Selected Users */}
          {selectedList.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-[#2a2d3e]">
              <div className="flex flex-wrap gap-2">
                {selectedList.map((u) => (
                  <div key={u.uuid} className="flex items-center bg-indigo-100 text-indigo-800 dark:bg-[#5b4dd1]/20 dark:text-white px-3 py-1 rounded-md text-sm">
                    {u.username}
                    <button
                      onClick={() => handleToggleUser(u)}
                      className="ml-2 text-indigo-500 dark:text-indigo-300 hover:text-red-600"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchData?.searchUser?.length > 0 ? (
            searchData.searchUser.map((user: any) => (
              <button
                key={user.uuid}
                className={`w-full px-4 py-3 flex items-center hover:bg-gray-100 dark:hover:bg-[#2a2d3e] transition-colors ${selectedUsers[user.uuid] ? "bg-gray-100 dark:bg-[#2a2d3e]" : ""}`}
                onClick={() => handleToggleUser(user)}
              >
                <div className="w-10 h-10 rounded-md bg-indigo-500 dark:bg-[#6c5ce7] text-white flex items-center justify-center mr-4">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-gray-800 dark:text-gray-200">{user.username}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                </div>
                <UserPlus size={18} className="text-gray-400 dark:text-gray-500" />
              </button>
            ))
          ) : searchTerm.length >= 2 ? (
            <div className="p-6 text-center text-gray-600 dark:text-gray-300">No users found.</div>
          ) : (
            <div className="p-6 text-center text-gray-600 dark:text-gray-300">Type to search users</div>
          )}
        </div>

        {/* Create Group Button */}
        <div className="p-4 border-t border-gray-200 dark:border-[#2a2d3e] text-center">
          <button
            onClick={handleCreateGroup}
            disabled={selectedList.length === 0 || loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-[#6c5ce7] dark:hover:bg-[#5b4dd1] text-white text-sm rounded-md font-medium disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  )
}
