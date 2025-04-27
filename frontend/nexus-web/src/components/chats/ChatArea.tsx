
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "phoenix";
import { MessageStorage } from "@/data/messageStorage";
import { useDebouncedCallback } from "use-debounce"; 

interface Message {
  user: string;
  body: string;
}

const ChatArea = () => {
  const { roomId, channelId } = useParams();
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(MessageStorage.load());
  const [socket, setSocket] = useState<Socket | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const usernameRef = useRef(`User${Math.floor(1000 + Math.random() * 9000)}`);
  const username = usernameRef.current;
  
  useEffect(() => {
    if (!roomId || !channelId) return;

    const newSocket = new Socket("ws://localhost:4000/socket", {
      params: { token: "dummy_token", username },
    });
    newSocket.connect();
    setSocket(newSocket);

    const topic = `room:${roomId}:${channelId}`;
    const newChannel = newSocket.channel(topic, {});
    setChannel(newChannel);

    newChannel.join()
      .receive("ok", () => console.log(`Joined ${topic}`))
      .receive("error", (err: any) => console.error(`Failed to join ${topic}`, err));

    // Message receiving
    newChannel.on("message:new", (payload: Message) => {
      const topic = `room:${roomId}:${channelId}`;

      setMessagesMap(prev => {
        const currentMessages = prev[topic] || [];
        const updatedMessages = [...currentMessages, payload];
        if (updatedMessages.length > 50) {
          updatedMessages.shift(); // queue size of 50, lim it
        }
        const newMap = { ...prev, [topic]: updatedMessages };
        MessageStorage.save(newMap);
        return newMap;
      });
    });

    newChannel.on("typing:start", (payload: { user: string }) => {
      setTypingUsers(prev => {
        if (!prev.includes(payload.user)) {
          return [...prev, payload.user];
        }
        return prev;
      });
    });

    newChannel.on("typing:stop", (payload: { user: string }) => {
      setTypingUsers(prev => prev.filter(u => u !== payload.user));
    });

    return () => {
      newChannel.leave();
      newSocket.disconnect();
      setChannel(null);
      setSocket(null);
    };
  }, [roomId, channelId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesMap, roomId, channelId]);

  const sendMessage = () => {
    if (channel && message.trim() !== "") {
      channel.push("message:new", { user: username, body: message });
      setMessage("");
    }
  };

  // using debounce (read, it's best practice) to avoid sending too many typing events
  const handleTyping = useDebouncedCallback(() => {
    if (!channel) return;
  
    setTypingUsers(prev => {
      if (!prev.includes(username)) {
        return [...prev, username];
      }
      return prev;
    });
  
    channel.push("typing:start", { user: username });
  
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
  
    typingTimeout.current = setTimeout(() => {
      setTypingUsers(prev => prev.filter(u => u !== username));
      channel.push("typing:stop", { user: username });
    }, 3000); // 3s 
  }, 300);
  

  const topic = `room:${roomId}:${channelId}`;
  const currentMessages = messagesMap[topic] || [];

  return (
    <div className="flex flex-col h-full w-full bg-[#1E1E2F] text-white rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-[#2C2C3E] shadow-md">
        <div className="text-lg font-bold">
          {(roomId?.toUpperCase() ?? "Unknown Room")} / #{channelId?.replace("-", " ") ?? "Unknown Channel"}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {currentMessages.map((msg, idx) => (
          <div
            key={idx}
            className="p-3 bg-[#2C2C3E] rounded-lg shadow-md hover:bg-[#3A3A4E] transition"
          >
            <strong className="text-blue-400">{msg.user}:</strong> {msg.body}
          </div>
        ))}
        {typingUsers.length > 0 && (
          <div className="px-4 text-sm text-gray-400">
            {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-[#2C2C3E] flex items-center gap-3">
        <input
          type="text"
          className="flex-1 p-3 rounded bg-[#1E1E2F] border border-gray-600 focus:outline-none focus:border-blue-500"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping(); 
          }}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
