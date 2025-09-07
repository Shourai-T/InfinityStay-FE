import React, { useEffect, useState } from "react";
import { User } from "../../types/types";

interface Conversation {
  _id: string;
  userEmail: string;
  adminEmail: string;
  lastMessage?: {
    text: string;
    fromEmail: string;
    at: string;
    _id: string;
  };
  unreadForAdmin: number;
  unreadForUser: number;
  updatedAt: string;
}

interface ChatUserListProps {
  users: User[];
  selectedUser: string;
  onSelectUser: (userId: string) => void;
  setConversations?: (convs: Conversation[]) => void;
}

const ChatUserList: React.FC<ChatUserListProps> = ({
  users,
  selectedUser,
  onSelectUser,
  setConversations,
}) => {
  const [conversations, setLocalConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/chat`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Chuẩn hóa lấy từ data.result.items (không phải data.items)
        const convs = data.result?.items || [];
        setLocalConversations(convs);
        if (setConversations) setConversations(convs);
      });
  }, [setConversations]);

  // Hiển thị danh sách user từ response conversation
  return (
    <div className="card-luxury rounded-2xl p-6">
      <h3 className="text-lg font-heading font-bold text-white mb-4">
        Khách hàng
      </h3>
      <div className="space-y-2">
        {/* Hiển thị từ conversation thay vì users */}
        {conversations.map((conv) => (
          <button
            key={conv._id}
            onClick={() => onSelectUser(conv.userEmail)}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors duration-300 ${
              selectedUser === conv.userEmail
                ? "bg-royal-500/20 border border-royal-500/30"
                : "hover:bg-royal-500/10"
            }`}
          >
            <div className="w-8 h-8 bg-gradient-royal rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {conv.userEmail.charAt(0)}
              </span>
            </div>
            <div className="text-left">
              <div className="text-sm font-body font-semibold text-white truncate max-w-[160px]">
                {conv.userEmail.length > 22
                  ? conv.userEmail.slice(0, 22) + "..."
                  : conv.userEmail}
              </div>
              {conv.lastMessage && (
                <div className="text-xs text-lavender-400 mt-1 truncate max-w-[160px]">
                  {conv.lastMessage.text.length > 30
                    ? conv.lastMessage.text.slice(0, 30) + "..."
                    : conv.lastMessage.text}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatUserList;
