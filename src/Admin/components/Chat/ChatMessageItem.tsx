import React from "react";
import { ChatMessage } from "../../types/types";

interface ChatMessageItemProps {
  message: ChatMessage;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isAdmin = message.sender === "admin";
  return (
    <div className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isAdmin
            ? "bg-gradient-royal text-white"
            : "bg-midnight-800/50 text-lavender-300"
        }`}
      >
        <p className="font-body">{message.text}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default ChatMessageItem;
