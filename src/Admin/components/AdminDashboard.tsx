import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  DollarSign,
  Users,
  Calendar as CalendarIcon,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  Search,
} from "lucide-react";
import { formatCurrency } from "../../utils/dateUtils";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

// Mock data
const revenueData = [
  { month: "T1", revenue: 45000000, bookings: 120 },
  { month: "T2", revenue: 52000000, bookings: 140 },
  { month: "T3", revenue: 48000000, bookings: 130 },
  { month: "T4", revenue: 61000000, bookings: 165 },
  { month: "T5", revenue: 55000000, bookings: 150 },
  { month: "T6", revenue: 67000000, bookings: 180 },
];

const roomTypeData = [
  { name: "Deluxe", value: 45, color: "#6366f1" },
  { name: "Suite", value: 30, color: "#fbbf24" },
  { name: "Standard", value: 25, color: "#10b981" },
];

const mockBookings = [
  {
    id: 1,
    title: "Nguyễn Văn A - Deluxe",
    start: new Date(2024, 11, 15, 14, 0),
    end: new Date(2024, 11, 17, 12, 0),
    resource: { status: "confirmed", amount: 2500000 },
  },
  {
    id: 2,
    title: "Trần Thị B - Suite",
    start: new Date(2024, 11, 18, 14, 0),
    end: new Date(2024, 11, 20, 12, 0),
    resource: { status: "pending", amount: 4200000 },
  },
  {
    id: 3,
    title: "Lê Văn C - Deluxe",
    start: new Date(2024, 11, 22, 14, 0),
    end: new Date(2024, 11, 24, 12, 0),
    resource: { status: "confirmed", amount: 2500000 },
  },
];

const mockUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    totalBookings: 5,
    totalSpent: 12500000,
    joinDate: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0907654321",
    totalBookings: 3,
    totalSpent: 8400000,
    joinDate: "2024-02-20",
    status: "active",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@email.com",
    phone: "0912345678",
    totalBookings: 2,
    totalSpent: 5000000,
    joinDate: "2024-03-10",
    status: "inactive",
  },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "users">(
    "overview"
  );
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Calculate statistics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = revenueData.reduce(
    (sum, item) => sum + item.bookings,
    0
  );
  const avgBookingValue = totalRevenue / totalBookings;
  const monthlyGrowth =
    ((revenueData[5].revenue - revenueData[4].revenue) /
      revenueData[4].revenue) *
    100;

  const eventStyleGetter = (event: any) => {
    const backgroundColor =
      event.resource.status === "confirmed" ? "#10b981" : "#f59e0b";
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-luxury pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-gradient mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lavender-300 font-body">
            Quản lý khách sạn Infinity Stay
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-midnight-800/50 p-1 rounded-xl border border-royal-500/20">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 rounded-lg font-heading font-semibold transition-all duration-300 ${
              activeTab === "overview"
                ? "bg-gradient-royal text-white shadow-royal"
                : "text-lavender-300 hover:text-white hover:bg-royal-500/10"
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-3 rounded-lg font-heading font-semibold transition-all duration-300 ${
              activeTab === "bookings"
                ? "bg-gradient-royal text-white shadow-royal"
                : "text-lavender-300 hover:text-white hover:bg-royal-500/10"
            }`}
          >
            Quản lý đặt phòng
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 rounded-lg font-heading font-semibold transition-all duration-300 ${
              activeTab === "users"
                ? "bg-gradient-royal text-white shadow-royal"
                : "text-lavender-300 hover:text-white hover:bg-royal-500/10"
            }`}
          >
            Quản lý user
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-luxury rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lavender-400 font-body text-sm">
                      Tổng doanh thu
                    </p>
                    <p className="text-2xl font-heading font-bold text-infinity-400">
                      {formatCurrency(totalRevenue)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-midnight-900" />
                  </div>
                </div>
              </div>

              <div className="card-luxury rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lavender-400 font-body text-sm">
                      Tổng đặt phòng
                    </p>
                    <p className="text-2xl font-heading font-bold text-royal-400">
                      {totalBookings}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-royal rounded-xl flex items-center justify-center">
                    <CalendarIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="card-luxury rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lavender-400 font-body text-sm">
                      Giá trị TB/đơn
                    </p>
                    <p className="text-2xl font-heading font-bold text-white">
                      {formatCurrency(avgBookingValue)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-midnight-700 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-lavender-300" />
                  </div>
                </div>
              </div>

              <div className="card-luxury rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lavender-400 font-body text-sm">
                      Tăng trưởng
                    </p>
                    <p className="text-2xl font-heading font-bold text-green-400">
                      +{monthlyGrowth.toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Chart */}
              <div className="card-luxury rounded-2xl p-8">
                <h3 className="text-xl font-heading font-bold text-white mb-6">
                  Doanh thu theo tháng
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis
                      stroke="#9ca3af"
                      tickFormatter={(value) => `${value / 1000000}M`}
                    />
                    <Tooltip
                      formatter={(value: any) => [
                        formatCurrency(value),
                        "Doanh thu",
                      ]}
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#fbbf24"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Room Type Distribution */}
              <div className="card-luxury rounded-2xl p-8">
                <h3 className="text-xl font-heading font-bold text-white mb-6">
                  Phân bố loại phòng
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={roomTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {roomTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Booking Trend */}
            <div className="card-luxury rounded-2xl p-8">
              <h3 className="text-xl font-heading font-bold text-white mb-6">
                Xu hướng đặt phòng
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value: any) => [value, "Số đặt phòng"]}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: "#6366f1", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-8">
            {/* Calendar */}
            <div className="card-luxury rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-white">
                  Lịch đặt phòng
                </h3>
                <button className="btn-gold px-4 py-2 rounded-xl font-heading font-semibold flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Thêm đặt phòng</span>
                </button>
              </div>

              <div
                className="bg-white rounded-xl p-4"
                style={{ height: "600px" }}
              >
                <Calendar
                  localizer={localizer}
                  events={mockBookings}
                  startAccessor="start"
                  endAccessor="end"
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={(event) => setSelectedBooking(event)}
                  views={["month", "week", "day"]}
                  defaultView="month"
                  popup
                  style={{ height: "100%", color: "black" }}
                />
              </div>
            </div>

            {/* Booking List */}
            <div className="card-luxury rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-white">
                  Danh sách đặt phòng
                </h3>
                <div className="flex items-center space-x-4">
                  <select className="form-input px-4 py-2 rounded-xl font-body">
                    <option value="all">Tất cả trạng thái</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                  <button className="btn-primary px-4 py-2 rounded-xl font-body flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Xuất Excel</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-midnight-700/50">
                      <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                        ID
                      </th>
                      <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                        Khách hàng
                      </th>
                      <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                        Phòng
                      </th>
                      <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                        Ngày
                      </th>
                      <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                        Số tiền
                      </th>
                      <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                        Trạng thái
                      </th>
                      <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-midnight-800/30 hover:bg-royal-500/5"
                      >
                        <td className="py-4 px-4 font-body text-white">
                          #{booking.id}
                        </td>
                        <td className="py-4 px-4 font-body text-white">
                          {booking.title.split(" - ")[0]}
                        </td>
                        <td className="py-4 px-4 font-body text-lavender-300">
                          {booking.title.split(" - ")[1]}
                        </td>
                        <td className="py-4 px-4 font-body text-lavender-300">
                          {moment(booking.start).format("DD/MM/YYYY")} -{" "}
                          {moment(booking.end).format("DD/MM/YYYY")}
                        </td>
                        <td className="py-4 px-4 font-body text-infinity-400 font-semibold">
                          {formatCurrency(booking.resource.amount)}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.resource.status === "confirmed"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {booking.resource.status === "confirmed"
                              ? "Đã xác nhận"
                              : "Chờ xác nhận"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-royal-400 hover:bg-royal-500/10 rounded-lg transition-colors duration-300">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-infinity-400 hover:bg-infinity-500/10 rounded-lg transition-colors duration-300">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-300">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-8">
            {/* Search and Filter */}
            <div className="card-luxury rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-lavender-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm khách hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-10 pr-4 py-2 rounded-xl font-body w-full md:w-80"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="form-input px-4 py-2 rounded-xl font-body"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                  <button className="btn-gold px-4 py-2 rounded-xl font-heading font-semibold flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Thêm khách hàng</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Users List */}
            <div className="card-luxury rounded-2xl p-8">
              <h3 className="text-xl font-heading font-bold text-white mb-6">
                Danh sách khách hàng ({filteredUsers.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-midnight-700/50">
                      <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                        Khách hàng
                      </th>
                      <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                        Liên hệ
                      </th>
                      <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                        Đặt phòng
                      </th>
                      <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                        Tổng chi tiêu
                      </th>
                      <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                        Ngày tham gia
                      </th>
                      <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                        Trạng thái
                      </th>
                      <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-midnight-800/30 hover:bg-royal-500/5"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-royal rounded-full flex items-center justify-center">
                              <span className="text-white font-heading font-semibold">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-body font-semibold text-white">
                                {user.name}
                              </div>
                              <div className="text-sm text-lavender-400">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-body text-lavender-300">
                          {user.phone}
                        </td>
                        <td className="py-4 px-4 font-body text-white">
                          {user.totalBookings}
                        </td>
                        <td className="py-4 px-4 font-body text-infinity-400 font-semibold">
                          {formatCurrency(user.totalSpent)}
                        </td>
                        <td className="py-4 px-4 font-body text-lavender-300">
                          {user.joinDate}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.status === "active"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {user.status === "active"
                              ? "Hoạt động"
                              : "Không hoạt động"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-royal-400 hover:bg-royal-500/10 rounded-lg transition-colors duration-300">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-infinity-400 hover:bg-infinity-500/10 rounded-lg transition-colors duration-300">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-300">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
