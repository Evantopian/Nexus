import { MessageCircle as ChatIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LFGPostProps {
  id: number;
  title: string;
  author: {
    username: string;
    profileImg: string;
  };
  tags: string[];
}

interface LFGPostsProps {
  posts: LFGPostProps[];
}

const LFGPosts = ({ posts }: LFGPostsProps) => {
  const navigate = useNavigate();
  // console.log(posts);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center text-gray-900 dark:text-white">
        <ChatIcon className="mr-2" /> LFG Posts
      </h3>
      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors"
          >
            <p className="font-medium text-gray-900 dark:text-white">
              {post.title}
            </p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Posted by{" "}
              </span>
              <img
                src={post.author.profileImg || "/default-avatar.png"}
                alt={`${post.author.username}'s avatar`}
                className="h-4 w-4 rounded-full mx-1"
              />
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {post.author.username}
              </span>
            </div>
            <div className="flex items-center mt-2">
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
          </div>
        ))}
        <button
          onClick={() => navigate("/lfg")}
          className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline w-full text-center mt-2"
        >
          View More LFG Posts
        </button>
      </div>
    </div>
  );
};

export default LFGPosts;
