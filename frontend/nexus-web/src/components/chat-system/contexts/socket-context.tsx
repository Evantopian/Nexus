import  { createContext, useContext, ReactNode } from "react"
import { User } from "../ChatSystem"

interface SocketContextValue {
  // TODO: Add socket connection, events, etc.
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) throw new Error("useSocket must be used within a SocketProvider")
  return context
}

interface SocketProviderProps {
  socketUrl: string
  user: User
  onError?: (error: Error) => void
  children: ReactNode
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const value = {} as SocketContextValue
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
