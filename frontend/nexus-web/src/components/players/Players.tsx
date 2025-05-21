"use client"

import { useMutation, useQuery } from "@apollo/client"
import { useState} from "react"
import { GET_FRIENDS, GET_FRIEND_REQUESTS } from "@/graphql/friends/friendQueries"
import { REMOVE_FRIEND, SEND_FRIEND_REQUEST } from "@/graphql/friends/friendMutations"
import { GET_ALL_USERS } from "@/graphql/user/userQueries"
import PlayerList from "./PlayerList"
import FriendRequests from "./FriendRequests"
import { useAuth } from "@/contexts/AuthContext"
import { Users, UserPlus, Clock } from "lucide-react"

export type Player = {
  id: string
  uuid: string
  username: string
  email: string
  profileImg: string | null
  status: string
  rank: string
}

const Players = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"all" | "friends" | "requests">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [displayCount, setDisplayCount] = useState(10)

  const { data: allUsersData, loading: allUsersLoading} = useQuery(GET_ALL_USERS, {
    variables: { limit: 40, offset: 0 },
  })

  const { data: friendsData, loading: friendsLoading } = useQuery(GET_FRIENDS, {
    variables: { userId: user?.uuid },
    skip: !user?.uuid,
  })

  const { data: requestsData, loading: requestsLoading } = useQuery(GET_FRIEND_REQUESTS, {
    variables: { userId: user?.uuid },
    skip: !user?.uuid,
  })

  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST, {
    refetchQueries: [{ query: GET_FRIEND_REQUESTS, variables: { userId: user?.uuid } }],
  })

  const [removeFriend] = useMutation(REMOVE_FRIEND, {
    refetchQueries: [{ query: GET_FRIENDS, variables: { userId: user?.uuid } }],
  })

  const allUsers = allUsersData?.getAllUsers || []
  const friends = friendsData?.getFriends || []
  const friendRequests = requestsData?.getFriendRequests || { received: [], sent: [] }

  const filteredUsers = allUsers
    .filter((user: Player) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, displayCount)

  const isFriend = (uuid: string) => {
    return friends.some((friend: Player) => friend.uuid === uuid)
  }

  const hasSentRequest = (uuid: string) => {
    return friendRequests.sent?.some((request: any) => request.receiver.uuid === uuid)
  }

  const handleAddFriend = (uuid: string) => {
    if (user?.uuid) {
      sendFriendRequest({ variables: { senderId: user.uuid, receiverId: uuid } })
    }
  }

  const handleRemoveFriend = (uuid: string) => {
    if (user?.uuid) {
      removeFriend({ variables: { userId: user.uuid, friendId: uuid } })
    }
  }

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 10)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Players</h1>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex space-x-2">
            {["all", "friends", "requests"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span className="flex items-center">
                  {tab === "all" && <Users className="w-4 h-4 mr-2" />}
                  {tab === "friends" && <UserPlus className="w-4 h-4 mr-2" />}
                  {tab === "requests" && <Clock className="w-4 h-4 mr-2" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
          {activeTab === "all" && (
            <>
              <PlayerList
                players={filteredUsers}
                onAddFriend={handleAddFriend}
                onRemoveFriend={handleRemoveFriend}
                isFriend={isFriend}
                hasSentRequest={hasSentRequest}
                loading={allUsersLoading}
              />
              {displayCount < allUsers.length && (
                <div className="flex justify-center p-4">
                  <button
                    onClick={handleShowMore}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Show More
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "friends" && (
            <PlayerList
              players={friends}
              onRemoveFriend={handleRemoveFriend}
              isFriend={() => true}
              loading={friendsLoading}
            />
          )}

          {activeTab === "requests" && (
            <FriendRequests
              received={friendRequests.received || []}
              sent={friendRequests.sent || []}
              loading={requestsLoading}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Players
