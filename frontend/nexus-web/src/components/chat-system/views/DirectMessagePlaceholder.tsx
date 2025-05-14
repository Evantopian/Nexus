export default function DirectMessagePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#36393f] text-gray-400 p-4">
      <div className="w-16 h-16 mb-4 rounded-full bg-[#2f3136] flex items-center justify-center">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium mb-2">Your conversations</h3>
      <p className="text-center max-w-md">
        Select a conversation from the sidebar or start a new one by searching for users.
      </p>
    </div>
  )
}
