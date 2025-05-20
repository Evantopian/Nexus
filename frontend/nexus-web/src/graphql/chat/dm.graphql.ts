import { gql } from "@apollo/client"


export const GET_DIRECT_CONVERSATIONS = gql`
  query GetDirectConversations {
    getDirectConversations {
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


export const FETCH_DM_MESSAGES = gql`
    query FetchDMMessages($conversationId: UUID!) {
    getMessages(conversationId: $conversationId) {
        id
        body
        timestamp
        sender {
        id
        username
        }
    }
    }

`

export const SEND_DM_MESSAGE = gql`
  mutation SendDMMessage($conversationId: UUID!, $body: String!) {
    sendMessage(conversationId: $conversationId, body: $body) {
      id
      body
      timestamp
      sender {
        id
        username
      }
    }
  }
`


export const SEARCH_USER = gql`
  query SearchUser($search: String!) {
    searchUser(search: $search) {
      uuid
      username
      email
      profileImg
      profileMessage
      status
      rank
      reputation
      createdAt
      age
    }
  }
`

export const START_CONVERSATION = gql`
  mutation StartConversation($participantIds: [UUID!]!) {
    startConversation(participantIds: $participantIds) {
      id
      participants { id username }
    }
  }
`

export const GET_GROUP_CONVERSATIONS = gql`
  query GetGroupConversations {
    conversations {
      id
      isGroup
      participants {
        id
        username
      }
      messages {
        id
        body
        timestamp
        sender {
          id
          username
        }
      }
    }
  }
`;