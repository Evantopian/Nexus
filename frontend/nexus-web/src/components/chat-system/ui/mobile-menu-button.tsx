"use client"

import { Menu } from "lucide-react"

interface MobileMenuButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function MobileMenuButton({ onClick, isOpen }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#6c5ce7] ${
        isOpen
          ? "bg-gray-200 dark:bg-[#2a2d3e] text-gray-800 dark:text-gray-200"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-800 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-[#2a2d3e]"
      }`}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <Menu size={20} />
    </button>
  )
}
