export interface GroupConversation {
  id: string
  name: string
  participants: {
    id: string
    username: string
    profileImg?: string
  }[]
  lastMessage: string
  lastActive: Date
  messages: any[]
}

// Mock data for group conversations
export const mockGroupConversations: GroupConversation[] = [
  {
    id: "group-1",
    name: "Gaming Squad",
    participants: [
      { id: "user-1", username: "GameMaster" },
      { id: "user-2", username: "ProGamer" },
      { id: "user-3", username: "CasualPlayer" },
      { id: "user-4", username: "Streamer" },
    ],
    lastMessage: "When are we playing tonight?",
    lastActive: new Date(),
    messages: [],
  },
  {
    id: "group-2",
    name: "Project Team",
    participants: [
      { id: "user-2", username: "ProGamer" },
      { id: "user-6", username: "CodeWizard" },
      { id: "user-7", username: "DesignGuru" },
    ],
    lastMessage: "Let's meet tomorrow to discuss the new features",
    lastActive: new Date(Date.now() - 3600000), // 1 hour ago
    messages: [],
  },
  {
    id: "group-3",
    name: "Weekend Plans",
    participants: [
      { id: "user-1", username: "GameMaster" },
      { id: "user-3", username: "CasualPlayer" },
      { id: "user-5", username: "Newbie" },
    ],
    lastMessage: "Who's up for a movie this weekend?",
    lastActive: new Date(Date.now() - 86400000), // 1 day ago
    messages: [],
  },
  {
    id: "group-4",
    name: "Study Group",
    participants: [
      { id: "user-5", username: "Newbie" },
      { id: "user-6", username: "CodeWizard" },
      { id: "user-7", username: "DesignGuru" },
    ],
    lastMessage: "I've shared the study materials in the drive",
    lastActive: new Date(Date.now() - 172800000), // 2 days ago
    messages: [],
  },
]

// Helper function to get a group conversation by ID
export function getGroupConversationById(id: string): GroupConversation | undefined {
  return mockGroupConversations.find((group) => group.id === id)
}
