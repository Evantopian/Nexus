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
