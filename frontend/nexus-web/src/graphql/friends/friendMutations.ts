import { gql } from "@apollo/client";

export const SEND_FRIEND_REQUEST = gql`
  mutation SendFriendRequest($receiverId: UUID!) {
    sendFriendRequest(receiverId: $receiverId) {
      sender {
        uuid
        username
        email
        profileImg
      }
      receiver {
        uuid
        username
        email
        profileImg
      }
      status
      requestedAt
    }
  }
`;

export const ACCEPT_FRIEND_REQUEST = gql`
  mutation AcceptFriendRequest($senderId: UUID!) {
    acceptFriendRequest(senderId: $senderId)
  }
`;

export const REJECT_FRIEND_REQUEST = gql`
  mutation RejectFriendRequest($senderId: UUID!) {
    rejectFriendRequest(senderId: $senderId)
  }
`;

export const CANCEL_FRIEND_REQUEST = gql`
  mutation CancelFriendRequest($receiverId: UUID!) {
    cancelFriendRequest(receiverId: $receiverId)
  }
`;

export const REMOVE_FRIEND = gql`
  mutation RemoveFriend($friendId: UUID!) {
    removeFriend(friendId: $friendId)
  }
`;
