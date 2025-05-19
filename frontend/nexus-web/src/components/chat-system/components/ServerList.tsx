"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Plus, Settings, Home, Compass, Download } from "lucide-react"
import { mockServers } from "../mock/servers-data"

export default function ServerList() {
  const navigate = useNavigate()
  const { serverId } = useParams<{ serverId: string }>()
  const [hoveredServer, setHoveredServer] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [unreadServers, setUnreadServers] = useState<string[]>(["server-2"]) // Mock unread state

  // Simulate notification badges
  useEffect(() => {
    // This would normally be driven by real data
    const interval = setInterval(() => {
      setUnreadServers((prev) => {
        if (prev.includes("server-2")) {
          return prev
        } else {
          return [...prev, "server-2"]
        }
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-16 h-full bg-gray-100 dark:bg-[#1a1b26] flex flex-col items-center py-4 overflow-y-auto scrollbar-none">
      {/* Home button */}
      <button
        className={`w-10 h-10 rounded-full mb-4 flex items-center justify-center transition-all duration-200 ${
          !serverId
            ? "bg-indigo-600 dark:bg-[#6c5ce7] text-white"
            : "bg-gray-200 dark:bg-[#2a2d3e] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#3f4259]"
        }`}
        onClick={() => navigate("/chat/dms")}
        onMouseEnter={() => setHoveredServer("home")}
        onMouseLeave={() => setHoveredServer(null)}
      >
        <Home size={18} />

        {/* Tooltip */}
        {hoveredServer === "home" && (
          <div className="absolute left-14 bg-black text-white text-sm py-1 px-2 rounded z-50 whitespace-nowrap">
            Home
          </div>
        )}
      </button>

      <div className="w-8 h-0.5 bg-gray-300 dark:bg-[#2a2d3e] rounded-full mb-4"></div>

      {/* Server list */}
      <div className="flex flex-col items-center gap-3 flex-1 overflow-y-auto scrollbar-none">
        {mockServers.map((server) => {
          const hasUnread = unreadServers.includes(server.id)

          return (
            <button
              key={server.id}
              className={`relative w-12 h-12 rounded-full overflow-hidden group transition-all duration-200 ${
                serverId === server.id
                  ? "rounded-xl bg-indigo-600 dark:bg-[#6c5ce7]"
                  : "bg-gray-200 dark:bg-[#2a2d3e] hover:rounded-xl hover:bg-indigo-600 dark:hover:bg-[#6c5ce7]"
              }`}
              onClick={() => {
                navigate(`/chat/servers/${server.id}`)
                // Remove unread indicator when clicking
                if (hasUnread) {
                  setUnreadServers((prev) => prev.filter((id) => id !== server.id))
                }
              }}
              onMouseEnter={() => setHoveredServer(server.id)}
              onMouseLeave={() => setHoveredServer(null)}
            >
              {server.iconUrl ? (
                <img
                  src={server.iconUrl || "/placeholder.svg"}
                  alt={server.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-700 dark:text-gray-300">
                  {server.name.charAt(0)}
                </div>
              )}

              {/* Unread indicator */}
              {hasUnread && serverId !== server.id && (
                <div className="absolute -right-0.5 top-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  {server.id === "server-2" ? "3" : ""}
                </div>
              )}

              {/* Server name tooltip on hover */}
              {hoveredServer === server.id && (
                <div className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-black text-white text-sm py-1 px-2 rounded z-50 whitespace-nowrap">
                  {server.name}
                </div>
              )}

              {/* Indicator for active server */}
              {serverId === server.id && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
            </button>
          )
        })}

        {/* Explore servers button */}
        <button
          className="w-12 h-12 rounded-full bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:rounded-xl hover:bg-emerald-500 dark:hover:bg-emerald-600 hover:text-white transition-all duration-200"
          onMouseEnter={() => setHoveredServer("explore")}
          onMouseLeave={() => setHoveredServer(null)}
        >
          <Compass size={20} />

          {/* Tooltip */}
          {hoveredServer === "explore" && (
            <div className="absolute left-14 bg-black text-white text-sm py-1 px-2 rounded z-50 whitespace-nowrap">
              Explore Servers
            </div>
          )}
        </button>

        {/* Add server button */}
        <button
          className="w-12 h-12 rounded-full bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:rounded-xl hover:bg-green-500 dark:hover:bg-green-600 hover:text-white transition-all duration-200"
          onClick={() => setShowAddModal(true)}
          onMouseEnter={() => setHoveredServer("add")}
          onMouseLeave={() => setHoveredServer(null)}
        >
          <Plus size={24} />

          {/* Tooltip */}
          {hoveredServer === "add" && (
            <div className="absolute left-14 bg-black text-white text-sm py-1 px-2 rounded z-50 whitespace-nowrap">
              Add Server
            </div>
          )}
        </button>
      </div>

      {/* Bottom actions */}
      <div className="mt-auto pt-4 flex flex-col items-center gap-3">
        <button
          className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#3f4259] transition-all duration-200"
          onMouseEnter={() => setHoveredServer("download")}
          onMouseLeave={() => setHoveredServer(null)}
        >
          <Download size={18} />

          {/* Tooltip */}
          {hoveredServer === "download" && (
            <div className="absolute left-14 bg-black text-white text-sm py-1 px-2 rounded z-50 whitespace-nowrap">
              Download App
            </div>
          )}
        </button>

        <button
          className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#3f4259] transition-all duration-200"
          onMouseEnter={() => setHoveredServer("settings")}
          onMouseLeave={() => setHoveredServer(null)}
        >
          <Settings size={18} />

          {/* Tooltip */}
          {hoveredServer === "settings" && (
            <div className="absolute left-14 bg-black text-white text-sm py-1 px-2 rounded z-50 whitespace-nowrap">
              Settings
            </div>
          )}
        </button>
      </div>

      {/* Add Server Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1e2030] rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-[#2a2d3e] flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Add a Server</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 dark:border-[#3f4259] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2d3e] flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
                    <Plus size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Create Server</span>
                </button>
                <button className="p-4 border border-gray-200 dark:border-[#3f4259] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2d3e] flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
                    <Compass size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Join Server</span>
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-[#2a2d3e] flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2d3e] rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
