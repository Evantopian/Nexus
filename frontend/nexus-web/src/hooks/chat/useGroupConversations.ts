import { useQuery } from "@apollo/client"
import { GET_GROUP_CONVERSATIONS } from "@/graphql/chat/dm.graphql"

export function useGroupConversations(limit = 20) {
  const { data, loading, error, refetch } = useQuery(GET_GROUP_CONVERSATIONS, {
    variables: { limit },
    fetchPolicy: "cache-and-network"
  })

  

  const groups = (data?.getGroupConversations ?? []).map((group: any) => ({
    id: group.id,
    name: group.name || group.participants.map((p: any) => p.username).join(", "),
    participants: group.participants.map((p: any) => ({
      id: p.uuid,
      username: p.username
    })),
    lastMessage: group.lastMessage || "",
    lastActive: group.lastActive || new Date().toISOString()
  }))

  return { groups, loading, error, refetch  }
}
