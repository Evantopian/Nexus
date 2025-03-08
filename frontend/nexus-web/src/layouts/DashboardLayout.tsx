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

  // debugging for routing
  useEffect(() => {
    console.log("Current route:", location.pathname);
  }, [location]);

  // observer sidebar for the dashboard items to be dyanamic accoriding to it.
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

    // top navbar observer and cleaner
    const bodyElement = document.body;
    if (bodyElement) {
      topNavObserver.observe(bodyElement, {
        childList: true,
        subtree: true,
      });
    }

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardSidebar />
      <main
        className={`transition-all duration-300 ${sidebarWidth} w-[calc(100%-16rem)] mx-auto px-4 pb-8 ${topNavVisible ? "pt-24" : "pt-6"} overflow-x-hidden`}
        style={{
          width:
            sidebarWidth === "ml-56"
              ? "calc(100% - 14rem)"
              : "calc(100% - 4rem)",
        }}
      >
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default DashboardLayout;