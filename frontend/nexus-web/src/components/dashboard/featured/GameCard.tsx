import { Heart, BarChart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import RivalsBanner from "@/assets/pages/games/MarvelRivals/MarvelRivalsBanner.jpg";

interface GameCardProps {
  image: string;
  title: string;
  slug?: string;
  players: string;
  tags: string[];
  showDetails?: boolean;
}

const GameCard = ({
  image,
  title,
  slug,
  players,
  tags,
  showDetails = true,
}: GameCardProps) => {
  const navigate = useNavigate();

  // Convert tag colors to pastel button styles
  const getTagStyle = (tag: string) => {
    const colorMap: Record<string, string> = {
      "bg-blue-500": "bg-blue-100 text-blue-700",
      "bg-purple-500": "bg-purple-100 text-purple-700",
      "bg-green-500": "bg-green-100 text-green-700",
      "bg-yellow-500": "bg-yellow-100 text-yellow-700",
      "bg-orange-500": "bg-orange-100 text-orange-700",
      "bg-red-500": "bg-red-100 text-red-700",
      "bg-gray-500": "bg-gray-100 text-gray-700",
      "bg-blue-300": "bg-blue-50 text-blue-500",
    };

    return colorMap[tag] || "bg-gray-100 text-gray-700";
  };

  const handleDoubleClick = () => {
    navigate(`/games/${slug || title.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div
      className="flex- w-150 h-full overflow-visible relative group shadow-lg transform transition-all duration-300 hover:scale-105 border border-gray-300 dark:border-gray-600 rounded-[10px]"
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex h-full rounded-[10px] overflow-hidden">
        {showDetails ? (
          <>
            <div className="w-[70%] h-full relative">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="w-[30%] bg-white dark:bg-gray-800 p-3 flex flex-col justify-between">
              <div>
                <h3
                  className="text-gray-800 dark:text-gray-200 text-sm font-bold truncate flex items-center cursor-pointer"
                  onDoubleClick={handleDoubleClick}
                >
                  <div className="h-5 w-5 rounded-full overflow-hidden mr-1 bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <img
                      src={image}
                      alt="game icon"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {title}
                </h3>
                <div className="flex items-center mt-2">
                  <Users className="h-4 w-4 mr-1 text-gray-600 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {players}k
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-4">
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`inline-block text-[9px] px-2 py-0.5 rounded-full ${getTagStyle(
                        tag
                      )}`}
                    >
                      {tag
                        .replace("bg-", "")
                        .replace("-500", "")
                        .replace("-300", "")
                        .replace("-100", "")}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <button className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                  <Heart className="h-3 w-3" />
                </button>
                <button className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                  <BarChart className="h-3 w-3" />
                </button>
              </div>
            </div>
          </>
        ) : (
          // Only show the image when not active
          <div className="w-full h-full relative">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;
