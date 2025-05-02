import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_LFG_POSTS } from "@/graphql/lfgQueries";
import LFGPosts from "../common/LFGPosts";
import LfgForm from "./LFGForm";

const Lfg = () => {
  const [showForm, setShowForm] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_ALL_LFG_POSTS, {
    variables: { limit: 5, offset: 0 },
  });

  const lfgPostData = data?.getAllLFGPosts || [];

  const handleCreateLfgPost = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    refetch(); // Refetch the posts after closing the form
  };

  if (loading) return <p>Loading LFG Posts...</p>;
  if (error) return <p>Error fetching LFG posts: {error.message}</p>;

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4 mt-8 text-gray-900 dark:text-white">
        Looking For Group
      </h1>

      {showForm ? (
        <div className="mb-6">
          <LfgForm onClose={handleCloseForm} />
        </div>
      ) : (
        <button
          onClick={handleCreateLfgPost}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Create LFG Post
        </button>
      )}

      <LFGPosts posts={lfgPostData} />
    </div>
  );
};

export default Lfg;
