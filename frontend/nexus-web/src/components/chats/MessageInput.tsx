// src/components/chats/MessageInput.tsx
interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onTyping: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onTyping,
}) => (
  <div className="px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-3">
    <textarea
      rows={1}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        onTyping();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSend();
        }
      }}
      placeholder="Type a message…"
      className="flex-1 resize-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
    />
    <button
      onClick={onSend}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition"
    >
      Send
    </button>
  </div>
);

export default MessageInput;
