import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  href: string;
  active?: boolean;
  tooltip: string;
  label: string;
  expanded: boolean;
}

const NavItem = ({
  icon,
  href,
  active,
  tooltip,
  label,
  expanded,
}: NavItemProps) => {
  return (
    <Link to={href} className="relative group w-full">
      <div
        className={cn(
          "flex items-center rounded-lg py-2 px-3 transition-all duration-200",
          active
            ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        )}
      >
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          {icon}
        </div>
        {expanded && (
          <span className="ml-3 text-sm font-medium truncate-text max-w-[120px]">
            {label}
          </span>
        )}
        {!expanded && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 dark:bg-gray-700 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
            {tooltip}
          </div>
        )}
      </div>
    </Link>
  );
};

export default NavItem;
