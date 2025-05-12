import { gql } from "@apollo/client"

export const GET_DIRECT_CONVERSATIONS = gql`
  query GetDirectConversations($limit: Int!, $after: Time) {
    getDirectConversations(limit: $limit, after: $after) {
      id
      user {
        id
        username
      }
      lastMessage
      lastActive
    }
  }
`
