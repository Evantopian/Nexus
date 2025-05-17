import { ServerInfo } from "@/components/games/detail/GameServers";

export const dummyPosts = [
  {
    id: 1,
    title: "Need 3 for Valorant unrated",
    author: {
      avatar: "https://i.pravatar.cc/40?img=1",
      username: "valorpro",
    },
    tags: ["unrated", "casual", "NA-East"],
  },
  {
    id: 2,
    title: "Apex ranked grind tonight",
    author: {
      avatar: "https://i.pravatar.cc/40?img=2",
      username: "wraith_main",
    },
    tags: ["ranked", "mic-required", "night-grind"],
  },
  {
    id: 3,
    title: "Late night Fortnite duos",
    author: {
      avatar: "https://i.pravatar.cc/40?img=3",
      username: "buildgod",
    },
    tags: ["duos", "late-night", "chill"],
  },
];

export const serversDummy: ServerInfo[] = [
  {
    id: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14",
    name: "Game Dev Central",
    ownerId: "user-1",
    iconUrl: "https://example.com/icons/gamedev.png",
    roles: [
      { id: "role-1", name: "Admin", color: "#ff0000" },
      { id: "role-2", name: "Member", color: "#00ff00" },
    ],
    members: [
      {
        id: "member-1",
        userId: "user-1",
        serverId: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14",
        roleIds: ["role-1"],
      },
      {
        id: "member-2",
        userId: "user-2",
        serverId: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14",
        roleIds: ["role-2"],
      },
    ],
    categories: [
      {
        id: "cat-1",
        name: "General",
        serverId: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14",
      },
      {
        id: "cat-2",
        name: "Dev Talk",
        serverId: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14",
      },
    ],
    channels: [
      {
        id: "chan-1",
        name: "welcome",
        serverId: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14",
        categoryId: "cat-1",
        type: "TEXT",
      },
      {
        id: "chan-2",
        name: "announcements",
        serverId: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14",
        categoryId: "cat-1",
        type: "TEXT",
      },
      {
        id: "chan-3",
        name: "code-sharing",
        serverId: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14",
        categoryId: "cat-2",
        type: "TEXT",
      },
      {
        id: "chan-4",
        name: "voice-lounge",
        serverId: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14",
        categoryId: "cat-2",
        type: "VOICE",
      },
    ],
  },
];
