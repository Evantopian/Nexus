import { useMutation, useQuery } from "@apollo/client";
import PartyList from "./PartyList";
import PlayerRecommendation from "./PlayerRecommendation";
import { useAuth } from "@/contexts/AuthContext";
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
  const { recommendedPlayers, recLoading } = useRecommendedPlayers(user?.uuid);
  const [activeTab, setActiveTab] = useState<"recommendations" | "invites">(
    "recommendations"
  );

  // console.log(recommendedPlayers);

  // Fetch user's party
  const {
    data: partyData,
    loading: partyLoading,
    error: partyError,
    refetch: refetchParty,
  } = useQuery(GET_PARTY_BY_USER, {
    variables: { userId: user?.uuid },
    skip: !user?.uuid,
  });

  // console.log("Party data", partyData);

  const partyMemberIds =
    partyData?.getPartyByUser?.members?.map(
      (member: PartyMember) => member.uuid
    ) || [];

  // console.log("Party member IDs:", partyMemberIds);

  // Filter out party members from recommendations
  const filteredRecommendations = recommendedPlayers?.filter(
    (player: Player) => !partyMemberIds.includes(player.id)
  );

  // console.log(filteredRecommendations);

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

  // console.log("sentInvitesData", sentInvitesData);

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
      // console.log(accept ? "Accepted" : "Declined", "invite", inviteId);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-12 px-6">
      {/* Main Content */}
      <div className="flex items-start gap-16 w-full max-w-screen-xl">
        {/* Left: Current Party always visible */}
        <div className="w-1/2">
          {partyError ? (
            <p className="text-red-500 mb-6">Failed to load party.</p>
          ) : (
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
          )}
        </div>

        {/* Right: Tab content (Recommended or Invites) */}
        <div className="flex-1/2">
          {/* Tabs for right side */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`px-5 py-2.5 rounded-l-full border border-r-0 ${
                activeTab === "recommendations"
                  ? "bg-indigo-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => setActiveTab("invites")}
              className={`px-5 py-2.5 rounded-r-full border ${
                activeTab === "invites"
                  ? "bg-indigo-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Invites
            </button>
          </div>
          {activeTab === "recommendations" ? (
            <PlayerRecommendation
              recommendedPlayers={filteredRecommendations}
              handleInvite={handleInvite}
              loading={recLoading || !user?.uuid}
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
  );
};

export default Party;
