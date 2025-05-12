import { useState, useEffect } from "react"
import { gql, useQuery } from "@apollo/client"
import { useNavigate, useParams } from "react-router-dom"
import { Users, User, Search, Plus, X } from "lucide-react"

const DEV_USER_ID = "32673fee-5280-4134-a5f9-e339532bd7f9"

const GET_USER = gql`
  query GetUser($userId: UUID!) {
    getUser(userId: $userId) {
      uuid
      username
      profileImg
    }
  }
`

const ChatSidebar: React.FC = () => {
  const navigate = useNavigate()
  const { contact: activeContactId, groupId: activeGroupId } = useParams<{
    contact?: string
    groupId?: string
  }>()
  const [activeTab, setActiveTab] = useState<"direct" | "groups">("direct")
  const [searchQuery, setSearchQuery] = useState("")

  // Set the active tab based on the current route
  useEffect(() => {
    if (activeGroupId) {
      setActiveTab("groups")
    } else {
      setActiveTab("direct")
    }
  }, [activeGroupId, activeContactId])

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId: DEV_USER_ID },
  })

  if (loading) {
    return <p className="p-4 text-[#8a92b2]">Loading contacts…</p>
  }

  if (error) {
    return <p className="p-4 text-[#ff5a5f]">Error: {error.message}</p>
  }

  const user = data?.getUser
  if (!user) {
    return <p className="p-4 text-[#ff5a5f]">User not found.</p>
  }

  // Mock contacts list
  const contacts = [
    { id: "1", name: "Alex Gaming", status: "online", img: null, lastMessage: "Ready for the tournament?", unread: 2 },
    { id: "2", name: "Sarah Player", status: "idle", img: null, lastMessage: "Check out this new game", unread: 0 },
    { id: "3", name: "Mike Streamer", status: "dnd", img: null, lastMessage: "Going live in 10 minutes", unread: 5 },
    {
      id: DEV_USER_ID,
      name: user.username,
      status: "online",
      img: user.profileImg,
      lastMessage: "Thanks for the help!",
      unread: 0,
    },
  ]

  // Mock groups list
  const groups = [
    { id: "1", name: "Gaming Squad", members: 5, img: null, lastMessage: "Who's online tonight?", unread: 3 },
    { id: "2", name: "Tournament Team", members: 8, img: null, lastMessage: "Practice at 8PM", unread: 0 },
    { id: "3", name: "Casual Players", members: 12, img: null, lastMessage: "Anyone up for some rounds?", unread: 1 },
  ]

  // Filter contacts/groups based on search query
  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <aside className="w-64 bg-[#0e1525] flex flex-col h-full">
      <div className="p-3 border-b border-[#1e2a45]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold">Messages</h2>
          <button className="w-7 h-7 rounded-full bg-[#182238] text-[#8a92b2] flex items-center justify-center hover:bg-[#4a65f2] hover:text-white transition">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle between DMs and Groups */}
        <div className="flex bg-[#182238] rounded-md p-1">
          <button
            onClick={() => {
              setActiveTab("direct")
              navigate(`/chat/direct/${contacts[0].id}`)
            }}
            className={`flex items-center justify-center gap-1.5 flex-1 py-1.5 rounded-md text-sm font-medium transition ${
              activeTab === "direct" ? "bg-[#4a65f2] text-white" : "text-[#8a92b2] hover:text-[#e0e4f0]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Direct</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("groups")
              navigate(`/chat/group/${groups[0].id}`)
            }}
            className={`flex items-center justify-center gap-1.5 flex-1 py-1.5 rounded-md text-sm font-medium transition ${
              activeTab === "groups" ? "bg-[#4a65f2] text-white" : "text-[#8a92b2] hover:text-[#e0e4f0]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Groups</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === "direct" ? "Search contacts..." : "Search groups..."}
              className="w-full bg-[#182238] text-[#e0e4f0] placeholder-[#8a92b2] rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a65f2]"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8a92b2] hover:text-[#e0e4f0]"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a92b2]" />
            )}
          </div>

          {activeTab === "direct" ? (
            <>
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => navigate(`/chat/direct/${contact.id}`)}
                    className={`flex items-center gap-3 w-full p-2 rounded-md transition group mb-1
                      ${contact.id === activeContactId ? "bg-[#182238]" : "hover:bg-[#182238]"}`}
                  >
                    <div className="relative">
                      {contact.img ? (
                        <img
                          src={contact.img || "/placeholder.svg"}
                          alt={`${contact.name}'s avatar`}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#4a65f2] text-white flex items-center justify-center shadow-md">
                          {contact.name[0]}
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0e1525] ${
                          contact.status === "online"
                            ? "bg-green-500"
                            : contact.status === "idle"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      ></span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#e0e4f0] truncate">{contact.name}</span>
                        {contact.unread > 0 && (
                          <span className="bg-[#4a65f2] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#8a92b2] truncate block">{contact.lastMessage}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-4 text-[#8a92b2] text-sm">No contacts found</div>
              )}
            </>
          ) : (
            <>
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => navigate(`/chat/group/${group.id}`)}
                    className={`flex items-center gap-3 w-full p-2 rounded-md transition group mb-1
                      ${group.id === activeGroupId ? "bg-[#182238]" : "hover:bg-[#182238]"}`}
                  >
                    <div className="relative">
                      {group.img ? (
                        <img
                          src={group.img || "/placeholder.svg"}
                          alt={`${group.name} group`}
                          className="w-9 h-9 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-md bg-[#3a55e2] text-white flex items-center justify-center shadow-md">
                          <Users className="w-5 h-5" />
                        </div>
                      )}
                      {group.unread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#4a65f2] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {group.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#e0e4f0] truncate">{group.name}</span>
                        <span className="text-xs text-[#8a92b2]">{group.members}</span>
                      </div>
                      <span className="text-xs text-[#8a92b2] truncate block">{group.lastMessage}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-4 text-[#8a92b2] text-sm">No groups found</div>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  )
}

export default ChatSidebar
