import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageStorage } from "@/data/messageStorage";

// For now, stub list of known contacts; replace with dynamic list when server-side is ready
const CONTACT_NAMES = ["Alice", "Bob", "Charlie"];

const ChatIndexPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const msgsMap = MessageStorage.load();
    const available = CONTACT_NAMES.filter(
      (name) => (msgsMap[`dm:${name}`] || []).length > 0
    );

    if (available.length > 0) {
      // pick random until real "latest" logic in place
      const choice = available[Math.floor(Math.random() * available.length)];
      navigate(`/chat/direct/${choice}`, { replace: true });
    } else {
      navigate(`/chat/find`, { replace: true });
    }
  }, [navigate]);

  return null;
};

export default ChatIndexPage;
