import { Skeleton } from "./skeleton"

export function MessageSkeleton({ isCurrentUser = false }: { isCurrentUser?: boolean }) {
  return (
    <div className="group flex items-start gap-3 py-2 px-1">
      <Skeleton className="flex-shrink-0 w-9 h-9 rounded-full" />

      <div className="flex flex-col max-w-[85%]">
        <div className="flex items-center gap-2 mb-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>

        <Skeleton className="h-16 w-64 rounded-lg rounded-tl-sm" />
      </div>
    </div>
  )
}
