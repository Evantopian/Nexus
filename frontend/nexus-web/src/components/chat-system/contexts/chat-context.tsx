"use client"

import React, { createContext, useContext, useMemo } from "react"
import { useDirectMessages } from "@/hooks/chat/useDirectMessages"

type ChatContextType = {
  conversations: any[]
  loading: boolean
  refetchConversations: () => Promise<any>
  getConversationById: (id: string) => any | undefined
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { conversations, loadingConversations, refetchConversations } = useDirectMessages()

  const getConversationById = (id: string) =>
    conversations.find((conv: any) => conv?.id === id)

  const value = useMemo(
    () => ({
      conversations,
      loading: loadingConversations,
      refetchConversations,
      getConversationById,
    }),
    [conversations, loadingConversations, refetchConversations]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export const useChatContext = (): ChatContextType => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChatContext must be used within a ChatProvider")
  return ctx
}
