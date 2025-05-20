import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation updateUser(
    $username: String
    $profileImg: String
    $profileMessage: String
    $rank: String
    $age: Int
    $status: String
  ) {
    updateUser(
      username: $username
      profileImg: $profileImg
      profileMessage: $profileMessage
      rank: $rank
      age: $age
      status: $status
    ) {
      uuid
      email
      username
      profileMessage
      rank
      age
      status
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

export const ADJUST_REP = gql`
  mutation adjustRep($userId: UUID!, $amount: Int!) {
    adjustRep(userId: $userId, amount: $amount)
  }
`;
