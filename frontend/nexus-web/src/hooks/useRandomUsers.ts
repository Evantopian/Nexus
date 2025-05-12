import { useQuery } from "@apollo/client"
import { GET_RANDOM_USERS } from "@/graphql/getRandomUsers"

export const useRandomUsers = () => {
  const { data, loading, error, refetch } = useQuery(GET_RANDOM_USERS)
  return {
    users: data?.getRandomUsers ?? [],
    loading,
    error,
    refetch,
  }
}
