import { useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  ADD_PARTICIPANT_TO_GROUP_CONVERSATION,
  START_CONVERSATION_LFG,
} from "@/graphql/chat/dm.graphql";
import { useAuth } from "@/contexts/AuthContext";
import { UPDATE_LFG_CONVERSATION } from "@/graphql/lfg/lfgMutations";
import { GET_LFG } from "@/graphql/lfg/lfgQueries";

interface LFGPostProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  authorId: string;
  conversationId?: string | null;
  author: {
    username: string;
    profileImg: string;
  };
}

interface AllLFGPostsProps {
  posts: LFGPostProps[];
}

const AllLFGPosts = ({ posts }: AllLFGPostsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [startConversation] = useMutation(START_CONVERSATION_LFG);
  const [addParticipant] = useMutation(ADD_PARTICIPANT_TO_GROUP_CONVERSATION);
  const [updateLFGConversation] = useMutation(UPDATE_LFG_CONVERSATION);
  const [getLFGPost] = useLazyQuery(GET_LFG);

  const handleJoinChat = async (post: LFGPostProps) => {
    if (!user?.uuid) return;

    try {
      // Fetch latest post including conversationId
      const { data: postData } = await getLFGPost({
        variables: { postId: post.id },
      });

      if (!postData?.getLFG) {
        throw new Error("Post not found");
      }

      const conversationId = postData.getLFG.conversationId;

      if (!conversationId) {
        // No conversation exists — create one
        const { data: startData } = await startConversation({
          variables: {
            participantIds: [user.uuid, post.authorId],
            isGroup: true,
          },
        });

        const newId = startData?.startConversation?.id;
        if (!newId) throw new Error("Failed to start conversation");

        await updateLFGConversation({
          variables: {
            postId: post.id,
            conversationId: newId,
          },
        });

        return navigate(`/chat/groups/${newId}`);
      }

      // Conversation exists — try to add participant
      try {
        await addParticipant({
          variables: {
            conversationId,
            participantId: user.uuid,
          },
        });
      } catch (err: any) {
        if (
          err.message.includes("user is already a participant") ||
          err.message.includes("already a participant")
        ) {
          // ignore these errors
        } else if (err.message.includes("the requested element is null")) {
          // ignore this schema null error temporarily
        } else {
          throw err; // rethrow unexpected errors
        }
      }

      navigate(`/chat/groups/${conversationId}`);
    } catch (error) {
      console.error("Error joining chat:", error);
    }
  };

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
              <button
                onClick={() => handleJoinChat(post)}
                className="mt-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Join Group Chat
              </button>
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
