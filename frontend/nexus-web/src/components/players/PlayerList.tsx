"use client";

import { useState } from "react";
import type { Player } from "./Players";
import { UserPlus, UserMinus, Shield, Award } from "lucide-react";

type PlayerListProps = {
  players: Player[];
  onAddFriend?: (uuid: string) => void;
  onRemoveFriend?: (uuid: string) => void;
  isFriend?: (uuid: string) => boolean;
  hasSentRequest?: (uuid: string) => boolean;
  loading?: boolean;
};

const getRankColor = (rank: string) => {
  const rankLower = rank.toLowerCase();
  if (rankLower.includes("bronze")) return "text-amber-600";
  if (rankLower.includes("silver")) return "text-gray-400";
  if (rankLower.includes("gold")) return "text-yellow-400";
  if (rankLower.includes("platinum")) return "text-cyan-300";
  if (rankLower.includes("diamond")) return "text-blue-400";
  return "text-gray-400";
};

const getRankIcon = (rank: string) => {
  const rankLower = rank.toLowerCase();
  if (rankLower.includes("diamond")) return <Award className="w-3 h-3 mr-1" />;
  return null;
};

const PlayerList = ({
  players,
  onAddFriend,
  onRemoveFriend,
  isFriend,
  hasSentRequest,
  loading = false,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="p-8 text-center">
        <Shield className="w-12 h-12 mx-auto mb-4 text-gray-600" />
        <p className="text-gray-400">No players found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-gray-700/50">
        {players.map((player) => (
          <div
            key={player.uuid}
            className="flex justify-between items-center p-4 hover:bg-gray-800/80 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 relative">
                <img
                  src={player.profileImg || "/default-avatar.png"}
                  alt={player.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                    player.status === "online"
                      ? "bg-green-500"
                      : player.status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                  title={player.status}
                ></div>
              </div>
              <div>
                <p className="font-medium text-black dark:text-white">
                  {player.username}
                </p>
                <p
                  className={`text-sm flex items-center ${getRankColor(
                    player.rank
                  )}`}
                >
                  {getRankIcon(player.rank)}
                  {player.rank}
                </p>
              </div>
            </div>
            <div>
              {isFriend && onRemoveFriend && isFriend(player.uuid) ? (
                <button
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                  onClick={() => openConfirmModal(player.uuid)}
                >
                  <UserMinus className="w-4 h-4 mr-1.5" />
                  Remove Friend
                </button>
              ) : onAddFriend &&
                hasSentRequest &&
                hasSentRequest(player.uuid) ? (
                <span className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium flex items-center">
                  Request Sent
                </span>
              ) : (
                onAddFriend && (
                  <button
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                    onClick={() => onAddFriend(player.uuid)}
                  >
                    <UserPlus className="w-4 h-4 mr-1.5" />
                    Add Friend
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmUUID && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Confirm Remove Friend
            </h2>
            <p className="mb-6 text-gray-300">
              Are you sure you want to remove this friend?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium text-sm transition-colors"
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
  );
};

export default PlayerList;
