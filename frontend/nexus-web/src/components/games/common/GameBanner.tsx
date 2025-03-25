import { Users, Heart, MessageSquare } from "lucide-react";
import { Game, getTagColor } from "@/data/DummyGameData";

interface GameBannerProps {
  game: Game;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

const GameBanner = ({
  game,
  activeTab,
  setActiveTab,
  tabs,
}: GameBannerProps) => {
  return (
    <div className="relative">
      {/* Taller banner */}
      <div className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full">
        <img
          src={game.banner}
          alt={game.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-600/80 dark:from-gray-900/95 via-gray-500/50 dark:via-gray-800/70 to-transparent"></div>
      </div>

      {/* Game Info Overlay */}
      <div className="absolute bottom-20 left-0 right-0 px-4 md:px-6 text-white">
        <div className="flex justify-between items-end">
          {/* Left side - Game identity */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded overflow-hidden border-2 border-white dark:border-gray-600 mb-2 sm:mb-0 sm:mr-4 bg-white dark:bg-gray-800 shadow-md">
              <img
                src={game.logo}
                alt="game icon"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {game.title}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {game.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className={`text-xs px-3 py-1 rounded-full bg-opacity-70 ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-200 dark:text-gray-300">
                {game.developer && <span>By {game.developer}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs integrated at the bottom of banner with buttons */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-600/90 dark:from-gray-900/95 to-transparent">
        <div className="w-full px-4 md:px-6 flex justify-between items-center">
          <div className="flex overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm relative transition-all whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <>
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 dark:bg-indigo-400"></span>
                    <span
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 
                      border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-indigo-500 dark:border-b-indigo-400"
                    ></span>
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Action buttons moved to tab bar */}
          <div className="flex items-center gap-2">
            <button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-full p-2 md:px-3 md:py-1.5 flex items-center transition-all">
              <Heart className="h-4 w-4" />
              <span className="hidden md:inline ml-1 text-sm">Favorite</span>
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-full p-2 md:px-3 md:py-1.5 flex items-center transition-all">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden md:inline ml-1 text-sm">
                Join Discord
              </span>
            </button>
            <div className="bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 rounded-full p-2 md:px-3 md:py-1.5 flex items-center transition-all">
              <Users className="h-4 w-4 text-white" />
              <span className="hidden md:inline ml-1 text-white text-sm font-medium">
                {game.players.toLocaleString()} online
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBanner;