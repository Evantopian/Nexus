import { useLocation } from "react-router-dom";
import { followedGames, chatItems, serverItems } from "./NavItemsModel";
import NavItem from "./NavItem";
import SectionHeader from "./SectionHeader";

interface SidebarContentProps {
  expanded: boolean;
}

const SidebarContent = ({ expanded }: SidebarContentProps) => {
  const location = useLocation();

  return (
    <div className="w-full overflow-hidden">
      {/* Section 1: Followed Games */}
      <div className="mb-6 w-full">
        <SectionHeader title="GAMES" expanded={expanded} />
        <div className="space-y-1">
          {followedGames.map((item, index) => (
            <NavItem
              key={`game-${index}`}
              icon={item.icon}
              href={item.href}
              tooltip={item.tooltip}
              label={item.label}
              active={location.pathname === item.href}
              expanded={expanded}
            />
          ))}
        </div>
      </div>

      {/* Section 2: Chat/DMs */}
      <div className="mb-6 w-full">
        <SectionHeader title="CHATS" expanded={expanded} />
        <div className="space-y-1">
          {chatItems.map((item, index) => (
            <NavItem
              key={`chat-${index}`}
              icon={item.icon}
              href={item.href}
              tooltip={item.tooltip}
              label={item.label}
              active={location.pathname === item.href}
              expanded={expanded}
            />
          ))}
        </div>
      </div>

      {/* Section 3: Servers/Group Chats */}
      <div className="mb-6 w-full">
        <SectionHeader title="SERVERS" expanded={expanded} />
        <div className="space-y-1">
          {serverItems.map((item, index) => (
            <NavItem
              key={`server-${index}`}
              icon={item.icon}
              href={item.href}
              tooltip={item.tooltip}
              label={item.label}
              active={location.pathname === item.href}
              expanded={expanded}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarContent;