import { Outlet } from "react-router-dom"
import ChatSidebar from "@/components/chats/ChatSidebar"

const ChatLayout: React.FC = () => (
  <div className="flex h-[calc(100vh-6rem)] bg-[#121a2f]">
    <ChatSidebar />
    <main className="flex-1 flex overflow-hidden">
      <Outlet />
    </main>
  </div>
)

export default ChatLayout
