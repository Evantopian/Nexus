import { gql } from "@apollo/client";

export const CREATELFGPOST = gql`
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

export const GET_LFG_POSTS_BY_SLUG = gql`
  query GetLFGPosts($slug: String!) {
    getLFGPosts(slug: $slug) {
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
