import React, { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./Sidebar/AdminSidebar";
import OverviewSection from "./Sections/OverviewSection";
import BookingsSection from "./Sections/BookingsSection";
import RoomsSection from "./Sections/RoomsSection";
import UsersSection from "./Sections/UsersSection";
import ChatSection from "./Sections/ChatSection";
import {
  mockRooms,
  mockUsers,
  mockChatMessages,
  mockBookings,
} from "../data/mockData";
import { Room, User, ChatMessage, Tab } from "../types/types";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(mockChatMessages);
  const [selectedUser, setSelectedUser] = useState<string>("1");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gradient-luxury flex-col">
      <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {activeTab === "overview" && <OverviewSection />}

            {activeTab === "bookings" && (
              <BookingsSection bookings={mockBookings} />
            )}

            {activeTab === "rooms" && (
              <RoomsSection
                rooms={rooms}
                setRooms={setRooms}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}

            {activeTab === "users" && (
              <UsersSection
                users={users}
                setUsers={setUsers}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}

            {activeTab === "chat" && (
              <ChatSection
                users={users}
                chatMessages={chatMessages}
                setChatMessages={setChatMessages}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
