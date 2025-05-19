"use client"

import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { getServerById, getChannelById } from "../mock/servers-data"
import { ChatPanel } from "../components/ChatPanel"
import { useChatMessages } from "../hooks/useChatMessages"
import { useAuth } from "@/contexts/AuthContext"
import {
  Volume2,
  Video,
  Pin,
  Bell,
  BellOff,
  Settings,
  Users,
  Shield,
  Crown,
} from "lucide-react"

export default function ServerView() {
  const { serverId, channelId } = useParams<{ serverId: string; channelId: string }>()
  const { user } = useAuth()
  const [channel, setChannel] = useState<any>(null)
  const [server, setServer] = useState<any>(null)
  const [showInfoPanel, setShowInfoPanel] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [activeMembers, setActiveMembers] = useState<string[]>([])

  useEffect(() => {
    if (serverId) {
      const serverData = getServerById(serverId)
      setServer(serverData)
    }
  }, [serverId])

  useEffect(() => {
    if (channelId) {
      const channelData = getChannelById(channelId)
      setChannel(channelData)
    }
  }, [channelId])

  useEffect(() => {
    if (channel?.type === "VOICE") {
      const randomMembers =
        server?.members?.filter(() => Math.random() > 0.5).map((member: any) => member.user.id) || []
      setActiveMembers(randomMembers)
    }
  }, [channel, server])

  const { messages, sendMessage, isConnected } = useChatMessages(channelId)

  if (!user || !channelId || !channel) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 p-4">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">Select a channel</h3>
          <p>Choose a channel from the sidebar to start chatting</p>
        </div>
      </div>
    )
  }


  if (channel.type === "VOICE") {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-[#2a2d3e] bg-white dark:bg-[#1e2030] py-3 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Volume2 className="mr-2 text-gray-500 dark:text-gray-400" size={18} />
            <h2 className="font-bold text-gray-800 dark:text-gray-200">{channel.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="icon-btn"><Video size={16} /></button>
            <button className={`icon-btn ${isMuted ? "text-red-500" : ""}`} onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <BellOff size={16} /> : <Bell size={16} />}
            </button>
            <button className={`icon-btn ${isPinned ? "text-indigo-500" : ""}`} onClick={() => setIsPinned(!isPinned)}>
              <Pin size={16} />
            </button>
            <button className={`icon-btn ${showInfoPanel ? "text-indigo-500" : ""}`} onClick={() => setShowInfoPanel(!showInfoPanel)}>
              <Users size={16} />
            </button>
            <button className="icon-btn"><Settings size={16} /></button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 flex flex-col items-center justify-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-indigo-100 dark:bg-[#6c5ce7]/20 flex items-center justify-center">
              <Volume2 className="w-12 h-12 text-indigo-500 dark:text-[#6c5ce7]" />
            </div>
            <h3 className="text-2xl font-medium mb-3 text-gray-700 dark:text-gray-300">{channel.name}</h3>
            <p className="text-center max-w-md text-gray-500 dark:text-gray-400">
              {activeMembers.length > 0
                ? `${activeMembers.length} members are currently in this voice channel.`
                : "No one is currently in this voice channel. Be the first to join!"}
            </p>

            {/* Active members */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 max-w-2xl">
              {activeMembers.length > 0 &&
                server?.members
                  .filter((member: any) => activeMembers.includes(member.user.id))
                  .map((member: any) => (
                    <div key={member.user.id} className="flex flex-col items-center">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                          {member.user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        {server.ownerId === member.user.id && (
                          <Crown size={12} className="absolute -top-1 -right-1 text-yellow-500 bg-white rounded-full p-0.5" />
                        )}
                        {member.roleIds.includes("role-2") && server.ownerId !== member.user.id && (
                          <Shield size={12} className="absolute -top-1 -right-1 text-blue-500 bg-white rounded-full p-0.5" />
                        )}
                      </div>
                      <span className="mt-2 text-sm text-gray-800 dark:text-gray-200">{member.user.username}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getRoleForMember(server, member)}
                      </span>
                    </div>
                  ))}
            </div>
          </div>

          {showInfoPanel && (
            <div className="w-64 border-l border-gray-200 dark:border-[#2a2d3e] bg-white dark:bg-[#1e2030] overflow-y-auto">
              <div className="p-4">
                <h3 className="font-bold text-gray-800 dark:text-gray-200">Voice Channel Members</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activeMembers.length} active members</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Main layout */}
      <div className="flex flex-1 w-full h-full overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatPanel
            messages={messages}
            onSend={sendMessage}
            isConnected={isConnected}
            currentUserId={user.uuid}
            channelName={channel.name}
            channelTopic={channel.topic}
            isServerChannel={true}
            participants={server?.members?.map((member: any) => ({
              id: member.user.id,
              username: member.user.username,
              role: getRoleForMember(server, member),
            }))}
          />
        </div>
      </div>
    </div>
  )
}

function getRoleForMember(server: any, member: any): "owner" | "admin" | "mod" | "member" {
  if (!server || !member) return "member"
  if (server.ownerId === member.user.id) return "owner"

  const roles = member.roleIds
    .map((id: string) => server.roles.find((r: any) => r.id === id))
    .filter(Boolean)

  if (roles.some((r: any) => r.name === "Admin")) return "admin"
  if (roles.some((r: any) => r.name === "Moderator")) return "mod"
  return "member"
}
