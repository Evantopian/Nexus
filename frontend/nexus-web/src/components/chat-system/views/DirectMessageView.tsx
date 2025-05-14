"use client"
import { useParams } from "react-router-dom"
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"
import { useDirectMessages } from "@/hooks/chat/useDirectMessages"

export default function DirectMessageView() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const { messages, loadingMessages, sendMessage } = useDirectMessages(conversationId)

  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput("")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="h-12 min-h-[48px] border-b border-[#202225] flex items-center px-4 shadow-sm">
        <div className="font-medium">{conversationId ? `Chat ${conversationId}` : "Direct Message"}</div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-t-transparent border-[#5865f2] rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400 italic">
              <p>No messages yet</p>
              <p className="text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg: { id: Key | null | undefined; sender: { username: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }; timestamp: string | number | Date; body: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
            <div key={msg.id} className="bg-[#42464d] rounded-md p-3 max-w-[90%]">
              <div className="flex items-center mb-1">
                {/* Avatar placeholder */}
                <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center mr-2 text-xs font-medium">
                  {typeof msg.sender.username === "string" ? msg.sender.username.charAt(0).toUpperCase() : ""}
                </div>
                <div className="font-medium">{msg.sender.username}</div>
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="pl-10 text-gray-200">{msg.body}</p>
            </div>
          ))
        )}
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-[#202225]">
        <div className="bg-[#40444b] rounded-lg overflow-hidden">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="w-full bg-transparent border-none p-3 text-gray-200 focus:outline-none"
          />
        </div>
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
