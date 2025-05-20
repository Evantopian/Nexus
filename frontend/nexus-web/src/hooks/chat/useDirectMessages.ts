import { useQuery, useMutation } from "@apollo/client"
import {
  GET_DIRECT_CONVERSATIONS,
  FETCH_DM_MESSAGES,
  SEND_DM_MESSAGE
} from "@/graphql/chat/dm.graphql"
import { useEffect, useState } from "react"

export const useDirectMessages = (conversationId?: string, _p0?: { skipIfRealtimeActive: boolean }) => {
  // Local state for real-time mutation
  const [conversations, setConversations] = useState<any[]>([])

  // Conversations (sidebar)
  const {
    data: convData,
    loading: loadingConversations,
    refetch: refetchConversations,
  } = useQuery(GET_DIRECT_CONVERSATIONS)

  // Initialize local conversations when GraphQL loads
  useEffect(() => {
    if (convData?.getDirectConversations) {
      setConversations(convData.getDirectConversations)
    }
  }, [convData])

  // Messages (pane)
  const {
    data: msgData,
    loading: loadingMessages,
    refetch: refetchMessages,
  } = useQuery(FETCH_DM_MESSAGES, {
    variables: { conversationId },
    skip: !conversationId,
  })

  // Send a new message
  const [sendDMMessage, { loading: sending }] = useMutation(SEND_DM_MESSAGE)
  const sendMessage = async (body: string) => {
    if (!conversationId) return
    await sendDMMessage({ variables: { conversationId, body } })
    await refetchMessages()
  }

  return {
    // sidebar
    conversations,
    setConversations,
    loadingConversations,
    refetchConversations,

    // pane
    messages: msgData?.getMessages ?? [],
    loadingMessages,

    // send
    sending,
    sendMessage,
  }
}
