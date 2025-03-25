import {useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  HelpCircle,
  Bell,
  Palette,
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import cinnamoroll from "@/assets/dummydata/cinnamoroll.jpg"


interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileMenu = ({ isOpen, onClose }: ProfileMenuProps) => {
  const { theme, setTheme } = useTheme();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".profile-menu") &&
        !target.closest(".profile-trigger")
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="profile-menu absolute bottom-16 left-16 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-700 mr-3">
            <img
              src={cinnamoroll}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-100">
              @Tamothy
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Level 21 • Okayish Gamer
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <Link
          to="/profile"
          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <User className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
          Profile
        </Link>
        <Link
          to="/settings"
          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Settings className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
          Settings
        </Link>
        <Link
          to="/notifications"
          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Bell className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
          Notifications
        </Link>

        {/* Theme Toggle */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Appearance
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center justify-center p-2 rounded-md ${theme === "light" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}
            >
              <Sun className="h-4 w-4" />
              <span className="ml-2 text-xs">Light</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center justify-center p-2 rounded-md ${theme === "dark" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}
            >
              <Moon className="h-4 w-4" />
              <span className="ml-2 text-xs">Dark</span>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex items-center justify-center p-2 rounded-md ${theme === "system" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}
            >
              <Palette className="h-4 w-4" />
              <span className="ml-2 text-xs">Auto</span>
            </button>
          </div>
        </div>

        {/* Help & Logout */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
          <Link
            to="/help"
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <HelpCircle className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
            Help & Support
          </Link>
          <Link
            to="/logout"
            className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;