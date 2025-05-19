import { useState } from "react";
import { Player } from "./Players";

type PlayerListProps = {
  players: Player[];
  onAddFriend?: (uuid: string) => void;
  onRemoveFriend?: (uuid: string) => void;
  isFriend?: (uuid: string) => boolean;
};

const PlayerList = ({
  players,
  onAddFriend,
  onRemoveFriend,
  isFriend,
}: PlayerListProps) => {
  const [confirmUUID, setConfirmUUID] = useState<string | null>(null);

  const openConfirmModal = (uuid: string) => {
    setConfirmUUID(uuid);
  };

  const closeConfirmModal = () => {
    setConfirmUUID(null);
  };

  const confirmRemove = () => {
    if (confirmUUID && onRemoveFriend) {
      onRemoveFriend(confirmUUID);
    }
    closeConfirmModal();
  };

  return (
    <>
      <ul>
        {players.map((player) => (
          <li
            key={player.uuid}
            className="flex justify-between items-center p-4 border-b"
          >
            <div>
              <p className="font-semibold">{player.username}</p>
              <p>
                {player.rank} - {player.status}
              </p>
            </div>
            <div>
              {isFriend && onRemoveFriend ? (
                isFriend(player.uuid) ? (
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => openConfirmModal(player.uuid)}
                  >
                    Remove Friend
                  </button>
                ) : (
                  onAddFriend && (
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded"
                      onClick={() => onAddFriend(player.uuid)}
                    >
                      Add Friend
                    </button>
                  )
                )
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {/* Confirmation Modal */}
      {confirmUUID && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Confirm Remove Friend
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to remove this friend?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerList;
