// components/MessageInput.tsx
import { Paperclip, Smile, Send } from "lucide-react"
import { useState, useRef } from "react"

export function MessageInput({ onSend, disabled }: {
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
    <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
      <div className="rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center">
        <button className="p-3 text-gray-500">
          <Paperclip size={20} />
        </button>
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
          placeholder="Type a message..."
          className="flex-1 p-3 bg-transparent outline-none text-gray-800 dark:text-gray-200"
        />
        <button className="p-3 text-gray-500">
          <Smile size={20} />
        </button>
      </div>
      <div className="flex justify-end mt-2">
        <button
          disabled={disabled || !text.trim()}
          onClick={handleSend}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <span>Send</span>
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
