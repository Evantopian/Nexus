import React from "react"

interface ServerSidebarProps {
  serverId: string
}

const ServerSidebar: React.FC<ServerSidebarProps> = ({ serverId }) => {
  return (
    <aside className="w-64 p-4 bg-gray-100 dark:bg-[#0e1525] border-r border-gray-200 dark:border-[#1e2a45] h-full">
      <h2 className="text-gray-800 dark:text-white font-bold mb-2">Server #{serverId}</h2>
      <p className="text-sm text-gray-500 dark:text-[#8a92b2]">Server sidebar coming soon.</p>
    </aside>
  )
}

export default ServerSidebar
