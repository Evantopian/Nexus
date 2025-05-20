import { gql } from "@apollo/client";

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
`;

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
`;

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
`;

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
`;

export const START_CONVERSATION = gql`
  mutation StartConversation($participantIds: [UUID!]!) {
    startConversation(participantIds: $participantIds) {
      id
      participants {
        id
        username
      }
    }
  }
`;

export const START_CONVERSATION_LFG = gql`
  mutation StartConversation($participantIds: [UUID!]!, $isGroup: Boolean) {
    startConversation(participantIds: $participantIds, isGroup: $isGroup) {
      id
      participants {
        id
        username
      }
    }
  }
`;

export const ADD_PARTICIPANT_TO_GROUP_CONVERSATION = gql`
  mutation AddParticipantToGroupConversation(
    $conversationId: UUID!
    $participantId: UUID!
  ) {
    addParticipantToGroupConversation(
      conversationId: $conversationId
      participantId: $participantId
    ) {
      id
      name
      lastMessage
      lastActive
      participants {
        uuid
        username
      }
    }
  }
`;

export const GET_GROUP_CONVERSATIONS = gql`
  query GetGroupConversations($limit: Int, $after: Time) {
    getGroupConversations(limit: $limit, after: $after) {
      id
      name
      lastMessage
      lastActive
      participants {
        uuid
        username
      }
    }
  }
`;
