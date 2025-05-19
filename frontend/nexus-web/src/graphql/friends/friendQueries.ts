import { gql } from "@apollo/client";

export const GET_FRIENDS = gql`
  query GetFriends {
    getFriends {
      uuid
      email
      username
      profileImg
      rank
      status
    }
  }
`;

export const GET_FRIEND_REQUESTS = gql`
  query GetFriendRequests {
    getFriendRequests {
      sent {
        sender {
          uuid
          username
          profileImg
          status
        }
        receiver {
          uuid
          username
          profileImg
          status
        }
        status
        requestedAt
      }
      received {
        sender {
          uuid
          username
          profileImg
          status
        }
        receiver {
          uuid
          username
          profileImg
          status
        }
        status
        requestedAt
      }
    }
  }
`;
