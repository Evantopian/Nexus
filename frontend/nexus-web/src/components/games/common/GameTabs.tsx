interface GameTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

const GameTabs = ({ activeTab, setActiveTab, tabs }: GameTabsProps) => {
  return (
    <div className="bg-gray-900 border-b border-indigo-500/30 sticky top-0 z-10">
      <div className="w-full px-4">
        <div className="flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-3 px-6 font-medium text-sm relative transition-all
                ${activeTab === tab.id 
                  ? "text-white" 
                  : "text-gray-400 hover:text-gray-200"
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <>
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500"></span>
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 
                    border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-indigo-500"></span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameTabs;