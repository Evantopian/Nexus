"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useMemo, useState } from "react"
import {
  ChevronDown,
  Hash,
  Volume2,
  Plus,
  Mic,
  Headphones,
  Settings,
} from "lucide-react"
import { getServerById } from "../mock/servers-data"

export default function ServerSidebar() {
  const { serverId } = useParams<{ serverId: string }>()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const server = useMemo(() => (serverId ? getServerById(serverId) : null), [serverId])

  if (!server) return null

  const handleToggle = (category: string) => {
    setCollapsed((prev) => ({ ...prev, [category]: !prev[category] }))
  }

  const isActive = (id: string) => {
    const current = location.pathname.split("/").pop()
    return current === id
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e2030] border-r border-gray-200 dark:border-[#2a2d3e] text-sm">
      {/* Server header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-[#2a2d3e] flex items-center justify-between text-base font-semibold text-gray-800 dark:text-gray-100">
        <span className="truncate">{server.name}</span>
        <button className="p-1 text-gray-500 hover:text-indigo-500 transition">
          <Plus size={16} />
        </button>
      </div>

      {/* Categories and channels */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {server.categories.map((cat) => {
          const isCollapsed = collapsed[cat.name]

          return (
            <div key={cat.name}>
              {/* Category header */}
              <button
                onClick={() => handleToggle(cat.name)}
                className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                <span className="uppercase tracking-wider">{cat.name}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`}
                />
              </button>

              {!isCollapsed && (
                <div className="space-y-1">
                  {cat.channelIds
                    .map((id) => server.channels.find((ch) => ch.id === id))
                    .filter(Boolean)
                    .map((channel) => (
                      <button
                        key={channel!.id}
                        onClick={() =>
                          navigate(`/chat/servers/${server.id}/channels/${channel!.id}`)
                        }
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left truncate transition ${
                          isActive(channel!.id)
                            ? "bg-indigo-100 dark:bg-[#6c5ce7]/20 text-indigo-700 dark:text-indigo-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2d3e]"
                        }`}
                      >
                        {channel!.type === "TEXT" ? <Hash size={14} /> : <Volume2 size={14} />}
                        <span className="truncate">{channel!.name}</span>
                      </button>
                  ))}

                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer voice / settings */}
      <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-[#2a2d3e] bg-white/50 dark:bg-[#1e2030]/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <button className="hover:text-indigo-500">
            <Mic size={16} />
          </button>
          <button className="hover:text-indigo-500">
            <Headphones size={16} />
          </button>
        </div>
        <button className="text-gray-500 hover:text-indigo-500 transition">
          <Settings size={16} />
        </button>
      </div>
    </div>
  )
}
