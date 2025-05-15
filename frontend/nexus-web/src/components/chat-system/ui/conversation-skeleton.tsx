import { Skeleton } from "./skeleton"

export function ConversationSkeleton() {
  return (
    <div className="w-full px-3 py-3 rounded-md flex items-center">
      <Skeleton className="w-10 h-10 rounded-full mr-3" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  )
}
