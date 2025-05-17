import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { GET_GAME_QUERY } from "@/graphql/game/gameQueries";
import { useFollowedGames } from "@/contexts/FollowedGamesContext";

import GameBanner from "./common/GameBanner";
import FilterBar from "./common/FilterBar";
import GameAbout from "./detail/GameAbout";
import GameServers from "./detail/GameServers";
import GamePlayers from "./detail/GamePlayers";
import GameLFG from "./detail/GameLFG";

const GameDetail = () => {
  const gameName =
    useParams<{ gameName: string }>().gameName ?? "defaultGameName";
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("guilds");
  const [activeFilter, setActiveFilter] = useState("all");

  const { loading, error, data } = useQuery(GET_GAME_QUERY, {
    variables: { slug: gameName },
  });

  const gameData = data?.getGame;

  const { followedGames } = useFollowedGames();
  const isFollowed = followedGames.some((game: any) => game.slug === gameName);

  // console.log(gameData);

  // Redirect to dashboard if no valid game name
  useEffect(() => {
    if (!gameName) {
      navigate("/dashboard");
    }
  }, [gameName, navigate]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error || !gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Game Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The game you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/browse")}
            className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            Browse Games
          </button>
        </div>
      </div>
    );
  }

  // Your tabs, filters, etc.
  const tabs = [
    { id: "guilds", label: "Guilds/Factions/Servers" },
    { id: "players", label: "Players" },
    { id: "lfg", label: "LFG" },
  ];

  const filterOptions = [
    { id: "all", label: "All", active: activeFilter === "all" },
    { id: "active", label: "Active", active: activeFilter === "active" },
    { id: "popular", label: "Popular", active: activeFilter === "popular" },
    { id: "new", label: "New", active: activeFilter === "new" },
    {
      id: "competitive",
      label: "Competitive",
      active: activeFilter === "competitive",
    },
  ];

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  return (
    <div className="min-h-screen w-full">
      {/* Game Banner with integrated tabs */}
      <div className="w-[calc(100%+2rem)] -ml-4 -mt-6">
        <GameBanner
          game={gameData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
          isFollowed={isFollowed}
        />
      </div>
      {/* Content Area */}
      <div className="w-full py-8">
        {/* Filters Row */}
        <FilterBar
          options={filterOptions}
          onFilterChange={handleFilterChange}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area - Left Side */}
          <div className="lg:w-3/4">
            {/* Guilds/Servers Section - Carousel */}
            {activeTab === "guilds" && <GameServers gameName={gameName} />}

            {/* Separator Line */}
            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-6"></div>

            {/* Players Section - Horizontal Cards */}
            <GamePlayers players={gameData.topPlayers} />

            {/* LFG Section */}
            {activeTab === "lfg" && <GameLFG gameName={gameName} />}
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:w-1/4">
            {/* Game Description */}
            <GameAbout game={gameData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
