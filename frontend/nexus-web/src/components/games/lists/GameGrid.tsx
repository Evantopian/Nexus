import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Game, getTagColor } from "@/data/DummyGameData";

interface GameGridProps {
  games: Game[];
}

const GameGrid = ({ games }: GameGridProps) => {
  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No games found matching your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {games.map((game) => (
        <Link
          to={`/games/${game.slug}`}
          key={game.id}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 group"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={game.image}
              alt={game.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-24"></div>
            <div className="absolute bottom-3 left-3 flex items-center text-white">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">{game.players}</span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate-text text-gray-900 dark:text-white">
              {game.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {game.shortDescription ||
                game.description.substring(0, 120) + "..."}
            </p>
            <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
              {game.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GameGrid;