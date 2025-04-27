// temp for now since, jsut testing chat
import { Link } from "react-router-dom";

const ChatSidebar = () => {
  const rooms = [
    { id: "gaming", name: "Gaming Server" },
    { id: "development", name: "Development Hub" },
    { id: "esports", name: "Esports Arena" },
  ];

  const channels = ["general", "group-chat", "announcements"];

  return (
    <div className="w-64 bg-gray-200 dark:bg-gray-800 p-4 h-full flex flex-col gap-4">
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
    </div>
  );
};

export default ChatSidebar;
