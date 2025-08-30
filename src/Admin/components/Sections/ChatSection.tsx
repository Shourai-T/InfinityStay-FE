import React, { useState } from "react";
import { Send } from "lucide-react";
import { User, ChatMessage } from "../../types/types";
import SectionHeader from "../UI/SectionHeader";
import ChatUserList from "../Chat/ChatUserList";
import ChatMessageItem from "../Chat/ChatMessageItem";

interface ChatSectionProps {
  users: User[];
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  selectedUser: string;
  setSelectedUser: React.Dispatch<React.SetStateAction<string>>;
}

const ChatSection: React.FC<ChatSectionProps> = ({
  users,
  chatMessages,
  setChatMessages,
  selectedUser,
  setSelectedUser,
}) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: selectedUser,
      userName: "Admin",
      message: newMessage,
      timestamp: new Date(),
      isAdmin: true,
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage("");
  };

  const userChatMessages = chatMessages.filter(
    (msg) => msg.userId === selectedUser
  );

  const currentUser = users.find((u) => u.id === selectedUser);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Chat với khách hàng"
        description="Hỗ trợ khách hàng thời gian thực"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        <ChatUserList
          users={users}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
        />

        <div className="lg:col-span-3 card-luxury rounded-2xl flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b border-midnight-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-royal rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {currentUser?.firstName.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-heading font-semibold text-white">
                  {currentUser?.firstName} {currentUser?.lastName}
                </div>
                <div className="text-sm text-green-400">Online</div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {userChatMessages.map((message) => (
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
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
                className="form-input flex-1 px-4 py-3 rounded-xl font-body"
              />
              <button
                onClick={handleSendMessage}
                className="btn-primary px-6 py-3 rounded-xl font-body flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Gửi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
