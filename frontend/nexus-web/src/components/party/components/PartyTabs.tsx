"use client"

interface PartyTabsProps {
  activeTab: "recommendations" | "invites"
  setActiveTab: (tab: "recommendations" | "invites") => void
}

const PartyTabs = ({ activeTab, setActiveTab }: PartyTabsProps) => {
  return (
    <div className="flex justify-center">
      <div className="inline-flex bg-gray-100 dark:bg-gray-800/60 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("recommendations")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "recommendations"
              ? "bg-blue-500 text-white shadow-sm"
              : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50"
          }`}
        >
          Recommended
        </button>
        <button
          onClick={() => setActiveTab("invites")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "invites"
              ? "bg-blue-500 text-white shadow-sm"
              : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50"
          }`}
        >
          Invites
        </button>
      </div>
    </div>
  )
}

export default PartyTabs
