import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  GET_FRIENDS,
  GET_FRIEND_REQUESTS,
} from "@/graphql/friends/friendQueries";

import PlayerList from "@/components/players/PlayerList";
import FriendRequests from "@/components/players/FriendRequests";
import {
  REMOVE_FRIEND,
  SEND_FRIEND_REQUEST,
} from "@/graphql/friends/friendMutations";
import { GET_ALL_USERS } from "@/graphql/user/userQueries";

export type Player = {
  uuid: string;
  email: string;
  username: string;
  profileImg: string;
  rank: string;
  status: string;
};

const Players = () => {
  const [activeTab, setActiveTab] = useState<"all" | "friends" | "requests">(
    "all"
  );

  const { data: allPlayerData } = useQuery(GET_ALL_USERS, {
    variables: { limit: 10 }, // example limit
  });

  const { data: friendsData } = useQuery(GET_FRIENDS);
  const { data: requestData } = useQuery(GET_FRIEND_REQUESTS);

  const friends: Player[] = friendsData?.getFriends || [];
  const receivedRequests = requestData?.getFriendRequests?.received || [];
  const sentRequests = requestData?.getFriendRequests?.sent || [];

  const [addFriend] = useMutation(
    SEND_FRIEND_REQUEST,
    {
      refetchQueries: [{ query: GET_FRIENDS }, { query: GET_FRIEND_REQUESTS }],
    }
  );
  const [removeFriend] = useMutation(
    REMOVE_FRIEND,
    {
      refetchQueries: [{ query: GET_FRIENDS }, { query: GET_FRIEND_REQUESTS }],
    }
  );

  const allPlayers = allPlayerData?.getAllUsers || [];

  // Filter out players who are already friends
  const filteredAllPlayers = allPlayers.filter(
    (player: Player) => !friends.some((friend) => friend.uuid === player.uuid)
  );

  const isFriend = (playerUUID: string) => {
    return friends.some((friend) => friend.uuid === playerUUID);
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6 mt-8 text-gray-900 dark:text-white">
        Players
      </h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {["all", "friends", "requests"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
            onClick={() => setActiveTab(tab as typeof activeTab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "all" && (
        <PlayerList
          players={filteredAllPlayers}
          onAddFriend={(uuid) => addFriend({ variables: { receiverId: uuid } })}
          onRemoveFriend={(uuid) =>
            removeFriend({ variables: { friendId: uuid } })
          }
          isFriend={isFriend}
        />
      )}

      {activeTab === "friends" && (
        <PlayerList
          players={friends}
          onRemoveFriend={(uuid) =>
            removeFriend({ variables: { friendId: uuid } })
          }
          isFriend={isFriend}
        />
      )}

      {activeTab === "requests" && (
        <FriendRequests received={receivedRequests} sent={sentRequests} />
      )}
    </div>
  );
};

export default Players;
