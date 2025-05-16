"use client"

import { createContext, useContext, useMemo } from "react"
import { useDirectMessages } from "@/hooks/chat/useDirectMessages"

type ChatContextType = {
  conversations: any[]
  loading: boolean
  refetchConversations: () => Promise<any>
  getConversationById: (id: string) => any | undefined
  setConversations: (fn: (prev: any[]) => any[]) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider")
  return ctx
}

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    conversations,
    loadingConversations,
    refetchConversations,
    setConversations,
  } = useDirectMessages()

  const getConversationById = (id: string) => conversations.find((c) => c.id === id)

  const value = useMemo(
    () => ({
      conversations,
      loading: loadingConversations,
      refetchConversations,
      getConversationById,
      setConversations,
    }),
    [conversations, loadingConversations, refetchConversations]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
