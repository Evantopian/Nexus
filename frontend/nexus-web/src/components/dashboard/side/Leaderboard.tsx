import { BarChart as LeaderboardIcon } from "lucide-react";

interface LeaderProps {
  id: number;
  rank: number;
  avatar: string;
  username: string;
  points: number;
}

interface LeaderboardProps {
  leaders: LeaderProps[];
}

const Leaderboard = ({ leaders }: LeaderboardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center text-gray-900 dark:text-white">
        <LeaderboardIcon className="mr-2" /> Leaderboards
      </h3>
      <div className="space-y-3">
        {leaders.map((leader) => (
          <div
            key={leader.id}
            className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <span className="font-bold text-gray-500 dark:text-gray-400 w-6">
              {leader.rank}.
            </span>
            <img
              src={leader.avatar}
              alt={`${leader.username}'s avatar`}
              className="h-8 w-8 rounded-full mr-2"
            />
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-900 dark:text-white">
                {leader.username}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {leader.points} points
              </p>
            </div>
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              #{leader.rank}
            </div>
          </div>
        ))}
        <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline w-full text-center mt-2">
          View Full Leaderboard
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
