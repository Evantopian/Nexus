// src/components/chats/NoMessagesFallback.tsx
const NoMessagesFallback: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No messages yet</h3>
    <p className="mt-2 text-gray-600 dark:text-gray-400">Looks like you haven't started chatting with anyone.</p>
    <a
      href="/lfg"
      className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
    >
      Find Friends
    </a>
  </div>
);

export default NoMessagesFallback;
