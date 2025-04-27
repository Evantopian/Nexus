// temp for now since, jsut testing chat
const ChatSidebar = () => {
  return (
    <div className="w-64 bg-gray-200 dark:bg-gray-800 p-4 h-full">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      <ul className="space-y-2">
        <li className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded">
          # General
        </li>
        <li className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded">
          # Development
        </li>
      </ul>
    </div>
  );
};

export default ChatSidebar;
