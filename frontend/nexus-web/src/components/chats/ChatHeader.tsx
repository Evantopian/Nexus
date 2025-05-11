// src/components/chats/ChatHeader.tsx

interface ChatHeaderProps {
  title: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => (
  <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
  </div>
);

export default ChatHeader;
