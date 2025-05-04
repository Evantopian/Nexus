import { GamePlayer } from "@/data/DummyGameData";

interface GamePlayersProps {
  players: GamePlayer[];
  limit?: number;
}

const GamePlayers = ({ players = [], limit = 6 }: GamePlayersProps) => {
  // Default to empty array if players is undefined or null
  const displayPlayers = limit ? players.slice(0, limit) : players;

  if (displayPlayers.length === 0) {
    return <div>No players available</div>;
  }

  return (
    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/30 dark:to-purple-900/30 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800 backdrop-blur-sm mb-8 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Recommended Players
        </h2>
        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayPlayers.map((player) => (
          <div
            key={player.id}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Player Card Image Section (75%) */}
            <div className="relative h-50 bg-gradient-to-b from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
              <img
                src={player.avatar}
                alt={player.name}
                className="h-full w-full object-cover"
              />

              {/* Rank Badge (if applicable) */}
              {player.role === "verified" && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 shadow-md">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                  </svg>
                </div>
              )}
            </div>

            {/* Player Details Section (25%) */}
            <div className="p-3 relative">
              <div className="flex items-center">
                {/* Small Profile Picture */}
                <div className="relative mr-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Status Indicator */}
                  {player.status && (
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                        player.status === "online"
                          ? "bg-green-500"
                          : player.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                  )}
                </div>

                {/* Player Name */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-sm truncate-text text-gray-900 dark:text-white">
                    {player.name}
                  </h3>
                  {player.level && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Level {player.level}
                    </p>
                  )}
                </div>
              </div>

              {/* Follow Button */}
              <button className="w-full mt-2 text-xs bg-indigo-600 dark:bg-indigo-700 text-white px-2 py-1 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamePlayers;
