import React, { createContext, useContext } from "react";
import { useQuery } from "@apollo/client";
import { useAuth } from "./AuthContext";
import { GET_USER_FOLLOWED_GAMES } from "@/graphql/user/userQueries";

type FollowedGamesContextType = {
  followedGames: any[];
  loading: boolean;
  error: any;
};

const FollowedGamesContext = createContext<
  FollowedGamesContextType | undefined
>(undefined);

export const FollowedGamesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const { data, loading, error } = useQuery(GET_USER_FOLLOWED_GAMES, {
    variables: { userId: user?.uuid },
    skip: !user?.uuid, // prevents early execution, runs when user is defined
  });

  const followedGames = data?.getUserFollowedGames ?? [];

  // console.log("fetched followed games", followedGames);

  return (
    <FollowedGamesContext.Provider value={{ followedGames, loading, error }}>
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
