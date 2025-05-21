"use client"

import { ThumbsUp, ThumbsDown, UserCircle, UserMinus, Crown, Plus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"
import CreatePartyModal from "./modals/CreatePartyModal"
import DeletePartyModal from "./modals/DeletePartyModal"
import KickConfirmModal from "./modals/KickConfirmModal"

interface Leader {
  uuid: string
  username: string
}

interface Member {
  uuid: string
  username: string
  email: string
  profileImg?: string | null
}

interface Party {
  id: string
  name: string
  leaderId: string
  leader: Leader
  members: Member[]
  maxMembers: number
  createdAt: string
}

interface PartyListProps {
  partyData: Party | null | undefined
  onCreateParty: (partyName: string) => void
  onDeleteParty: (partyId: string) => void
  onHonor: (userId: string) => void
  onDislike: (userId: string) => void
  onViewProfile: (userId: string) => void
  onKick: (userId: string) => void
  loading: boolean
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
  const { user } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [kickConfirmId, setKickConfirmId] = useState<string | null>(null)

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>  
    )
  }

  // Show no party/create party button
  if (!partyData) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <h3 className="text-base font-semibold mb-2">Make Party</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1"
          >
            <Plus size={14} />
            Create Party
          </button>
        </div>

        <CreatePartyModal show={showCreateModal} onCreate={onCreateParty} onClose={() => setShowCreateModal(false)} />
      </>
    )
  }

  const { id: partyId, name: _partyName, leaderId, members: partyMembers } = partyData

  const confirmKick = (userId: string) => {
    setKickConfirmId(userId)
  }

  const handleKick = () => {
    if (kickConfirmId) {
      onKick(kickConfirmId)
      setKickConfirmId(null)
    }
  }

  const cancelKick = () => setKickConfirmId(null)

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold">Make Party</h3>
        {leaderId === user?.uuid && (
          <button
            onClick={() => setDeleteConfirm("delete")}
            className="px-3 py-1 bg-indigo-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Disband
          </button>
        )}
      </div>

      <div className="space-y-2">
        {partyMembers.length > 0 ? (
          partyMembers.map((m) => (
            <div key={m.uuid} className="flex items-center p-2 bg-gray-700/50 rounded-lg border border-gray-700">
              <div className="relative mr-2">
                <img
                  src={m.profileImg || "/default-avatar.png"}
                  alt={m.username}
                  className="h-8 w-8 rounded-full object-cover border-2 border-gray-600"
                />
                {m.uuid === leaderId && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 p-0.5 rounded-full">
                    <Crown size={8} className="text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <span className="font-medium text-sm truncate">{m.username}</span>
                  {m.uuid === leaderId && (
                    <span className="ml-1 text-xs bg-amber-500 text-white px-1 py-0.5 rounded-full">Leader</span>
                  )}
                </div>
              </div>

              {!(m.uuid === user?.uuid) && (
                <div className="flex gap-1 ml-1">
                  <button
                    onClick={() => onHonor(m.uuid)}
                    className="p-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center transition-colors"
                    title="Honor Player"
                  >
                    <ThumbsUp size={12} />
                  </button>
                  <button
                    onClick={() => onDislike(m.uuid)}
                    className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm flex items-center transition-colors"
                    title="Dislike Player"
                  >
                    <ThumbsDown size={12} />
                  </button>
                  <button
                    onClick={() => onViewProfile(m.uuid)}
                    className="p-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm flex items-center transition-colors"
                    title="View Profile"
                  >
                    <UserCircle size={12} />
                  </button>

                  {user?.uuid === leaderId && m.uuid !== leaderId && (
                    <button
                      onClick={() => confirmKick(m.uuid)}
                      className="p-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm flex items-center transition-colors"
                      title="Kick Player"
                    >
                      <UserMinus size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-700/30 h-20">
            <p className="text-gray-400 text-center text-xs">Your party is empty. Invite some players!</p>
          </div>
        )}
      </div>

      <DeletePartyModal
        show={!!deleteConfirm}
        onConfirm={() => {
          onDeleteParty(partyId || "")
          setDeleteConfirm(null)
        }}
        onCancel={() => setDeleteConfirm(null)}
        message="Are you sure you want to disband this party? This action cannot be undone."
      />

      <KickConfirmModal show={!!kickConfirmId} onConfirm={() => handleKick()} onCancel={() => cancelKick()} />
    </div>
  )
}

export default PartyList
