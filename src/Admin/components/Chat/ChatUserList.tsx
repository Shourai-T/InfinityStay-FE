import React from "react";
import { User } from "../../types/types";

interface ChatUserListProps {
  users: User[];
  selectedUser: string;
  onSelectUser: (userId: string) => void;
}

const ChatUserList: React.FC<ChatUserListProps> = ({
  users,
  selectedUser,
  onSelectUser,
}) => {
  return (
    <div className="card-luxury rounded-2xl p-6">
      <h3 className="text-lg font-heading font-bold text-white mb-4">
        Khách hàng
      </h3>
      <div className="space-y-2">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors duration-300 ${
              selectedUser === user.id
                ? "bg-royal-500/20 border border-royal-500/30"
                : "hover:bg-royal-500/10"
            }`}
          >
            <div className="w-8 h-8 bg-gradient-royal rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user.firstName.charAt(0)}
              </span>
            </div>
            <div className="text-left">
              <div className="text-sm font-body font-semibold text-white">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-lavender-400">Online</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatUserList;
