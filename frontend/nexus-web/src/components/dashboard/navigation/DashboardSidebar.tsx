import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import NexusDragon from "@/assets/Nexus_Dragon.svg";
import TopNavigation from "./TopNavigation";
import SidebarContent from "./SidebarContent";
import ProfileMenu from "./ProfileMenu";
import cinnamoroll from "@/assets/dummydata/cinnamoroll.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";

const DashboardSidebar = () => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const [showTopNav, setShowTopNav] = useState(true);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpanded(false);
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedExpanded = localStorage.getItem("sidebar_expanded");
    const savedShowTopNav = localStorage.getItem("topnav_visible");

    if (savedExpanded !== null) {
      setExpanded(savedExpanded === "true");
    }

    if (savedShowTopNav !== null) {
      setShowTopNav(savedShowTopNav === "true");
    }
  }, []);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem("sidebar_expanded", expanded.toString());
    localStorage.setItem("topnav_visible", showTopNav.toString());
  }, [expanded, showTopNav]);

  const handleLogoClick = () => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;

    // checks fr double click
    if (timeDiff < 300) {
      setShowTopNav(!showTopNav);
    } else {
      setExpanded(!expanded);
    }

    setLastClickTime(currentTime);
  };

  return (
    <>
      {/* Header Bar - Contains logo and app name */}
      <div className="fixed left-0 top-0 z-50 flex items-center h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all duration-200 ease-in-out">
        {/* Dragon Logo */}
        <div
          className={cn(
            "w-16 h-16 flex items-center justify-center",
            !expanded && "border-r border-gray-600"
          )}
        >
          <img
            src={NexusDragon}
            alt="Nexus"
            className="h-10 w-auto cursor-pointer transition-transform duration-200 hover:scale-105 dark:filter dark:invert filter-none"
            style={{ transform: "scale(1.2)" }}
            onClick={handleLogoClick}
            title="Click to expand/collapse, double-click to show/hide top nav"
          />
        </div>
      </div>

      {/*User Profile */}
      <div className="fixed left-0 bottom-0 z-50 px-3 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-16 h-16 flex items-center justify-center">
        <button
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="relative group profile-trigger"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-700 flex-shrink-0 transition-all duration-200 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md">
            <img
              src={cinnamoroll}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {!profileMenuOpen && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 dark:bg-gray-700 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
              Profile Menu
            </div>
          )}
        </button>
        <ProfileMenu
          isOpen={profileMenuOpen}
          onClose={() => setProfileMenuOpen(false)}
        />
      </div>

      {/* Sidebar Container */}
      <div
        className={cn(
          "fixed left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 transition-all duration-200 ease-in-out",
          expanded ? "w-56" : "w-16",
          showTopNav ? "top-16" : "top-0",
          isMobile && !expanded && "-left-16",
          isMobile && expanded && "shadow-lg"
        )}
      >
        {/* Top section - logo spacer */}
        <div className="h-16"></div>

        {/* Middle section - scrollable content with hidden scrollbar */}
        <div className="absolute top-16 bottom-16 left-0 right-0 overflow-y-auto overflow-x-hidden hide-scrollbar px-1 py-2">
          <SidebarContent expanded={expanded} />
        </div>

        {/* Bottom section - profile spacer */}
        <div className="h-16"></div>
      </div>

      {/* Username - Only visible when sidebar is expanded */}
      {expanded && (
        <div className="fixed left-16 bottom-0 z-50 h-16 flex items-center transition-all duration-200 ease-in-out">
          <span className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
            {user?.username}
          </span>
        </div>
      )}

      {/* Top Navigation - always shown by default, can be toggled */}
      {showTopNav && <TopNavigation expanded={expanded} isMobile={isMobile} />}

      {/* Mobile overlay when sidebar is expanded */}
      {isMobile && expanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setExpanded(false)}
        />
      )}
    </>
  );
};

export default DashboardSidebar;
