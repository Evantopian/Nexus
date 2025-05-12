import { useQuery } from "@apollo/client"
import { GET_DIRECT_CONVERSATIONS } from "@/graphql/getDirectConversations"

export const useDirectConversations = (limit: number = 20, after?: string) => {
  const { data, loading, error, fetchMore } = useQuery(GET_DIRECT_CONVERSATIONS, {
    variables: { limit, after },
    fetchPolicy: "cache-and-network",
  })

  const loadMore = () => {
    if (data?.getDirectConversations?.length > 0) {
      const last = data.getDirectConversations[data.getDirectConversations.length - 1]
      fetchMore({
        variables: {
          after: last.lastActive,
        },
      })
    }
  }

  return {
    conversations: data?.getDirectConversations ?? [],
    loading,
    error,
    loadMore,
  }
}
