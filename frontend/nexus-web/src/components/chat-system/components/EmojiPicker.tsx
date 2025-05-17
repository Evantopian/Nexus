"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"

// Common emoji categories
const EMOJI_CATEGORIES = [
  {
    name: "Smileys & Emotion",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
  },
  {
    name: "People & Body",
    emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "👋", "🤚", "🖐️", "✋", "🖖"],
  },
  {
    name: "Animals & Nature",
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧"],
  },
  {
    name: "Food & Drink",
    emojis: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆"],
  },
  {
    name: "Activities",
    emojis: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏"],
  },
  {
    name: "Travel & Places",
    emojis: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🚲", "🛵", "🏍️"],
  },
  {
    name: "Objects",
    emojis: ["⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽", "💾", "💿", "📀", "📼", "📷", "📸"],
  },
  {
    name: "Symbols",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘"],
  },
  {
    name: "Flags",
    emojis: ["🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️", "🇦🇫", "🇦🇽", "🇦🇱", "🇩🇿", "🇦🇸", "🇦🇩", "🇦🇴", "🇦🇮", "🇦🇶"],
  },
]

// Recently used emojis - stored in localStorage
const getRecentEmojis = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem("recent-emojis") || "[]")
  } catch (e) {
    return []
  }
}

const addRecentEmoji = (emoji: string) => {
  try {
    const recent = getRecentEmojis()
    // Remove if already exists
    const filtered = recent.filter((e) => e !== emoji)
    // Add to beginning
    filtered.unshift(emoji)
    // Keep only the most recent 17
    const trimmed = filtered.slice(0, 17)
    localStorage.setItem("recent-emojis", JSON.stringify(trimmed))
  } catch (e) {
    console.error("Failed to save recent emoji", e)
  }
}

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  onClose: () => void
}

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Recent")
  const [searchTerm, setSearchTerm] = useState("")
  const [recentEmojis, setRecentEmojis] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Load recent emojis on mount
  useEffect(() => {
    setRecentEmojis(getRecentEmojis())
  }, [])

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Handle emoji selection
  const handleSelectEmoji = (emoji: string) => {
    onEmojiSelect(emoji)
    addRecentEmoji(emoji)
  }

  // Filter emojis based on search term
  const filteredEmojis = searchTerm
    ? EMOJI_CATEGORIES.flatMap((category) => category.emojis).filter((emoji) => emoji.includes(searchTerm))
    : []

  return (
    <div
      ref={containerRef}
      className="absolute bottom-full mb-2 right-0 w-64 bg-white dark:bg-[#2a2d3e] rounded-md shadow-lg border border-gray-200 dark:border-[#3f4259] overflow-hidden z-50"
    >
      {/* Search bar */}
      <div className="p-2 border-b border-gray-200 dark:border-[#3f4259]">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search emojis..."
            className="w-full pl-8 pr-2 py-1.5 text-sm bg-gray-100 dark:bg-[#1e2030] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-[#6c5ce7]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-[#3f4259] scrollbar-none">
        <button
          onClick={() => setActiveCategory("Recent")}
          className={`px-3 py-1.5 text-xs whitespace-nowrap ${
            activeCategory === "Recent"
              ? "border-b-2 border-indigo-500 dark:border-[#6c5ce7] text-indigo-600 dark:text-[#6c5ce7]"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Recent
        </button>
        {EMOJI_CATEGORIES.map((category) => (
          <button
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            className={`px-3 py-1.5 text-xs whitespace-nowrap ${
              activeCategory === category.name
                ? "border-b-2 border-indigo-500 dark:border-[#6c5ce7] text-indigo-600 dark:text-[#6c5ce7]"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div className="max-h-48 overflow-y-auto p-2 scrollbar-none">
        {searchTerm ? (
          <div className="grid grid-cols-7 gap-1">
            {filteredEmojis.map((emoji, index) => (
              <button
                key={`search-${index}`}
                onClick={() => handleSelectEmoji(emoji)}
                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-[#3f4259] rounded"
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : activeCategory === "Recent" ? (
          <div className="grid grid-cols-7 gap-1">
            {recentEmojis.length > 0 ? (
              recentEmojis.map((emoji, index) => (
                <button
                  key={`recent-${index}`}
                  onClick={() => handleSelectEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-[#3f4259] rounded"
                >
                  {emoji}
                </button>
              ))
            ) : (
              <div className="col-span-7 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No recent emojis
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{activeCategory}</h3>
            <div className="grid grid-cols-7 gap-1">
              {EMOJI_CATEGORIES.find((c) => c.name === activeCategory)?.emojis.map((emoji, index) => (
                <button
                  key={`${activeCategory}-${index}`}
                  onClick={() => handleSelectEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-[#3f4259] rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
