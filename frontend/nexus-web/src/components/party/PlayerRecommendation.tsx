import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Player } from "./Party";

interface PlayerRecommendationProps {
  recommendedPlayers: Player[];
}

// Define ratios or percentages for responsiveness
const CARD_WIDTH_PERCENT_MOBILE = 0.8; // 80% of viewport width on mobile
const CARD_WIDTH_PERCENT_DESKTOP = 0.4; // 40% of viewport width on desktop (adjust as needed)
const CARD_ASPECT_RATIO = 300 / 260; // Original width/height ratio (adjust if you want a different shape)

const PlayerRecommendation = ({
  recommendedPlayers,
}: PlayerRecommendationProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [offsetMultiplier, setOffsetMultiplier] = useState(0); // Start at 0, calculate in effect
  const [cardHeight, setCardHeight] = useState(0); // State for dynamic height

  useEffect(() => {
    const calculateDimensions = () => {
      const vw = window.innerWidth;
      let calculatedOffset;

      if (vw < 768) {
        calculatedOffset = vw * CARD_WIDTH_PERCENT_MOBILE;
      } else {
        calculatedOffset = vw * CARD_WIDTH_PERCENT_DESKTOP;
      }

      setOffsetMultiplier(calculatedOffset);
      // Calculate height based on the aspect ratio of the calculated width
      setCardHeight(calculatedOffset / CARD_ASPECT_RATIO);
    };

    window.addEventListener("resize", calculateDimensions);
    calculateDimensions(); // Call on mount

    return () => window.removeEventListener("resize", calculateDimensions); // Cleanup
  }, []);

  const prev = () =>
    setActiveIndex(
      (i) => (i - 1 + recommendedPlayers.length) % recommendedPlayers.length
    );
  const next = () => setActiveIndex((i) => (i + 1) % recommendedPlayers.length);

  const containerMaxWidth = offsetMultiplier; // No extra padding in max-width for this positioning

  return (
    <div className="flex flex-col items-center w-full md:w-[60%] gap-6">
      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Recommended
      </h2>

      {recommendedPlayers.length > 0 ? (
        <div
          className="relative w-full overflow-hidden rounded-xl"
          style={{
            maxWidth: `${containerMaxWidth}px`, // Max width based on calculated card width
            height: `${cardHeight}px`, // Height based on calculated card height
          }}
        >
          {/* Prev Button */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 z-20"
          >
            <ChevronLeft className="w-6 h-6 dark:text-gray-300" />
          </button>

          {/* Cards */}
          {recommendedPlayers.map((p, idx) => {
            const diff = idx - activeIndex;

            const translateX = diff * offsetMultiplier;
            const scale =
              1 - Math.abs(diff) * (window.innerWidth < 768 ? 0.15 : 0.1); // Slightly more scaling on smaller screens
            const z = 10 - Math.abs(diff);
            const opacity = diff === 0 ? 1 : 0.7; // Maybe reduce opacity slightly more for cards further away

            return (
              <div
                key={p.id}
                className="absolute top-0 left-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 flex-shrink-0 flex flex-col items-center justify-between transition-all duration-300 ease-in-out"
                style={{
                  width: `${offsetMultiplier}px`, // Card width matches offset for positioning
                  height: `${cardHeight}px`, // Dynamic height
                  transform: `translateX(${translateX}px) translateX(-50%) scale(${scale})`,
                  zIndex: z,
                  opacity,
                }}
              >
                {/* Username */}
                <span className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                  {p.username}
                </span>

                {/* Profile Image */}
                <div className="flex items-center justify-center flex-grow min-h-[100px]">
                  <img
                    src={p.profileImg || "/default-avatar.png"}
                    alt={p.username}
                    className="w-3/4 h-3/4 rounded-full object-cover"
                  />
                </div>

                {/* Invite Button */}
                <button className="text-sm px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                  Invite
                </button>
              </div>
            );
          })}

          {/* Next Button */}
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 z-20"
          >
            <ChevronRight className="w-6 h-6 dark:text-gray-300" />
          </button>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          No recommended players.
        </p>
      )}
    </div>
  );
};

export default PlayerRecommendation;
