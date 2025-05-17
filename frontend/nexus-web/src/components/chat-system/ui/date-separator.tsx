export function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-300/30 dark:via-[#6c5ce7]/30 to-transparent flex-grow" />
      <div className="px-4 py-1 text-xs font-bold text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-[#2a2d3e] rounded-md mx-2">
        {date}
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-300/30 dark:via-[#6c5ce7]/30 to-transparent flex-grow" />
    </div>
  )
}
