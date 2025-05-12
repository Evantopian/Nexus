import { useEffect, useState } from "react";
import { Users, Heart, MessageSquare } from "lucide-react";
import { useMutation } from "@apollo/client";
import { FOLLOW_GAME, UNFOLLOW_GAME } from "@/graphql/gameQueries";
import { Game, getTagColor } from "@/data/DummyGameData";

interface GameBannerProps {
  game: Game;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { id: string; label: string }[];
  isFollowed: boolean;
}

// Need to better synch/fix how follow/unfollow

const GameBanner = ({
  game,
  activeTab,
  setActiveTab,
  tabs,
  isFollowed,
}: GameBannerProps) => {
  const [isFollowing, setIsFollowing] = useState(isFollowed);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);

  useEffect(() => {
    setIsFollowing(isFollowed);
  }, [isFollowed]);

  // Follow Game Mutation
  const [followGame, { loading: followLoading }] = useMutation(FOLLOW_GAME, {
    variables: { slug: game.slug },
    onCompleted: (data) => {
      if (data?.followGame) {
        setIsFollowing(true);
      }
    },
    onError: (err) => {
      console.error("Failed to follow game:", err.message);
    },
  });

  // Unfollow Game Mutation
  const [unfollowGame, { loading: unfollowLoading }] = useMutation(
    UNFOLLOW_GAME,
    {
      variables: { slug: game.slug },
      onCompleted: (data) => {
        if (data?.unfollowGame) {
          setIsFollowing(false);
        }
      },
      onError: (err) => {
        console.error("Failed to unfollow game:", err.message);
      },
    }
  );

  // Handle the toggle between follow/unfollow
  const handleFollowToggle = () => {
    if (isFollowing) {
      setShowUnfollowConfirm(true);
    } else {
      followGame();
    }
  };

  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full">
        <img
          src={game.banner}
          alt={game.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-600/80 dark:from-gray-900/95 via-gray-500/50 dark:via-gray-800/70 to-transparent"></div>
      </div>

      {/* Game Info */}
      <div className="absolute bottom-20 left-0 right-0 px-4 md:px-6 text-white">
        <div className="flex justify-between items-end">
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
                    className={`text-xs px-3 py-1 rounded-full bg-opacity-70 ${getTagColor(
                      tag
                    )}`}
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

      {/* Tabs and Action Buttons */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-600/90 dark:from-gray-900/95 to-transparent">
        <div className="w-full px-4 md:px-6 flex justify-between items-center">
          <div className="flex overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 sm:py-4 px-3 sm:px-6 font-medium text-xs sm:text-sm relative transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <>
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 dark:bg-indigo-400"></span>
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-indigo-500 dark:border-b-indigo-400"></span>
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleFollowToggle}
              disabled={followLoading || unfollowLoading}
              className={`${
                isFollowing
                  ? "bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500"
                  : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
              } text-white rounded-full p-2 md:px-3 md:py-1.5 flex items-center transition-all`}
            >
              <Heart className="h-4 w-4" />
              <span className="hidden md:inline ml-1 text-sm">
                {isFollowing ? "Following" : "Follow"}
              </span>
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

      {/* Confirm/Cancel unfollow */}
      {showUnfollowConfirm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Unfollow
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to unfollow{" "}
              <span className="font-semibold">{game.title}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowUnfollowConfirm(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  unfollowGame();
                  setShowUnfollowConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Unfollow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBanner;
