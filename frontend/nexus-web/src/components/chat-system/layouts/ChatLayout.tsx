import { Outlet } from "react-router-dom"
import DirectMessageSidebar from "@/components/chat-system/components/DirectMessageSidebar"

export default function ChatLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#36393f] text-white">
      {/* Sidebar - always visible */}
      <aside className="w-60 h-full flex-shrink-0 bg-[#2f3136] border-r border-[#202225]">
        <DirectMessageSidebar />
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
