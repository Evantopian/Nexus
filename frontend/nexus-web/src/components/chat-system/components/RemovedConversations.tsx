"use client"

import type { Dispatch, SetStateAction } from "react"

interface RemovedConversationsProps {
  conversations: any[]
  removedUsers: string[]
  setRemovedUsers: Dispatch<SetStateAction<string[]>>
}

export function RemovedConversations({ conversations, removedUsers, setRemovedUsers }: RemovedConversationsProps) {
  if (removedUsers.length === 0) return null

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#2a2d3e]">
      <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center justify-between">
        <span>Hidden Conversations</span>
        <button
          className="text-xs text-indigo-500 dark:text-[#6c5ce7] hover:underline"
          onClick={() => {
            localStorage.removeItem("chat-removed-users")
            setRemovedUsers([])
          }}
        >
          Restore All
        </button>
      </div>
      <div className="mt-1 space-y-1">
        {conversations
          .filter((conv: any) => removedUsers.includes(conv?.user?.id))
          .map((conv: any) => (
            <div
              key={conv.id}
              className="px-3 py-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"
            >
              <span className="truncate">{conv?.user?.username}</span>
              <button
                className="text-xs text-indigo-500 dark:text-[#6c5ce7] hover:underline"
                onClick={() => {
                  const newRemoved = removedUsers.filter((id) => id !== conv?.user?.id)
                  localStorage.setItem("chat-removed-users", JSON.stringify(newRemoved))
                  setRemovedUsers(newRemoved)
                }}
              >
                Restore
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}
