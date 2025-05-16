import { gql } from "@apollo/client";

export const GET_PARTY_INVITATIONS = gql`
  query GetPartyInvitations($userId: UUID!) {
    getPartyInvitations(userId: $userId) {
      id
      partyId
      inviterId
      inviteeId
      status
      createdAt
      party {
        id
        name
      }
      inviter {
        uuid
        username
      }
      invitee {
        uuid
        username
      }
    }
  }
`;

export const GET_SENT_PARTY_INVITATIONS = gql`
  query GetSentPartyInvitations($userId: UUID!) {
    getSentPartyInvitations(userId: $userId) {
      id
      partyId
      inviterId
      inviteeId
      status
      createdAt
      party {
        id
        name
      }
      inviter {
        uuid
        username
      }
      invitee {
        uuid
        username
      }
    }
  }
`;

export const GET_PARTY = gql`
  query GetParty($partyId: UUID!) {
    getParty(partyId: $partyId) {
      id
      name
      leaderId
      leader {
        uuid
        username
      }
      members {
        uuid
        username
        email
        profileImg
      }
      maxMembers
      createdAt
    }
  }
`;

export const GET_PARTY_BY_USER = gql`
  query GetPartyByUser($userId: UUID!) {
    getPartyByUser(userId: $userId) {
      id
      name
      leaderId
      leader {
        uuid
        username
      }
      members {
        uuid
        username
        email
        profileImg
      }
      maxMembers
      createdAt
    }
  }
`;
