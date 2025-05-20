import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { serversDummy } from "@/data/MockData";

export interface ServerInfo {
  id: string;
  name: string;
  ownerId: string;
  iconUrl?: string;
  members: ServerMember[];
  roles: Role[];
  channels: Channel[];
  categories: ServerCategory[];
}

interface ServerMember {
  id: string;
  userId: string;
  serverId: string;
  roleIds: string[];
}

interface Role {
  id: string;
  name: string;
  color: string;
}

interface Channel {
  id: string;
  name: string;
  serverId: string;
  categoryId?: string;
  type: "TEXT" | "VOICE";
}

interface ServerCategory {
  id: string;
  name: string;
  serverId: string;
}

interface GameServersProps {
  gameName: string;
}

const GameServers = ({ }: GameServersProps) => {
  const serversScrollRef = useRef<HTMLDivElement>(null);

  // console.log(gameName);

  const serversInfo = serversDummy;

  const scrollServers = (direction: "left" | "right") => {
    if (serversScrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        direction === "left"
          ? serversScrollRef.current.scrollLeft - scrollAmount
          : serversScrollRef.current.scrollLeft + scrollAmount;

      serversScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  // if (loading) return <div>Loading servers...</div>;
  // if (error) return <div>Error loading servers: {error.message}</div>;

  return (
    <div className="mb-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-900/30 dark:to-cyan-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Guilds & Servers
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scrollServers("left")}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scrollServers("right")}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={serversScrollRef}
        className="flex overflow-x-auto pb-4 space-x-4 hide-scrollbar max-w-full"
      >
        {serversInfo.map((server: ServerInfo) => (
          <div
            key={server.id}
            className="flex-shrink-0 w-76 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px]"
          >
            <div className="h-36 bg-gray-200 relative">
              <img
                src={server.iconUrl}
                alt={server.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {server.members.length} members
              </div>
            </div>
            <div className="p-2">
              <h3 className="font-medium truncate-text text-gray-900 dark:text-white">
                {server.name}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border border-white overflow-hidden">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${server.id}a`}
                      alt="user"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="w-6 h-6 rounded-full border border-white overflow-hidden">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${server.id}b`}
                      alt="user"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <button className="text-xs bg-indigo-600 dark:bg-indigo-700 text-white px-2 py-1 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600">
                  Join
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameServers;
