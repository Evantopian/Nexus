"use client"

import React, { useState, useEffect } from "react"
import { Socket, Channel } from "phoenix"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useChat } from "@/contexts/ChatContext"

import ChatHeader from "@/components/chats/ChatHeader"
import MessageList from "@/components/chats/MessageList"
import MessageInput from "@/components/chats/MessageInput"
import NoMessagesFallback from "@/components/chats/NoMessagesFallback"

interface Message {
  id: string
  body: string
  user_id: string
  conversation_id: string
  created_at: string
  timestamp: string
  pending?: boolean
}

const ChatArea: React.FC = () => {
  const { contact: paramContact, groupId } = useParams<{ contact?: string; groupId?: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addOrUpdateConversation } = useChat()

  const isGroup = !!groupId
  const myId = user?.uuid
  const otherId = paramContact ?? ""

  const [socket, setSocket] = useState<Socket | null>(null)
  const [channel, setChannel] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState("")
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  useEffect(() => {
    if (user?.uuid) {
      localStorage.setItem("uuid", user.uuid)
    }
  }, [user])

  useEffect(() => {
    if (!paramContact && !groupId && user?.uuid) {
      navigate(`/chat/direct/${user.uuid}`, { replace: true })
    }
  }, [paramContact, groupId, navigate, user])

  useEffect(() => {
    if (!myId) return

    const sock = new Socket("ws://localhost:4000/socket", {
      params: { user_id: myId },
    })
    sock.connect()
    setSocket(sock)

    return () => {
      sock.disconnect()
      setSocket(null)
    }
  }, [myId])

  useEffect(() => {
    if (!socket || !otherId) return

    const channelId = isGroup ? `group:${groupId}` : `dm:${otherId}`
    const chan = socket.channel(channelId, {})

    chan
      .join()
      .receive("ok", ({ messages: hist }: { messages: Message[] }) => {
        const formatted = hist.map((m) => ({
          ...m,
          timestamp: m.created_at,
        }))
        setMessages(formatted)
      })
      .receive("error", (err: unknown) => {
        console.error("Channel join failed:", err)
        setMessages([])
      })

    chan.on("message:new", (msg: Message & { client_id?: string }) => {
      setMessages((prev) => {
        let updated: Message[]

        if (msg.client_id) {
          const idx = prev.findIndex((m) => m.id === msg.client_id || m.id === msg.id)
          if (idx !== -1) {
            updated = [...prev]
            updated[idx] = { ...msg, timestamp: msg.created_at, pending: false }
          } else {
            updated = [...prev, { ...msg, timestamp: msg.created_at }]
          }
        } else {
          updated = [...prev, { ...msg, timestamp: msg.created_at }]
        }

        if (!isGroup) {
          addOrUpdateConversation({
            id: `dm:${[myId, otherId].sort().join("-")}`,
            user: {
              id: otherId,
              username: otherId, // You may replace this with actual name if available
            },
            lastMessage: msg.body,
            lastActive: msg.created_at,
          })
        }

        return updated
      })
    })

    chan.on("user:typing", ({ user_id }: { user_id: string }) => {
      if (user_id !== myId) {
        setTypingUsers((prev) =>
          prev.includes(user_id) ? prev : [...prev, user_id]
        )

        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((id) => id !== user_id))
        }, 3000)
      }
    })

    setChannel(chan)
    return () => {
      chan.leave()
      setChannel(null)
    }
  }, [socket, otherId, groupId, isGroup, myId, addOrUpdateConversation])

  const sendMessage = () => {
    if (!channel || !draft.trim()) return

    const tempId = crypto.randomUUID()
    const optimisticMessage: Message = {
      id: tempId,
      body: draft,
      user_id: myId!,
      conversation_id: "",
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      pending: true,
    }

    setMessages((prev) => [...prev, optimisticMessage])
    const body = draft
    setDraft("")

    channel
      .push("message:new", { body, client_id: tempId })
      .receive("error", (err: unknown) => {
        console.error("Failed to send:", err)
        setMessages((prev) => prev.filter((m) => m.id !== tempId))
      })
  }

  const handleTyping = () => {
    if (channel) {
      channel.push("user:typing", { user_id: myId })
    }
  }

  if (!myId) {
    return <div className="p-4 text-gray-500 dark:text-[#8a92b2]">Loading user…</div>
  }

  const chatTitle = isGroup
    ? `Group ${groupId}`
    : `Chat with ${otherId}`

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-[#121a2f] overflow-hidden">
      <ChatHeader
        title={chatTitle}
        isGroup={isGroup}
        participants={isGroup ? 5 : 0}
      />

      {messages.length > 0 ? (
        <MessageList messages={messages} typingUsers={typingUsers} />
      ) : (
        <NoMessagesFallback isGroup={isGroup} />
      )}

      <MessageInput
        value={draft}
        onChange={setDraft}
        onSend={sendMessage}
        onTyping={handleTyping}
      />
    </div>
  )
}

export default ChatArea
