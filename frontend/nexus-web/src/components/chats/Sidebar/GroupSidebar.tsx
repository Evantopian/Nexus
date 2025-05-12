import React from "react"

interface GroupSidebarProps {
  groupId: string
}

const GroupSidebar: React.FC<GroupSidebarProps> = ({ groupId }) => {
  return (
    <aside className="w-64 p-4 bg-gray-100 dark:bg-[#0e1525] border-r border-gray-200 dark:border-[#1e2a45] h-full">
      <h2 className="text-gray-800 dark:text-white font-bold mb-2">Group #{groupId}</h2>
      <p className="text-sm text-gray-500 dark:text-[#8a92b2]">Group messaging is under construction.</p>
    </aside>
  )
}

export default GroupSidebar
