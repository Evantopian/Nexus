"use client";

import { useMutation, useQuery } from "@apollo/client";
import PartyList from "./PartyList";
import PlayerRecommendation from "./PlayerRecommendation";
import { useAuth } from "@/contexts/AuthContext";
import { useGames } from "@/contexts/GameContext";
import { ADJUST_REP } from "@/graphql/user/userMutations";
import {
  GET_PARTY_BY_USER,
  GET_PARTY_INVITATIONS,
  GET_SENT_PARTY_INVITATIONS,
} from "@/graphql/party/partyQueries";
import {
  CREATE_PARTY,
  DELETE_PARTY,
  HANDLE_PARTY_INVITE,
  INVITE_TO_PARTY,
  REMOVE_FROM_PARTY,
} from "@/graphql/party/partyMutations";
import PartyInvites from "./PartyInvites";
import { useState } from "react";
import { useRecommendedPlayers } from "@/hooks/useRecommendedPlayers";
import {
  Users,
  GamepadIcon as GameController,
  UserPlus,
  Search,
} from "lucide-react";

export type UserRecommendation = {
  uuid: string;
  username: string;
  email: string;
  profileImg: string;
  region: string;
  genre: string;
  platform: string;
  playstyle: string;
  rank: string;
  age: number;
  reputation: number;
};

export type Player = {
  id: string;
  username: string;
  email: string;
  profileImg: string | null;
};

type PartyMember = {
  uuid: string;
  username: string;
  email: string;
  profileImg: string | null;
};

