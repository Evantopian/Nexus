import { gql } from "@apollo/client";

export const INVITE_TO_PARTY = gql`
  mutation InviteToParty($partyId: UUID!, $inviteeId: UUID!) {
    inviteToParty(partyId: $partyId, inviteeId: $inviteeId) {
      id
      status
      createdAt
      invitee {
        uuid
        username
      }
      inviter {
        uuid
        username
      }
      party {
        id
        name
      }
    }
  }
`;

export const HANDLE_PARTY_INVITE = gql`
  mutation HandlePartyInvite($inviteId: UUID!, $accept: Boolean!) {
    handlePartyInvite(inviteId: $inviteId, accept: $accept) {
      id
      name
      members {
        uuid
        username
      }
      leader {
        uuid
        username
      }
    }
  }
`;

export const REMOVE_FROM_PARTY = gql`
  mutation RemoveFromParty($partyId: UUID!, $userId: UUID!) {
    removeFromParty(partyId: $partyId, userId: $userId) {
      id
      members {
        uuid
        username
      }
    }
  }
`;

export const CREATE_PARTY = gql`
  mutation CreateParty($name: String!) {
    createParty(name: $name) {
      id
      name
      leader {
        uuid
        username
      }
      members {
        uuid
        username
      }
    }
  }
`;

export const DELETE_PARTY = gql`
  mutation DeleteParty($partyId: UUID!) {
    deleteParty(partyId: $partyId)
  }
`;

export const LEAVE_PARTY = gql`
  mutation LeaveParty($partyId: UUID!) {
    leaveParty(partyId: $partyId) {
      id
      members {
        uuid
        username
      }
    }
  }
`;
