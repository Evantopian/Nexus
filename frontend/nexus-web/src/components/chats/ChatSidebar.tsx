"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Users, User, Search, X } from "lucide-react"
import { USER_IDS } from "@/data/ChatAccounts"


const ChatSidebar: React.FC = () => {
  const navigate = useNavigate()
  const { contact: activeContactId, groupId: activeGroupId } = useParams<{
    contact?: string
    groupId?: string
  }>()
  const [activeTab, setActiveTab] = useState<"direct" | "groups">("direct")
  const [searchQuery, setSearchQuery] = useState("")
  const [userList, setUserList] = useState<Array<{ id: string; name: string; status?: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Set the active tab based on the current route
  useEffect(() => {
    if (activeGroupId) {
      setActiveTab("groups")
    } else {
      setActiveTab("direct")
    }
  }, [activeGroupId, activeContactId])

  // Load users from USER_IDS
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      try {
        // Convert USER_IDS object to array of users
        const users = Object.entries(USER_IDS).map(([key, id]) => ({
          id,
          name: key, // Use the key as name for now
          status: "online", // Default status
        }))
        setUserList(users)
        setError(null)
      } catch (err) {
        setError("Failed to load users")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Filter users based on search query
  const filteredUsers = userList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400">
        <p>Loading contacts…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 dark:text-red-400">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <aside className="w-64 bg-gray-100 dark:bg-[#0e1525] flex flex-col h-full border-r border-gray-200 dark:border-[#1e2a45]">
      <div className="p-3 border-b border-gray-200 dark:border-[#1e2a45]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-800 dark:text-white font-bold">Messages</h2>
        </div>

        {/* Toggle between DMs and Groups */}
        <div className="flex bg-white dark:bg-[#182238] rounded-md p-1 shadow-sm">
          <button
            onClick={() => {
              setActiveTab("direct")
              if (filteredUsers.length > 0) {
                navigate(`/chat/direct/${filteredUsers[0].id}`)
              }
            }}
            className={`flex items-center justify-center gap-1.5 flex-1 py-1.5 rounded-md text-sm font-medium transition ${
              activeTab === "direct"
                ? "bg-blue-600 dark:bg-[#4a65f2] text-white"
                : "text-gray-600 dark:text-[#8a92b2] hover:text-gray-800 dark:hover:text-[#e0e4f0]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Direct</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("groups")
              navigate(`/chat/group/1`) // Default group ID
            }}
            className={`flex items-center justify-center gap-1.5 flex-1 py-1.5 rounded-md text-sm font-medium transition ${
              activeTab === "groups"
                ? "bg-blue-600 dark:bg-[#4a65f2] text-white"
                : "text-gray-600 dark:text-[#8a92b2] hover:text-gray-800 dark:hover:text-[#e0e4f0]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Groups</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === "direct" ? "Search contacts..." : "Search groups..."}
              className="w-full bg-white dark:bg-[#182238] text-gray-800 dark:text-[#e0e4f0] placeholder-gray-500 dark:placeholder-[#8a92b2] rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#4a65f2] border border-gray-300 dark:border-transparent"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#8a92b2] hover:text-gray-700 dark:hover:text-[#e0e4f0]"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-[#8a92b2]" />
            )}
          </div>

          {activeTab === "direct" ? (
            <>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => navigate(`/chat/direct/${user.id}`)}
                    className={`flex items-center gap-3 w-full p-2 rounded-md transition group mb-1
                      ${
                        user.id === activeContactId
                          ? "bg-gray-200 dark:bg-[#182238]"
                          : "hover:bg-gray-200 dark:hover:bg-[#182238]"
                      }`}
                  >
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-blue-500 dark:bg-[#4a65f2] text-white flex items-center justify-center shadow-md">
                        {user.name[0]}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-100 dark:border-[#0e1525] ${
                          user.status === "online"
                            ? "bg-green-500"
                            : user.status === "idle"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      ></span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800 dark:text-[#e0e4f0] truncate">
                          {user.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-[#8a92b2] truncate block">{user.id}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-[#8a92b2] text-sm">No contacts found</div>
              )}
            </>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-[#8a92b2] text-sm">
              Group messaging coming soon
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default ChatSidebar