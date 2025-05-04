import { User as UserIcon } from "lucide-react";
import { ChevronRightIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  // Handle loading or missing user data
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-12">
      <div className="flex items-center mb-6">
        <img
          src={user.profileImg || "/default-avatar.png"} // Default avatar if none exists
          alt={user.username || "User Avatar"}
          className="w-24 h-24 rounded-full border-2 border-gray-200 dark:border-gray-600 mr-4"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {user.username || "User Name"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            @{user.username || "username"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Status: {user.status || "offline"}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bio</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {user.profileMessage || "No bio available"}
        </p>
      </div>

      <div className="flex justify-between mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Reputation</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.reputation || 0}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Rank</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.rank || "N/A"}
          </p>
        </div>
      </div>

      {/* Recent Activity Feed (Just an Example) */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
          See more <ChevronRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-3" />
          <p className="text-sm text-gray-800 dark:text-gray-300">
            {user.username} liked your post.
          </p>
        </div>
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-3" />
          <p className="text-sm text-gray-800 dark:text-gray-300">
            {user.username} commented on your photo.
          </p>
        </div>
        {/* Add more activity items as needed */}
      </div>
    </div>
  );
};

export default Profile;
