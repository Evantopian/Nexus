import { gql } from "@apollo/client";

export const GET_LFG = gql`
  query GetLFG($postId: UUID!) {
    getLFG(postId: $postId) {
      id
      title
      description
      authorId
      requirements
      tags
      conversationId
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
      conversationId
      createdAt
      expiresAt
    }
  }
`;

export const GET_USER_LFG_POSTS = gql`
  query getUserLFGPosts($limit: Int, $offset: Int) {
    getUserLFGPosts(limit: $limit, offset: $offset) {
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
