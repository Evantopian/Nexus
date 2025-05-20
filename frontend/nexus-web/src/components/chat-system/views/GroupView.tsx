"use client"

import { useParams } from "react-router-dom"
import { useMemo } from "react"
import { useChatMessages } from "../hooks/useChatMessages"
import { ChatPanel } from "../components/ChatPanel"
import { useAuth } from "@/contexts/AuthContext"
import { useGroupConversations } from "@/hooks/chat/useGroupConversations"
import { Users } from "lucide-react"

export default function GroupView() {
  const { groupId } = useParams<{ groupId: string }>()
  const { user } = useAuth()
  const { groups } = useGroupConversations()

  type Group = {
    id: string
    name: string
    participants: any[] // Replace 'any' with the actual participant type if available
  }

  const group = useMemo(() => {
    return groups.find((g: Group) => g.id === groupId)
  }, [groups, groupId])

  const { messages, sendMessage, isConnected } = useChatMessages(groupId)

  if (!user || !groupId || !group) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center">
            <Users size={24} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-medium mb-2">Select a group</h3>
          <p>Choose a group conversation from the sidebar to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Middle chat panel */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <ChatPanel
            messages={messages}
            onSend={sendMessage}
            isConnected={isConnected}
            currentUserId={user.uuid}
            channelName={group.name}
            isGroupChat={true}
            participants={group.participants}
          />
        </div>
      </div>
    </div>
  )
}
