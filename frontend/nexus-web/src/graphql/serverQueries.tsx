import { gql } from "@apollo/client";

export const GET_SERVERS_WITH_SLUG = gql`
  query GetServers($slug: String!) {
    getServers(slug: $slug) {
      id
      name
      image
      description
      # members
    }
  }
`;
