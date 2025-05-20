import {
  Users,
  ThumbsUp,
  ThumbsDown,
  UserCircle,
  UserMinus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import CreatePartyModal from "./modals/CreatePartyModal";
import DeletePartyModal from "./modals/DeletePartyModal";
import KickConfirmModal from "./modals/KickConfirmModal";

interface Leader {
  uuid: string;
  username: string;
}

interface Member {
  uuid: string;
  username: string;
  email: string;
  profileImg?: string | null;
}

interface Party {
  id: string;
  name: string;
  leaderId: string;
  leader: Leader;
  members: Member[];
  maxMembers: number;
  createdAt: string;
}

interface PartyListProps {
  partyData: Party | null | undefined;
  onCreateParty: (partyName: string) => void;
  onDeleteParty: (partyId: string) => void;
  onHonor: (userId: string) => void;
  onDislike: (userId: string) => void;
  onViewProfile: (userId: string) => void;
  onKick: (userId: string) => void;
  loading: boolean;
}

const PartyList = ({
  partyData,
  onCreateParty,
  onDeleteParty,
  onHonor,
  onDislike,
  onViewProfile,
  onKick,
  loading,
}: PartyListProps) => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [kickConfirmId, setKickConfirmId] = useState<string | null>(null);

  // Need to properly handle honor/dislike & profile left

  // Show loading while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show no party/create party button
  if (!partyData) {
    return (
      <>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Current Party
        </h2>
        <div className="flex flex-col items-center justify-center p-6 border rounded-lg dark:border-gray-700 bg-gray-100 dark:bg-gray-700 h-56 max-w-sm mx-auto">
          <Users size={32} className="text-gray-400 mb-2" />
          <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
            You are not in a party. <br />
            Create a party or join one!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
          >
            Create Party
          </button>
        </div>

        <CreatePartyModal
          show={showCreateModal}
          onCreate={onCreateParty}
          onClose={() => setShowCreateModal(false)}
        />
      </>
    );
  }

  const {
    id: partyId,
    name: partyName,
    leaderId,
    members: partyMembers,
  } = partyData;

  const confirmKick = (userId: string) => {
    setKickConfirmId(userId);
  };

  const handleKick = () => {
    if (kickConfirmId) {
      onKick(kickConfirmId);
      setKickConfirmId(null);
    }
  };

  const cancelKick = () => setKickConfirmId(null);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-full max-w-md">
        <h2 className="flex justify-center items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          {partyName || "Current Party"}
          <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
            ({partyMembers.length}/{partyData.maxMembers})
          </span>
        </h2>

        <div className="space-y-3">
          {leaderId === user?.uuid && (
            <div className="mt-2 flex justify-center">
              <button
                onClick={() => setDeleteConfirm("delete")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                title="Delete Party"
              >
                Disband Party
              </button>
            </div>
          )}

          {partyMembers.length > 0 ? (
            partyMembers.map((m) => (
              <div
                key={m.uuid}
                className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md"
              >
                <img
                  src={m.profileImg || "/default-avatar.png"}
                  alt={m.username}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  {m.username}
                  {m.uuid === leaderId && (
                    <span className="text-xs bg-indigo-700 text-white px-2 py-0.5 rounded-full">
                      Leader
                    </span>
                  )}
                </span>

                {!(m.uuid === user?.uuid) && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => onHonor(m.uuid)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-1"
                      title="Honor Player"
                    >
                      <ThumbsUp size={16} />
                    </button>
                    <button
                      onClick={() => onDislike(m.uuid)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm flex items-center gap-1"
                      title="Dislike Player"
                    >
                      <ThumbsDown size={16} />
                    </button>
                    <button
                      onClick={() => onViewProfile(m.uuid)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1"
                      title="View Profile"
                    >
                      <UserCircle size={16} />
                    </button>

                    {user?.uuid === leaderId && m.uuid !== leaderId && (
                      <button
                        onClick={() => confirmKick(m.uuid)}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm flex items-center gap-1"
                        title="Kick Player"
                      >
                        <UserMinus size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg dark:border-gray-700 bg-gray-100 dark:bg-gray-700 h-56">
              <Users size={32} className="text-gray-400 mb-2" />
              <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                No members in this party.
              </p>
            </div>
          )}
        </div>

        <DeletePartyModal
          show={!!deleteConfirm}
          onConfirm={() => {
            onDeleteParty(partyId || "");
            setDeleteConfirm(null);
          }}
          onCancel={() => setDeleteConfirm(null)}
          message="Are you sure you want to disband this party? This action cannot be undone."
        />

        <KickConfirmModal
          show={!!kickConfirmId}
          onConfirm={() => handleKick()}
          onCancel={() => cancelKick()}
        />
      </div>
    </div>
  );
};

export default PartyList;
