"use client"

import type React from "react"

import { Shield, Crown, MoreVertical } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface Member {
  id: string
  username: string
  status?: "online" | "idle" | "dnd" | "offline"
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
  const menuRef = useRef<HTMLDivElement>(null)

  // For DMs, we only want to show the other user, not the client
  const otherUser = conversation?.user || { id: "1", username: "User" }

  // Create a member object for the other user
  const member: Member = {
    id: otherUser.id || "1",
    username: otherUser.username || "User",
    status: "online", // You could fetch the actual status if available
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "dnd":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
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
    <div className="w-56 h-full border-l border-gray-200 dark:border-[#2a2d3e] bg-gray-50 dark:bg-[#1e2030] overflow-y-auto scrollbar-none">
      <div className="p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Members</h3>

        <ul className="space-y-1">
          <li
            key={member.id}
            className="flex items-center py-1 px-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#2a2d3e] group cursor-pointer"
            onContextMenu={(e) => handleContextMenu(e, member.id)}
          >
            <div className="relative mr-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 dark:bg-[#6c5ce7] flex items-center justify-center text-white font-medium">
                {member.username.charAt(0).toUpperCase()}
              </div>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-50 dark:border-[#1e2030] ${getStatusColor(
                  member.status,
                )}`}
              ></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{member.username}</span>
                {getRoleIcon(member.role) && <span className="ml-1">{getRoleIcon(member.role)}</span>}
              </div>
            </div>
            <button className="w-6 h-6 rounded-md opacity-0 group-hover:opacity-100 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-[#3f4259]">
              <MoreVertical size={14} />
            </button>
          </li>
        </ul>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          ref={menuRef}
          className="fixed bg-white dark:bg-[#2a2d3e] shadow-lg rounded-md py-1 z-50 border border-gray-200 dark:border-[#3f4259] w-48"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259]"
            onClick={() => {
              // Add friend logic
              setContextMenu((prev) => ({ ...prev, visible: false }))
            }}
          >
            Add Friend
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259]"
            onClick={() => {
              // Add to group logic
              setContextMenu((prev) => ({ ...prev, visible: false }))
            }}
          >
            Add to Group
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#3f4259]"
            onClick={() => {
              // Remove logic
              setContextMenu((prev) => ({ ...prev, visible: false }))
            }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
