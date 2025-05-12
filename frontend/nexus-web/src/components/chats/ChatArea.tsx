import React, { useState, useEffect } from "react";
import { Socket, Channel } from "phoenix";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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

  // Redirect if no contact param is set
  useEffect(() => {
    if (!paramContact) {
      navigate(`/chat/direct/${DEV_USER_ID}`, { replace: true });
    }
  }, [paramContact, navigate]);

  // Connect the Phoenix socket when `myId` is available
  useEffect(() => {
    if (!myId) return;

    console.log("🔌 Connecting to Phoenix with user_id:", myId);

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

  // Join the direct message channel when socket + otherId change
  useEffect(() => {
    if (!socket || !myId || !otherId) return;

    const chan = socket.channel(`dm:${otherId}`, {});

    chan.join()
      .receive("ok", ({ messages: hist }: { messages: Message[] }) => {
        console.log("🟢 Joined DM channel. Loaded messages:", hist);
        setMessages(hist);
      })
      .receive("error", (err: any) => {
        console.error("❌ Failed to join DM channel:", err);
      });

    chan.on("message:new", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    setChannel(chan);

    return () => {
      chan.leave();
      setChannel(null);
    };
  }, [socket, myId, otherId]);

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
    <div className="flex flex-col flex-1 bg-white rounded shadow-md overflow-hidden">
      <header className="p-4 border-b text-sm text-gray-700">
        Chat with <span className="font-mono text-blue-600">{otherId}</span>
      </header>

      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[75%] px-3 py-2 rounded ${
              m.user_id === myId
                ? "bg-blue-100 ml-auto text-right"
                : "bg-gray-100 mr-auto text-left"
            }`}
          >
            <div>{m.body}</div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(m.created_at).toLocaleTimeString()}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-gray-400 italic">No messages yet.</div>
        )}
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          placeholder="Type your message…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
