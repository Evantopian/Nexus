import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/navigation/DashboardSidebar";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const [sidebarWidth, setSidebarWidth] = useState("ml-56");
  const [topNavVisible, setTopNavVisible] = useState(false);

  // Debug current route
  useEffect(() => {
    console.log("Current route:", location.pathname);
  }, [location]);

  useEffect(() => {
    const sidebarObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const sidebarElement = mutation.target as HTMLElement;
          if (sidebarElement.classList.contains("w-56")) {
            setSidebarWidth("ml-56");
          } else {
            setSidebarWidth("ml-16");
          }
        }
      });
    });

    // Monitor top navigation visibility
    const topNavObserver = new MutationObserver(() => {
      const topNav = document.querySelector(".fixed.top-0.left-0.right-0");
      setTopNavVisible(
        !!topNav && window.getComputedStyle(topNav).display !== "none",
      );
    });

    const sidebarElement = document.querySelector(".fixed.left-0.h-screen");
    if (sidebarElement) {
      sidebarObserver.observe(sidebarElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    // Observe the body for changes to detect when TopNavigation is added/removed
    const bodyElement = document.body;
    if (bodyElement) {
      topNavObserver.observe(bodyElement, {
        childList: true,
        subtree: true,
      });
    }

    // Check if TopNavigation is already visible on mount
    const topNav = document.querySelector(".fixed.top-0.left-0.right-0");
    setTopNavVisible(
      !!topNav && window.getComputedStyle(topNav).display !== "none",
    );

    return () => {
      sidebarObserver.disconnect();
      topNavObserver.disconnect();
    };
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <DashboardSidebar />
        <main
        className={`transition-all duration-300 ${sidebarWidth} pb-8 ${topNavVisible ? "pt-24" : "pt-6"}`}
        style={{
          width: sidebarWidth === "ml-56" ? "calc(100% - 14rem)" : "calc(100% - 4rem)",
          maxWidth: "100vw"
        }}
        >
          <div className="w-full h-full px-4">{children || <Outlet />}</div>
        </main>
    </div>
  );
};

export default DashboardLayout;