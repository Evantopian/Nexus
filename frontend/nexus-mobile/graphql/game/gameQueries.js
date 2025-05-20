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
    }
  }
`;

export const GET_ALL_GAMES = gql`
  query GetAllGames {
    getAllGames {
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
