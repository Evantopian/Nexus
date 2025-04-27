import { gql } from "@apollo/client";

export const PROFILE_QUERY = gql`
  query Profile {
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
