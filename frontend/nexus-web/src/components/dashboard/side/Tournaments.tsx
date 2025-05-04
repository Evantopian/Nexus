import { Trophy as EmojiEventsIcon } from "lucide-react";

interface TournamentProps {
  id: number;
  name: string;
  startsIn: string;
  slots: number;
  prize: string;
}

interface TournamentsProps {
  tournaments: TournamentProps[];
}

const Tournaments = ({ tournaments }: TournamentsProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center text-gray-900 dark:text-white">
        <EmojiEventsIcon className="mr-2" /> Tournaments
      </h3>
      <div className="space-y-3">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors"
          >
            <p className="font-medium text-gray-900 dark:text-white">
              {tournament.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {tournament.startsIn}
            </p>
            <div className="flex items-center mt-2">
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                {tournament.slots} slots
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                {tournament.prize} prize
              </span>
            </div>
          </div>
        ))}
        <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline w-full text-center mt-2">
          View All Tournaments
        </button>
      </div>
    </div>
  );
};

export default Tournaments;