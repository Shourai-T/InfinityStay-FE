import React from "react";
import { ChatMessage as ChatMessageType } from "../../types/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`flex ${message.isAdmin ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          message.isAdmin
            ? "bg-gradient-royal text-white"
            : "bg-midnight-800/50 text-lavender-300"
        }`}
      >
        <p className="font-body">{message.message}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
