"use client"

// components/MessageInput.tsx
import { Paperclip, Smile, Send } from "lucide-react"
import { useState, useRef } from "react"

export function MessageInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void
  disabled: boolean
}) {
  const [text, setText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text)
    setText("")
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <div className="p-4 border-t border-gray-200 dark:border-[#2a2d3e] bg-white dark:bg-[#1e2030]">
      <div className="relative">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Send a message..."
          className="w-full px-4 py-3 bg-gray-100 dark:bg-[#2a2d3e] rounded-md outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 border-2 border-transparent focus:border-indigo-500 dark:focus:border-[#6c5ce7]"
          disabled={disabled}
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-[#3f4259]">
            <Paperclip size={18} />
          </button>
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-[#3f4259]">
            <Smile size={18} />
          </button>
          <button
            disabled={disabled || !text.trim()}
            onClick={handleSend}
            className="p-2 rounded-md bg-indigo-600 dark:bg-[#6c5ce7] text-white hover:bg-indigo-700 dark:hover:bg-[#5b4dd1] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
