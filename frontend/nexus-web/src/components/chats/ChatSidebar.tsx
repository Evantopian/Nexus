import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const DEV_USER_ID = "32673fee-5280-4134-a5f9-e339532bd7f9";

const GET_USER = gql`
  query GetUser($userId: UUID!) {
    getUser(userId: $userId) {
      uuid
      username
      profileImg
    }
  }
`;

const ChatSidebar: React.FC = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId: DEV_USER_ID } // ✅ correct key name
  });

  if (loading) {
    return <p className="p-4 text-gray-500">Loading dev contact…</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">Error: {error.message}</p>;
  }

  const user = data?.getUser;
  if (!user) {
    return <p className="p-4 text-red-500">Dev user not found.</p>;
  }

  return (
    <aside className="w-60 border-r p-4 bg-white dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-4">Contacts</h2>
      <button
        onClick={() => navigate(`/chat/direct/${user.uuid}`)}
        className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
      >
        {user.profileImg ? (
          <img
            src={user.profileImg}
            alt={`${user.username}'s avatar`}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300" />
        )}
        <span className="text-sm font-medium">{user.username}</span>
      </button>
    </aside>
  );
};

export default ChatSidebar;
