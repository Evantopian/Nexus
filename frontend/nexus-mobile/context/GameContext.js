import React, { createContext, useContext, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_GAMES } from "../graphql/game/gameQueries";
import { useAuth } from "./AuthContext";

const GameContext = createContext(undefined);

export const GameProvider = ({ children }) => {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_ALL_GAMES, {
    skip: !user,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  const games = data?.getAllGames ?? [];

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
