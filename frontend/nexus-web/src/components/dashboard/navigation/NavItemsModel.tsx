import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ChatIcon from "@mui/icons-material/Chat";
import GroupsIcon from "@mui/icons-material/Groups";
import RivalsIcon from "@/assets/pages/games/MarvelRivals/MarvelRivalsIcon.jpg";

export interface NavItem {
  icon: React.ReactNode;
  href: string;
  tooltip: string;
  label: string;
}

// Section 1: Followed Games
export const followedGames: NavItem[] = [
  {
    icon: (
      <img
        src={RivalsIcon}
        alt="Marvel Rivals Icon"
        style={{ width: 34, height: 32, borderRadius: "10px" }}
      />
    ),
    href: "/games/marvel-rivals",
    tooltip: "Marvel Rivals",
    label: "Marvel Rivals",
  },
  {
    icon: <SportsEsportsIcon sx={{ fontSize: 20 }} />,
    href: "/games/minecraft",
    tooltip: "Minecraft",
    label: "Minecraft",
  },
  {
    icon: <SportsEsportsIcon sx={{ fontSize: 20 }} />,
    href: "/games/valorant",
    tooltip: "Valorant",
    label: "Valorant",
  },
];

// Section 2: Chat/DMs
export const chatItems: NavItem[] = [
  {
    icon: <ChatIcon sx={{ fontSize: 20 }} />,
    href: "/chat/direct", // <-- updated to match "direct/:contact"
    tooltip: "Direct Messages",
    label: "Direct Messages",
  },
  {
    icon: <ChatIcon sx={{ fontSize: 20 }} />,
    href: "/chat/groups", // <-- updated to match "groups/:groupId"
    tooltip: "Group Chats",
    label: "Group Chats",
  },
];

// Section 3: Servers/Group Chats
export const serverItems: NavItem[] = [
  {
    icon: <GroupsIcon sx={{ fontSize: 20 }} />,
    href: "chat/servers/",
    tooltip: "Gaming Server",
    label: "Gaming Server",
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 20 }} />,
    href: "/servers/esports",
    tooltip: "Esports Server",
    label: "Esports Server",
  },
];
