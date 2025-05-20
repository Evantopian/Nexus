"use client"

import { Outlet, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import DirectMessageSidebar from "@/components/chat-system/components/DirectMessageSidebar"
import GroupConversationSidebar from "@/components/chat-system/components/GroupConversationSidebar"
import { MobileMenuButton } from "../ui/mobile-menu-button"
import { ChatProvider } from "../contexts/chat-context"

export default function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()

  // Determine which sidebar to show
  const isGroupView = location.pathname.startsWith("/chat/groups")

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.getElementById("sidebar")
        if (sidebar && !sidebar.contains(e.target as Node)) {
          setSidebarOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobile, sidebarOpen])

  return (
    <ChatProvider>
      <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-[#1a1b26] text-gray-900 dark:text-gray-200">
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-20 md:hidden" aria-hidden="true" />
        )}

        {/* Sidebar */}
        <aside
          id="sidebar"
          className={`${
            isMobile
              ? `fixed inset-y-0 left-0 z-30 w-72 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
              : "w-64 md:w-72 lg:w-80"
          } h-full flex-shrink-0 border-r border-gray-200 dark:border-[#2a2d3e] bg-white dark:bg-[#1e2030]`}
          aria-label="Sidebar navigation"
        >
          {isGroupView ? <GroupConversationSidebar /> : <DirectMessageSidebar />}
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Mobile menu toggle */}
          <div className="absolute top-3 left-3 z-10 md:hidden">
            <MobileMenuButton onClick={() => setSidebarOpen(!sidebarOpen)} isOpen={sidebarOpen} />
          </div>

          <Outlet />
        </main>
      </div>
    </ChatProvider>
  )
}
