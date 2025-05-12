 

interface ChatTabsProps {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
}

const ChatTabs: React.FC<ChatTabsProps> = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex space-x-1 bg-[#0e1525] px-2 py-2 overflow-x-auto">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={[
          "px-3 py-1.5 text-sm font-medium rounded-md transition flex items-center",
          activeTab === tab
            ? "bg-[#4a65f2] text-white shadow-md"
            : "text-[#8a92b2] hover:bg-[#182238] hover:text-[#e0e4f0]",
        ].join(" ")}
      >
        <span className="mr-1.5">#</span>
        {tab}
      </button>
    ))}
  </div>
)

export default ChatTabs
