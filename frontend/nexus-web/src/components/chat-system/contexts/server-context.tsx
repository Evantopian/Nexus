import { createContext, useContext, ReactNode } from "react"

interface ServerContextValue {
  // TODO: Server management logic
}

const ServerContext = createContext<ServerContextValue | undefined>(undefined)

export const useServer = () => {
  const context = useContext(ServerContext)
  if (!context) throw new Error("useServer must be used within a ServerProvider")
  return context
}

interface ServerProviderProps {
  apiBaseUrl: string
  children: ReactNode
}

export const ServerProvider = ({ children }: ServerProviderProps) => {
  const value = {} as ServerContextValue
  return <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
}
