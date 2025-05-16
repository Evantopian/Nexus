import { useQuery, useMutation } from "@apollo/client"
import {
  GET_DIRECT_CONVERSATIONS,
  FETCH_DM_MESSAGES,
  SEND_DM_MESSAGE
} from "@/graphql/chat/dm.graphql"

export const useDirectMessages = (conversationId?: string, p0?: { skipIfRealtimeActive: boolean }) => {
  // Conversations (sidebar)
  const {
    data: convData,
    loading: loadingConversations,
    refetch: refetchConversations,
  } = useQuery(GET_DIRECT_CONVERSATIONS)

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
    conversations: convData?.getDirectConversations ?? [],
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
