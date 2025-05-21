"use client"

import { useState } from "react"
import type { Player } from "./Players"

type PlayerListProps = {
  players: Player[]
  onAddFriend?: (uuid: string) => void
  onRemoveFriend?: (uuid: string) => void
  isFriend?: (uuid: string) => boolean
}

const PlayerList = ({ players, onAddFriend, onRemoveFriend, isFriend }: PlayerListProps) => {
  const [confirmUUID, setConfirmUUID] = useState<string | null>(null)

  const openConfirmModal = (uuid: string) => {
    setConfirmUUID(uuid)
  }

  const closeConfirmModal = () => {
    setConfirmUUID(null)
  }

  const confirmRemove = () => {
    if (confirmUUID && onRemoveFriend) {
      onRemoveFriend(confirmUUID)
    }
    closeConfirmModal()
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
        {players.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {players.map((player) => (
              <li
                key={player.uuid}
                className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={player.profileImg || "/default-avatar.png"}
                      alt={player.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                        player.status === "online"
                          ? "bg-green-500"
                          : player.status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                      }`}
                    ></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{player.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {player.rank} • {player.status}
                    </p>
                  </div>
                </div>
                <div>
                  {isFriend && onRemoveFriend ? (
                    isFriend(player.uuid) ? (
                      <button
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                        onClick={() => openConfirmModal(player.uuid)}
                      >
                        Remove Friend
                      </button>
                    ) : (
                      onAddFriend && (
                        <button
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
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
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No players found.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmUUID && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl max-w-sm w-full border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Confirm Remove Friend</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Are you sure you want to remove this friend?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PlayerList
