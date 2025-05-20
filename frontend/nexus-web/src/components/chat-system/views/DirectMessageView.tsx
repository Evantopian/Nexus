"use client"

// views/DirectMessageView.tsx
import { useParams } from "react-router-dom"
import { useChatMessages } from "../hooks/useChatMessages"
import { useAuth } from "@/contexts/AuthContext"
import { ChatPanel } from "@/components/chat-system/components/ChatPanel"
import { useChatContext } from "../contexts/chat-context"

export default function DirectMessageView() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const { user } = useAuth()
  const { getConversationById, setConversations } = useChatContext()
  const conversation = conversationId ? getConversationById(conversationId) : null

  const { messages, sendMessage, isConnected } = useChatMessages(conversationId)

  if (!user || !conversationId) return null

  return (
    <ChatPanel
      messages={messages}
      onSend={sendMessage}
      isConnected={isConnected}
      currentUserId={user.uuid}
      conversation={conversation}
      getConversationById={getConversationById}
      setConversations={setConversations}
    />
  )
}
