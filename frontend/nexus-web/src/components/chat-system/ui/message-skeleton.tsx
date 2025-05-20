import { Skeleton } from "./skeleton"

export function MessageSkeleton({ }: { isCurrentUser?: boolean }) {
  return (
    <div className="group flex items-start gap-3 py-2 px-1">
      <Skeleton className="flex-shrink-0 w-10 h-10 rounded-md" />

      <div className="flex flex-col max-w-[85%]">
        <div className="flex items-center gap-2 mb-1">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-3 w-12 rounded-md" />
        </div>

        <Skeleton className="h-16 w-64 rounded-md" />
      </div>
    </div>
  )
}
