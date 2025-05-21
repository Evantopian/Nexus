"use client"

import { useMutation } from "@apollo/client"
import { ACCEPT_FRIEND_REQUEST, CANCEL_FRIEND_REQUEST, REJECT_FRIEND_REQUEST } from "@/graphql/friends/friendMutations"
import { GET_FRIEND_REQUESTS } from "@/graphql/friends/friendQueries"
import type { User } from "@/contexts/AuthContext"
import { Check, X, Clock } from "lucide-react"

type FriendRequest = {
  sender: User
  receiver: User
  status: string
  requestedAt: string
}

type FriendRequestsProps = {
  received: FriendRequest[]
  sent: FriendRequest[]
}

const FriendRequests = ({ received, sent }: FriendRequestsProps) => {
  const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST, {
    refetchQueries: [{ query: GET_FRIEND_REQUESTS }],
  })
  const [rejectRequest] = useMutation(REJECT_FRIEND_REQUEST, {
    refetchQueries: [{ query: GET_FRIEND_REQUESTS }],
  })
  const [cancelRequest] = useMutation(CANCEL_FRIEND_REQUEST, {
    refetchQueries: [{ query: GET_FRIEND_REQUESTS }],
  })

  return (
    <div className="space-y-10 mt-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Received Requests</h2>
        {received.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {received.map((req, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={req.sender.profileImg || "/default-avatar.png"}
                    alt={req.sender.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-gray-800 dark:text-white font-medium">{req.sender.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(req.requestedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    onClick={() => acceptRequest({ variables: { senderId: req.sender.uuid } })}
                    title="Accept"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    onClick={() => rejectRequest({ variables: { senderId: req.sender.uuid } })}
                    title="Reject"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No received requests.</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Sent Requests</h2>
        {sent.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {sent.map((req, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={req.receiver.profileImg || "/default-avatar.png"}
                    alt={req.receiver.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-gray-800 dark:text-white font-medium">{req.receiver.username}</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Clock size={12} className="mr-1" />
                      <span>{req.status}</span>
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
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No sent requests.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FriendRequests
