// contexts/ChatContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react"
import { Socket } from "phoenix"
import { useAuth } from "@/contexts/AuthContext"

export interface DirectConversation {
  id: string
  user: {
    id: string
    username: string
  }
  lastMessage: string
  lastActive: string
}

interface ChatContextType {
  conversations: DirectConversation[]
  addOrUpdateConversation: (conv: DirectConversation) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [conversations, setConversations] = useState<DirectConversation[]>([])

  useEffect(() => {
    if (!user?.uuid) return

    const sock = new Socket("ws://localhost:4000/socket", {
      params: { user_id: user.uuid },
    })

    sock.connect()
    setSocket(sock)

    return () => {
      sock.disconnect()
      setSocket(null)
    }
  }, [user?.uuid])

  useEffect(() => {
    if (!socket || !user?.uuid) return

    const channel = socket.channel(`dm:${user.uuid}`, {})

    channel
      .join()
      .receive("ok", ({ conversations }: { conversations: DirectConversation[] }) => {
        setConversations(conversations)
      })
      .receive("error", (err: any) => {
        console.error("Failed to join direct conversation channel:", err)
      })

    channel.on("dm:update", (newConv: DirectConversation) => {
      setConversations((prev = []) => {
        const index = prev.findIndex((c) => c.id === newConv.id)
        if (index !== -1) {
          const updated = [...prev]
          updated[index] = newConv
          return updated
        }
        return [newConv, ...prev]
      })
    })

    return () => {
      channel.leave()
    }
  }, [socket, user?.uuid])

  const addOrUpdateConversation = (conv: DirectConversation) => {
    setConversations((prev = []) => {
      const index = prev.findIndex((c) => c.id === conv.id)
      if (index !== -1) {
        const updated = [...prev]
        updated[index] = conv
        return updated
      }
      return [conv, ...prev]
    })
  }

  return (
    <ChatContext.Provider value={{ conversations, addOrUpdateConversation }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
