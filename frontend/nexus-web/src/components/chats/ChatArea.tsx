import  {useState, useEffect } from "react";
import { Socket } from "phoenix";

const ChatArea = () => {
  const [messages, setMessages] = useState<{ user: string; body: string }[]>([]);
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    const randomUsername = `User${Math.floor(1000 + Math.random() * 9000)}`;
    const socket = new Socket("ws://localhost:4000/socket", {
      params: { token: "dummy_token", username: randomUsername },
    });
    
    socket.connect();

    const channel = socket.channel("room:lobby", {});
    setChannel(channel);

    channel.join()
      .receive("ok", () => console.log("Joined chat room"))
      .receive("error", () => console.error("Failed to join"));

    channel.on("message:new", (payload: { user: string; body: string }) => {
      setMessages((prev) => [...prev, payload]);
    });

    return () => {
      channel.leave();
    };
  }, []);

  const sendMessage = () => {
    if (channel && message.trim() !== "") {
      channel.push("message:new", { body: message });
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white dark:bg-gray-900">
        {messages.map((msg, idx) => (
          <div key={idx} className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
            <strong>{msg.user}:</strong> {msg.body}
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-100 dark:bg-gray-800 flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 rounded border dark:bg-gray-700"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
