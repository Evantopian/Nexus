import { gql } from "@apollo/client";

export const CREATE_LFG_POST = gql`
  mutation CreateLFGPost(
    $gameId: UUID!
    $title: String!
    $description: String!
    $requirements: [String!]!
    $tags: [String!]!
    $expirationHour: Int
  ) {
    createLFGPost(
      gameId: $gameId
      title: $title
      description: $description
      requirements: $requirements
      tags: $tags
      expirationHour: $expirationHour
    ) {
      id
      gameId
      title
      description
      authorId
      requirements
      tags
      createdAt
      expiresAt
    }
  }
`;

export const UPDATE_LFG_POST = gql`
  mutation updateLFGPost(
    $postId: UUID!
    $title: String!
    $description: String!
    $requirements: [String!]!
    $tags: [String!]!
    $expirationHour: Int
  ) {
    updateLFGPost(
      postId: $postId
      title: $title
      description: $description
      requirements: $requirements
      tags: $tags
      expirationHour: $expirationHour
    ) {
      id
      gameId
      title
      description
      authorId
      requirements
      tags
      createdAt
      expiresAt
    }
  }
`;

export const UPDATE_LFG_CONVERSATION = gql`
  mutation UpdateLFGConversationId($postId: UUID!, $conversationId: UUID!) {
    updateLFGConversationId(postId: $postId, conversationId: $conversationId) {
      id
      conversationId
    }
  }
`;

export const DELETE_LFG_POST = gql`
  mutation deleteLFGPost($postId: UUID!) {
    deleteLFGPost(postId: $postId)
  }
`;
