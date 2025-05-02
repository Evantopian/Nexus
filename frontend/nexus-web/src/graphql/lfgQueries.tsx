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
    $gameId: UUID!
    $title: String!
    $description: String!
    $requirements: [String!]!
    $tags: [String!]!
    $expirationHour: Int
  ) {
    updateLFGPost(
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
  query getLFGPosts($slug: String!) {
    getLFGPosts(slug: $slug) {
      id
      gameId
      title
      description
      authorId
      author {
        uuid
        username
        profileImg
      }
      requirements
      tags
      createdAt
      expiresAt
    }
  }
`;

export const GET_ALL_LFG_POSTS = gql`
  query getAllLFGPosts($limit: Int, $offset: Int) {
    getAllLFGPosts(limit: $limit, offset: $offset) {
      id
      title
      description
      author {
        username
        profileImg
      }
      tags
      createdAt
      expiresAt
    }
  }
`;
