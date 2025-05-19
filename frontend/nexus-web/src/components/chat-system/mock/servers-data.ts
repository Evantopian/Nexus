export interface ServerMember {
  user: {
    id: string
    username: string
  }
  roleIds: string[]
}

export interface Role {
  id: string
  name: string
  permissions: string[]
}

export interface ServerCategory {
  id: string
  name: string
  channelIds: string[]
}

export interface Channel {
  id: string
  name: string
  type: "TEXT" | "VOICE" | "ANNOUNCEMENT"
  serverId: string
  participants: {
    id: string
    username: string
  }[]
  messages: any[]
  lastMessage?: any
  topic?: string
  slowModeSeconds?: number
  categoryId?: string
}

export interface Server {
  description: string
  id: string
  name: string
  ownerId: string
  iconUrl?: string
  members: ServerMember[]
  roles: Role[]
  channels: Channel[]
  categories: ServerCategory[]
}

// Mock data for servers
export const mockServers: Server[] = [
  {
      id: "server-1",
      name: "Gaming Hub",
      description: "A place for gamers to chat and play together.",
      ownerId: "user-1",
      iconUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=GamingHub",
      members: [
      {
        user: { id: "user-1", username: "GameMaster" },
        roleIds: ["role-1"],
      },
      {
        user: { id: "user-2", username: "ProGamer" },
        roleIds: ["role-2"],
      },
      {
        user: { id: "user-3", username: "CasualPlayer" },
        roleIds: ["role-3"],
      },
      {
        user: { id: "user-4", username: "Streamer" },
        roleIds: ["role-2"],
      },
      {
        user: { id: "user-5", username: "Newbie" },
        roleIds: ["role-3"],
      },
    ],
    roles: [
      {
        id: "role-1",
        name: "Admin",
        permissions: ["MANAGE_SERVER", "MANAGE_CHANNELS", "MANAGE_ROLES"],
      },
      {
        id: "role-2",
        name: "Moderator",
        permissions: ["MANAGE_MESSAGES", "KICK_MEMBERS"],
      },
      {
        id: "role-3",
        name: "Member",
        permissions: ["SEND_MESSAGES", "READ_MESSAGES"],
      },
    ],
    categories: [
      {
        id: "cat-1",
        name: "General",
        channelIds: ["channel-1", "channel-2"],
      },
      {
        id: "cat-2",
        name: "Games",
        channelIds: ["channel-3", "channel-4"],
      },
      {
        id: "cat-3",
        name: "Voice",
        channelIds: ["channel-5"],
      },
    ],
    channels: [
      {
        id: "channel-1",
        name: "welcome",
        type: "TEXT",
        serverId: "server-1",
        categoryId: "cat-1",
        participants: [],
        messages: [],
        topic: "Welcome to the Gaming Hub!",
      },
      {
        id: "channel-2",
        name: "general",
        type: "TEXT",
        serverId: "server-1",
        categoryId: "cat-1",
        participants: [],
        messages: [],
        topic: "General discussion",
      },
      {
        id: "channel-3",
        name: "fps-games",
        type: "TEXT",
        serverId: "server-1",
        categoryId: "cat-2",
        participants: [],
        messages: [],
        topic: "FPS games discussion",
      },
      {
        id: "channel-4",
        name: "moba-games",
        type: "TEXT",
        serverId: "server-1",
        categoryId: "cat-2",
        participants: [],
        messages: [],
        topic: "MOBA games discussion",
      },
      {
        id: "channel-5",
        name: "Gaming Voice",
        type: "VOICE",
        serverId: "server-1",
        categoryId: "cat-3",
        participants: [],
        messages: [],
      },
    ],
  },
  {
    id: "server-2",
    name: "Dev Community",
    description: "A community for developers to share and learn.",
    ownerId: "user-2",
    iconUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=DevCommunity",
    members: [
      {
        user: { id: "user-2", username: "ProGamer" },
        roleIds: ["role-1"],
      },
      {
        user: { id: "user-1", username: "GameMaster" },
        roleIds: ["role-2"],
      },
      {
        user: { id: "user-6", username: "CodeWizard" },
        roleIds: ["role-2"],
      },
      {
        user: { id: "user-7", username: "DesignGuru" },
        roleIds: ["role-3"],
      },
    ],
    roles: [
      {
        id: "role-1",
        name: "Admin",
        permissions: ["MANAGE_SERVER", "MANAGE_CHANNELS", "MANAGE_ROLES"],
      },
      {
        id: "role-2",
        name: "Developer",
        permissions: ["MANAGE_MESSAGES", "KICK_MEMBERS"],
      },
      {
        id: "role-3",
        name: "Member",
        permissions: ["SEND_MESSAGES", "READ_MESSAGES"],
      },
    ],
    categories: [
      {
        id: "cat-1",
        name: "General",
        channelIds: ["channel-1", "channel-2"],
      },
      {
        id: "cat-2",
        name: "Development",
        channelIds: ["channel-3", "channel-4", "channel-5"],
      },
    ],
    channels: [
      {
        id: "channel-1",
        name: "welcome",
        type: "TEXT",
        serverId: "server-2",
        categoryId: "cat-1",
        participants: [],
        messages: [],
        topic: "Welcome to the Dev Community!",
      },
      {
        id: "channel-2",
        name: "announcements",
        type: "ANNOUNCEMENT",
        serverId: "server-2",
        categoryId: "cat-1",
        participants: [],
        messages: [],
        topic: "Important announcements",
      },
      {
        id: "channel-3",
        name: "frontend",
        type: "TEXT",
        serverId: "server-2",
        categoryId: "cat-2",
        participants: [],
        messages: [],
        topic: "Frontend development discussion",
      },
      {
        id: "channel-4",
        name: "backend",
        type: "TEXT",
        serverId: "server-2",
        categoryId: "cat-2",
        participants: [],
        messages: [],
        topic: "Backend development discussion",
      },
      {
        id: "channel-5",
        name: "design",
        type: "TEXT",
        serverId: "server-2",
        categoryId: "cat-2",
        participants: [],
        messages: [],
        topic: "Design discussion",
      },
    ],
  },
]

// Helper function to get a server by ID
export function getServerById(id: string): Server | undefined {
  return mockServers.find((server) => server.id === id)
}

// Helper function to get a channel by ID
export function getChannelById(id: string): Channel | undefined {
  for (const server of mockServers) {
    const channel = server.channels.find((channel) => channel.id === id)
    if (channel) return channel
  }
  return undefined
}

// Helper function to get channels by category ID
export function getChannelsByCategoryId(serverId: string, categoryId: string): Channel[] {
  const server = getServerById(serverId)
  if (!server) return []

  const category = server.categories.find((cat) => cat.id === categoryId)
  if (!category) return []

  return server.channels.filter((channel) => category.channelIds.includes(channel.id))
}
