import React, { createContext, useContext } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_GAMES } from "@/graphql/gameQueries";

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

// Define the context type
type GameContextType = {
  games: Game[];
  loading: boolean;
  error: any;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, loading, error } = useQuery(GET_ALL_GAMES);
  const games = data?.getAllGames ?? [];

  console.log(games);

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
