// components/ChatPanel.tsx
import { useRef, useEffect, useState } from "react"
import { ArrowDown } from "lucide-react"
import { MessageList } from "./MessageList"
import { MessageInput } from "./MessageInput"

export function ChatPanel({ messages, onSend, isConnected, currentUserId }: {
  messages: any[]
  onSend: (text: string) => void
  isConnected: boolean
  currentUserId: string
}) {
  const endRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      setShowScroll(scrollHeight - scrollTop - clientHeight > 100)
    }
    el.addEventListener("scroll", onScroll)
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#111827]">
      {/* Message List */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin"
      >
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-400">No messages yet</div>
        ) : (
          <>
            <MessageList messages={messages} currentUserId={currentUserId} />
            <div ref={endRef} />
          </>
        )}
      </div>

      {/* Scroll Button */}
      {showScroll && (
        <button
          onClick={() => endRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-24 right-4 p-2 rounded-full bg-blue-500 text-white shadow-md"
        >
          <ArrowDown size={20} />
        </button>
      )}

      {/* Input */}
      <MessageInput onSend={onSend} disabled={!isConnected} />
    </div>
  )
}
