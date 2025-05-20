import { useQuery } from '@apollo/client';
import { GET_GROUP_CONVERSATIONS } from "@/graphql/chat/dm.graphql"

type ChatUser = {
  id: string;
  username: string;
};

type Message = {
  id: string;
  body: string;
  timestamp: string;
  sender: ChatUser;
};

type GroupConversation = {
  id: string;
  name: string;
  participants: ChatUser[];
  lastMessage: string;
  lastActive: string;
};

export function useGroupConversations() {
  const { data, loading, error } = useQuery(GET_GROUP_CONVERSATIONS);

  const groups: GroupConversation[] = (data?.conversations ?? [])
    .filter((conv: any) => conv.isGroup)
    .map((group: any) => {
      const lastMessage: Message | undefined =
        group.messages?.[group.messages.length - 1];

      return {
        id: group.id,
        name: group.participants.map((p: ChatUser) => p.username).join(', '),
        participants: group.participants,
        lastMessage: lastMessage?.body ?? '',
        lastActive: lastMessage?.timestamp ?? '',
      };
    });

  return { groups, loading, error };
}
