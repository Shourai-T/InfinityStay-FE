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
import { Tab } from "../../types/types";

interface AdminSidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const sidebarItems = [
    { id: "overview" as Tab, label: "Tổng quan", icon: BarChart3 },
    { id: "bookings" as Tab, label: "Đặt phòng", icon: CalendarIcon },
    { id: "rooms" as Tab, label: "Quản lý phòng", icon: Hotel },
    { id: "users" as Tab, label: "Quản lý user", icon: Users },
    { id: "chat" as Tab, label: "Chat", icon: MessageCircle },
  ];

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-16"
      } transition-all duration-300 bg-midnight-900/95 backdrop-blur-md border-r border-royal-500/20 flex flex-col`}
    >
      {/* Sidebar Header */}
      <div
        className={
          sidebarOpen
            ? "p-6 border-b border-royal-500/20"
            : "p-1 border-b border-royal-500/20"
        }
      >
        <div
          className={`flex items-center ${
            sidebarOpen ? "justify-between" : "justify-center"
          }`}
        >
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
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center rounded-xl transition-all duration-300 ${
                  activeTab === item.id
                    ? "bg-gradient-royal text-white shadow-royal"
                    : "text-lavender-300 hover:text-white hover:bg-royal-500/10"
                } ${
                  sidebarOpen
                    ? "space-x-3 px-4 py-3"
                    : "px-0 py-2 justify-center"
                }`}
              >
                <Icon className={sidebarOpen ? "h-5 w-5" : "h-6 w-6"} />
                {sidebarOpen ? (
                  <span className="font-body font-medium">{item.label}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
