import ChatSidebar from "@/components/chats/ChatSidebar";
import ChatArea from "@/components/chats/ChatArea";

const ChatLayout = () => {
  return (
    <div className="flex h-[calc(100vh-6rem)] bg-gray-50 dark:bg-gray-900">
      <ChatSidebar />
      <ChatArea />
    </div>
  );
};

export default ChatLayout;
