export function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow" />
      <div className="px-4 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
        {date}
      </div>
      <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow" />
    </div>
  )
}
