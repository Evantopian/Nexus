import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function useTypingEvents(channel: any, userId: string | null) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = useDebouncedCallback(() => {
    if (!channel || !userId) return;

    channel.push("typing:start", { user_id: userId });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      channel.push("typing:stop", { user_id: userId });
    }, 2000);
  }, 200);

  useEffect(() => {
    if (!channel) return;

    const addUser = ({ user_id }: { user_id: string }) => {
      setTypingUsers((prev) =>
        prev.includes(user_id) ? prev : [...prev, user_id]
      );
    };

    const removeUser = ({ user_id }: { user_id: string }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== user_id));
    };

    channel.on("typing:start", addUser);
    channel.on("typing:stop", removeUser);

    return () => {
      channel.off("typing:start", addUser);
      channel.off("typing:stop", removeUser);
    };
  }, [channel]);

  return { typingUsers, handleTyping };
}
