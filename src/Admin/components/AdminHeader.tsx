import React, { useState } from "react";
import { Bell, Menu, Settings, User, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/dang-nhap");
  };

  const notifications = [
    { id: 1, text: "Có đơn đặt phòng mới", time: "5 phút trước" },
    { id: 2, text: "Khách hàng vừa gửi tin nhắn", time: "30 phút trước" },
    { id: 3, text: "Đơn hàng #123 đã thanh toán", time: "2 giờ trước" },
  ];

  return (
    <header className="bg-midnight-900/80 backdrop-blur-lg border-b border-royal-500/20 sticky top-0 z-40">
      <div className="flex items-center justify-end px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              className="relative p-2 text-lavender-300 hover:text-white rounded-lg hover:bg-royal-500/10 transition-colors duration-300"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-midnight-800 border border-royal-500/20 rounded-xl shadow-lg z-50">
                <div className="p-4 border-b border-midnight-700/50">
                  <h3 className="text-white font-heading font-semibold">
                    Thông báo
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 hover:bg-midnight-700/50 border-b border-midnight-700/30"
                    >
                      <p className="text-lavender-200 text-sm font-body">
                        {notification.text}
                      </p>
                      <p className="text-lavender-400 text-xs mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center">
                  <button className="text-royal-400 text-sm hover:text-royal-300 font-body">
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Info & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <div className="text-white font-heading font-semibold">
                Admin User
              </div>
              <div className="text-xs text-lavender-400">
                admin@infinitystay.com
              </div>
            </div>

            <div className="w-10 h-10 bg-gradient-royal rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-lavender-300 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors duration-300 ml-2"
              title="Đăng xuất"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
