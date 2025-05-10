import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_LFG_POSTS, GET_USER_LFG_POSTS } from "@/graphql/lfgQueries";
import UserLfgPosts from "./UserLFGPosts";
import AllLFGPosts from "./AllLFGPosts";

export type LFGPostFormData = {
  gameId: string;
  title: string;
  description: string;
  requirements: string[];
  tags: string[];
  expirationHour: number;
};

// Reorganize which lfgpost component is used (lfgpost for side & lfgpost for user view, all view, and game view)

const Lfg = () => {
  const [activeTab, setActiveTab] = useState<"all" | "user">("all");

  const {
    data: allPostsData,
    loading: allPostsLoading,
    error: allPostsError,
  } = useQuery(GET_ALL_LFG_POSTS, {
    variables: { limit: 5, offset: 0 },
  });

  const {
    data: userPostsData,
    loading: userPostsLoading,
    error: userPostsError,
    refetch: refetchUserPosts,
  } = useQuery(GET_USER_LFG_POSTS, {
    variables: { limit: 5, offset: 0 },
  });

  const allPosts = allPostsData?.getAllLFGPosts || [];
  const userPosts = userPostsData?.getUserLFGPosts || [];

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6 mt-8 text-gray-900 dark:text-white">
        Looking For Group
      </h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Posts
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "user"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
          }`}
          onClick={() => setActiveTab("user")}
        >
          Your Posts
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "user" ? (
          userPostsLoading ? (
            <p>Loading Your LFG Posts...</p>
          ) : userPostsError ? (
            <p className="text-red-500">
              Error fetching your posts: {userPostsError.message}
            </p>
          ) : (
            <UserLfgPosts posts={userPosts} refetch={refetchUserPosts} />
          )
        ) : allPostsLoading ? (
          <p>Loading LFG Posts...</p>
        ) : allPostsError ? (
          <p className="text-red-500">
            Error fetching posts: {allPostsError.message}
          </p>
        ) : (
          <AllLFGPosts posts={allPosts} />
        )}
      </div>
    </div>
  );
};

export default Lfg;
