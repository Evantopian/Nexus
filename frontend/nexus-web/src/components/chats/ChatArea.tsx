import React, { useState, useEffect } from "react";
import { Socket, Channel } from "phoenix";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import ChatHeader from "@/components/chats/ChatHeader";
import MessageList from "@/components/chats/MessageList";
import MessageInput from "@/components/chats/MessageInput";
import NoMessagesFallback from "@/components/chats/NoMessagesFallback";

interface Message {
  id: string;
  body: string;
  user_id: string;
  conversation_id: string;
  created_at: string;
}

const DEV_USER_ID = "32673fee-5280-4134-a5f9-e339532bd7f9";

const ChatArea: React.FC = () => {
  const { contact: paramContact } = useParams<{ contact?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const myId = user?.uuid;
  const otherId = paramContact ?? DEV_USER_ID;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (user?.uuid) {
      localStorage.setItem("uuid", user.uuid);
    }
  }, [user]);

  useEffect(() => {
    if (!paramContact) {
      navigate(`/chat/direct/${DEV_USER_ID}`, { replace: true });
    }
  }, [paramContact, navigate]);

  useEffect(() => {
    if (!myId) return;

    const sock = new Socket("ws://localhost:4000/socket", {
      params: { user_id: myId },
    });
    sock.connect();
    setSocket(sock);

    return () => {
      sock.disconnect();
      setSocket(null);
    };
  }, [myId]);

  useEffect(() => {
    if (!socket) return;

    const chan = socket.channel(`dm:${otherId}`, {});
    chan.join()
      .receive("ok", ({ messages: hist }: { messages: Message[] }) => {
        setMessages(hist);
      })
      .receive("error", (err: any) => {
        console.error("DM join failed:", err);
      });

    chan.on("message:new", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    setChannel(chan);
    return () => {
      chan.leave();
      setChannel(null);
    };
  }, [socket, otherId]);

  const sendMessage = () => {
    if (channel && draft.trim()) {
      channel.push("message:new", { body: draft });
      setDraft("");
    }
  };

  if (!myId) {
    return <div className="p-4 text-gray-600">Loading user…</div>;
  }

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 rounded shadow-md overflow-hidden">
      <ChatHeader title={`Chat with ${otherId}`} />

      {messages.length > 0 ? (
        <MessageList
          messages={messages.map((m) => ({
            ...m,
            timestamp: m.created_at,
          }))}
          typingUsers={[]}
        />
      ) : (
        <NoMessagesFallback />
      )}

      <MessageInput
        value={draft}
        onChange={setDraft}
        onSend={sendMessage}
        onTyping={() => {}}
      />
    </div>
  );
};

export default ChatArea;
