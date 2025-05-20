import { gql } from "@apollo/client"

export const GET_RANDOM_USERS = gql`
  query GetRandomUsers {
    getRandomUsers {
      uuid
      username
      profileImg
      rank
      status
    }
  }
`
