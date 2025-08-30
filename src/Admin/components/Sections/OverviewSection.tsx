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
import {
  DollarSign,
  CalendarIcon,
  TrendingUp,
  Hotel,
  RefreshCw,
} from "lucide-react";
import { formatCurrency } from "../../../utils/dateUtils";
import { roomTypeData, mockRooms } from "../../data/mockData";
import StatCard from "../UI/StatCard";
import ChartCard from "../UI/ChartCard";
import SectionHeader from "../UI/SectionHeader";
import axios from "axios";

interface RevenueDataItem {
  month: string;
  revenue: number;
  bookings: number;
}

const API_URL = import.meta.env.VITE_API_URL;

const OverviewSection: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomCount, setRoomCount] = useState(0); // Add state for room count

  useEffect(() => {
    fetchRevenueData();
    fetchRoomCount();
  }, []);

  const fetchRevenueData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/transactions/revenue/monthly`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.result) {
        // Transform API data to match our chart format
        const formattedData = response.data.result.map((item: any) => ({
          month: formatMonthDisplay(item.month),
          revenue: item.revenue,
          bookings: item.count,
        }));

        setRevenueData(formattedData);
      }
    } catch (err) {
      console.error("Error fetching revenue data:", err);
      setError("Không thể tải dữ liệu doanh thu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Convert "2025-01" to "T1"
  const formatMonthDisplay = (monthStr: string): string => {
    const parts = monthStr.split("-");
    if (parts.length === 2) {
      const monthNumber = parseInt(parts[1]);
      return `T${monthNumber}`;
    }
    return monthStr;
  };

  // Calculate statistics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = revenueData.reduce(
    (sum, item) => sum + item.bookings,
    0
  );

  // Calculate monthly growth if we have at least 2 months of data
  let monthlyGrowth = 0;
  if (revenueData.length >= 2) {
    const lastMonthIndex = revenueData.length - 1;
    const prevMonthIndex = revenueData.length - 2;

    const lastMonthRevenue = revenueData[lastMonthIndex].revenue;
    const prevMonthRevenue = revenueData[prevMonthIndex].revenue;

    if (prevMonthRevenue > 0) {
      monthlyGrowth =
        ((lastMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
    }
  }

  // Add new function to fetch room count
  const fetchRoomCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.result) {
        setRoomCount(response.data.result.length);
      }
    } catch (err) {
      console.error("Error fetching room count:", err);
      // Fall back to mockRooms if API fails
      setRoomCount(mockRooms.length);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <SectionHeader
          title="Dashboard Overview"
          description="Tổng quan hoạt động khách sạn"
        />

        <button
          onClick={fetchRevenueData}
          disabled={loading}
          className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl">{error}</div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng doanh thu"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          iconStyle="bg-gradient-gold text-midnight-900"
          textStyle="text-infinity-400"
        />

        <StatCard
          title="Tổng đặt phòng"
          value={totalBookings.toString()}
          icon={CalendarIcon}
          iconStyle="bg-gradient-royal text-white"
          textStyle="text-royal-400"
        />

        <StatCard
          title="Số phòng"
          value={roomCount.toString()} // Use the API-fetched room count
          icon={Hotel}
          iconStyle="bg-midnight-700 text-lavender-300"
          textStyle="text-white"
        />

        <StatCard
          title="Tăng trưởng"
          value={`${monthlyGrowth > 0 ? "+" : ""}${monthlyGrowth.toFixed(1)}%`}
          icon={TrendingUp}
          iconStyle={
            monthlyGrowth >= 0
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }
          textStyle={monthlyGrowth >= 0 ? "text-green-400" : "text-red-400"}
        />
      </div>

      {/* Charts */}
      {loading ? (
        <div className="card-luxury rounded-2xl p-8 flex justify-center items-center h-80">
          <div className="text-lavender-300 flex items-center gap-3">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Đang tải dữ liệu...</span>
          </div>
        </div>
      ) : revenueData.length === 0 ? (
        <div className="card-luxury rounded-2xl p-8 flex justify-center items-center h-80">
          <div className="text-lavender-300 text-center">
            <p>Không có dữ liệu doanh thu</p>
            <button
              onClick={fetchRevenueData}
              className="mt-4 btn-primary px-4 py-2 rounded-xl"
            >
              Thử lại
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Doanh thu theo tháng">
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
                  <Bar dataKey="revenue" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Phân bố loại phòng">
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
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Booking Trend */}
          <ChartCard title="Xu hướng đặt phòng">
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
          </ChartCard>
        </>
      )}
    </div>
  );
};

export default OverviewSection;
