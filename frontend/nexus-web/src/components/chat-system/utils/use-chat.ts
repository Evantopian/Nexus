
import { useContext } from "react"
import { ChatContext } from "../contexts/chat-context"

// Hook to use the chat context
export function useChat() {
  const context = useContext(ChatContext)
  if (!context) throw new Error("useChat must be used within a ChatProvider")
  return context
}