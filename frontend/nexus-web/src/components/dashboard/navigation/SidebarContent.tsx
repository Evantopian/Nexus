// src/components/SidebarContent.tsx
import { useLocation } from "react-router-dom";
import {
  followedGames,
  chatItems as rawChatItems,
  serverItems,
} from "./NavItemsModel";
import NavItem from "./NavItem";
import SectionHeader from "./SectionHeader";

interface SidebarContentProps {
  expanded: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ expanded }) => {
  const location = useLocation();

  // Remap the “Direct Messages” link to /chat (so your index route logic will run)
  const chatItems = rawChatItems.map((item) => {
    let href = item.href;
    if (item.href.includes("/chat/direct")) {
      href = "/chat";
    }
    // if you ever have a standalone “all groups” link you could map that here too:
    // else if (item.href.includes("/chat/groups")) {
    //   href = "/chat/groups";
    // }
    return { ...item, href };
  });

  return (
    <div className="w-full overflow-hidden">
      {/* Section 1: Followed Games */}
      <div className="mb-6 w-full">
        <SectionHeader title="GAMES" expanded={expanded} />
        <div className="space-y-1">
          {followedGames.map((item, i) => (
            <NavItem
              key={`game-${i}`}
              {...item}
              active={location.pathname === item.href}
              expanded={expanded}
            />
          ))}
        </div>
      </div>

      {/* Section 2: Chats */}
      <div className="mb-6 w-full">
        <SectionHeader title="CHATS" expanded={expanded} />
        <div className="space-y-1">
          {chatItems.map((item, i) => (
            <NavItem
              key={`chat-${i}`}
              icon={item.icon}
              href={item.href}
              tooltip={item.tooltip}
              label={item.label}
              active={location.pathname.startsWith(item.href)}
              expanded={expanded}
            />
          ))}
        </div>
      </div>

      {/* Section 3: Servers/Group Chats */}
      <div className="mb-6 w-full">
        <SectionHeader title="SERVERS" expanded={expanded} />
        <div className="space-y-1">
          {serverItems.map((item, i) => (
            <NavItem
              key={`server-${i}`}
              {...item}
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
