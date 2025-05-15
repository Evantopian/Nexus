import { Menu } from 'lucide-react'

interface MobileMenuButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function MobileMenuButton({ onClick, isOpen }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`md:hidden p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
        isOpen 
          ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200" 
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <Menu size={20} />
    </button>
  )
}
