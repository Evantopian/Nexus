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
