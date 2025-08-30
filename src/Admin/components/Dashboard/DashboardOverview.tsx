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
import { DollarSign, CalendarIcon, TrendingUp, Hotel } from "lucide-react";
import { formatCurrency } from "../../../utils/dateUtils";
import StatCard from "../UI/StatCard";
import ChartCard from "../UI/ChartCard";
import { roomTypeData } from "../../data/mockData";
import axios from "axios";

interface RevenueData {
  month: string;
  revenue: number;
  count: number;
}

interface FormattedRevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

const API_URL = import.meta.env.VITE_API_URL;

const DashboardOverview: React.FC = () => {
  const [revenueData, setRevenueData] = useState<FormattedRevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    setLoading(true);
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
        // Format the data for our charts
        const formattedData = response.data.result.map((item: RevenueData) => ({
          month: formatMonth(item.month),
          revenue: item.revenue,
          bookings: item.count,
        }));

        setRevenueData(formattedData);
      }
    } catch (err) {
      console.error("Error fetching revenue data:", err);
      setError("Failed to load revenue data. Please try again later.");

      // Set some fallback data
      setRevenueData([
        { month: "T1", revenue: 0, bookings: 0 },
        { month: "T2", revenue: 0, bookings: 0 },
        { month: "T3", revenue: 0, bookings: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Format month from "2025-01" to "T1"
  const formatMonth = (monthStr: string): string => {
    const parts = monthStr.split("-");
    if (parts.length === 2) {
      const monthNum = parseInt(parts[1]);
      return `T${monthNum}`;
    }
    return monthStr;
  };

  // Calculate statistics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = revenueData.reduce(
    (sum, item) => sum + item.bookings,
    0
  );

  // Calculate monthly growth (if we have enough data)
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold text-gradient mb-2">
          Dashboard Overview
        </h1>
        <p className="text-lavender-300 font-body">
          Tổng quan hoạt động khách sạn
        </p>
      </div>

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
          value="2" // You might want to make this dynamic
          icon={Hotel}
          iconStyle="bg-midnight-700 text-lavender-300"
          textStyle="text-white"
        />

        <StatCard
          title="Tăng trưởng"
          value={`${monthlyGrowth > 0 ? "+" : ""}${monthlyGrowth.toFixed(1)}%`}
          icon={TrendingUp}
          iconStyle={`${
            monthlyGrowth >= 0
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
          textStyle={monthlyGrowth >= 0 ? "text-green-400" : "text-red-400"}
        />
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="card-luxury rounded-2xl p-6 text-center">
          <div className="animate-pulse text-lavender-300">
            <span className="inline-block animate-spin mr-2">⟳</span>
            Đang tải dữ liệu...
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-4">
          {error}
          <button
            onClick={fetchRevenueData}
            className="ml-4 underline hover:text-red-300"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Charts - only render if we have data and not loading */}
      {!loading && revenueData.length > 0 && (
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

export default DashboardOverview;
