import React from "react"
import { useParams } from "react-router-dom"
import DirectSidebar from "./Sidebar/DirectSidebar"
import GroupSidebar from "./Sidebar/GroupSidebar"
import ServerSidebar from "./Sidebar/ServerSidebar"

const ChatSidebar: React.FC = () => {
  const { contact, groupId, serverId } = useParams<{
    contact?: string
    groupId?: string
    serverId?: string
  }>()

  if (serverId) return <ServerSidebar serverId={serverId} />
  if (groupId) return <GroupSidebar groupId={groupId} />
  return <DirectSidebar activeContactId={contact} />
}

export default ChatSidebar
