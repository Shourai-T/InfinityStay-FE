import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { User, ChatMessage } from "../../types/types";
import SectionHeader from "../UI/SectionHeader";
import ChatUserList from "../Chat/ChatUserList";
import ChatMessageItem from "../Chat/ChatMessageItem";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const API_URL = import.meta.env.VITE_API_URL;

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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [toUserEmail, setToUserEmail] = useState<string | null>(null);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Lấy email admin từ localStorage key 'user'
  const user = localStorage.getItem("user");
  const adminEmail = user ? JSON.parse(user).email : null;
  // Lấy user từ conversation (không dùng users prop nữa)
  const currentConv = conversations.find((c) => c.userEmail === selectedUser);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 0);
  }, [chatMessages]);

  // Fetch conversation list từ API (đồng bộ với ChatUserList)
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
        const convs = data.result?.items || [];
        setConversations(convs);
      });
    // Lắng nghe inboxUpdated để cập nhật lại list
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: { token: `${token}` },
      });
    }
    const socket = socketRef.current;
    // socket.off("chat:inboxUpdated");
    socket.on("chat:inboxUpdated", () => {
      console.log("Đã nhận sự kiện chat:inboxUpdated");
      fetch(`${API_URL}/chat`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const convs = data.result?.items || [];
          setConversations(convs);
          // Nếu đang ở phòng hiện tại thì reload messages
          if (selectedUser) {
            const conv = convs.find((c) => c.userEmail === selectedUser);
            if (conv) {
              fetch(`${API_URL}/chat/${conv._id}/messages`, {
                headers: { Authorization: `Bearer ${token}` },
              })
                .then((res) => res.json())
                .then((res) => {
                  if (Array.isArray(res.result?.items)) {
                    const formattedMessages = res.result.items.map(
                      (msg: any) => {
                        const isAdmin = msg.fromEmail === adminEmail;
                        return {
                          id: msg._id,
                          text: msg.text,
                          sender: isAdmin ? "admin" : "user",
                          timestamp: new Date(msg.createdAt),
                          senderName: isAdmin ? "Admin Support" : msg.fromEmail,
                        };
                      }
                    );
                    setChatMessages(formattedMessages);
                  }
                });
            }
          }
        });
    });
    return () => {
      socket.off("chat:inboxUpdated");
    };
  }, [selectedUser]);

  // Chỉ join/leave khi selectedUser thay đổi, không phụ thuộc vào conversations
  useEffect(() => {
    if (!selectedUser) return;
    // Tìm conversation hiện tại
    const conv = conversations.find((c) => c.userEmail === selectedUser);
    if (!conv) return;

    setConversationId(conv._id);
    setToUserEmail(conv.userEmail);

    const token = localStorage.getItem("token");
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: { token: `${token}` },
      });
    }
    const socket = socketRef.current;

    socket.on("chat:inboxUpdated", () => {
      fetch(`${API_URL}/chat`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const convs = data.result?.items || [];
          setConversations(convs);
        });
    });

    socket.emit("chat:joinRoom", {
      conversationId: conv._id,
      toUserEmail: conv.userEmail,
    });

    // Fetch messages
    fetch(`${API_URL}/chat/${conv._id}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res.result?.items)) {
          const formattedMessages = res.result.items.map((msg: any) => {
            const isAdmin = msg.fromEmail === adminEmail;
            return {
              id: msg._id,
              text: msg.text,
              sender: isAdmin ? "admin" : "user",
              timestamp: new Date(msg.createdAt),
              senderName: isAdmin ? "Admin Support" : msg.fromEmail,
            };
          });
          setChatMessages(formattedMessages);
        }
      });

    socket.off("chat:newMessage");
    socket.on("chat:newMessage", (msg: any) => {
      console.log("chat:newMessage nhận được:", msg);
      const isAdmin = msg.fromEmail === adminEmail;
      const newMessage: ChatMessage = {
        id: msg._id || Date.now().toString(),
        text: msg.text,
        sender: isAdmin ? "admin" : "user",
        timestamp: new Date(msg.createdAt || Date.now()),
        senderName: isAdmin ? "Admin Support" : msg.fromEmail,
      };
      setChatMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.emit("chat:leaveRoom", {
        conversationId: conv._id,
        toUserEmail: conv.userEmail,
      });
      socket.off("chat:inboxUpdated");
    };
  }, [selectedUser, setChatMessages]);

  const handleSendMessage = () => {
    if (
      !newMessage.trim() ||
      !conversationId ||
      !toUserEmail ||
      !socketRef.current
    )
      return;

    // Emit chat:send với toUserEmail
    socketRef.current.emit("chat:send", {
      text: newMessage,
      toUserEmail,
      conversationId,
    });
    setNewMessage("");
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Chat với khách hàng"
        description="Hỗ trợ khách hàng thời gian thực"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        <ChatUserList
          users={[]} // Không dùng users prop nữa
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
          setConversations={setConversations}
        />

        <div className="lg:col-span-3 card-luxury rounded-2xl flex flex-col">
          {/* Nếu chưa chọn user, hiển thị UI yêu cầu chọn đoạn hội thoại */}
          {!selectedUser ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-heading font-semibold text-lavender-300 mb-2">
                  Vui lòng chọn đoạn hội thoại
                </div>
                <div className="text-sm text-lavender-400">
                  Chọn khách hàng để bắt đầu trò chuyện.
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-midnight-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-royal rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {currentConv?.userEmail.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-white">
                      {currentConv?.userEmail}
                    </div>
                    {/* Có thể hiển thị lastMessage hoặc trạng thái khác nếu muốn */}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[420px]">
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <ChatMessageItem key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
