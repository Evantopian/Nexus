"use client"

import type React from "react"
import { useState } from "react"
import { PlusCircle, Smile, ImageIcon, AtSign, Send } from "lucide-react"

interface MessageInputProps {
  value: string
  onChange: (val: string) => void
  onSend: () => void
  onTyping: () => void
}

const MessageInput: React.FC<MessageInputProps> = ({ value, onChange, onSend, onTyping }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        onSend()
      }
    }
  }

  return (
    <div className="px-4 py-3 bg-white dark:bg-[#121a2f] border-t border-gray-200 dark:border-[#1e2a45]">
      <div className="flex items-center space-x-2">
        <button className="text-gray-500 dark:text-[#8a92b2] hover:text-gray-700 dark:hover:text-[#e0e4f0] transition p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#182238]">
          <PlusCircle className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <textarea
            rows={1}
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
              onTyping()
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full resize-none bg-gray-100 dark:bg-[#182238] border-none rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#4a65f2] text-gray-800 dark:text-[#e0e4f0] placeholder-gray-500 dark:placeholder-[#8a92b2] min-h-[40px] max-h-[50vh]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500 dark:text-[#8a92b2]">
            <button className="hover:text-gray-700 dark:hover:text-[#e0e4f0] transition p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#1e2a45]">
              <AtSign className="w-4 h-4" />
            </button>
            <button className="hover:text-gray-700 dark:hover:text-[#e0e4f0] transition p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#1e2a45]">
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              className="hover:text-gray-700 dark:hover:text-[#e0e4f0] transition p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#1e2a45]"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={onSend}
          disabled={!value.trim()}
          className={`p-2 rounded-full shadow-md transition ${
            value.trim()
              ? "bg-blue-600 dark:bg-[#4a65f2] hover:bg-blue-700 dark:hover:bg-[#3a55e2] text-white"
              : "bg-gray-200 dark:bg-[#182238] text-gray-500 dark:text-[#8a92b2] cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Emoji picker placeholder - would be implemented with an actual emoji picker library */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 right-4 w-64 h-48 bg-white dark:bg-[#182238] border border-gray-200 dark:border-[#1e2a45] rounded-md shadow-lg p-2">
          <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-200 dark:border-[#1e2a45]">
            <span className="text-sm text-gray-800 dark:text-[#e0e4f0]">Emoji</span>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="text-gray-500 dark:text-[#8a92b2] hover:text-gray-700 dark:hover:text-[#e0e4f0]"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {["😀", "😂", "😍", "🤔", "😎", "👍", "🎮", "🏆", "⚔️", "🛡️", "🔥", "✨"].map((emoji, i) => (
              <button
                key={i}
                className="text-xl hover:bg-gray-100 dark:hover:bg-[#1e2a45] rounded p-1"
                onClick={() => {
                  onChange(value + emoji)
                  setShowEmojiPicker(false)
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageInput
