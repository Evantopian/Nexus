import React, { createContext, useContext, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_GAMES } from "@/graphql/game/gameQueries";
import { useAuth } from "./AuthContext";

export type Game = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  shortDescription?: string;
  image?: string;
  banner?: string;
  logo?: string;
  players?: string;
  releaseDate?: string;
  developer?: string;
  publisher?: string;
  platforms: string[];
  tags: string[];
  rating?: number;
};

type GameContextType = {
  games: Game[];
  loading: boolean;
  error: any;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_ALL_GAMES, {
    skip: !user, // Only fetch when the user is logged in
    fetchPolicy: "network-only", // Always fetch fresh data
  });

  // Refetch the games when the user logs in or when the token becomes available
  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  const games = data?.getAllGames ?? [];

  // console.log("Games list", games);

  return (
    <GameContext.Provider value={{ games, loading, error }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGames = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGames must be used within a GameProvider");
  }
  return context;
};
