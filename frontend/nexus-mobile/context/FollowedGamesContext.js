import { createContext, useContext } from "react";
import { useQuery } from "@apollo/client";
import { useAuth } from "./AuthContext";
import { GET_USER_FOLLOWED_GAMES } from "../graphql/user/userQueries";

const FollowedGamesContext = createContext(undefined);

export const FollowedGamesProvider = ({ children }) => {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_USER_FOLLOWED_GAMES, {
    variables: { userId: user?.uuid },
    skip: !user?.uuid,
  });

  const followedGames = data?.getUserFollowedGames ?? [];

  return (
    <FollowedGamesContext.Provider value={{ followedGames, loading, error, refetch }}>
      {children}
    </FollowedGamesContext.Provider>
  );
};

export const useFollowedGames = () => {
  const context = useContext(FollowedGamesContext);
  if (context === undefined) {
    throw new Error(
      "useFollowedGames must be used within FollowedGamesProvider"
    );
  }
  return context;
};