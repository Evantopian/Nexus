import { Users as PeopleIcon } from "lucide-react";
import { ChevronRightIcon } from "lucide-react";

interface PlayerProps {
  id: number;
  email: string;
  username: string;
  proflieImg: string;
}

interface RecommendedPlayersProps {
  players: PlayerProps[];
}

const RecommendedPlayers = ({ players }: RecommendedPlayersProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <style>{`
        .transparent-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }

        .transparent-scrollbar::-webkit-scrollbar {
          height: 6px;
        }

        .transparent-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .transparent-scrollbar::-webkit-scrollbar-thumb {
          background-color: transparent;
        }
      `}</style>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
          <PeopleIcon className="mr-2" /> Recommended Players
        </h2>
        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
          See more <ChevronRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="flex overflow-x-auto space-x-4 pb-4 -mx-2 px-2 transparent-scrollbar">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex-shrink-0 w-40 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center hover:shadow-md transition-shadow"
          >
            <img
              src={player.proflieImg}
              alt={`${player.username}'s avatar`}
              className="h-16 w-16 rounded-full mb-2"
            />
            <h3 className="font-medium text-sm text-center truncate w-full">
              {player.username}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {player.email}
            </p>
            <button className="mt-3 bg-indigo-600 dark:bg-indigo-700 text-white text-xs px-4 py-1 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 w-full">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedPlayers;
