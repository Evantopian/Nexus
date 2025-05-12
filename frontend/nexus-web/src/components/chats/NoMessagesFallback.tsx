import { MessageSquare } from "lucide-react"

interface NoMessagesFallbackProps {
  isGroup?: boolean
}

const NoMessagesFallback: React.FC<NoMessagesFallbackProps> = ({ isGroup = false }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 bg-[#121a2f]">
    <div className="w-16 h-16 rounded-full bg-[#182238] flex items-center justify-center mb-4">
      <MessageSquare className="w-8 h-8 text-[#4a65f2]" />
    </div>
    <h3 className="text-xl font-semibold text-white">No messages yet</h3>
    <p className="mt-2 text-[#8a92b2] max-w-md">
      {isGroup
        ? "Be the first to send a message to this group!"
        : "Start a conversation or send a message to connect with this user."}
    </p>
    <div className="mt-6 flex gap-3">
      <button className="bg-[#4a65f2] text-white px-4 py-2 rounded-md hover:bg-[#3a55e2] transition shadow-md">
        {isGroup ? "Send Message" : "Say Hello"}
      </button>
      <button className="bg-[#182238] text-[#e0e4f0] px-4 py-2 rounded-md hover:bg-[#1e2a45] transition">
        {isGroup ? "Invite Friends" : "Find More Friends"}
      </button>
    </div>
  </div>
)

export default NoMessagesFallback
