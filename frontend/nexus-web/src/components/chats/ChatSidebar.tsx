// src/components/chats/ChatSidebar.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

const TEST_UUID = "d18e2a5b-1af8-4180-8270-f4104c73668b";

const GET_CONVERSATIONS = gql`
  query GetConversations {
    getConversations {
      id
      isGroup
    }
  }
`;

const ChatSidebar: React.FC = () => {
  const { data, loading, error } = useQuery(GET_CONVERSATIONS);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Get all DMs (non-group conversations)
  const apiConversations = data?.getConversations?.filter((c: any) => !c.isGroup) || [];

  // Always include TEST_UUID if it's not already in the API data
  const uniqueConversations = [
    ...apiConversations,
    ...(apiConversations.some((c: any) => c.id === TEST_UUID)
      ? []
      : [{ id: TEST_UUID, isGroup: false }])
  ];

  // Apply search filter
  const filtered = uniqueConversations.filter((c: any) =>
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-72 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Chats</h2>
      <input
        type="text"
        placeholder="Search DMs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex-1 overflow-y-auto space-y-1">
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
        ) : error ? (
          <p className="text-sm text-red-500">Failed to load.</p>
        ) : (
          filtered.map((c: any) => (
            <button
              key={c.id}
              onClick={() => navigate(`/chat/direct/${c.id}`)}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-800 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition"
            >
              {c.id === TEST_UUID ? "Dev Contact" : c.id.slice(0, 8)}
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
