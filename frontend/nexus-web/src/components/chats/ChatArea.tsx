// ChatArea.tsx
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "phoenix";
import { MessageStorage } from "@/data/messageStorage";
import { useDebouncedCallback } from "use-debounce";

interface Message { user: string; body: string; }

const ChatArea: React.FC = () => {
  const { roomId, channelId } = useParams<{ roomId: string; channelId: string }>();
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(MessageStorage.load());
  const [channel, setChannel] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const usernameRef = useRef(`User${Math.floor(1000 + Math.random() * 9000)}`);
  const username = usernameRef.current;

  useEffect(() => {
    if (!roomId || !channelId) return;
    const topic = `room:${roomId}:${channelId}`;
    const socket = new Socket("ws://localhost:4000/socket", { params: { username } });
    socket.connect();

    const ch = socket.channel(topic);
    ch.join()
      .receive("ok", () => console.log(`Joined ${topic}`))
      .receive("error", (err: unknown) => console.error(`Failed to join ${topic}`, err));

    ch.on("message:new", (payload: Message) => {
      setMessagesMap((prev) => {
        const msgs = prev[topic] || [];
        const next = [...msgs, payload].slice(-100);
        const map = { ...prev, [topic]: next };
        MessageStorage.save(map);
        return map;
      });
    });

    ch.on("typing:start", ({ user }) =>
      setTypingUsers((prev) => (prev.includes(user) ? prev : [...prev, user]))
    );

    ch.on("typing:stop", ({ user }) =>
      setTypingUsers((prev) => prev.filter((u) => u !== user))
    );

    setChannel(ch);
    return () => { ch.leave(); socket.disconnect(); };
  }, [roomId, channelId, username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesMap, roomId, channelId]);

  const sendMessage = () => {
    if (channel && message.trim()) {
      channel.push("message:new", { user: username, body: message });
      setMessage("");
    }
  };

  const handleTyping = useDebouncedCallback(() => {
    if (!channel) return;
    channel.push("typing:start", { user: username });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      channel.push("typing:stop", { user: username });
    }, 2000);
  }, 200);

  const topic = `room:${roomId}:${channelId}`;
  const currentMessages = messagesMap[topic] || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="px-6 py-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold">
          {roomId?.toUpperCase()} / <span className="text-blue-600 dark:text-blue-400">#{channelId}</span>
        </h3>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700">
        {currentMessages.map((msg, idx) => (
          <div key={idx} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="font-medium text-blue-600 dark:text-blue-400">{msg.user}</div>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{msg.body}</p>
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div className="text-sm italic text-gray-500 dark:text-gray-400">
            {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      <footer className="sticky bottom-0 px-6 py-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4">
        <input
          type="text"
          value={message}
          onChange={(e) => { setMessage(e.target.value); handleTyping(); }}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default ChatArea;
