import { useEffect, useRef, useState } from "react"
import { useDirectMessages } from "@/hooks/chat/useDirectMessages"
import { useAuth } from "@/contexts/AuthContext"
import { useSocket } from "../contexts/socket-context"

export function useChatMessages(conversationId: string | undefined) {
  const { user } = useAuth()
  const { joinDM } = useSocket()
  const [messages, setMessages] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const channelRef = useRef<any>(null)

  const {
    messages: historicalMessages,
    loadingMessages,
    sendMessage: persistMessage,
  } = useDirectMessages(conversationId)

  // Reset messages when conversation changes
  useEffect(() => {
    console.debug("[useChatMessages] Resetting messages for:", conversationId)
    setMessages([])
  }, [conversationId])

  // Merge in historical messages (from GraphQL)
  useEffect(() => {
    if (!historicalMessages || historicalMessages.length === 0) return

    setMessages((prev) => {
      const combined = [...prev]

      for (const newMsg of historicalMessages) {
        const duplicate = combined.some(
          (m) =>
            m.sender.id === newMsg.sender.id &&
            m.body === newMsg.body &&
            Math.abs(new Date(m.timestamp).getTime() - new Date(newMsg.timestamp).getTime()) < 5000
        )
        if (!duplicate) {
          combined.push(newMsg)
        }
      }

      return combined.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    })
  }, [historicalMessages])

  // Join the Phoenix channel
  useEffect(() => {
    if (!conversationId || !user?.uuid) return

    console.debug("[useChatMessages] Attempting to join channel:", conversationId)

    if (channelRef.current) {
      console.debug("[useChatMessages] Leaving old channel")
      channelRef.current.leave()
      channelRef.current = null
    }

    const resolveSender = (senderId: string) => {
      if (senderId === user.uuid) return { id: user.uuid, username: user.username }
      const known = messages.find((m) => m.sender.id === senderId)
      return known?.sender || { id: senderId, username: "Unknown" }
    }

    const handleIncoming = (payload: any) => {
      const senderId = payload.sender_id || payload.sender?.id || ""
      const messageId = payload.id || `server-${Date.now()}`
      const timestamp = payload.timestamp || new Date().toISOString()

      const incoming = {
        id: messageId,
        body: payload.body,
        timestamp,
        sender: resolveSender(senderId),
      }

      // Remove optimistic version if present
      setMessages((prev) => {
        const filtered = prev.filter(
          (m) =>
            !(
              m.sender.id === senderId &&
              m.body === incoming.body &&
              Math.abs(new Date(m.timestamp).getTime() - new Date(incoming.timestamp).getTime()) < 5000
            )
        )

        return [...filtered, incoming].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      })
    }

    const channel = joinDM(conversationId, handleIncoming)
    channelRef.current = channel
    setIsConnected(true)

    return () => {
      console.debug("[useChatMessages] Cleaning up channel:", conversationId)
      channel.leave()
      channelRef.current = null
      setIsConnected(false)
    }
  }, [conversationId, user?.uuid])

  // Send a new message
  const sendMessage = (text: string) => {
    if (!text || !user || !conversationId) return
    const now = new Date().toISOString()
    const tempId = `temp-${Date.now()}`

    const optimistic = {
      id: tempId,
      body: text,
      sender: { id: user.uuid, username: user.username },
      timestamp: now,
    }

    console.debug("[useChatMessages] Sending optimistic message:", optimistic)

    setMessages((prev) => [...prev, optimistic])
    channelRef.current?.sendMessage(text)
    persistMessage(text)
  }

  return {
    messages,
    sendMessage,
    loading: loadingMessages,
    isConnected,
  }
}
