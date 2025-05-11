import { Users, ThumbsUp, ThumbsDown, UserCircle } from "lucide-react";
import { Player } from "./Party";

interface PartyListProps {
  partyMembers: Player[];
  onHonor: (userId: string) => void;
  onDislike: (userId: string) => void;
  onViewProfile: (userId: string) => void;
}

const PartyList = ({
  partyMembers,
  onHonor,
  onDislike,
  onViewProfile,
}: PartyListProps) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Current Party
        </h2>
        <div className="space-y-3">
          {partyMembers.length > 0 ? (
            partyMembers.map((m) => (
              <div
                key={m.id}
                className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md"
              >
                <img
                  src={m.profileImg || "/default-avatar.png"}
                  alt={m.username}
                  className="h-10 w-10 rounded-full object-cover"
                />
                {/* Name on top */}
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {m.username}
                </span>

                {/* Buttons stacked below */}
                <div className="flex gap-2 mt-2">
                  {/* Honor Button */}
                  <button
                    onClick={() => onHonor(m.id)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-1"
                  >
                    <ThumbsUp size={16} />
                  </button>
                  {/* Dislike Button */}
                  <button
                    onClick={() => onDislike(m.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm flex items-center gap-1"
                  >
                    <ThumbsDown size={16} />
                  </button>
                  {/* View Profile Button */}
                  <button
                    onClick={() => onViewProfile(m.id)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1"
                  >
                    <UserCircle size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg dark:border-gray-700 bg-gray-100 dark:bg-gray-700 h-48">
              <Users size={32} className="text-gray-400 mb-2" />
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Your party is empty. <br />
                Invite players to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartyList;
