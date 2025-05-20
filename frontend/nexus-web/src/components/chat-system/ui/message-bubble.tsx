"use client"

import type React from "react"

import { formatTime } from "../utils/format-time"
import { useState, useRef, useEffect } from "react"
import { Reply, MoreHorizontal, Smile, ArrowUpRight } from "lucide-react"
import { EmojiPicker } from "../components/EmojiPicker"
import { useAuth } from "@/contexts/AuthContext"

interface Reaction {
  emoji: string
  users: {
    id: string
    username: string
  }[]
}

interface MessageBubbleProps {
  id: string | number
  sender: {
    username: string
    id?: string
  }
  timestamp: string | number | Date
  body: string
  isCurrentUser?: boolean
  showAvatar?: boolean
  showTimestamp?: boolean
  isFirstInGroup?: boolean
  isLastInGroup?: boolean
  replyInfo?: {
    messageId: string | number
    replyToId: string | number
    replyToText: string
    replyToSender: {
      username: string
      id?: string
    }
  }
  replyToMessage?: any
  onReply?: (id: string | number, body: string, sender: { username: string; id?: string }) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
}

export function MessageBubble({
  id,
  sender,
  timestamp,
  body,
  isCurrentUser = false,
  showAvatar = true,
  isFirstInGroup = true,
  replyInfo,
  replyToMessage,
  onReply,
  onKeyDown,
}: MessageBubbleProps) {
  const { user: currentUser } = useAuth()
  const formattedTime = formatTime(timestamp)
  const initial = typeof sender.username === "string" ? sender.username.charAt(0).toUpperCase() : ""
  const [isFocused, setIsFocused] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [showReactionUsers, setShowReactionUsers] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0,
  })
  const messageRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)

  // Load reactions from localStorage
  useEffect(() => {
    try {
      const savedReactions = localStorage.getItem(`message-reactions-${id}`)
      if (savedReactions) {
        setReactions(JSON.parse(savedReactions))
      }
    } catch (e) {
      console.error("Failed to load reactions", e)
    }
  }, [id])

  // Save reactions to localStorage
  const saveReactions = (newReactions: Reaction[]) => {
    try {
      localStorage.setItem(`message-reactions-${id}`, JSON.stringify(newReactions))
    } catch (e) {
      console.error("Failed to save reactions", e)
    }
  }

  // Add a reaction
  const addReaction = (emoji: string) => {
    if (!currentUser) return

    const newReactions = [...reactions]
    const existingReactionIndex = newReactions.findIndex((r) => r.emoji === emoji)

    if (existingReactionIndex >= 0) {
      // Check if user already reacted with this emoji
      const reaction = newReactions[existingReactionIndex]
      const userIndex = reaction.users.findIndex((u) => u.id === currentUser.uuid)

      if (userIndex >= 0) {
        // User already reacted with this emoji, remove their reaction
        reaction.users.splice(userIndex, 1)

        // If no users left for this emoji, remove the emoji entirely
        if (reaction.users.length === 0) {
          newReactions.splice(existingReactionIndex, 1)
        }
      } else {
        // Add user to existing emoji reaction
        reaction.users.push({
          id: currentUser.uuid,
          username: currentUser.username,
        })
      }
    } else {
      // Add new emoji reaction
      newReactions.push({
        emoji,
        users: [
          {
            id: currentUser.uuid,
            username: currentUser.username,
          },
        ],
      })
    }

    setReactions(newReactions)
    saveReactions(newReactions)
    setShowEmojiPicker(false)
  }

  // Handle right-click on message
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    })
  }

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleDocumentClick = () => {
      setContextMenu({ visible: false, x: 0, y: 0 })
    }

    if (contextMenu.visible) {
      document.addEventListener("click", handleDocumentClick)
      return () => document.removeEventListener("click", handleDocumentClick)
    }
  }, [contextMenu.visible])

  // Handle reply
  const handleReply = () => {
    if (onReply) {
      onReply(id, body, sender)
    }
    setContextMenu({ visible: false, x: 0, y: 0 })
  }

  // Scroll to replied message
  const scrollToRepliedMessage = () => {
    if (replyToMessage) {
      const element = document.getElementById(`message-${replyInfo?.replyToId}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
        // Highlight the message briefly
        element.classList.add("bg-indigo-100", "dark:bg-[#6c5ce7]/20")
        setTimeout(() => {
          element.classList.remove("bg-indigo-100", "dark:bg-[#6c5ce7]/20")
        }, 1500)
      }
    }
  }

  return (
    <div
      id={`message-${id}`}
      ref={messageRef}
      className={`group flex items-start gap-3 py-1.5 px-2 ${
        isFocused ? "bg-gray-100/70 dark:bg-[#2a2d3e]/70" : "hover:bg-gray-100/50 dark:hover:bg-[#2a2d3e]/40"
      } ${isCurrentUser ? "pl-4" : "border-l-2 border-transparent hover:border-indigo-300 dark:hover:border-[#6c5ce7]"}`}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={onKeyDown}
      onContextMenu={handleContextMenu}
      role="listitem"
      aria-label={`Message from ${sender.username}: ${body}`}
    >
      <style>{`
        /* Message actions visibility */
        .message-actions {
          height: 0;
          overflow: hidden;
          transition: height 0.2s ease;
        }
        
        .message-container:hover .message-actions,
        .message-container:focus-within .message-actions {
          height: 28px;
        }
        
        /* Reaction tooltip */
        .reaction-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 50;
          pointer-events: none;
        }
        
        .reaction-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 4px;
          border-style: solid;
          border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
        }
      `}</style>

      {showAvatar ? (
        <div className="relative">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center text-sm font-bold text-white ${
              isCurrentUser ? "bg-indigo-500 dark:bg-[#6c5ce7]" : "bg-emerald-500 dark:bg-[#00b894]"
            }`}
          >
            {initial}
          </div>
        </div>
      ) : (
        <div className="flex-shrink-0 w-10 opacity-0">{/* Invisible placeholder to maintain alignment */}</div>
      )}

      <div className="flex flex-col max-w-[90%] pt-0.5 message-container">
        {isFirstInGroup && (
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`font-bold text-sm ${
                isCurrentUser ? "text-indigo-600 dark:text-indigo-400" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {sender.username}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formattedTime}</span>
          </div>
        )}

        {/* Reply reference */}
        {replyInfo && replyToMessage && (
          <div
            className="flex items-center gap-1 mb-1 text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:underline"
            onClick={scrollToRepliedMessage}
          >
            <ArrowUpRight size={12} className="text-indigo-500 dark:text-[#6c5ce7]" />
            <span>
              Replying to{" "}
              <span className="font-medium text-indigo-600 dark:text-[#6c5ce7]">{replyToMessage.sender.username}</span>
            </span>
          </div>
        )}

        <div className={`text-gray-800 dark:text-gray-200 text-sm leading-relaxed ${isFirstInGroup ? "" : "pl-0"}`}>
          {body}
        </div>

        {/* Message reactions */}
        {reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {reactions.map((reaction) => (
              <div
                key={reaction.emoji}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md cursor-pointer ${
                  reaction.users.some((u) => u.id === currentUser?.uuid)
                    ? "bg-indigo-100 dark:bg-[#6c5ce7]/20 text-indigo-600 dark:text-[#6c5ce7]"
                    : "bg-gray-100 dark:bg-[#2a2d3e] text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => addReaction(reaction.emoji)}
                onMouseEnter={() => setShowReactionUsers(reaction.emoji)}
                onMouseLeave={() => setShowReactionUsers(null)}
              >
                <span>{reaction.emoji}</span>
                <span className="text-xs">{reaction.users.length}</span>

                {/* Tooltip showing who reacted */}
                {showReactionUsers === reaction.emoji && (
                  <div className="reaction-tooltip">{reaction.users.map((user) => user.username).join(", ")}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Message actions that expand on hover */}
        <div ref={actionsRef} className="message-actions flex items-center gap-1 mt-1">
          <button
            className="w-6 h-6 rounded-sm bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-[#3f4259]"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            aria-label="Add reaction"
          >
            <Smile size={14} />
          </button>
          <button
            className="w-6 h-6 rounded-sm bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-[#3f4259]"
            onClick={handleReply}
            aria-label="Reply to message"
          >
            <Reply size={14} />
          </button>
          <button
            className="w-6 h-6 rounded-sm bg-gray-200 dark:bg-[#2a2d3e] flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-[#3f4259]"
            onClick={(e) => {
              e.stopPropagation()
              handleContextMenu(e as any)
            }}
          >
            <MoreHorizontal size={14} />
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && <EmojiPicker onEmojiSelect={addReaction} onClose={() => setShowEmojiPicker(false)} />}
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed bg-white dark:bg-[#2a2d3e] shadow-lg rounded-md py-1 z-50 border border-gray-200 dark:border-[#3f4259] w-48"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
            onClick={() => {
              setShowEmojiPicker(true)
              setContextMenu({ visible: false, x: 0, y: 0 })
            }}
          >
            <Smile size={14} className="mr-2" />
            Add Reaction
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259] flex items-center"
            onClick={handleReply}
          >
            <Reply size={14} className="mr-2" />
            Reply
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f4259]"
            onClick={() => {
              navigator.clipboard.writeText(body)
              setContextMenu({ visible: false, x: 0, y: 0 })
            }}
          >
            Copy Text
          </button>
        </div>
      )}
    </div>
  )
}
