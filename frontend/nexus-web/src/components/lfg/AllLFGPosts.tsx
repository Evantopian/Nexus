import { useQuery } from "@apollo/client";
import { GET_ALL_LFG_POSTS } from "@/graphql/lfgQueries";
import LFGPosts from "../common/LFGPosts";

const AllLFGPosts = () => {
  const { data, loading, error } = useQuery(GET_ALL_LFG_POSTS, {
    variables: { limit: 5, offset: 0 },
  });

  const lfgPostData = data?.getAllLFGPosts || [];

  if (loading) return <p>Loading LFG Posts...</p>;
  if (error) return <p>Error fetching LFG posts: {error.message}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        All LFG Posts
      </h2>
      <LFGPosts posts={lfgPostData} />
    </div>
  );
};

export default AllLFGPosts;
