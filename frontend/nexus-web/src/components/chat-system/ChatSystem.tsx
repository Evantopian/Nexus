"use client"

import React from "react"
import { SocketProvider } from "./contexts/socket-context"
import { ServerProvider } from "./contexts/server-context"
import { ChannelProvider } from "./contexts/channel-context"
import { PresenceProvider } from "./contexts/presence-context"
import { ChatProvider } from "./contexts/chat-context"
import { useAuth } from "../../contexts/AuthContext"

import DirectMessageView from "./views/DirectMessageView"
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
import { Routes, Route, Navigate } from "react-router-dom"
 

export function ChatSystem({
  user,
  apiBaseUrl,
  socketUrl,
  onError,
  className,
}: ChatSystemProps) {
  return (
    <div className={`h-full w-full flex ${className || ""}`}>
      <SocketProvider socketUrl={socketUrl} user={user} onError={onError}>
        <ServerProvider apiBaseUrl={apiBaseUrl}>
          <ChannelProvider apiBaseUrl={apiBaseUrl}>
            <PresenceProvider>
              <ChatProvider>
                <Routes>
                  <Route path="/" element={<Navigate to="/chat/dms" replace />} />
                  <Route path="dms" element={<ChatLayout />}>
                    <Route
                      index
                      element={
                        <div className="flex items-center justify-center h-full text-gray-400 italic">
                          Select a conversation to start chatting.
                        </div>
                      }
                    />
                    <Route path=":conversationId" element={<DirectMessageView />} />
                  </Route>
                </Routes>
              </ChatProvider>
            </PresenceProvider>
          </ChannelProvider>
        </ServerProvider>
      </SocketProvider>
    </div>
  )
}


// Extend global interface if needed
declare global {
  interface Window {
    __APOLLO_CLIENT__: any
  }
}

function ChatSystemWrapper() {
  const { user } = useAuth()
  if (!user) return <p>Loading user...</p>

  return (
    <ChatSystem
      user={{
        id: user.uuid,
        username: user.username,
        avatar: user.profileImg || undefined,
        status: (user.status || "offline") as "online" | "idle" | "dnd" | "offline",
      }}
      apiBaseUrl={import.meta.env.VITE_API_BASE_URL}
      socketUrl="wss://localhost:4000/socket"
    />
  )
}

export default ChatSystemWrapper
