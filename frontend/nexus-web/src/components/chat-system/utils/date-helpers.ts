export function formatDate(date: Date): string {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  const isToday = date.toDateString() === now.toDateString()
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isToday) {
    return "Today"
  } else if (isYesterday) {
    return "Yesterday"
  } else {
    // Format as "Monday, January 1" or similar
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function shouldShowTimestamp(
  currentMsg: { timestamp: string | number | Date; sender: { id: string } },
  prevMsg?: { timestamp: string | number | Date; sender: { id: string } },
): boolean {
  if (!prevMsg) return true

  const currentTime = new Date(currentMsg.timestamp)
  const prevTime = new Date(prevMsg.timestamp)

  // Show timestamp if sender changed
  if (currentMsg.sender.id !== prevMsg.sender.id) return true

  // Show timestamp if more than 5 minutes between messages
  const fiveMinutes = 5 * 60 * 1000
  return currentTime.getTime() - prevTime.getTime() > fiveMinutes
}

export function shouldShowHeader(
  currentMsg: { timestamp: string | number | Date; sender: { id: string } },
  prevMsg?: { timestamp: string | number | Date; sender: { id: string } },
): boolean {
  if (!prevMsg) return true

  const currentTime = new Date(currentMsg.timestamp)
  const prevTime = new Date(prevMsg.timestamp)

  // Show header if sender changed
  if (currentMsg.sender.id !== prevMsg.sender.id) return true

  // Show header if more than 10 minutes between messages
  const tenMinutes = 10 * 60 * 1000
  return currentTime.getTime() - prevTime.getTime() > tenMinutes
}

export function getDateSeparator(
  currentMsg: { timestamp: string | number | Date },
  prevMsg?: { timestamp: string | number | Date },
): string | null {
  if (!prevMsg) return formatDate(new Date(currentMsg.timestamp))

  const currentDate = new Date(currentMsg.timestamp)
  const prevDate = new Date(prevMsg.timestamp)

  if (!isSameDay(currentDate, prevDate)) {
    return formatDate(currentDate)
  }

  return null
}
