import { gql } from "@apollo/client";

export const FOLLOW_GAME = gql`
  mutation followGame($slug: String!) {
    followGame(slug: $slug)
  }
`;

export const UNFOLLOW_GAME = gql`
  mutation unfollowGame($slug: String!) {
    unfollowGame(slug: $slug)
  }
`;

export const IS_USER_FOLLOWING_GAME = gql`
  query isUserFollowingGame($userId: UUID!, $gameId: UUID!) {
    isUserFollowingGame(userId: $userId, gameId: $gameId)
  }
`;