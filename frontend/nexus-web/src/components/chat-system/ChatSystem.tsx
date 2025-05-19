"use client"

import { Routes, Route, Navigate } from "react-router-dom"


import type React from "react"
import { SocketProvider } from "./contexts/socket-context"
import { ServerProvider } from "./contexts/server-context"
import { ChannelProvider } from "./contexts/channel-context"
import { PresenceProvider } from "./contexts/presence-context"
import { useAuth } from "../../contexts/AuthContext"

import DirectMessageView from "./views/DirectMessageView"
import GroupView from "./views/GroupView"
import ServerView from "./views/ServerView"
import GroupConversationSidebar from "./components/GroupConversationSidebar"
import ServerList from "./components/ServerList"
import ServerSidebar from "./components/ServerSidebar"


import ChatLayout from "./layouts/ChatLayout"


export interface User {
  id: string
  username: string
  avatar?: string
  status?: "online" | "idle" | "dnd" | "offline"
}

export interface ChatSystemProps {
  user: User
  apiBaseUrl: string
  socketUrl: string
  onError?: (error: Error) => void
  className?: string
  children?: React.ReactNode
}

export function ChatSystem({ user, apiBaseUrl, socketUrl, onError, className }: ChatSystemProps) {
  return (
    <div className="h-full w-full flex bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      <SocketProvider socketUrl={socketUrl} user={user} onError={onError}>
        <ServerProvider apiBaseUrl={apiBaseUrl}>
          <ChannelProvider apiBaseUrl={apiBaseUrl}>
            <PresenceProvider>
              <Routes>
                {/* Redirect root to DMs */}
                <Route path="/" element={<Navigate to="/chat/dms" replace />} />

                {/* Direct Messages */}
                <Route path="dms" element={<ChatLayout />}>
                  <Route
                    index
                    element={
                      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 italic">
                        Select a conversation to start chatting.
                      </div>
                    }
                  />
                  <Route path=":conversationId" element={<DirectMessageView />} />
                </Route>

                {/* Group Conversations */}
                <Route path="groups/*" element={<ChatLayout />}>
                  <Route
                    index
                    element={
                      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 italic">
                        Select a group to start chatting.
                      </div>
                    }
                  />
                  <Route path=":groupId/*" element={<GroupView />} />
                </Route>


                {/* Servers */}
                <Route
                  path="servers/*"
                  element={
                    <div className="flex h-screen w-full overflow-hidden">
                      <ServerList />
                      <Routes>
                        <Route
                          index
                          element={
                            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 italic">
                              Select a server from the sidebar.
                            </div>
                          }
                        />
                        <Route
                          path=":serverId/*"
                          element={
                            <div className="flex flex-1">
                              <ServerSidebar />
                              <main className="flex-1 flex flex-col overflow-hidden">
                                <Routes>
                                  <Route
                                    index
                                    element={
                                      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 italic">
                                        Select a channel to start chatting.
                                      </div>
                                    }
                                  />
                                  <Route path=":channelId/*" element={<ServerView />} />
                                </Routes>
                              </main>
                            </div>
                          }
                        />
                      </Routes>
                    </div>
                  }
                />
              </Routes>

            </PresenceProvider>
          </ChannelProvider>
        </ServerProvider>
      </SocketProvider>
    </div>
  )
}

declare global {
  interface Window {
    __APOLLO_CLIENT__: any
  }
}

function ChatSystemWrapper() {
  const { user } = useAuth()
  if (!user) return <p>Loading user...</p>

  const socketUrl = import.meta.env.DEV
    ? "ws://localhost:4000/socket"
    : import.meta.env.VITE_SOCKET_URL || "future link here"

  return (
    <ChatSystem
      user={{
        id: user.uuid,
        username: user.username,
        avatar: user.profileImg || undefined,
        status: (user.status || "offline") as "online" | "idle" | "dnd" | "offline",
      }}
      apiBaseUrl={import.meta.env.VITE_API_BASE_URL}
      socketUrl={socketUrl}
    />
  )
}

export default ChatSystemWrapper
