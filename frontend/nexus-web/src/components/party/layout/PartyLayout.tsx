"use client"

import type { ReactNode } from "react"

interface PartyLayoutProps {
  leftContent: ReactNode
  rightContent: ReactNode
}

const PartyLayout = ({ leftContent, rightContent }: PartyLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center sm:text-left">Party System</h1>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="w-full lg:w-1/2">{leftContent}</div>

          {/* Right Column */}
          <div className="w-full lg:w-1/2">{rightContent}</div>
        </div>
      </div>
    </div>
  )
}

export default PartyLayout
