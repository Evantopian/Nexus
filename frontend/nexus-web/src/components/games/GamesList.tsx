import { useState } from "react";
import { getAllGames } from "@/data/DummyGameData";
import SearchFilters from "./lists/SearchFilters";
import GameGrid from "./lists/GameGrid";

const GamesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Get all games from data model
  const games = getAllGames();

  // Filter games based on search term and active filter
  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    if (activeFilter === "all") return matchesSearch;
    return (
      matchesSearch &&
      game.tags.some((tag) => tag.toLowerCase() === activeFilter.toLowerCase())
    );
  });

  // Extract unique tags for filter dropdown
  const allTags = Array.from(new Set(games.flatMap((game) => game.tags)));

  const clearFilters = () => {
    setSearchTerm("");
    setActiveFilter("all");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-6 pb-12">
      <div className="w-full max-w-[1600px] mx-auto px-4 transition-all duration-300">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Browse Games</h1>

          {/* Search and Filter Bar */}
          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            availableTags={allTags}
          />

          {/* Results Count */}
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {filteredGames.length} games found
          </p>
        </div>

        {/* Games Grid */}
        <GameGrid games={filteredGames} />

        {/* Empty State - Clear Filters Button */}
        {filteredGames.length === 0 && (
          <div className="text-center">
            <button
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesList;
