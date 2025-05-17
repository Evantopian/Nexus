import { useQuery } from "@apollo/client";
import { GET_RECOMMENDATIONS } from "../graphql/user/userQueries"; // update path if needed
import { UserRecommendation } from "@/components/party/Party";

export const useRecommendedPlayers = (
  userId?: string,
  numRecommendations: number = 5
) => {
  const {
    data,
    loading: recLoading,
    error: recError,
  } = useQuery(GET_RECOMMENDATIONS, {
    variables: { userId, numRecommendations },
    skip: !userId,
  });

  const recommendedPlayers =
    data?.getRecommendations?.map((player: UserRecommendation) => ({
      id: player.uuid,
      username: player.username,
      email: player.email || "placeholder@email.com",
      profileImg: player.profileImg || "https://thispersondoesnotexist.com/",
    })) || [];

  return { recommendedPlayers, recLoading, recError };
};
