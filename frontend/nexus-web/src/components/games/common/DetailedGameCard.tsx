import { Heart, BarChart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTagColor } from "@/data/DummyGameData";

interface GameCardProps {
  image: string;
  title: string;
  slug: string;
  players: string;
  tags: string[];
  showDetails?: boolean;
}

// This component is now named DetailedGameCard to avoid confusion with dashboard/featured/GameCard
const DetailedGameCard = ({
  image,
  title,
  slug,
  players,
  tags,
  showDetails = true,
}: GameCardProps) => {
  const navigate = useNavigate();

  const handleDoubleClick = () => {
    navigate(`/games/${slug}`);
  };

  return (
    <div
      className="flex-shrink-0 w-full h-full overflow-hidden relative group shadow-lg transform transition-all duration-300 hover:scale-105 border border-gray-300 rounded-[10px]"
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
            <div className="w-[30%] bg-white p-3 flex flex-col justify-between">
              <div>
                <h3
                  className="text-gray-800 text-sm font-bold truncate-text flex items-center cursor-pointer"
                  onDoubleClick={handleDoubleClick}
                >
                  <div className="h-5 w-5 rounded-full overflow-hidden mr-1 bg-gray-100 flex-shrink-0">
                    <img
                      src={`https://api.dicebear.com/7.x/identicon/svg?seed=${title}`}
                      alt="game icon"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {title}
                </h3>
                <div className="flex items-center mt-1">
                  <Users className="h-3 w-3 mr-1 text-gray-600" />
                  <span className="text-xs text-gray-600">{players}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`inline-block text-[10px] px-2 py-0.5 rounded-full ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <button className="text-gray-600 hover:text-red-500">
                  <Heart className="h-3 w-3" />
                </button>
                <button className="text-gray-600 hover:text-blue-500">
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
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedGameCard;