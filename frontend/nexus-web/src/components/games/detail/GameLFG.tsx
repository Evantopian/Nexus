import { Plus } from "lucide-react";
import { LFGPost } from "@/data/DummyGameData";

interface GameLFGProps {
  lfgPosts: LFGPost[];
  gameName: string;
}

const GameLFG = ({ lfgPosts, gameName }: GameLFGProps) => {
  return (
    <div className="mt-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-900/30 dark:to-emerald-900/30 p-6 rounded-lg border border-green-200 dark:border-green-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Looking For Group
        </h2>
        <button className="bg-indigo-600 dark:bg-indigo-700 text-white px-3 py-1 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 flex items-center">
          <Plus className="h-4 w-4 mr-1" /> Create LFG
        </button>
      </div>

      {lfgPosts && lfgPosts.length > 0 ? (
        <div className="space-y-4">
          {lfgPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {post.description}
                  </p>
                </div>
                <div className="flex items-center">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-sm font-medium">
                    {post.author.name}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Requirements:
                </h4>
                <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
                  {post.requirements.map((req, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-full"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="bg-indigo-600 dark:bg-indigo-700 text-white text-sm px-3 py-1 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600">
                  Join Group
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Posted: {new Date(post.createdAt).toLocaleString()}
                {post.expiresAt && (
                  <> · Expires: {new Date(post.expiresAt).toLocaleString()}</>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-4">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No active LFG posts for {gameName} at the moment.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
            Create one to find players!
          </p>
        </div>
      )}
    </div>
  );
};

export default GameLFG;