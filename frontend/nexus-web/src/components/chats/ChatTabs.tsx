// src/components/chats/ChatTabs.tsx
interface ChatTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ChatTabs: React.FC<ChatTabsProps> = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex space-x-4 bg-gray-100 dark:bg-gray-800 px-4 py-2">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={[
          "px-3 py-1 text-sm font-medium rounded transition",
          activeTab === tab
            ? "bg-white dark:bg-gray-900 shadow"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200",
        ].join(" ")}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default ChatTabs;
