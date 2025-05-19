import { useMutation } from "@apollo/client";
import { DELETE_LFG_POST } from "@/graphql/lfgQueries";
import LFGForm from "./LFGForm";
import { useState } from "react";
import { LFGPostFormData } from "./LFG";

interface LFGPost extends LFGPostFormData {
  id: string;
}

interface UserLFGPostsProps {
  posts: LFGPost[];
  refetch: () => void;
  refetchAll: () => void;
}

const UserLFGPosts: React.FC<UserLFGPostsProps> = ({
  posts,
  refetch,
  refetchAll,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteLfgPost] = useMutation(DELETE_LFG_POST);

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<LFGPost | null>(null);
  const [canEdit, setCanEdit] = useState(false);

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    await deleteLfgPost({ variables: { postId: confirmDeleteId } });
    setConfirmDeleteId(null); // close modal
    refetch();
    refetchAll();
  };

  const handleEditClick = (post: LFGPost) => {
    setEditData(post);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditData(null);
    setShowForm(false);
    refetch();
    refetchAll();
  };

  return (
    <div className="space-y-6">
      {showForm ? (
        <LFGForm initialData={editData!} onClose={handleFormClose} />
      ) : (
        <div className="flex gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Create New LFG
          </button>
          <button
            onClick={() => setCanEdit((prev) => !prev)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            {canEdit ? "Finish" : "Edit LFGs"}
          </button>
        </div>
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
              <div className="flex items-center mt-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full ${
                      index > 0 ? "ml-1" : ""
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {canEdit && (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleEditClick(post)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(post.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300">
            No posts available.
          </p>
        )}
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this post?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLFGPosts;
