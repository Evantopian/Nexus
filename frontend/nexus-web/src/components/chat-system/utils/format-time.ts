export function formatTime(timestamp: string | number | Date): string {
  const date = new Date(timestamp)

  // Use the system's locale settings for time formatting
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Use 12-hour format with AM/PM
  })
}
