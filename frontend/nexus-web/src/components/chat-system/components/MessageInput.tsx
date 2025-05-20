"use client"

import { Paperclip, Smile, Send, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { EmojiPicker } from "./EmojiPicker"

interface ReplyingTo {
  id: string | number
  body: string
  sender: {
    username: string
    id?: string
  }
}

export function MessageInput({
  onSend,
  disabled,
}: {
  onSend: (text: string, replyingTo?: ReplyingTo | null) => void
  disabled: boolean
}) {
  const [text, setText] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyingTo, setReplyingTo] = useState<ReplyingTo | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Listen for reply events from MessageList
  useEffect(() => {
    const handleReply = (event: CustomEvent) => {
      setReplyingTo(event.detail)
      inputRef.current?.focus()
    }

    window.addEventListener("message-reply" as any, handleReply)
    return () => window.removeEventListener("message-reply" as any, handleReply)
  }, [])

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text, replyingTo)
    setText("")
    setReplyingTo(null)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleEmojiSelect = (emoji: string) => {
    setText((prev) => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  return (
    <div className="p-4 border-t border-gray-200 dark:border-[#2a2d3e] bg-white dark:bg-[#1e2030]">
      {/* Reply preview */}
      {replyingTo && (
        <div className="mb-2 pl-4 py-2 border-l-2 border-indigo-500 dark:border-[#6c5ce7] bg-gray-50 dark:bg-[#2a2d3e]/50 rounded-md flex items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <span className="text-xs font-medium text-indigo-600 dark:text-[#6c5ce7]">
                Replying to {replyingTo.sender.username}
              </span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{replyingTo.body}</div>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="ml-2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-[#3f4259]"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            } else if (e.key === "Escape" && replyingTo) {
              e.preventDefault()
              setReplyingTo(null)
            }
          }}
          placeholder={replyingTo ? `Reply to ${replyingTo.sender.username}...` : "Send a message..."}
          className="w-full px-4 py-3 bg-gray-100 dark:bg-[#2a2d3e] rounded-md outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 border-2 border-transparent focus:border-indigo-500 dark:focus:border-[#6c5ce7]"
          disabled={disabled}
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-[#3f4259]">
            <Paperclip size={18} />
          </button>
          <div className="relative">
            <button
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-[#3f4259]"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile size={18} />
            </button>
            {showEmojiPicker && (
              <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
            )}
          </div>
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
