"use client"

import React, { useState, useEffect } from "react"
import { Socket, Channel } from "phoenix"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { USER_IDS } from "@/data/ChatAccounts"

import ChatHeader from "@/components/chats/ChatHeader"
import MessageList from "@/components/chats/MessageList"
import MessageInput from "@/components/chats/MessageInput"
import NoMessagesFallback from "@/components/chats/NoMessagesFallback"
import { useDirectConversations } from "@/hooks/useDirectConversations"

interface Message {
  id: string
  body: string
  user_id: string
  conversation_id: string
  created_at: string
  timestamp: string
  pending?: boolean
}

const USER_ID_TO_NAME = Object.entries(USER_IDS).reduce((acc, [name, id]) => {
  acc[id] = name
  return acc
}, {} as Record<string, string>)




const ChatArea: React.FC = () => {
  const { contact: paramContact, groupId } = useParams<{ contact?: string; groupId?: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isGroup = !!groupId

  const defaultUserId = Object.values(USER_IDS)[0]
  const myId = user?.uuid
  const otherId = paramContact ?? defaultUserId

  const [socket, setSocket] = useState<Socket | null>(null)
  const [channel, setChannel] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState("")
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const { refetch } = useDirectConversations()

  useEffect(() => {
    if (user?.uuid) {
      localStorage.setItem("uuid", user.uuid)
    }
  }, [user])

  useEffect(() => {
    if (!paramContact && !groupId) {
      navigate(`/chat/direct/${defaultUserId}`, { replace: true })
    }
  }, [paramContact, groupId, navigate, defaultUserId])

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
    if (!socket) return

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
      if (msg.client_id) {
        const idx = prev.findIndex((m) => m.id === msg.client_id || m.id === msg.id)
        if (idx !== -1) {
          const updated = [...prev]
          updated[idx] = { ...msg, timestamp: msg.created_at, pending: false }
          return updated
        }
      }

      return [...prev, { ...msg, timestamp: msg.created_at }]
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
  }, [socket, otherId, groupId, isGroup])

  const sendMessage = () => {
    if (!channel || !draft.trim()) return

    const tempId = crypto.randomUUID()
    const optimisticMessage: Message = {
      id: tempId,
      body: draft,
      user_id: myId!,
      conversation_id: "", // not needed for display
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      pending: true,
    }

    setMessages((prev) => [...prev, optimisticMessage])
    const body = draft
    setDraft("")

    channel
      .push("message:new", { body, client_id: tempId })
      .receive("ok", () => {
        refetch() // ✅ trigger sidebar update
      })
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

  const getUserName = (id: string) => {
    const entry = Object.entries(USER_IDS).find(([, value]) => value === id)
    return entry ? entry[0] : id
  }

  const chatTitle = isGroup
    ? `Group ${groupId}`
    : `Chat with ${getUserName(otherId)}`

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-[#121a2f] overflow-hidden">
      <ChatHeader
        title={chatTitle}
        isGroup={isGroup}
        participants={isGroup ? 5 : 0}
      />

      {messages.length > 0 ? (
        <MessageList messages={messages} typingUsers={typingUsers} userNames={USER_ID_TO_NAME}/>
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
