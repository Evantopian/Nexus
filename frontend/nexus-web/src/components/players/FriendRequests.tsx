"use client"

import { useMutation } from "@apollo/client"
import { ACCEPT_FRIEND_REQUEST, CANCEL_FRIEND_REQUEST, REJECT_FRIEND_REQUEST } from "@/graphql/friends/friendMutations"
import { GET_FRIEND_REQUESTS } from "@/graphql/friends/friendQueries"
import type { User } from "@/contexts/AuthContext"
import { Check, X, Clock, UserCheck, UserX, Shield } from "lucide-react"

type FriendRequest = {
  sender: User
  receiver: User
  status: string
  requestedAt: string
}

type FriendRequestsProps = {
  received: FriendRequest[]
  sent: FriendRequest[]
  loading?: boolean
}

const FriendRequests = ({ received, sent, loading = false }: FriendRequestsProps) => {
  const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST, {
    refetchQueries: [{ query: GET_FRIEND_REQUESTS }],
  })
  const [rejectRequest] = useMutation(REJECT_FRIEND_REQUEST, {
    refetchQueries: [{ query: GET_FRIEND_REQUESTS }],
  })
  const [cancelRequest] = useMutation(CANCEL_FRIEND_REQUEST, {
    refetchQueries: [{ query: GET_FRIEND_REQUESTS }],
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (received.length === 0 && sent.length === 0) {
    return (
      <div className="p-8 text-center">
        <Shield className="w-12 h-12 mx-auto mb-4 text-gray-600" />
        <p className="text-gray-400">No friend requests found.</p>
      </div>
    )
  }

  const formatRequestTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    return date.toLocaleDateString()
  }

  return (
    <div>
      {received.length > 0 && (
        <div className="mb-6">
          <div className="p-3 bg-gray-800/80 border-b border-gray-700 flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-blue-400" />
            <h2 className="text-base font-bold text-white">Received Requests</h2>
          </div>
          <div className="divide-y divide-gray-700/50">
            {received.map((req, index) => (
              <div key={index} className="p-4 hover:bg-gray-800/80 flex justify-between items-center transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={req.sender.profileImg || "/default-avatar.png"}
                      alt={req.sender.username}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  </div>
                  <div>
                    <p className="text-white font-medium">{req.sender.username}</p>
                    <p className="text-xs text-gray-400">{formatRequestTime(req.requestedAt)}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    onClick={() => acceptRequest({ variables: { senderId: req.sender.uuid } })}
                    title="Accept"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    onClick={() => rejectRequest({ variables: { senderId: req.sender.uuid } })}
                    title="Reject"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sent.length > 0 && (
        <div>
          <div className="p-3 bg-gray-800/80 border-b border-gray-700 flex items-center">
            <UserX className="w-5 h-5 mr-2 text-blue-400" />
            <h2 className="text-base font-bold text-white">Sent Requests</h2>
          </div>
          <div className="divide-y divide-gray-700/50">
            {sent.map((req, index) => (
              <div key={index} className="p-4 hover:bg-gray-800/80 flex justify-between items-center transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={req.receiver.profileImg || "/default-avatar.png"}
                      alt={req.receiver.username}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-gray-800"></div>
                  </div>
                  <div>
                    <p className="text-white font-medium">{req.receiver.username}</p>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <Clock size={12} className="mr-1" />
                      <span>{formatRequestTime(req.requestedAt)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  {req.status === "pending" && (
                    <button
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                      onClick={() =>
                        cancelRequest({
                          variables: { receiverId: req.receiver.uuid },
                        })
                      }
                      title="Cancel Friend Request"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FriendRequests
