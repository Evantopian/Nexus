import { useLocation } from "react-router-dom";
import { followedGamesTest, chatItems, serverItems } from "./NavItemsModel";
import NavItem from "./NavItem";
import SectionHeader from "./SectionHeader";
// import { useAuth } from "@/contexts/AuthContext";
// import { useQuery } from "@apollo/client";
// import { GET_USER_FOLLOWED_GAMES } from "@/graphql/userQueries";

interface SidebarContentProps {
  expanded: boolean;
}

const SidebarContent = ({ expanded }: SidebarContentProps) => {
  const location = useLocation();
  // const { user } = useAuth();
  // const { data, loading, error } = useQuery(GET_USER_FOLLOWED_GAMES, {
  //   variables: { userId: user?.uuid },
  // });

  // const followedGames = data?.getUserFollowedGames ?? [];

  // console.log("Followed Games", followedGames);

  return (
    <div className="w-full overflow-hidden">
      {/* Section 1: Followed Games */}
      <div className="mb-6 w-full">
        <SectionHeader title="GAMES" expanded={expanded} />
        <div className="space-y-1">
          {followedGamesTest.map((item, index) => (
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
