import { Monitor } from "lucide-react";
import { Game } from "@/data/DummyGameData";

interface GameAboutProps {
  game: Game;
}

const GameAbout = ({ game }: GameAboutProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 sticky top-24">
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
        About {game.title}
      </h2>
      <p className="text-gray-700 dark:text-gray-300">{game.description}</p>

      {game.platforms && game.platforms.length > 0 && (
        <div className="mt-4 flex items-center">
          <Monitor className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
          <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
            {game.platforms.map((platform, index) => (
              <span
                key={index}
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {game.developer && (
          <p>
            <strong>Developer:</strong> {game.developer}
            {game.publisher && game.publisher !== game.developer && (
              <>
                {" "}
                | <strong>Publisher:</strong> {game.publisher}
              </>
            )}
          </p>
        )}
        {game.releaseDate && (
          <p>
            <strong>Released:</strong>{" "}
            {new Date(game.releaseDate).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default GameAbout;

