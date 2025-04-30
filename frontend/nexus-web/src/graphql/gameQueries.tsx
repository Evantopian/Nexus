import { gql } from "@apollo/client";

export const GET_GAME_QUERY = gql`
  query getGame($slug: String!) {
    getGame(slug: $slug) {
      id
      slug
      title
      description
      shortDescription
      image
      banner
      logo
      players
      releaseDate
      developer
      publisher
      platforms
      tags
      rating
      servers {
        id
        name
        image
        description
        createdAt
      }
      lfgPosts {
        id
        title
        description
        createdAt
        authorId
      }
    }
  }
`;

export const FOLLOW_GAME = gql`
  mutation FollowGame($slug: String!) {
    followGame(slug: $slug)
  }
`;

export const UNFOLLOW_GAME = gql`
  mutation UnfollowGame($slug: String!) {
    unfollowGame(slug: $slug)
  }
`;

export const IS_USER_FOLLOWING_GAME = gql`
  query IsUserFollowingGame($userId: UUID!, $gameId: UUID!) {
    isUserFollowingGame(userId: $userId, gameId: $gameId)
  }
`;
