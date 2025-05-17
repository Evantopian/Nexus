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
      age
      createdAt
      preferences {
        playstyle
        region
        favoritePlatform
        favoriteGameGenre
      }
    }
  }
`;

export const GET_USER_FOLLOWED_GAMES = gql`
  query getUserFollowedGames($userId: UUID!) {
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

export const GET_RECOMMENDATIONS = gql`
  query getRecommendations($userId: UUID!, $numRecommendations: Int!) {
    getRecommendations(
      userId: $userId
      numRecommendations: $numRecommendations
    ) {
      uuid
      email
      username
      profileImg
      region
      genre
      platform
      playstyle
      rank
      reputation
      age
    }
  }
`;
