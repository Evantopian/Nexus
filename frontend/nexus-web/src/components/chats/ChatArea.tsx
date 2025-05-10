import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Socket } from "phoenix";
import { MessageStorage } from "@/data/messageStorage";
import { useDebouncedCallback } from "use-debounce";
import TabBar from "./TabBar";
import { Message } from "@/types/chat";

const CONTACT_NAMES = ["Alice", "Bob", "Charlie"];

const ChatArea: React.FC = () => {
  const { contact, groupId } = useParams<{
    contact?: string;
    groupId?: string;
  }>();
  const navigate = useNavigate();
  const tabs = ["Direct Messages", "Group Chats"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(
    MessageStorage.load()
  );
  const [channel, setChannel] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const username = useRef(
    `User${Math.floor(1000 + Math.random() * 9000)}`
  ).current;

  // Determine if there is any direct-conversation content
  const msgsMap = MessageStorage.load();
  const hasContent = CONTACT_NAMES.some(
    (name) => (msgsMap[`dm:${name}`] || []).length > 0
  );

  // Auto-redirect if needed
  useEffect(() => {
    if (activeTab === tabs[0] && !contact && hasContent) {
      const lastList = CONTACT_NAMES.map((name) => {
        const arr = msgsMap[`dm:${name}`] || [];
        const ts = arr.length
          ? new Date(arr[arr.length - 1].timestamp!).getTime()
          : 0;
        return { name, ts };
      })
        .sort((a, b) => b.ts - a.ts)
        .map((x) => x.name);
      navigate(`/chat/direct/${lastList[0]}`, { replace: true });
    }
    if (activeTab === tabs[1] && !groupId) {
      navigate(`/chat/groups/general`, { replace: true });
    }
  }, [activeTab, contact, groupId, navigate, hasContent, msgsMap]);

  // If no content and no contact selected, show placeholder
  if (activeTab === tabs[0] && !contact && !hasContent) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        No conversations. Add friends to start chatting.
      </div>
    );
  }

  // Phoenix channel setup
  useEffect(() => {
    const topic =
      activeTab === tabs[0]
        ? contact
          ? `dm:${contact}`
          : null
        : `group:${groupId || "general"}`;
    if (!topic) return;

    const socket = new Socket("ws://localhost:4000/socket", {
      params: { username },
    });
    socket.connect();

    const ch = socket.channel(topic);
    ch.join();
    ch.on("message:new", (msg: Message) => {
      setMessagesMap((prev) => {
        const arr = prev[topic] || [];
        const next = [
          ...arr,
          { ...msg, timestamp: msg.timestamp || new Date().toISOString() },
        ].slice(-200);
        const updated = { ...prev, [topic]: next };
        MessageStorage.save(updated);
        return updated;
      });
    });
    ch.on("typing:start", ({ user }) =>
      setTypingUsers((p) => (p.includes(user) ? p : [...p, user]))
    );
    ch.on("typing:stop", ({ user }) =>
      setTypingUsers((p) => p.filter((u) => u !== user))
    );

    setChannel(ch);
    return () => {
      ch.leave();
      socket.disconnect();
    };
  }, [activeTab, contact, groupId, username]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesMap, activeTab]);

  // Send & typing handlers
  const sendMessage = () => {
    if (channel && message.trim()) {
      channel.push("message:new", {
        user: username,
        body: message,
        timestamp: new Date().toISOString(),
      });
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

  const topicKey =
    activeTab === tabs[0] ? `dm:${contact}` : `group:${groupId || "general"}`;
  const currentMessages = messagesMap[topicKey] || [];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden min-h-0">
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {activeTab === tabs[0] ? contact : groupId || "general"}
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
                  {new Date(msg.timestamp!).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message…"
          className="flex-1 resize-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
