// src/components/chats/ChatArea.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Socket } from "phoenix";
import { MessageStorage, Message } from "@/data/messageStorage";
import { useDebouncedCallback } from "use-debounce";
import TabBar from "./TabBar";

const tabs = ["Direct Messages", "Group Chats"];

const ChatArea: React.FC = () => {
  const { contact } = useParams<{ contact: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial active tab from URL
  const initialTab = location.pathname.includes("/chat/groups/")
    ? tabs[1]
    : tabs[0];
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(MessageStorage.load());
  const [channel, setChannel] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const username = useRef(
    `User${Math.floor(1000 + Math.random() * 9000)}`
  ).current;

  // Handle tab changes by navigating
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === tabs[0]) {
      navigate(`/chat/direct/${contact}`, { replace: true });
    } else {
      navigate(`/chat/groups/${contact}`, { replace: true });
    }
  };

  // Subscribe to Phoenix channel
  useEffect(() => {
    if (!contact) return;
    const topic = activeTab === tabs[0] ? `dm:${contact}` : `room:${contact}`;
    const socket = new Socket("ws://localhost:4000/socket", {
      params: { username },
    });
    socket.connect();

    const ch = socket.channel(topic);
    ch.join()
      .receive("error", (err: any) => console.error("Channel join failed", err));

    ch.on("message:new", (msg: Message) => {
      setMessagesMap(prev => {
        const arr = prev[topic] || [];
        const next = [...arr, msg].slice(-200);
        const updated = { ...prev, [topic]: next };
        MessageStorage.save(updated);
        return updated;
      });
    });

    ch.on("typing:start", ({ user }) =>
      setTypingUsers(p => (p.includes(user) ? p : [...p, user]))
    );
    ch.on("typing:stop", ({ user }) =>
      setTypingUsers(p => p.filter(u => u !== user))
    );

    setChannel(ch);
    return () => {
      ch.leave();
      socket.disconnect();
    };
  }, [activeTab, contact, username]);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesMap, activeTab, contact]);

  // Send message
  const sendMessage = () => {
    if (channel && message.trim()) {
      channel.push("message:new", { user: username, body: message });
      setMessage("");
    }
  };

  // Typing indicator
  const handleTyping = useDebouncedCallback(() => {
    if (!channel) return;
    channel.push("typing:start", { user: username });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      channel.push("typing:stop", { user: username });
    }, 2000);
  }, 200);

  // Determine messages to display
  const topicKey =
    activeTab === tabs[0] ? `dm:${contact}` : `room:${contact}`;
  const currentMessages = messagesMap[topicKey] || [];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden min-h-0">
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {contact}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {currentMessages.map((msg, i) => (
          <div key={i} className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
              {msg.user[0]}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium text-indigo-600 dark:text-indigo-300">
                  {msg.user}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(msg.timestamp!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="mt-1 text-gray-700 dark:text-gray-300">{msg.body}</p>
            </div>
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div className="py-2 text-sm italic text-gray-500 dark:text-gray-400">
            {typingUsers.join(", ")} typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-3">
        <textarea
          rows={1}
          value={message}
          onChange={e => { setMessage(e.target.value); handleTyping(); }}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Type a message…"
          className="flex-1 resize-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
        />
        <button onClick={sendMessage} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;