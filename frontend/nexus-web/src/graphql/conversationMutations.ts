import { gql } from "@apollo/client";

export const START_CONVERSATION = gql`
  mutation StartConversation($participantIds: [UUID!]!) {
    startConversation(participantIds: $participantIds) {
      id
    }
  }
`;
