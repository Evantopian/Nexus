import { MessageCircle as ChatIcon } from "lucide-react";
import { ChevronRightIcon } from "lucide-react";

interface RecentGameProps {
  id: number;
  image: string;
  title: string;
  lastPlayed: string;
}

interface RecentlyPlayedProps {
  games: RecentGameProps[];
}

const RecentlyPlayed = ({ games }: RecentlyPlayedProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
          <ChatIcon className="mr-2" /> Recently Played
        </h2>
        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
          See more <ChevronRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="flex overflow-x-auto space-x-4 pb-4 -mx-2 px-2 hide-scrollbar">
        {games.map((game) => (
          <div
            key={game.id}
            className="flex-shrink-0 w-48 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-24 w-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
              <img
                src={game.image}
                alt={`${game.title} thumbnail`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm truncate-text">
                {game.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {game.lastPlayed}
              </p>
              <button className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center">
                Play now <ChevronRightIcon className="h-3 w-3 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPlayed;