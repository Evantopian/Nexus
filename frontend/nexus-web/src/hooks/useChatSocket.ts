// src/hooks/useChatSocket.ts
import { useEffect, useRef, useState } from "react";
import { Socket, Channel } from "phoenix";

export function useChatSocket(topic: string, token: string | null) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token || !topic) return;

    const socket = new Socket("ws://localhost:4000/socket", {
      params: { token },
    });
    socket.connect();
    socketRef.current = socket;

    const ch = socket.channel(topic);
    ch.join()
      .receive("ok", () => setChannel(ch))
      .receive("error", (e: any) => console.error("Channel join failed", e));

    return () => {
      ch.leave();
      socket.disconnect();
    };
  }, [token, topic]);

  return { channel };
}
