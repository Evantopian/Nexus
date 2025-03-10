import { Link } from "react-router-dom";
import {
  Bell as NotificationsIcon,
  Mail as EmailIcon,
  LogOut as LogoutIcon,
  Menu as MenuIcon,
} from "lucide-react";

interface TopNavigationProps {
  expanded?: boolean;
  isMobile?: boolean;
}

const TopNavigation = ({ isMobile = false }: TopNavigationProps) => {
  return (
    <header
      className="fixed top-0 left-5 right-0 bg-white dark:bg-gray-800 z-40 shadow-sm transition-all duration-200 ease-in-out"
      data-topnav="true"
    >
      <div className="flex items-center justify-between h-16 pr-4 md:pr-8">
        {/* Left side navigation links */}
        <div className="flex items-center ml-20">
          {/* Mobile menu button - only visible on small screens */}
          {isMobile && (
            <button className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <MenuIcon className="text-gray-600 dark:text-gray-300" />
            </button>
          )}

          <div className="hidden md:flex space-x-6 lg:space-x-10">
            <Link
              to="/dashboard"
              className="text-gray-800 dark:text-gray-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors duration-200 hover:scale-105 transform"
            >
              Following
            </Link>
            <Link
              to="/browse"
              className="text-gray-800 dark:text-gray-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors duration-200 hover:scale-105 transform"
            >
              Browse
            </Link>
            <Link
              to="/lfg"
              className="text-gray-800 dark:text-gray-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors duration-200 hover:scale-105 transform"
            >
              LFG
            </Link>
            <Link
              to="/players"
              className="text-gray-800 dark:text-gray-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors duration-200 hover:scale-105 transform"
            >
              Players
            </Link>
            <Link
              to="/events"
              className="text-gray-800 dark:text-gray-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors duration-200 hover:scale-105 transform"
            >
              Events
            </Link>
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-2 md:space-x-6">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md relative transition-all duration-200">
            <EmailIcon className="text-gray-600 dark:text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200">
            <NotificationsIcon className="text-gray-600 dark:text-gray-300" />
          </button>
          <Link
            to="/logout"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200"
          >
            <LogoutIcon className="text-gray-600 dark:text-gray-300" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;