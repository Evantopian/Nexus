"use client"

import type React from "react"
import {
  Shield,
  Crown,
  MoreVertical,
  Star,
  Bell,
  BellOff,
  Search,
} from "lucide-react"
import { useState, useRef, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface Member {
  id: string
  username: string
  role?: "admin" | "mod" | "owner" | "member"
}

interface MembersListProps {
  conversation?: any
  isServerChannel?: boolean
  isGroupChat?: boolean
  participants?: any[]
}

export function MembersList({
  conversation,
  isServerChannel = false,
  isGroupChat = false,
  participants = [],
}: MembersListProps) {
  useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [, setContextMenu] = useState({ visible: false, x: 0, y: 0, userId: "" })
  const [isFavorite, setIsFavorite] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const members: Member[] = useMemo(() => {
    if (isServerChannel || isGroupChat) {
      return (participants || []).map((p) => ({
        id: p.id,
        username: p.username,
        role: isServerChannel ? p.role : "member",
      }))
    }
    if (conversation?.user) {
      return [
        {
          id: conversation.user.id,
          username: conversation.user.username,
          role: "member",
        },
      ]
    }
    return []
  }, [isServerChannel, isGroupChat, participants, conversation])

  const filteredMembers = useMemo(() => {
    return searchTerm
      ? members.filter((m) => m.username.toLowerCase().includes(searchTerm.toLowerCase()))
      : members
  }, [members, searchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setContextMenu((prev) => ({ ...prev, visible: false }))
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (!isServerChannel && !isGroupChat && conversation?.user?.id) {
      const favorites = JSON.parse(localStorage.getItem("chat-favorites") || "[]")
      setIsFavorite(favorites.includes(conversation.user.id))
      const muted = JSON.parse(localStorage.getItem("chat-muted") || "[]")
      setIsMuted(muted.includes(conversation.user.id))
    }
  }, [isServerChannel, isGroupChat, conversation])

  const groupedMembers = useMemo(() => {
    if (!isServerChannel) return { members: filteredMembers }
    const grouped: Record<string, Member[]> = { owner: [], admin: [], mod: [], member: [] }
    filteredMembers.forEach((m) => {
      grouped[m.role || "member"].push(m)
    })
    return grouped
  }, [isServerChannel, filteredMembers])

  const handleContextMenu = (e: React.MouseEvent, userId: string) => {
    e.preventDefault()
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, userId })
  }

  const toggleFavorite = () => {
    if (!conversation?.user?.id) return
    const favorites = JSON.parse(localStorage.getItem("chat-favorites") || "[]")
    const updated = isFavorite ? favorites.filter((id: string) => id !== conversation.user.id) : [...favorites, conversation.user.id]
    localStorage.setItem("chat-favorites", JSON.stringify(updated))
    setIsFavorite(!isFavorite)
  }

  const toggleMuted = () => {
    if (!conversation?.user?.id) return
    const muted = JSON.parse(localStorage.getItem("chat-muted") || "[]")
    const updated = isMuted ? muted.filter((id: string) => id !== conversation.user.id) : [...muted, conversation.user.id]
    localStorage.setItem("chat-muted", JSON.stringify(updated))
    setIsMuted(!isMuted)
  }

  const renderListSection = (label: string, role: string, icon?: React.ReactNode) => {
    const list = groupedMembers[role] || []
    if (!list.length) return null
    return (
      <div>
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center px-2">
          {icon} {label} — {list.length}
        </h4>
        <ul className="space-y-1">
          {list.map((member) => (
            <MemberItem key={member.id} member={member} onContextMenu={handleContextMenu} isServerChannel={isServerChannel} />
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="w-52 h-full border-l border-gray-200 dark:border-[#2a2d3e] bg-gray-50 dark:bg-[#1e2030] overflow-y-auto flex flex-col">
      <div className="p-3 border-b border-gray-200 dark:border-[#2a2d3e]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          {isServerChannel ? "Members" : isGroupChat ? "Group Members" : "User Details"}
        </h3>
        {(isServerChannel || isGroupChat) && (
          <div className="relative mt-2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={14} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-8 pr-2 py-1.5 text-xs bg-gray-100 dark:bg-[#2a2d3e] rounded-md text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-[#6c5ce7]"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isServerChannel ? (
          <div className="space-y-4">
            {renderListSection("Owner", "owner", <Crown size={12} className="mr-1 text-yellow-500" />)}
            {renderListSection("Admins", "admin", <Shield size={12} className="mr-1 text-red-500" />)}
            {renderListSection("Moderators", "mod", <Shield size={12} className="mr-1 text-blue-500" />)}
            {renderListSection("Members", "member")}
          </div>
        ) : isGroupChat ? (
          <ul className="space-y-1">
            {filteredMembers.map((member) => (
              <MemberItem key={member.id} member={member} onContextMenu={handleContextMenu} isGroupChat={isGroupChat} />
            ))}
          </ul>
        ) : (
          <>
            <ul className="space-y-1">
              {filteredMembers.map((member) => (
                <MemberItem key={member.id} member={member} onContextMenu={handleContextMenu} isFavorite={isFavorite} isMuted={isMuted} />
              ))}
            </ul>

            {filteredMembers.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#2a2d3e]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">User Details</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Username</div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{filteredMembers[0]?.username}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <div className="text-sm text-gray-800 dark:text-gray-200">Online</div>
                    </div>
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
            )}
          </>
        )}
      </div>
    </div>
  )
}

function MemberItem({
  member,
  onContextMenu,
  isFavorite = false,
  isMuted = false,
}: {
  member: Member
  onContextMenu: (e: React.MouseEvent, userId: string) => void
  isServerChannel?: boolean
  isGroupChat?: boolean
  isFavorite?: boolean
  isMuted?: boolean
}) {
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
    <li
      className="flex items-center py-1 px-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#2a2d3e] group cursor-pointer relative"
      onContextMenu={(e) => onContextMenu(e, member.id)}
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
        {isMuted && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center">
              <BellOff size={10} className="mr-0.5" /> Muted
            </span>
          </div>
        )}
      </div>
      <button className="w-6 h-6 rounded-md opacity-0 group-hover:opacity-100 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-[#3f4259] transition-opacity duration-200">
        <MoreVertical size={14} />
      </button>
    </li>
  )
}