const Party = () => {
  const { user } = useAuth();
  const { games, loading: gamesLoading } = useGames();
  const { recommendedPlayers, recLoading } = useRecommendedPlayers(user?.uuid);
  const [activeTab, setActiveTab] = useState<"recommendations" | "invites">(
    "recommendations"
  );
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user's party
  const {
    data: partyData,
    loading: partyLoading,
    error: _partyError,
    refetch: refetchParty,
  } = useQuery(GET_PARTY_BY_USER, {
    variables: { userId: user?.uuid },
    skip: !user?.uuid,
  });

  const partyMemberIds =
    partyData?.getPartyByUser?.members?.map(
      (member: PartyMember) => member.uuid
    ) || [];

  // Filter out party members from recommendations
  const filteredRecommendations = recommendedPlayers?.filter(
    (player: Player) => !partyMemberIds.includes(player.id)
  );

  const { data: receivedInvitesData, refetch: refetchReceivedInvites } =
    useQuery(GET_PARTY_INVITATIONS, {
      variables: { userId: user?.uuid },
      skip: !user?.uuid,
    });

  const { data: sentInvitesData, refetch: refetchSentInvites } = useQuery(
    GET_SENT_PARTY_INVITATIONS,
    {
      variables: { userId: user?.uuid },
      skip: !user?.uuid,
    }
  );

  const sentInvites = sentInvitesData?.getSentPartyInvitations || [];
  const receivedInvites = receivedInvitesData?.getPartyInvitations || [];

  const [inviteToParty] = useMutation(INVITE_TO_PARTY);
  const [handlePartyInvite] = useMutation(HANDLE_PARTY_INVITE);

  const handleInvite = async (inviteeId: string) => {
    try {
      await inviteToParty({
        variables: {
          partyId: partyData?.getPartyByUser?.id,
          inviteeId,
        },
      });
      console.log(`Invited ${inviteeId}`);
      refetchSentInvites();
    } catch (err) {
      console.error("Failed to send invite:", err);
    }
  };

  const handleInviteResponse = async (inviteId: string, accept: boolean) => {
    try {
      await handlePartyInvite({ variables: { inviteId, accept } });
      refetchReceivedInvites();
      refetchSentInvites();
      // Refresh party data if accepted
      if (accept) refetchParty();
    } catch (err) {
      console.error("Failed to handle invite:", err);
    }
  };

  const [createParty] = useMutation(CREATE_PARTY);
  const [removeFromParty] = useMutation(REMOVE_FROM_PARTY);
  const [deleteParty] = useMutation(DELETE_PARTY);

  const handleCreateParty = async (partyName: string) => {
    try {
      await createParty({ variables: { name: partyName } });
      refetchParty();
    } catch (err) {
      console.error("Failed to create party", err);
    }
  };

  const handleKickPlayer = async (userId: string) => {
    try {
      await removeFromParty({
        variables: {
          partyId: partyData?.getPartyByUser?.id,
          userId,
        },
      });
    } catch (err) {
      console.error("Failed to kick player:", err);
    }
  };

  const handleDeleteParty = async (partyId: string) => {
    try {
      await deleteParty({ variables: { partyId } });
      refetchParty();
    } catch (err) {
      console.error("Failed to delete party:", err);
    }
  };

  const [adjustRep] = useMutation(ADJUST_REP);

  const handleHonor = async (userId: string) => {
    try {
      await adjustRep({ variables: { userId, amount: 1 } });
      console.log(`Honored ${userId}`);
    } catch (err) {
      console.error("Failed to honor user:", err);
    }
  };

  const handleDislike = async (userId: string) => {
    try {
      await adjustRep({ variables: { userId, amount: -1 } });
      console.log(`Disliked ${userId}`);
    } catch (err) {
      console.error("Failed to dislike user:", err);
    }
  };

  const handleViewProfile = (userId: string) => {
    console.log(userId);
  };

  const toggleGameSelection = (gameId: string) => {
    setSelectedGames((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId]
    );
  };

  // Filter games based on search query
  const filteredGames =
    games?.filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="max-w-[1800px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Column (1/3) - Party and Games stacked */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {/* Party Section */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700">
              <div className="p-3 bg-gray-200 dark:bg-gray-700 flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-teal-500 dark:text-teal-400" />
                  <h2 className="text-base font-bold">Your Party</h2>
                </div>
                {partyData?.getPartyByUser && (
                  <span className="text-xs bg-teal-500 px-2 py-0.5 rounded-full text-white">
                    {partyData.getPartyByUser.members?.length || 0}/
                    {partyData.getPartyByUser.maxMembers || 5}
                  </span>
                )}
              </div>

              <div className="p-3">
                <PartyList
                  partyData={partyData?.getPartyByUser}
                  onCreateParty={handleCreateParty}
                  onDeleteParty={handleDeleteParty}
                  onHonor={handleHonor}
                  onDislike={handleDislike}
                  onViewProfile={handleViewProfile}
                  onKick={handleKickPlayer}
                  loading={partyLoading}
                />
              </div>
            </div>

            {/* Games Section */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 flex-grow">
              <div className="p-3 bg-gray-200 dark:bg-gray-700 flex items-center justify-between">
                <div className="flex items-center">
                  <GameController className="w-5 h-5 mr-2 text-teal-500 dark:text-teal-400" />
                  <h2 className="text-base font-bold">Games</h2>
                </div>
                <span className="text-xs bg-teal-500 px-2 py-0.5 rounded-full text-white">
                  {filteredGames?.length || 0}
                </span>
              </div>

              <div className="p-3">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="h-[calc(100vh-400px)] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                  {gamesLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                  ) : filteredGames && filteredGames.length > 0 ? (
                    filteredGames.map((game) => (
                      <div
                        key={game.id}
                        onClick={() => toggleGameSelection(game.id)}
                        className={`relative p-2 rounded-lg cursor-pointer transition-all border ${
                          selectedGames.includes(game.id)
                            ? "bg-teal-600 border-teal-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 bg-gray-300 dark:bg-gray-600 flex-shrink-0">
                            {game.image ? (
                              <img
                                src={game.image || "/placeholder.svg"}
                                alt={game.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <GameController className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm truncate">
                              {game.title}
                            </h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {game.platforms
                                ?.slice(0, 2)
                                .map((platform, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-1.5 py-0.5 bg-gray-300 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200"
                                  >
                                    {platform}
                                  </span>
                                ))}
                              {game.platforms?.length > 2 && (
                                <span className="text-xs px-1.5 py-0.5 bg-gray-300 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200">
                                  +{game.platforms.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                      <GameController className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p>No games found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (2/3) - Find Players */}
          <div className="w-full lg:w-2/3">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 h-full">
              <div className="p-3 bg-gray-200 dark:bg-gray-700 flex items-center justify-between">
                <div className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-teal-500 dark:text-teal-400" />
                  <h2 className="text-base font-bold">Find Players</h2>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setActiveTab("recommendations")}
                    className={`px-3 py-1 text-xs rounded-lg transition ${
                      activeTab === "recommendations"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                  >
                    Recommended
                  </button>
                  <button
                    onClick={() => setActiveTab("invites")}
                    className={`px-3 py-1 text-xs rounded-lg transition ${
                      activeTab === "invites"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                  >
                    Invites
                  </button>
                </div>
              </div>

              {selectedGames.length > 0 && (
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700/50 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Selected games:
                  </span>
                  {selectedGames.map((gameId) => {
                    const game = games?.find((g) => g.id === gameId);
                    return (
                      game && (
                        <span
                          key={gameId}
                          className="text-xs px-2 py-1 bg-teal-600 rounded-full text-white flex items-center"
                        >
                          {game.title}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleGameSelection(gameId);
                            }}
                            className="ml-1 hover:text-gray-300"
                          >
                            ×
                          </button>
                        </span>
                      )
                    );
                  })}
                </div>
              )}

              <div className="p-3 h-[calc(100vh-200px)]">
                {activeTab === "recommendations" ? (
                  <PlayerRecommendation
                    recommendedPlayers={filteredRecommendations}
                    handleInvite={handleInvite}
                    loading={recLoading || !user?.uuid}
                    selectedGames={selectedGames}
                  />
                ) : (
                  <PartyInvites
                    sentInvites={sentInvites}
                    receivedInvites={receivedInvites}
                    onRespond={handleInviteResponse}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(75, 85, 99, 0.5);
        border-radius: 20px;
        border: 2px solid transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(75, 85, 99, 0.8);
      }
    `}</style>
    </div>
  );
};

export default Party;
