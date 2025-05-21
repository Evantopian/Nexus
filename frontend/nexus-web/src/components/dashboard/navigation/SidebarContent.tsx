// src/components/SidebarContent.tsx
import { useLocation } from "react-router-dom";
import { chatItems as rawChatItems, serverItems } from "./NavItemsModel";
import NavItem from "./NavItem";
import { NavItemData } from "./NavItemsModel";
import SectionHeader from "./SectionHeader";
import { useFollowedGames } from "@/contexts/FollowedGamesContext";

interface SidebarContentProps {
  expanded: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ expanded }) => {
  const location = useLocation();

  const chatItems = rawChatItems.map((item) => {
    let href = item.href;
    if (item.href.includes("/chat/direct")) {
      href = "/chat/dms";
    }
    return { ...item, href };
  });

  const { followedGames } = useFollowedGames();

  const reformattedFollowedGames: NavItemData[] = followedGames.map((game) => ({
    icon: (
      <img
        src={game.logo}
        alt={`${game.title} Logo`}
        style={{ width: 34, height: 32, borderRadius: "10px" }}
      />
    ),
    href: `/games/${game.slug}`,
    tooltip: game.title,
    label: game.title,
  }));

  // console.log(reformattedFollowedGames);

  return (
    <div className="w-full overflow-hidden">
      {/* Section 1: Followed Games */}
      <div className="mb-6 w-full">
        <SectionHeader title="GAMES" expanded={expanded} />
        <div className="space-y-1">
          {reformattedFollowedGames.map((item, i) => (
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
              active={
                item.href === "/chat"
                  ? location.pathname === "/chat"
                  : location.pathname.startsWith(item.href)
              }
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
              key={`chat/server-${i}`}
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
