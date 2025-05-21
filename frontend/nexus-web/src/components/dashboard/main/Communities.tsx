import { Users as GroupsIcon } from "lucide-react";
import { ChevronRightIcon } from "lucide-react";

interface CommunityProps {
  id: number;
  image: string;
  name: string;
  memberCount: number;
  onlineCount: number;
  description: string;
}

interface CommunitiesProps {
  communities: CommunityProps[];
}

const Communities = ({ communities }: CommunitiesProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <style>{`
        .transparent-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }

        .transparent-scrollbar::-webkit-scrollbar {
          height: 6px;
        }

        .transparent-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .transparent-scrollbar::-webkit-scrollbar-thumb {
          background-color: transparent;
        }
      `}</style>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
          <GroupsIcon className="mr-2" /> Discover Communities
        </h2>
        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
          See more <ChevronRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="flex overflow-x-auto space-x-4 pb-4 -mx-2 px-2 transparent-scrollbar">
        {communities.map((community) => (
          <div
            key={community.id}
            className="flex-shrink-0 w-72 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-32 w-full bg-gray-200 dark:bg-gray-600 relative">
              <img
                src={community.image}
                alt={`${community.name} banner`}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                {(community.memberCount / 1000).toFixed(1)}k
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate">{community.name}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {community.memberCount} members • {community.onlineCount} online
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                {community.description}
              </p>
              <button className="mt-3 bg-indigo-600 dark:bg-indigo-700 text-white text-xs px-4 py-1 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 w-full">
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Communities;
