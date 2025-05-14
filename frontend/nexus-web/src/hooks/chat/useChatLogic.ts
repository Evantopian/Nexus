import { useDirectMessages } from "./useDirectMessages"
import { ChatTarget } from "@/types/chat"

export const useChatLogic = (target: ChatTarget | null) => {
  const dm = useDirectMessages(target?.type === "dm" ? target.id : "")

  if (!target) {
    return { messages: [], sendMessage: () => {} }
  }

  switch (target.type) {
    case "dm":
      return dm
    // future: group, channel...
    default:
      return { messages: [], sendMessage: () => {} }
  }
}
