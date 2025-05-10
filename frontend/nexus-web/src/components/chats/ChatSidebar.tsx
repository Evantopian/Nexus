// ChatSidebar.tsx
import { Link } from "react-router-dom";

const ChatSidebar: React.FC = () => {
  const rooms = [
    { id: "gaming", name: "Gaming Server" },
    { id: "development", name: "Development Hub" },
    { id: "esports", name: "Esports Arena" },
  ];
  const channels = ["general", "group-chat", "announcements"];

  const clearMessages = () => {
    localStorage.removeItem("chat_messages");
    window.location.reload();
  };

  return (
    <aside className="w-72 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 flex flex-col border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
      <div className="sticky top-0 bg-inherit py-2">
        <h2 className="text-lg font-semibold">Servers</h2>
      </div>

      <ul className="flex-1 space-y-5 mt-4">
        {rooms.map((room) => (
          <li key={room.id}>
            <div className="text-base font-medium text-blue-600 dark:text-blue-400 mb-2">
              {room.name}
            </div>
            <ul className="ml-4 space-y-1">
              {channels.map((channel) => (
                <li key={channel}>
                  <Link
                    to={`/chat/${room.id}/${channel}`}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    # {channel}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <button
        onClick={clearMessages}
        className="mt-6 py-2 w-full text-sm text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded hover:bg-red-600 hover:text-white transition"
      >
        Clear Chat History
      </button>
    </aside>
  );
};

export default ChatSidebar;