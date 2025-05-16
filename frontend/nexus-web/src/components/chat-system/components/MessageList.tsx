// components/MessageList.tsx
import { MessageBubble } from "../ui/message-bubble"
import { DateSeparator } from "../ui/date-separator"
import { shouldShowTimestamp, getDateSeparator } from "../utils/date-helpers"

export function MessageList({ messages, currentUserId }: {
  messages: any[]
  currentUserId: string
}) {
  const prepared = messages.map((msg, i) => {
    const prev = i > 0 ? messages[i - 1] : undefined
    const next = i < messages.length - 1 ? messages[i + 1] : undefined

    return {
      ...msg,
      isFirstInGroup: !prev || prev.sender.id !== msg.sender.id,
      isLastInGroup: !next || next.sender.id !== msg.sender.id,
      showTimestamp: shouldShowTimestamp(msg, prev),
      dateSeparator: getDateSeparator(msg, prev),
    }
  })

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
          />
        </div>
      ))}
    </>
  )
}
