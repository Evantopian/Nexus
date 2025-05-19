"use client"

import { useState } from "react"
import { Search, X, UserPlus, Users } from "lucide-react"

interface FindGroupsOverlayProps {
  onClose: () => void
}

export function FindGroupsOverlay({ onClose }: FindGroupsOverlayProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const mockGroups = [
    { id: "g1", name: "Gaming Legends", members: 12 },
    { id: "g2", name: "Study Warriors", members: 5 },
    { id: "g3", name: "React Masters", members: 18 },
  ]

  const filteredGroups = searchTerm.length < 2
    ? []
    : mockGroups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()))

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
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search public groups..."
            className="w-full px-3 py-2 rounded-md focus:outline-none bg-white/20 text-white placeholder-white/70 focus:bg-white/30"
            aria-label="Search groups"
          />
          <button
            onClick={onClose}
            className="ml-2 p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/20 focus:outline-none"
            aria-label="Close group search"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {searchTerm.length < 2 ? (
            <div className="p-6 text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-2 font-bold">Type at least 2 characters to search</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Search for public or open groups to join</p>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4">
              <div className="w-16 h-16 rounded-md bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center mb-4">
                <Users size={24} className="text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-center text-gray-700 dark:text-gray-300 mb-1 font-bold">No groups found</p>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">Try a different keyword</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-[#2a2d3e]">
              {filteredGroups.map(group => (
                <button
                  key={group.id}
                  className="w-full px-4 py-3 flex items-center hover:bg-gray-100 dark:hover:bg-[#2a2d3e] transition-colors"
                >
                  <div className="w-10 h-10 rounded-md bg-indigo-500 dark:bg-[#6c5ce7] text-white flex items-center justify-center mr-4">
                    {group.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-gray-800 dark:text-gray-200">{group.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{group.members} members</div>
                  </div>
                  <UserPlus size={18} className="text-gray-400 dark:text-gray-500" />
                </button>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="p-4 border-t border-gray-200 dark:border-[#2a2d3e] text-center">
            <button
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-[#6c5ce7] dark:hover:bg-[#5b4dd1] text-white text-sm rounded-md font-medium"
            >
              Find a User Instead
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
