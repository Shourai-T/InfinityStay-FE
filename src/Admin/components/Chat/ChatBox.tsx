import React from "react";
import { Send } from "lucide-react";
import { User, ChatMessage } from "../../types/types";
import ChatMessageItem from "./ChatMessageItem";

interface ChatBoxProps {
  user?: User;
  messages: ChatMessage[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  user,
  messages,
  newMessage,
  setNewMessage,
  onSendMessage,
}) => {
  if (!user) {
    return (
      <div className="lg:col-span-3 card-luxury rounded-2xl flex items-center justify-center">
        <p className="text-lavender-400">
          Chọn một người dùng để bắt đầu trò chuyện
        </p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 card-luxury rounded-2xl flex flex-col">
      {/* Chat Header */}
      <div className="p-6 border-b border-midnight-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-royal rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {user.firstName.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-heading font-semibold text-white">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-green-400">Online</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-midnight-700/50">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
            placeholder="Nhập tin nhắn..."
            className="form-input flex-1 px-4 py-3 rounded-xl font-body"
          />
          <button
            onClick={onSendMessage}
            className="btn-primary px-6 py-3 rounded-xl font-body flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Gửi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
