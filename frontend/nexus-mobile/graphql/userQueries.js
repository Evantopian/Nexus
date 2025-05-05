import { gql } from "@apollo/client";

export const PROFILE_QUERY = gql`
  query profile {
    profile {
      uuid
      username
      email
      profileImg
      profileMessage
      status
      reputation
      rank
      createdAt
      preferences {
        playstyle
        region
      }
    }
  }
`;

export const GET_USER_FOLLOWED_GAMES = gql`
  query getUserFollowedGames($userId: String!) {
    getUserFollowedGames(userId: $userId) {
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
    }
  }
`;