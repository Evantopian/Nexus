"use client"

// components/MessageList.tsx
import { MessageBubble } from "../ui/message-bubble"
import { DateSeparator } from "../ui/date-separator"
import { shouldShowTimestamp, shouldShowHeader, getDateSeparator } from "../utils/date-helpers"
import { useEffect, useState } from "react"

interface ReplyInfo {
  messageId: string | number
  replyToId: string | number
  replyToText: string
  replyToSender: {
    username: string
    id?: string
  }
}

export function MessageList({
  messages,
  currentUserId,
}: {
  messages: any[]
  currentUserId: string
}) {
  const [replies, setReplies] = useState<Record<string, ReplyInfo>>({})

  // Load replies from localStorage
  useEffect(() => {
    try {
      const savedReplies = localStorage.getItem("message-replies") || "{}"
      setReplies(JSON.parse(savedReplies))
    } catch (e) {
      console.error("Failed to load replies", e)
    }
  }, [messages])

  const prepared = messages.map((msg, i) => {
    const prev = i > 0 ? messages[i - 1] : undefined
    const next = i < messages.length - 1 ? messages[i + 1] : undefined

    // Find if this message is a reply to another message
    const replyInfo = Object.values(replies).find((reply) => reply.messageId.toString() === msg.id.toString())

    // Find the message being replied to
    const replyToMessage = replyInfo ? messages.find((m) => m.id.toString() === replyInfo.replyToId.toString()) : null

    return {
      ...msg,
      isFirstInGroup: !prev || prev.sender.id !== msg.sender.id || shouldShowHeader(msg, prev),
      isLastInGroup: !next || next.sender.id !== msg.sender.id || shouldShowHeader(next, msg),
      showTimestamp: shouldShowTimestamp(msg, prev),
      dateSeparator: getDateSeparator(msg, prev),
      replyInfo: replyInfo,
      replyToMessage: replyToMessage,
    }
  })

  // Handle reply event
  const handleReply = (id: string | number, body: string, sender: { username: string; id?: string }) => {
    // Dispatch custom event to be caught by MessageInput
    const event = new CustomEvent("message-reply", {
      detail: { id, body, sender },
    })
    window.dispatchEvent(event)
  }

  return (
    <>
      {prepared.map((msg) => (
        <div key={msg.id}>
          {msg.dateSeparator && <DateSeparator date={msg.dateSeparator} />}
          <MessageBubble
            id={msg.id}
            sender={msg.sender}
            timestamp={msg.timestamp}
            body={msg.body}
            isCurrentUser={currentUserId === msg.sender.id}
            showAvatar={msg.isFirstInGroup}
            showTimestamp={msg.showTimestamp}
            isFirstInGroup={msg.isFirstInGroup}
            isLastInGroup={msg.isLastInGroup}
            onReply={handleReply}
            replyInfo={msg.replyInfo}
            replyToMessage={msg.replyToMessage}
          />
        </div>
      ))}
    </>
  )
}
