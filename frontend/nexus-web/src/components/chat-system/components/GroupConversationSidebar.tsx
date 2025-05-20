"use client"

import { useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Search,
  Plus,
  MoreVertical,
  Users,
  UserPlus,
  Hash,
  Bell,
} from "lucide-react"

import { FindGroupsOverlay } from "../components/FindGroups"
import { useGroupConversations } from "@/hooks/chat/useGroupConversations"

export default function GroupConversationSidebar() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const { groups = [], loading } = useGroupConversations()

  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    groupId: "",
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const filteredGroups = searchTerm
    ? groups.filter((g: { name: string }) =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : groups

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, groupId: id })
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-[#1e2030] text-gray-800 dark:text-gray-200">
      {/* Search */}
      <div className="p-3 border-b border-gray-200 dark:border-[#2a2d3e]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search groups..."
            className="w-full pl-10 pr-4 py-2 rounded-md text-sm bg-gray-100 dark:bg-[#2a2d3e] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#6c5ce7]"
          />
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-2 w-full text-left text-sm text-indigo-600 dark:text-indigo-400 hover:underline px-4 py-1"
        >
          + New Group
        </button>

        {showCreateModal && <FindGroupsOverlay onClose={() => setShowCreateModal(false)} />}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Group Conversations
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#2a2d3e] transition"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4">
        <div>
          <h3 className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">Groups</h3>
          <div className="space-y-1">
            {filteredGroups.map((group: { id: any; name?: string; lastMessage?: string; lastActive?: string; participants?: { id: string; username: string }[] }) => (
              <GroupItem
                key={group.id}
                group={{
                  id: String(group.id),
                  name: group.name ?? "Unnamed Group",
                  lastMessage: group.lastMessage ?? "",
                  lastActive: group.lastActive ?? new Date().toISOString(),
                  participants: group.participants ?? [],
                }}
                isActive={groupId === group.id}
                onClick={() => navigate(`/chat/groups/${group.id}`)}
                onContextMenu={handleContextMenu}
                onMouseEnter={() => setHoveredGroup(group.id)}
                onMouseLeave={() => setHoveredGroup(null)}
                showActions={hoveredGroup === group.id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Context menu */}
      {contextMenu.visible && (
        <div
          ref={menuRef}
          className="fixed z-50 bg-white dark:bg-[#2a2d3e] border border-gray-200 dark:border-[#3f4259] shadow-lg rounded-md py-1 w-48"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {[
            { icon: <Users size={14} />, label: "View Members" },
            { icon: <UserPlus size={14} />, label: "Add Members" },
            { icon: <Bell size={14} />, label: "Mute Notifications" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full px-4 py-2 text-sm flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259]"
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </button>
          ))}
          <div className="border-t border-gray-200 dark:border-[#3f4259] my-1" />
          <button className="w-full px-4 py-2 text-sm flex items-center text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#3f4259]">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M10 11v6m4-6v6" />
            </svg>
            Leave Group
          </button>
        </div>
      )}
    </div>
  )
}

function GroupItem({
  group,
  isActive,
  onClick,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
  showActions,
}: {
  group: {
    id: string
    name: string
    lastMessage: string
    lastActive: string
    participants: { id: string; username: string }[]
  }
  isActive: boolean
  onClick: () => void
  onContextMenu: (e: React.MouseEvent, id: string) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  showActions: boolean
}) {
  const formatTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    if (diff < 60000) return "Now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
    return `${Math.floor(diff / 86400000)}d`
  }

  const getMemberIcons = () => {
    const max = 3
    const base = group.participants.slice(0, max).map((p, i) => (
      <div
        key={p.id}
        className={`w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold ${
          i > 0 ? "-ml-2" : ""
        }`}
      >
        {p.username[0]}
      </div>
    ))
    if (group.participants.length > max) {
      base.push(
        <div
          key="more"
          className="-ml-2 w-5 h-5 rounded-full bg-gray-300 dark:bg-[#3f4259] text-xs text-gray-800 dark:text-gray-300 flex items-center justify-center"
        >
          +{group.participants.length - max}
        </div>
      )
    }
    return base
  }

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onContextMenu={(e) => onContextMenu(e, group.id)}
      className="relative group"
    >
      <button
        onClick={onClick}
        className={`w-full px-3 py-2 rounded-lg flex items-start gap-3 transition-all duration-150 ${
          isActive
            ? "bg-indigo-100 dark:bg-[#6c5ce7]/20 text-indigo-700 dark:text-indigo-300"
            : "hover:bg-gray-100 dark:hover:bg-[#2a2d3e] text-gray-800 dark:text-gray-200"
        }`}
      >
        <div className="relative w-10 h-10 bg-indigo-500 dark:bg-[#6c5ce7] rounded-md flex items-center justify-center text-white">
          <Hash size={16} />
          <span className="absolute -bottom-1 -right-1 text-[10px] bg-gray-800 dark:bg-gray-900 text-white rounded-full px-1">
            {group.participants.length}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{group.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 truncate">
            <div className="flex">{getMemberIcons()}</div>
            <span className="truncate">{group.lastMessage}</span>
          </div>
        </div>
        <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{formatTime(group.lastActive)}</div>
      </button>
      {showActions && (
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
          <MoreVertical size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
        </div>
      )}
    </div>
  )
}
