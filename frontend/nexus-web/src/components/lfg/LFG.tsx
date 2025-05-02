import { useQuery } from "@apollo/client";
import { GET_ALL_LFG_POSTS, GET_USER_LFG_POSTS } from "@/graphql/lfgQueries";
import LFGPosts from "../common/LFGPosts";
import UserLfgPosts from "./UserLFGPosts";

// Need to organize types, maybe make 2 tabs (separate views)
// Reorganize which lfgpost component is used (lfgpost for side & lfgpost for user view, all view, and game view)

const Lfg = () => {
  // Fetch all LFG posts (public posts)
  const {
    data: allPostsData,
    loading: allPostsLoading,
    error: allPostsError,
  } = useQuery(GET_ALL_LFG_POSTS, {
    variables: { limit: 5, offset: 0 },
  });

  // Fetch user's own LFG posts
  const {
    data: userPostsData,
    loading: userPostsLoading,
    error: userPostsError,
    refetch: refetchUserPosts,
  } = useQuery(GET_USER_LFG_POSTS, {
    variables: { limit: 5, offset: 0 },
  });

  // Extract data
  const allPosts = allPostsData?.getAllLFGPosts || [];
  const userPosts = userPostsData?.getUserLFGPosts || [];

  console.log("User posts", userPosts);

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6 mt-8 text-gray-900 dark:text-white">
        Looking For Group
      </h1>

      {/* User's Own LFG Posts */}
      <section className="mb-10">
        {userPostsLoading ? (
          <p>Loading Your LFG Posts...</p>
        ) : userPostsError ? (
          <p className="text-red-500">
            Error fetching your posts: {userPostsError.message}
          </p>
        ) : (
          <UserLfgPosts posts={userPosts} refetch={refetchUserPosts} />
        )}
      </section>

      {/* All Public LFG Posts */}
      <section>
        {allPostsLoading ? (
          <p>Loading LFG Posts...</p>
        ) : allPostsError ? (
          <p className="text-red-500">
            Error fetching posts: {allPostsError.message}
          </p>
        ) : (
          <LFGPosts posts={allPosts} />
        )}
      </section>
    </div>
  );
};

export default Lfg;
