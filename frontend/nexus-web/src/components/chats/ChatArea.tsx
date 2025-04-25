import { useState } from "react";
import { Smile, PlusCircle, Paperclip, Mic, Send, AtSign, Hash } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: { id: string; name: string; avatar?: string };
  timestamp: Date;
  isCurrentUser: boolean;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  status?: "online" | "idle" | "offline" | "dnd";
}

interface ChatAreaProps {
  chatId?: string;
  chatName?: string;
  chatType?: "dm" | "group";
  participants?: Participant[];
  messages?: Message[];
  className?: string;
}

const statusColor = (status?: string) =>
  ({ online: "bg-green-500", idle: "bg-yellow-500" }[status || ""] || "bg-gray-500");

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const formatDate = (date: Date) => {
  const today = new Date(),
    yest = new Date();
  yest.setDate(today.getDate() - 1);
  return date.toDateString() === today.toDateString()
    ? "Today"
    : date.toDateString() === yest.toDateString()
    ? "Yesterday"
    : date.toLocaleDateString();
};

const ChatArea = ({
  chatId = "1", // temp for future building with elixir/phoenix uses, 
  chatName = "General Chat",
  chatType = "group",
  participants = [],
  messages = [],
  className = "",
}: ChatAreaProps) => {
  const [newMessage, setNewMessage] = useState("");
  const handleSend = () =>
    newMessage.trim() && (console.log("Send:", newMessage), setNewMessage(""));
  const currentDate = messages[0] ? formatDate(messages[0].timestamp) : "";

  return (
    <div
      className={`
        flex flex-col 
        border-l border-gray-200 dark:border-gray-700 
        bg-white dark:bg-gray-800 
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {chatType === "dm" && participants[0] ? (
            <div className="relative h-8 w-8">
              <img
                src={participants[0].avatar}
                alt={participants[0].name}
                className="rounded-full h-full w-full"
              />
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${statusColor(
                  participants[0].status
                )}`}
              />
            </div>
          ) : (
            <div className="h-8 w-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
              <Hash className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {chatName}
            </h2>
            {chatType === "group" && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {participants.length} members
              </p>
            )}
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <AtSign className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
          <span className="mx-2 border-b flex-1 border-gray-300 dark:border-gray-600" />
          {currentDate}
          <span className="mx-2 border-b flex-1 border-gray-300 dark:border-gray-600" />
        </div>
        {messages.map((msg, i) => {
          const isFirst = i === 0 || messages[i - 1].sender.id !== msg.sender.id;
          return (
            <div
              key={msg.id}
              className={`flex ${msg.isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex ${
                  msg.isCurrentUser ? "flex-row-reverse" : "flex-row"
                } gap-2`}
              >
                {isFirst && (
                  <img
                    src={msg.sender.avatar}
                    alt={msg.sender.name}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <div className={`${!isFirst ? (msg.isCurrentUser ? "mr-10" : "ml-10") : ""} max-w-md`}>
                  {isFirst && (
                    <div className="text-sm font-medium mb-1 flex gap-2 text-gray-700 dark:text-gray-200">
                      <span>{msg.sender.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      msg.isCurrentUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {!isFirst && (
                    <div className="text-xs text-right text-gray-400 dark:text-gray-500 mt-1">
                      {formatTime(msg.timestamp)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
          {[PlusCircle, Paperclip].map((Icon, i) => (
            <button
              key={i}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          ))}
          <input
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) handleSend();
            }}
          />
          {[Smile, Mic].map((Icon, i) => (
            <button
              key={i}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          ))}
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-full disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
