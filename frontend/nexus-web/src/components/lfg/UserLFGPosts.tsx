import { useMutation } from "@apollo/client";
import { DELETE_LFG_POST } from "@/graphql/lfgQueries";
import LFGForm from "./LFGForm";
import { useState } from "react";
import { LFGPostFormData } from "./LFGForm";

// Define types for the posts and the refetch function
interface LfgPost extends LFGPostFormData {
  id: string;
}

interface UserLfgPostsProps {
  posts: LfgPost[];
  refetch: () => void;
}

const UserLfgPosts: React.FC<UserLfgPostsProps> = ({ posts, refetch }) => {
  const [deleteLfgPost] = useMutation(DELETE_LFG_POST);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<LfgPost | null>(null);

  const handleDelete = async (id: string) => {
    // console.log(id); // Make sure id is the correct value
    await deleteLfgPost({ variables: { postId: id } }); // Pass postId here
    refetch(); // Refetch posts after deleting
  };

  const handleEdit = (post: LfgPost) => {
    setEditData(post);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditData(null);
    setShowForm(false);
    refetch(); // Refetch posts after editing
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Your LFG Posts
      </h2>
      {showForm ? (
        <LFGForm initialData={editData!} onClose={handleFormClose} />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
        >
          Create New LFG
        </button>
      )}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-6 border-2 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md transition-all duration-300 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {post.description}
              </p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleEdit(post)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300">
            No posts available.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserLfgPosts;
