import type React from "react"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-[#2a2d3e] ${className || ""}`} {...props} />
}

export { Skeleton }
