"use client"

import { Outlet } from "react-router-dom"
import ServerList from "../components/ServerList"
import ServerSidebar from "../components/ServerSidebar"

export default function ServerLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-[#1a1b26] text-gray-900 dark:text-gray-200">
      <aside className="w-16 flex-shrink-0 border-r border-gray-200 dark:border-[#2a2d3e] bg-gray-50 dark:bg-[#16171f]">
        <ServerList />
      </aside>

      <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-[#2a2d3e] bg-white dark:bg-[#1e2030]">
        <ServerSidebar />
      </aside>

      <main className="flex-1 flex overflow-hidden min-w-0">
        <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
