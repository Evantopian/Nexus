"use client"

import { Outlet } from "react-router-dom"
import DirectMessageSidebar from "@/components/chat-system/components/DirectMessageSidebar"
import { useState, useEffect } from "react"
import { MobileMenuButton } from "../ui/mobile-menu-button"
import { ChatProvider } from "../contexts/chat-context"  

export default function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
      <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 md:hidden transition-opacity duration-200"
            aria-hidden="true"
          />
        )}

        {/* Sidebar - responsive */}
        <aside
          id="sidebar"
          className={`${
            isMobile
              ? `fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-200 ease-in-out ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : "w-64 md:w-72 lg:w-80"
          } h-full flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800`}
          aria-label="Sidebar navigation"
        >
          <DirectMessageSidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Mobile menu button */}
          <div className="absolute top-3 left-3 z-10 md:hidden">
            <MobileMenuButton
              onClick={() => setSidebarOpen(!sidebarOpen)}
              isOpen={sidebarOpen}
            />
          </div>

          <Outlet />
        </main>
      </div>
    </ChatProvider>
  )
}
