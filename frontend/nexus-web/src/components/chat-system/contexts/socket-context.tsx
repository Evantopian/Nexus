import { createContext, useContext, useMemo, ReactNode } from "react";
import { Socket } from "phoenix";
import { User } from "../ChatSystem";

type DMChannel = {
  sendMessage: (body: string) => void;
  leave: () => void;
};

type JoinDM = (
  conversationId: string,
  onMessage: (payload: any) => void
) => DMChannel;

interface SocketContextValue {
  joinDM: JoinDM;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

interface SocketProviderProps {
  socketUrl: string;
  user: User;
  onError?: (error: Error) => void;
  children: ReactNode;
}

export const SocketProvider = ({
  socketUrl,
  user,
  onError,
  children,
}: SocketProviderProps) => {
  // initialize Phoenix socket once
  const socket = useMemo(() => {
    const s = new Socket(socketUrl, { params: { token: user.id } });
    s.onError((error: any) => onError?.(new Error(`Socket error: ${error}`)));
    s.connect();
    return s;
  }, [socketUrl, user.id, onError]);

  const joinDM = useMemo<JoinDM>(
    () => (conversationId, onMessage) => {
      const topic = `dm:${conversationId}`;
      const channel = socket.channel(topic, {});

      channel
        .join()
        .receive("ok", () => console.log(`Joined ${topic}`))
        .receive("error", (err: any) => console.error(`Failed to join ${topic}`, err));

      channel.on("message:new", onMessage);

      return {
        sendMessage: (body: string) => {
          channel.push("message:new", {
            body,
            conversation_id: conversationId,
            sender_id: user.id,
            username: user.username,
          });
        },
        leave: () => channel.leave(),
      };
    },
    [socket]
  );

  return (
    <SocketContext.Provider value={{ joinDM }}>
      {children}
    </SocketContext.Provider>
  );
};
