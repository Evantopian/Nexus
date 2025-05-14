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

export const UPDATE_USER = gql`
  mutation updateUser(
    $username: String
    $profileImg: String
    $profileMessage: String
    $rank: String
    $age: Int
  ) {
    updateUser(
      username: $username
      profileImg: $profileImg
      profileMessage: $profileMessage
      rank: $rank
      age: $age
    ) {
      uuid
      email
      username
      profileMessage
      rank
      age
    }
  }
`;

export const UPDATE_PREFERENCE = gql`
  mutation updatePreference(
    $region: String
    $playstyle: Playstyle
    $favoritePlatform: Platform
    $favoriteGameGenre: GameGenre
  ) {
    updatePreference(
      region: $region
      playstyle: $playstyle
      favoritePlatform: $favoritePlatform
      favoriteGameGenre: $favoriteGameGenre
    ) {
      preferences {
        region
        playstyle
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
