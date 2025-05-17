"use client"

import type React from "react"

import { Shield, Crown, MoreVertical, UserPlus, Users, Trash2, Star, Bell, BellOff } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface Member {
  id: string
  username: string
  role?: "admin" | "mod" | "owner" | "member"
}

export function MembersList({ conversation }: { conversation: any }) {
  const { user: currentUser } = useAuth()
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean
    x: number
    y: number
    userId: string
  }>({
    visible: false,
    x: 0,
    y: 0,
    userId: "",
  })
  const [isFavorite, setIsFavorite] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // For DMs, we only want to show the other user, not the client
  const otherUser = conversation?.user || { id: "1", username: "User" }

  // Create a member object for the other user
  const member: Member = {
    id: otherUser.id || "1",
    username: otherUser.username || "User",
    role: "member",
  }

  // Handle right-click on user
  const handleContextMenu = (e: React.MouseEvent, userId: string) => {
    e.preventDefault()
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      userId,
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

  // Check if user is in local storage favorites
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("chat-favorites") || "[]")
    setIsFavorite(favorites.includes(member.id))

    const muted = JSON.parse(localStorage.getItem("chat-muted") || "[]")
    setIsMuted(muted.includes(member.id))
  }, [member.id])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("chat-favorites") || "[]")
    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== member.id)
      localStorage.setItem("chat-favorites", JSON.stringify(newFavorites))
    } else {
      favorites.push(member.id)
      localStorage.setItem("chat-favorites", JSON.stringify(favorites))
    }
    setIsFavorite(!isFavorite)
  }

  const toggleMuted = () => {
    const muted = JSON.parse(localStorage.getItem("chat-muted") || "[]")
    if (isMuted) {
      const newMuted = muted.filter((id: string) => id !== member.id)
      localStorage.setItem("chat-muted", JSON.stringify(newMuted))
    } else {
      muted.push(member.id)
      localStorage.setItem("chat-muted", JSON.stringify(muted))
    }
    setIsMuted(!isMuted)
  }

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "owner":
        return <Crown size={14} className="text-yellow-500" />
      case "admin":
        return <Shield size={14} className="text-red-500" />
      case "mod":
        return <Shield size={14} className="text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className="w-52 h-full border-l border-gray-200 dark:border-[#2a2d3e] bg-gray-50 dark:bg-[#1e2030] overflow-y-auto">
      <style>{`
        /* Hide scrollbar for this component only */
        div {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        div::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>

      <div className="p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Members</h3>

        <ul className="space-y-1">
          <li
            key={member.id}
            className="flex items-center py-1 px-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#2a2d3e] group cursor-pointer relative"
            onContextMenu={(e) => handleContextMenu(e, member.id)}
          >
            <div className="relative mr-2">
              <div className="w-8 h-8 rounded-md bg-indigo-500 dark:bg-[#6c5ce7] flex items-center justify-center text-white font-medium">
                {member.username.charAt(0).toUpperCase()}
              </div>
              {isFavorite && (
                <div className="absolute -top-1 -right-1 text-yellow-500">
                  <Star size={10} fill="currentColor" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{member.username}</span>
                {getRoleIcon(member.role) && <span className="ml-1">{getRoleIcon(member.role)}</span>}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {isMuted && (
                  <span className="inline-flex items-center">
                    <BellOff size={10} className="mr-0.5" /> Muted
                  </span>
                )}
              </div>
            </div>
            <button className="w-6 h-6 rounded-md opacity-0 group-hover:opacity-100 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-[#3f4259] transition-opacity duration-200">
              <MoreVertical size={14} />
            </button>
          </li>
        </ul>

        {/* User details section */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#2a2d3e]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            User Details
          </h4>

          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Username</div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{member.username}</div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={toggleFavorite}
                className={`flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium ${
                  isFavorite
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-gray-100 text-gray-700 dark:bg-[#2a2d3e] dark:text-gray-300"
                }`}
              >
                <Star size={12} className="mr-1" />
                {isFavorite ? "Favorited" : "Favorite"}
              </button>

              <button
                onClick={toggleMuted}
                className={`flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium ${
                  isMuted
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-gray-100 text-gray-700 dark:bg-[#2a2d3e] dark:text-gray-300"
                }`}
              >
                {isMuted ? <BellOff size={12} className="mr-1" /> : <Bell size={12} className="mr-1" />}
                {isMuted ? "Muted" : "Mute"}
              </button>
            </div>
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
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
            onClick={() => {
              // Add friend logic
              setContextMenu((prev) => ({ ...prev, visible: false }))
            }}
          >
            <UserPlus size={14} className="mr-2" />
            Add Friend
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
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
            onClick={() => {
              toggleFavorite()
              setContextMenu((prev) => ({ ...prev, visible: false }))
            }}
          >
            <Star size={14} className="mr-2" />
            {isFavorite ? "Remove Favorite" : "Add Favorite"}
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
            onClick={() => {
              toggleMuted()
              setContextMenu((prev) => ({ ...prev, visible: false }))
            }}
          >
            {isMuted ? <Bell size={14} className="mr-2" /> : <BellOff size={14} className="mr-2" />}
            {isMuted ? "Unmute" : "Mute"}
          </button>
          <div className="border-t border-gray-200 dark:border-[#3f4259] my-1"></div>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
            onClick={() => {
              // Remove logic - store in localStorage
              const removed = JSON.parse(localStorage.getItem("chat-removed-users") || "[]")
              if (!removed.includes(contextMenu.userId)) {
                removed.push(contextMenu.userId)
                localStorage.setItem("chat-removed-users", JSON.stringify(removed))
              }
              setContextMenu((prev) => ({ ...prev, visible: false }))
            }}
          >
            <Trash2 size={14} className="mr-2" />
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
