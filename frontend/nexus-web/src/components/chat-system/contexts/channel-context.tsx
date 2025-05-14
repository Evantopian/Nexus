import { createContext, useContext, ReactNode } from "react"

interface ChannelContextValue {
  // TODO: Channel-specific logic
}

const ChannelContext = createContext<ChannelContextValue | undefined>(undefined)

export const useChannel = () => {
  const context = useContext(ChannelContext)
  if (!context) throw new Error("useChannel must be used within a ChannelProvider")
  return context
}

interface ChannelProviderProps {
  apiBaseUrl: string
  children: ReactNode
}

export const ChannelProvider = ({ children }: ChannelProviderProps) => {
  const value = {} as ChannelContextValue
  return <ChannelContext.Provider value={value}>{children}</ChannelContext.Provider>
}
