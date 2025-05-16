// views/DirectMessageView.tsx
import { useParams } from "react-router-dom"
import { useChatMessages } from "../hooks/useChatMessages"
import { useAuth } from "@/contexts/AuthContext"
import { ChatPanel } from "@/components/chat-system/components/ChatPanel"

export default function DirectMessageView() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const { user } = useAuth()

  const {
    messages,
    sendMessage,
    isConnected
  } = useChatMessages(conversationId)

  if (!user || !conversationId) return null

  return (
    <ChatPanel
      messages={messages}
      onSend={sendMessage}
      isConnected={isConnected}
      currentUserId={user.uuid}
    />
  )
}
