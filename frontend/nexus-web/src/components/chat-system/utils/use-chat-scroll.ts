"use client"

// Create a new hook for handling chat auto-scrolling
import { useEffect, useRef } from "react"

export function useChatScroll<T extends HTMLElement = HTMLDivElement>(
  dependency: any[],
  options = { smooth: true, behavior: "auto" as ScrollBehavior },
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Scroll to bottom of container
    const scrollToBottom = () => {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: options.smooth ? "smooth" : "auto",
      })
    }

    scrollToBottom()

    // Optional: Add a small delay to ensure content is rendered
    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
  }, [dependency, options.smooth])

  return ref
}
