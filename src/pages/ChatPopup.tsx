import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X, Send, User, Bot } from "lucide-react";
// Thay useAuth bằng useSelector từ redux
import { useSelector } from "react-redux";
import { RootState } from "../store"; // Đảm bảo đã có RootState

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: Date;
  senderName: string;
}

const ChatPopup: React.FC = () => {
  // Lấy state từ redux
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Chúng tôi có thể hỗ trợ gì cho bạn?",
      sender: "admin",
      timestamp: new Date(Date.now() - 300000),
      senderName: "Admin Support",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: "user",
      timestamp: new Date(),
      senderName: user.firstName || "Bạn",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Simulate admin typing and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const adminResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAdminResponse(message.trim()),
        sender: "admin",
        timestamp: new Date(),
        senderName: "Admin Support",
      };
      setMessages((prev) => [...prev, adminResponse]);
    }, 2000);
  };

  const getAdminResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("giá") || lowerMessage.includes("price")) {
      return "Giá phòng của chúng tôi từ 2.500.000 VNĐ/đêm. Bạn có muốn xem chi tiết các loại phòng không?";
    } else if (
      lowerMessage.includes("đặt phòng") ||
      lowerMessage.includes("booking")
    ) {
      return 'Để đặt phòng, bạn có thể truy cập trang "Phòng & Giá" hoặc gọi hotline 1900-xxxx. Chúng tôi sẽ hỗ trợ bạn ngay!';
    } else if (
      lowerMessage.includes("địa chỉ") ||
      lowerMessage.includes("location")
    ) {
      return "Infinity Stay tọa lạc tại trung tâm thành phố với vị trí thuận tiện. Bạn có cần thông tin chi tiết về cách di chuyển không?";
    } else if (
      lowerMessage.includes("dịch vụ") ||
      lowerMessage.includes("service")
    ) {
      return "Chúng tôi cung cấp đầy đủ dịch vụ: WiFi miễn phí, bữa sáng, spa, gym, và dịch vụ phòng 24/7. Bạn quan tâm dịch vụ nào?";
    } else {
      return "Cảm ơn bạn đã liên hệ! Chúng tôi đã ghi nhận tin nhắn và sẽ phản hồi sớm nhất có thể. Bạn có câu hỏi gì khác không?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return null; // Don't show chat if user is not logged in
  }

  // Chỉ hiện popup ở route user, không hiện ở route admin
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-royal rounded-full shadow-royal flex items-center justify-center hover:shadow-glow transition-all duration-300 z-40 group"
        >
          <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-infinity-400 rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-gradient-card rounded-2xl shadow-luxury border border-royal-500/20 z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-midnight-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-royal rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-white">
                  Hỗ trợ khách hàng
                </h3>
                <p className="text-xs text-infinity-400">Đang hoạt động</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-lavender-400 hover:text-white transition-colors duration-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] ${
                    msg.sender === "user" ? "order-2" : "order-1"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-gradient-royal text-white rounded-br-md"
                        : "bg-midnight-800/50 text-lavender-100 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm font-body">{msg.text}</p>
                  </div>
                  <div
                    className={`flex items-center space-x-2 mt-1 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span className="text-xs text-lavender-500">
                      {msg.senderName}
                    </span>
                    <span className="text-xs text-lavender-500">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === "user"
                      ? "order-1 ml-2 bg-gradient-gold"
                      : "order-2 mr-2 bg-gradient-royal"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User className="h-4 w-4 text-midnight-900" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-royal rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-midnight-800/50 px-4 py-2 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-lavender-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-lavender-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-lavender-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-midnight-700/50">
            <div className="flex items-center space-x-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-midnight-800/50 border border-royal-500/30 rounded-xl px-4 py-2 text-white placeholder-lavender-400 focus:border-royal-400 focus:ring-2 focus:ring-royal-400/20 focus:outline-none transition-all duration-300 resize-none font-body"
                rows={1}
                style={{ minHeight: "40px", maxHeight: "80px" }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="w-10 h-10 bg-gradient-royal rounded-xl flex items-center justify-center hover:shadow-royal transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
            <p className="text-xs text-lavender-500 mt-2 font-body">
              Nhấn Enter để gửi tin nhắn
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPopup;
