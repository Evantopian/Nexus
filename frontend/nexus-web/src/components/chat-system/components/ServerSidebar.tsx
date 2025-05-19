"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Hash,
  Volume2,
  Megaphone,
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  UserPlus,
  Search,
  Bell,
  Pin,
  Trash2,
  Edit,
  Mic,
  MicOff,
  Headphones,
  Video,
} from "lucide-react"
import { getServerById, getChannelsByCategoryId, type Channel } from "../mock/servers-data"

export default function ServerSidebar() {
  const { serverId, channelId } = useParams<{ serverId: string; channelId: string }>()
  const navigate = useNavigate()
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [server, setServer] = useState<any>(null)
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean
    x: number
    y: number
    channelId: string
    type: string
  }>({
    visible: false,
    x: 0,
    y: 0,
    channelId: "",
    type: "",
  })
  const menuRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [userStatus, setUserStatus] = useState<"online" | "idle" | "dnd" | "offline">("online")
  const [isMuted, setIsMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)

  useEffect(() => {
    if (serverId) {
      const serverData = getServerById(serverId)
      setServer(serverData)

      // Initialize expanded state for all categories
      if (serverData) {
        const expanded: Record<string, boolean> = {}
        serverData.categories.forEach((category: any) => {
          expanded[category.id] = true
        })
        setExpandedCategories(expanded)
      }
    }
  }, [serverId])

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

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "TEXT":
        return <Hash size={16} />
      case "VOICE":
        return <Volume2 size={16} />
      case "ANNOUNCEMENT":
        return <Megaphone size={16} />
      default:
        return <Hash size={16} />
    }
  }

  const handleChannelContextMenu = (e: React.MouseEvent, channelId: string, type: string) => {
    e.preventDefault()
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      channelId,
      type,
    })
  }

  // Filter channels based on search term
  const getFilteredChannels = (categoryId: string) => {
    const channels = getChannelsByCategoryId(serverId || "", categoryId)

    if (!searchTerm) return channels

    return channels.filter((channel) => channel.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  // Get user status icon
  const getUserStatusIcon = () => {
    switch (userStatus) {
      case "online":
        return (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#1a1b26]"></div>
        )
      case "idle":
        return (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white dark:border-[#1a1b26]"></div>
        )
      case "dnd":
        return (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#1a1b26]"></div>
        )
      case "offline":
        return (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-white dark:border-[#1a1b26]"></div>
        )
    }
  }

  if (!server) {
    return (
      <div className="w-full h-full flex flex-col bg-white dark:bg-[#1e2030] text-gray-800 dark:text-gray-200 p-4">
        <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center">
            <Settings size={24} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">Select a server</h3>
          <p className="text-sm">Choose a server from the sidebar to view its channels</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-[#1e2030] text-gray-800 dark:text-gray-200">
      {/* Server Header */}
      <div className="p-4 border-b border-gray-200 dark:border-[#2a2d3e]">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-lg truncate">{server.name}</h1>
          <div className="flex items-center gap-1">
            <button
              className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3f4259]"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search size={16} />
            </button>
            <button className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3f4259]">
              <UserPlus size={16} />
            </button>
            <button className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3f4259]">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Search input - only visible when search is active */}
        {showSearch && (
          <div className="mt-2 relative">
            <Search
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={14}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search channels..."
              className="w-full pl-8 pr-2 py-1.5 text-sm bg-gray-100 dark:bg-[#2a2d3e] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-[#6c5ce7]"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-none">
        {server.categories.map((category: any) => {
          const filteredChannels = getFilteredChannels(category.id)

          // Skip categories with no matching channels when searching
          if (searchTerm && filteredChannels.length === 0) return null

          return (
            <div key={category.id} className="mb-2">
              <div
                className="flex items-center px-2 py-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 group"
                onClick={() => toggleCategory(category.id)}
              >
                {expandedCategories[category.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="ml-1">{category.name}</span>
                <button className="ml-auto p-0.5 rounded-md opacity-0 group-hover:opacity-100 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#3f4259]">
                  <Plus size={12} />
                </button>
              </div>

              {expandedCategories[category.id] && (
                <div className="mt-1 space-y-0.5">
                  {filteredChannels.map((channel: Channel) => (
                    <div
                      key={channel.id}
                      className="relative group"
                      onMouseEnter={() => setHoveredChannel(channel.id)}
                      onMouseLeave={() => setHoveredChannel(null)}
                      onContextMenu={(e) => handleChannelContextMenu(e, channel.id, channel.type)}
                    >
                      <button
                        className={`w-full flex items-center px-2 py-1.5 rounded-md text-sm ${
                          channelId === channel.id
                            ? "bg-indigo-100 dark:bg-[#6c5ce7]/20 text-indigo-600 dark:text-[#6c5ce7]"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2d3e]"
                        }`}
                        onClick={() => navigate(`/chat/servers/${serverId}/${channel.id}`)}
                      >
                        <span className="mr-2 text-gray-500 dark:text-gray-400">{getChannelIcon(channel.type)}</span>
                        <span className="truncate">{channel.name}</span>

                        {/* Show unread indicator or member count */}
                        {channel.type === "VOICE" && channel.participants && channel.participants.length > 0 && (
                          <span className="ml-auto text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">
                            {channel.participants.length}
                          </span>
                        )}
                      </button>

                      {/* Hover actions */}
                      {hoveredChannel === channel.id && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                          {channel.type === "VOICE" && (
                            <button className="p-1 rounded-md bg-gray-100 dark:bg-[#2a2d3e] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3f4259]">
                              <Headphones size={12} />
                            </button>
                          )}
                          <button className="p-1 rounded-md bg-gray-100 dark:bg-[#2a2d3e] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3f4259]">
                            <Settings size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* No results message when searching */}
        {searchTerm && server.categories.every((category: any) => getFilteredChannels(category.id).length === 0) && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center">
              <Search size={24} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">No channels found</h3>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}
      </div>

      {/* User controls at bottom */}
      <div className="p-3 border-t border-gray-200 dark:border-[#2a2d3e] bg-gray-50 dark:bg-[#1a1b26]">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-indigo-500 dark:bg-[#6c5ce7] flex items-center justify-center text-white font-medium">
                {server.name.charAt(0).toUpperCase()}
              </div>
              {getUserStatusIcon()}
            </div>
            <div className="ml-2 flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{server.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userStatus === "online"
                  ? "Online"
                  : userStatus === "idle"
                    ? "Idle"
                    : userStatus === "dnd"
                      ? "Do Not Disturb"
                      : "Offline"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              className={`p-1 rounded-md ${isMuted ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"} hover:bg-gray-200 dark:hover:bg-[#3f4259]`}
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
            <button
              className={`p-1 rounded-md ${isDeafened ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"} hover:bg-gray-200 dark:hover:bg-[#3f4259]`}
              onClick={() => setIsDeafened(!isDeafened)}
              title={isDeafened ? "Undeafen" : "Deafen"}
            >
              <Headphones size={14} />
            </button>
            <button
              className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3f4259]"
              title="Settings"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          ref={menuRef}
          className="fixed bg-white dark:bg-[#2a2d3e] shadow-lg rounded-md py-1 z-50 border border-gray-200 dark:border-[#3f4259] w-48"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {contextMenu.type === "VOICE" && (
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center">
              <Headphones size={14} className="mr-2" />
              Join Voice
            </button>
          )}
          {contextMenu.type === "VOICE" && (
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center">
              <Video size={14} className="mr-2" />
              Join with Video
            </button>
          )}
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center">
            <Bell size={14} className="mr-2" />
            Notification Settings
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center">
            <Pin size={14} className="mr-2" />
            Pin Channel
          </button>
          <div className="border-t border-gray-200 dark:border-[#3f4259] my-1"></div>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center">
            <Edit size={14} className="mr-2" />
            Edit Channel
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center">
            <Trash2 size={14} className="mr-2" />
            Delete Channel
          </button>
        </div>
      )}
    </div>
  )
}
