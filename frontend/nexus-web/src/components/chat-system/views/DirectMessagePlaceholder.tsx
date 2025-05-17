export default function DirectMessagePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 p-4 transition-colors duration-200">
      <div className="w-20 h-20 mb-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center transition-colors duration-200">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-medium mb-3 text-gray-700 dark:text-gray-300">Your conversations</h3>
      <p className="text-center max-w-md text-gray-500 dark:text-gray-400">
        Select a conversation from the sidebar or start a new one by searching for users.
      </p>
      <div className="mt-8 flex flex-col items-center">
        <div className="animate-bounce mb-2">
          <svg
            className="w-6 h-6 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">Start chatting now</p>
      </div>
    </div>
  )
}
