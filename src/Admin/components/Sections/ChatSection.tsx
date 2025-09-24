import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { User, ChatMessage } from "../../types/types";
import SectionHeader from "../UI/SectionHeader";
import ChatUserList from "../Chat/ChatUserList";
import ChatMessageItem from "../Chat/ChatMessageItem";
import io, { Socket } from "socket.io-client";

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

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevConvIdRef = useRef<string | null>(null);

  // Dedupe id tin nhắn để tránh append trùng
  const seenIds = useRef<Set<string>>(new Set());

  // Admin email từ localStorage
  const userLS = localStorage.getItem("user");
  const adminEmail = userLS ? JSON.parse(userLS).email : null;

  // Refs để listener đọc giá trị mới nhất
  const selectedUserRef = useRef<string>(selectedUser);
  const adminEmailRef = useRef<string | null>(adminEmail);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);
  useEffect(() => {
    adminEmailRef.current = adminEmail;
  }, [adminEmail]);

  const currentConv = conversations.find((c) => c.userEmail === selectedUser);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const t = setTimeout(scrollToBottom, 0);
    return () => clearTimeout(t);
  }, [chatMessages]);

  // --- MOUNT: tạo socket 1 lần + listeners cố định
  useEffect(() => {
    const token = localStorage.getItem("token") || "";

    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: { token },
      });
    }
    const socket = socketRef.current;

    // Load danh sách hội thoại 1 lần khi mount
    (async () => {
      try {
        const res = await fetch(`${API_URL}/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json());
        setConversations(res.result?.items || []);
      } catch {}
    })();

    // ❌ KHÔNG fetch trong inboxUpdated nữa để tránh recall API khi send
    const handleInboxUpdated = (payload?: any) => {
      // Nếu server có gửi payload (vd: lastMessage, unread...), có thể cập nhật cục bộ:
      if (!payload) return;
      // Ví dụ (tuỳ server): payload = { conversationId, lastMessage, updatedAt, unreadForAdmin, unreadForUser }
      setConversations((prev) =>
        prev.map((c) =>
          c._id === payload.conversationId
            ? {
                ...c,
                lastMessage: payload.lastMessage ?? c.lastMessage,
                updatedAt: payload.updatedAt ?? c.updatedAt,
                unreadForAdmin: payload.unreadForAdmin ?? c.unreadForAdmin,
                unreadForUser: payload.unreadForUser ?? c.unreadForUser,
              }
            : c
        )
      );
    };

    // newMessage: Nguồn DUY NHẤT để append tin vào UI (cả inbound/outbound)
    const handleNewMessage = (msg: any) => {
      if (!msg) return;

      // Ưu tiên so khớp theo conversationId
      let sameConv = false;
      if (msg.conversationId && prevConvIdRef.current) {
        sameConv = msg.conversationId === prevConvIdRef.current;
      } else {
        // Fallback nếu BE chưa gửi conversationId trong event
        const admin = adminEmailRef.current;
        const selected = selectedUserRef.current;
        const participants = [msg.fromEmail, msg.toEmail, msg.peerEmail].filter(
          Boolean
        );
        sameConv =
          !!admin &&
          !!selected &&
          participants.includes(admin) &&
          participants.includes(selected);
      }
      // Dedupe id
      const id =
        msg._id || `${msg.fromEmail}|${msg.text}|${msg.createdAt || ""}`;
      if (!sameConv && seenIds.current.has(id)) return;

      if (sameConv) {
        if (!seenIds.current.has(id)) {
          seenIds.current.add(id);
          const isAdmin = msg.fromEmail === adminEmailRef.current;
          const appended: ChatMessage = {
            id,
            text: msg.text,
            sender: isAdmin ? "admin" : "user",
            timestamp: new Date(msg.createdAt || Date.now()),
            senderName: isAdmin ? "Admin Support" : msg.fromEmail,
          };
          setChatMessages((prev) => [...prev, appended]);
        }
        // Auto update lastMessage trong conversations cục bộ (không gọi API)
        setConversations((prev) =>
          prev.map((c) =>
            (msg.conversationId && c._id === msg.conversationId) ||
            (!msg.conversationId &&
              c.userEmail ===
                (msg.fromEmail === adminEmailRef.current
                  ? msg.toEmail
                  : msg.fromEmail))
              ? {
                  ...c,
                  lastMessage: {
                    text: msg.text,
                    fromEmail: msg.fromEmail,
                    at: msg.createdAt || new Date().toISOString(),
                    _id: id,
                  },
                  updatedAt: msg.createdAt || new Date().toISOString(),
                  // Tùy role mà tăng unread; nếu đang mở phòng thì có thể để 0
                  unreadForAdmin:
                    selectedUserRef.current === c.userEmail
                      ? 0
                      : c.unreadForAdmin,
                }
              : c
          )
        );
      } else {
        // Không thuộc phòng đang mở: chỉ update preview cuộc hội thoại cục bộ
        setConversations((prev) =>
          prev.map((c) =>
            (msg.conversationId && c._id === msg.conversationId) ||
            (!msg.conversationId &&
              c.userEmail ===
                (msg.fromEmail === adminEmailRef.current
                  ? msg.toEmail
                  : msg.fromEmail))
              ? {
                  ...c,
                  lastMessage: {
                    text: msg.text,
                    fromEmail: msg.fromEmail,
                    at: msg.createdAt || new Date().toISOString(),
                    _id: id,
                  },
                  updatedAt: msg.createdAt || new Date().toISOString(),
                  unreadForAdmin: c.unreadForAdmin + 1,
                }
              : c
          )
        );
      }
    };

    socket.on("chat:inboxUpdated", handleInboxUpdated); // no-fetch
    socket.on("chat:newMessage", handleNewMessage);

    return () => {
      socket.off("chat:inboxUpdated", handleInboxUpdated);
      socket.off("chat:newMessage", handleNewMessage);
      // socket.disconnect(); // nếu muốn đóng socket khi unmount
    };
  }, [setChatMessages]);

  // --- Khi chọn user: join/leave room + fetch lịch sử *1 lần* (không phụ thuộc conversations để tránh refetch)
  useEffect(() => {
    if (!selectedUser) return;

    const token = localStorage.getItem("token") || "";
    const conv = conversations.find((c) => c.userEmail === selectedUser);
    if (!conv || !socketRef.current) return;

    setConversationId(conv._id);
    setToUserEmail(conv.userEmail);

    const socket = socketRef.current;

    // Rời phòng cũ (nếu có)
    if (prevConvIdRef.current && prevConvIdRef.current !== conv._id) {
      socket.emit("chat:leaveRoom", {
        conversationId: prevConvIdRef.current,
        toUserEmail: toUserEmail,
      });
    }

    // Vào phòng mới
    socket.emit("chat:joinRoom", {
      conversationId: conv._id,
      toUserEmail: conv.userEmail,
    });
    prevConvIdRef.current = conv._id;

    // Fetch lịch sử 1 lần khi vào phòng; KHÔNG refetch sau này
    (async () => {
      try {
        const res = await fetch(`${API_URL}/chat/${conv._id}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json());

        const items: any[] = Array.isArray(res.result?.items)
          ? res.result.items
          : [];

        items.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
        );

        // Reset dedupe cho phòng mới
        seenIds.current.clear();

        const formatted = items.map((msg) => {
          const isAdmin = msg.fromEmail === adminEmail;
          const id =
            msg._id || `${msg.fromEmail}|${msg.text}|${msg.createdAt || ""}`;
          seenIds.current.add(id);
          return {
            id,
            text: msg.text,
            sender: isAdmin ? "admin" : "user",
            timestamp: new Date(msg.createdAt),
            senderName: isAdmin ? "Admin Support" : msg.fromEmail,
          } as ChatMessage;
        });

        setChatMessages(formatted);

        // Đánh dấu đã đọc cục bộ phòng đang mở
        setConversations((prev) =>
          prev.map((c) =>
            c._id === conv._id ? { ...c, unreadForAdmin: 0 } : c
          )
        );
      } catch {}
    })();

    return () => {
      socket.emit("chat:leaveRoom", {
        conversationId: conv._id,
        toUserEmail: conv.userEmail,
      });
    };
    // ❗️Không đưa `conversations` vào deps để tránh refetch khi list thay đổi
  }, [selectedUser, adminEmail, setChatMessages, toUserEmail]);

  const handleSendMessage = () => {
    if (
      !newMessage.trim() ||
      !conversationId ||
      !toUserEmail ||
      !socketRef.current
    )
      return;

    // KHÔNG append lạc quan, KHÔNG gọi API
    // Chỉ emit và chờ server bắn 'chat:newMessage' để append vào UI
    socketRef.current.emit("chat:send", {
      text: newMessage.trim(),
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
          setConversations={setConversations} // ⚠️ Đảm bảo ChatUserList không tự fetch khi inboxUpdated
        />

        <div className="lg:col-span-3 card-luxury rounded-2xl flex flex-col">
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
              {/* Header */}
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

              {/* Input */}
              <div className="p-6 border-t border-midnight-700/50">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
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
