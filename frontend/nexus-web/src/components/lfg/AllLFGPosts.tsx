interface LFGPostProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: {
    username: string;
    profileImg: string;
  };
}

interface AllLFGPostsProps {
  posts: LFGPostProps[];
}

const AllLFGPosts = ({ posts }: AllLFGPostsProps) => {
  return (
    <div className="space-y-6">
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
              <div className="flex items-center mt-4">
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

export default AllLFGPosts;
