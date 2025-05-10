import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ContextMenu, { ContextMenuOption } from "./ContextMenu";
import { MessageStorage, Message } from "@/data/messageStorage";

interface Contact {
  name: string;
  avatarUrl?: string;
  status: "online" | "away" | "offline";
}

const INITIAL_CONTACTS: Contact[] = [
  { name: "Alice", avatarUrl: "/avatars/alice.png", status: "online" },
  { name: "Bob", avatarUrl: "/avatars/bob.png", status: "away" },
  { name: "Charlie", status: "offline" },
];

const statusColor = {
  online: "bg-green-500",
  away: "bg-yellow-500",
  offline: "bg-gray-500",
} as const;

const ChatSidebar: React.FC = () => {
  const { contact: active } = useParams<{ contact: string }>();
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [sortedContacts, setSortedContacts] = useState<
    (Contact & { lastTimestamp: number })[]
  >([]);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  // Recompute sortedContacts whenever contacts list or messages change
  useEffect(() => {
    const msgsMap = MessageStorage.load();
    const withTimestamps = contacts.map((contact) => {
      const topic = `dm:${contact.name}`;
      const msgs: Message[] = msgsMap[topic] || [];
      const lastTimestamp = msgs.length
        ? new Date(msgs[msgs.length - 1].timestamp || 0).getTime()
        : 0;
      return { ...contact, lastTimestamp };
    });
    withTimestamps.sort((a, b) =>
      b.lastTimestamp !== a.lastTimestamp
        ? b.lastTimestamp - a.lastTimestamp
        : a.name.localeCompare(b.name)
    );
    setSortedContacts(withTimestamps);
  }, [contacts]);

  const handleContext = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    const name = e.currentTarget.dataset.name!;
    setSelected(name);
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  const contextOptions: ContextMenuOption[] = selected
    ? [
        {
          label: `Create group chat with ${selected}`,
          onClick: () => alert(`Create group chat with ${selected}`),
        },
      ]
    : [];

  const handleAddFriend = () => {
    const name = prompt("Enter username to add as friend:");
    if (name && !contacts.find((c) => c.name === name)) {
      setContacts((prev) => [...prev, { name, status: "offline" }]);
    }
  };

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col p-4 overflow-y-auto min-h-0">
      <button
        onClick={handleAddFriend}
        className="mb-4 w-full text-sm font-medium text-indigo-600 hover:underline"
      >
        + Add Friend
      </button>

      <input
        type="text"
        placeholder="Search or start new chat"
        className="w-full px-3 py-2 mb-4 bg-gray-200 dark:bg-gray-700 rounded text-sm placeholder-gray-500 focus:outline-none"
      />

      <h2 className="text-xs font-semibold uppercase mb-2 text-gray-600 dark:text-gray-400">
        Direct Messages
      </h2>

      {sortedContacts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          No friends yet. Add one to start chatting.
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-gray-200 dark:divide-gray-700 relative">
          {sortedContacts.map((c) => (
            <li
              key={c.name}
              data-name={c.name}
              onContextMenu={handleContext}
              className="py-2"
            >
              <Link
                to={`/chat/direct/${c.name}`}
                className={`relative flex items-center space-x-3 px-2 py-1 rounded transition-colors ${
                  active === c.name
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <div className="relative">
                  {c.avatarUrl ? (
                    <img
                      src={c.avatarUrl}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white font-medium">
                      {c.name[0]}
                    </div>
                  )}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${statusColor[c.status]}`}
                  />
                </div>
                <span className="flex-1 truncate">{c.name}</span>
              </Link>
            </li>
          ))}

          {menuPos && selected && (
            <ContextMenu
              x={menuPos.x}
              y={menuPos.y}
              options={contextOptions}
              onClose={() => setMenuPos(null)}
            />
          )}
        </ul>
      )}
    </aside>
  );
};

export default ChatSidebar;
