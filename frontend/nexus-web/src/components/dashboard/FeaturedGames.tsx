import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GameCard from "@/components/dashboard/featured/GameCard";
import { getAllGames } from "@/data/DummyGameData";

interface FeaturedGamesProps {
  games?: any[];
}

const FeaturedGames = ({ games }: FeaturedGamesProps) => {
  // If no games are provided, use the data model
  const allGamesData = games || getAllGames();

  const [activeIndex, setActiveIndex] = useState(
    Math.floor(allGamesData.length / 2)
  );
  const [showMoreVisible, setShowMoreVisible] = useState(false);
  const [cardOffsetMultiplier, setCardOffsetMultiplier] = useState(180);

  // check for showmore
  useEffect(() => {
    if (activeIndex === allGamesData.length - 1) {
      setShowMoreVisible(true);
    } else {
      setShowMoreVisible(false);
    }
  }, [activeIndex, allGamesData.length]);

  // Update card offset multiplier based on viewport width for responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardOffsetMultiplier(140);
      } else {
        setCardOffsetMultiplier(180);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();  

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const prevCard = () => {
    setActiveIndex(
      (prev) => (prev - 1 + allGamesData.length) % allGamesData.length
    );
  };

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % allGamesData.length);
  };

  const handleCardClick = (clickedIndex: number) => {
    setActiveIndex(clickedIndex);
  };

  return (
    <div className="w-full py-4">
      <div className="relative w-full mx-auto">
        {/* Card Container with Overlapping Effect */}
        <div className="relative w-full h-[250px] md:h-[300px] flex items-center justify-center overflow-hidden">
          {/* Left Navigation Button */}
          <button
            onClick={prevCard}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 z-20"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Regular Game Cards */}
          {allGamesData.map((game, i) => {
            const offset = i - activeIndex;
            if (Math.abs(offset) > 3) return null;

            const translateX = offset * cardOffsetMultiplier;
            const scale = 1.2 - Math.abs(offset) * 0.12;
            const zIndex = 10 - Math.abs(offset);
            const opacity = offset === 0 ? 1 : 0.8;
            const isActive = offset === 0;

            return (
              <Link
                to={`/games/${game.slug}`}
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  width: "min(600px, 90vw)",
                  height: "220px",
                  transform: `translateX(${translateX}px) translateX(-50%) scale(${scale})`,
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                  zIndex,
                  opacity,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleCardClick(i);
                }}
              >
                <GameCard
                  image={game.image}
                  title={game.title}
                  slug={game.slug}
                  players={game.players}
                  tags={
                    typeof game.tags[0] === "string"
                      ? game.tags
                      : game.tags.map((tag: string) =>
                          tag
                            .replace("bg-", "")
                            .replace("-500", "")
                            .replace("-300", "")
                            .replace("-100", "")
                        )
                  }
                  showDetails={isActive}
                />
              </Link>
            );
          })}

          {/* Show More Card */}
          {showMoreVisible && (
            <Link
              to="/browse"
              style={{
                position: "absolute",
                left: "50%",
                width: "min(540px, 90vw)",
                height: "220px",
                transform: `translateX(${cardOffsetMultiplier}px) translateX(-50%) scale(0.88)`,
                transition: "transform 0.3s ease, opacity 0.3s ease",
                zIndex: 9,
                opacity: 0.8,
                cursor: "pointer",
              }}
            >
              <div className="flex-shrink-0 rounded-[10px] overflow-hidden relative group shadow-lg transform transition-transform hover:scale-105 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800 h-full">
                <div className="flex h-full">
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 mb-3">
                      <Plus className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      Show More Games
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Right Navigation Button */}
          <button
            onClick={nextCard}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 z-20"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {allGamesData.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index
                  ? "w-4 bg-indigo-600 dark:bg-indigo-500"
                  : "w-2 bg-gray-300 dark:bg-gray-600"
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedGames;
