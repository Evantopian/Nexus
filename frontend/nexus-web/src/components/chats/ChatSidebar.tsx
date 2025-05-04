import { Link } from "react-router-dom";

const ChatSidebar = () => {
  const rooms = [
    { id: "gaming", name: "Gaming Server" },
    { id: "development", name: "Development Hub" },
    { id: "esports", name: "Esports Arena" },
  ];

  const channels = ["general", "group-chat", "announcements"];


  // just for local testing, delete later
  const clearMessages = () => {
    localStorage.removeItem("chat_messages");
    window.location.reload(); 
  };

  return (
    <div className="w-64 bg-gray-200 dark:bg-gray-800 p-4 h-full flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Rooms</h2>
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li key={room.id}>
              <span className="block font-semibold">{room.name}</span>
              <ul className="pl-4">
                {channels.map((channel) => (
                  <li key={channel}>
                    <Link
                      to={`/chat/${room.id}/${channel}`}
                      className="text-sm hover:underline hover:text-blue-500"
                    >
                      #{channel}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* clering local storage*/}
      <div className="mt-auto">
        <button
          onClick={clearMessages}
          className="w-full p-2 mt-4 text-sm text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition"
        >
          Clear Chat History
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;

