import { Users } from "lucide-react";
import { Player } from "./Party";

interface PartyListProps {
  partyMembers: Player[];
}

const PartyList = ({ partyMembers }: PartyListProps) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      {" "}
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Current Party
        </h2>
        <div className="space-y-3">
          {partyMembers.length > 0 ? (
            partyMembers.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md"
              >
                <img
                  src={m.profileImg || "/default-avatar.png"}
                  alt={m.username}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {m.username}
                </span>
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
