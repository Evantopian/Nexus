"use client"
import { Hash, Users, Search, Phone, Video } from "lucide-react"

interface ChatHeaderProps {
  title: string
  participants?: number
  isGroup?: boolean
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, participants = 0, isGroup = false }) => (
  <div className="px-4 py-3 bg-white dark:bg-[#121a2f] border-b border-gray-200 dark:border-[#1e2a45] flex items-center justify-between">
    <div className="flex items-center">
      {isGroup ? (
        <div className="w-8 h-8 rounded-md bg-blue-500 dark:bg-[#3a55e2] text-white flex items-center justify-center mr-3 shadow-md">
          <Users className="w-4 h-4" />
        </div>
      ) : (
        <Hash className="w-5 h-5 text-gray-500 dark:text-[#8a92b2] mr-2" />
      )}
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
        {isGroup && participants > 0 && (
          <p className="text-xs text-gray-500 dark:text-[#8a92b2]">{participants} members</p>
        )}
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#182238] text-gray-500 dark:text-[#8a92b2] hover:text-gray-700 dark:hover:text-[#e0e4f0] transition">
        <Phone className="w-5 h-5" />
      </button>
      <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#182238] text-gray-500 dark:text-[#8a92b2] hover:text-gray-700 dark:hover:text-[#e0e4f0] transition">
        <Video className="w-5 h-5" />
      </button>
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-100 dark:bg-[#0e1525] text-sm rounded-md px-2 py-1 w-36 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#4a65f2] focus:w-48 transition-all duration-200 text-gray-800 dark:text-[#e0e4f0] placeholder-gray-500 dark:placeholder-[#8a92b2] border border-gray-200 dark:border-transparent"
        />
        <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-[#8a92b2]" />
      </div>
      <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#182238] text-gray-500 dark:text-[#8a92b2] hover:text-gray-700 dark:hover:text-[#e0e4f0] transition">
        <Users className="w-5 h-5" />
      </button>
    </div>
  </div>
)

export default ChatHeader
