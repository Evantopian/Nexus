import { createContext, ReactNode, useState } from "react"
import { ChatTarget, Message } from "@/types/chat"
import { useChatLogic } from "@/hooks/chat/useChatLogic"

// Define the context value interface
export interface ChatContextValue {
  messages: Message[]
  sendMessage: (content: string) => void
  setTarget: (target: ChatTarget) => void
  target: ChatTarget | null
}

// Create the context
export const ChatContext = createContext<ChatContextValue | undefined>(undefined)

// The provider component
export function ChatProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<ChatTarget | null>(null)
  const { messages, sendMessage } = useChatLogic(target)

  const value: ChatContextValue = {
    messages,
    sendMessage,
    setTarget,
    target
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}