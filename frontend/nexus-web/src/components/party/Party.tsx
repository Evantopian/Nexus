import { useMutation, useQuery } from "@apollo/client";
import PartyList from "./PartyList";
import PlayerRecommendation from "./PlayerRecommendation";
import { ADJUST_REP, GET_RECOMMENDATIONS } from "@/graphql/userQueries";
import { useAuth } from "@/contexts/AuthContext";

type UserRecommendation = {
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
  profileImg: string;
};

const Party = () => {
  const { user } = useAuth();
  const { data, loading } = useQuery(GET_RECOMMENDATIONS, {
    variables: { userId: user?.uuid, numRecommendations: 5 },
    skip: !user?.uuid, // prevents early execution, runs when user is defined
  });
  const [adjustRep] = useMutation(ADJUST_REP);

  const recommendedPlayers =
    data?.getRecommendations?.map((player: UserRecommendation) => ({
      id: player.uuid,
      username: player.username,
      email: player.email || "placeholder@email.com",
      profileImg:
        player.profileImg || "https://picsum.photos/250/250?grayscale",
    })) || [];

  const partyMembers = [
    {
      id: "3",
      username: "DragonSlayer",
      email: "dragon@example.com",
      profileImg: "https://thispersondoesnotexist.com/",
    },
    {
      id: "4",
      username: "SkyWalker",
      email: "skyw@example.com",
      profileImg: "https://thispersondoesnotexist.com/",
    },
    {
      id: "5",
      username: "LunaMage",
      email: "lm@example.com",
      profileImg: "https://thispersondoesnotexist.com/",
    },
    {
      id: "6",
      username: "SunSword",
      email: "ssword@example.com",
      profileImg: "https://thispersondoesnotexist.com/",
    },
  ];

  const handleHonor = async (userId: string) => {
    try {
      // await adjustRep({
      //   variables: { userId, amount: 1 },
      // });
      console.log(`Honored ${userId}`);
    } catch (err) {
      console.error("Failed to honor user:", err);
    }
  };

  const handleDislike = async (userId: string) => {
    try {
      // await adjustRep({
      //   variables: { userId, amount: -1 },
      // });
      console.log(`Disliked ${userId}`);
    } catch (err) {
      console.error("Failed to dislike user:", err);
    }
  };

  const handleViewProfile = (userId: string) => {
    console.log(userId);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 mt-8">
      {/* Main Layout */}
      <div className="flex items-start gap-2 w-4/5 max-w-[1440px]">
        {/* Carousel / Profile Cards */}
        <div className="flex-2">
          <PlayerRecommendation
            recommendedPlayers={recommendedPlayers}
            loading={loading || !user?.uuid}
            // Loading is true when either querying is in flight or skip user is true
          />
        </div>

        {/* Current Party Sidebar */}
        <div className="flex-1">
          <PartyList
            partyMembers={partyMembers}
            onHonor={handleHonor}
            onDislike={handleDislike}
            onViewProfile={handleViewProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default Party;
