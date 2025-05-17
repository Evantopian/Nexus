import { createContext, useContext, ReactNode } from "react"

interface PresenceContextValue {
  // TODO: Track user presence and status
}

const PresenceContext = createContext<PresenceContextValue | undefined>(undefined)

export const usePresence = () => {
  const context = useContext(PresenceContext)
  if (!context) throw new Error("usePresence must be used within a PresenceProvider")
  return context
}

export const PresenceProvider = ({ children }: { children: ReactNode }) => {
  const value = {} as PresenceContextValue
  return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>
}
