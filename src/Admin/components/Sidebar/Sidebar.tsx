import React from "react";
import {
  BarChart3,
  CalendarIcon,
  Hotel,
  Users,
  MessageCircle,
  X,
  Menu,
} from "lucide-react";

interface SidebarProps {
  activeTab: "overview" | "bookings" | "rooms" | "users" | "chat";
  setActiveTab: (
    tab: "overview" | "bookings" | "rooms" | "users" | "chat"
  ) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const sidebarItems = [
    { id: "overview", label: "Tổng quan", icon: BarChart3 },
    { id: "bookings", label: "Đặt phòng", icon: CalendarIcon },
    { id: "rooms", label: "Quản lý phòng", icon: Hotel },
    { id: "users", label: "Quản lý user", icon: Users },
    { id: "chat", label: "Chat", icon: MessageCircle },
  ];

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-16"
      } transition-all duration-300 bg-midnight-900/95 backdrop-blur-md border-r border-royal-500/20 flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-royal-500/20">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2 className="text-xl font-display font-bold text-gradient">
                Admin Panel
              </h2>
              <p className="text-xs text-lavender-400 font-body">
                Infinity Stay
              </p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-lavender-300 hover:text-royal-400 hover:bg-royal-500/10 transition-colors duration-300"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id
                    ? "bg-gradient-royal text-white shadow-royal"
                    : "text-lavender-300 hover:text-white hover:bg-royal-500/10"
                }`}
              >
                <Icon className="h-5 w-5" />
                {sidebarOpen && (
                  <span className="font-body font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
