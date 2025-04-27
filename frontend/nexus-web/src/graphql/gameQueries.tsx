import { gql } from "@apollo/client";

// Define your GraphQL query
export const GET_GAME_QUERY = gql`
  query getGame {
    getGame(slug: "apex-legends") {
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
