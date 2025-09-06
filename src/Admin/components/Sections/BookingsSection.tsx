import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { BookingEvent } from "../../types/types";
import SectionHeader from "../UI/SectionHeader";
import axios from "axios";
import { Eye, Search, Plus, X, Save } from "lucide-react";
import { formatCurrency } from "../../../utils/dateUtils";
import { getRooms } from "../../services/RoomsService";
import BookingModal from "../UI/BookingModal";
import { showToast } from "../../../utils/toast";

interface BookingsSectionProps {
  bookings: BookingEvent[];
}

interface ApiBooking {
  kind: string;
  isCheckOut: boolean;
  bookingId: string;
  status: string;
  roomId: string | null;
  userEmail: string;
  userPhone: string;
  totalPrice: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
}

interface BookingTableItem {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  roomName: string;
  dates: string;
  amount: number;
  status: "confirmed" | "pending" | "cancelled" | "checked_in";
  numberOfGuests: number;
}

const API_URL = import.meta.env.VITE_API_URL;

const localizer = momentLocalizer(moment);

const BookingsSection: React.FC<BookingsSectionProps> = ({ bookings }) => {
  const [calendarEvents, setCalendarEvents] =
    useState<BookingEvent[]>(bookings);
  const [tableBookings, setTableBookings] = useState<BookingTableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomsList, setRoomsList] = useState<{ id: string; name: string }[]>(
    []
  );
  const [createForm, setCreateForm] = useState({
    roomId: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    typeBooking: "daily",
    note: "",
    userEmail: "",
    userPhone: "",
    method: "BANK_TRANSFER",
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    roomId: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    typeBooking: "daily",
    note: "",
    userEmail: "",
    userPhone: "",
    method: "BANK_TRANSFER",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    // Get current date range for the calendar
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 15); // 2 weeks before

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 45); // 45 days ahead

    // Format dates for API
    const startStr = startDate.toISOString().split("T")[0];
    const endStr = endDate.toISOString().split("T")[0];

    setLoading(true);

    try {
      // Get token from localStorage or your auth management system
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/booking/get-booking-calendar?start=${startStr}&end=${endStr}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.data &&
        response.data.result &&
        Array.isArray(response.data.result)
      ) {
        const apiBookings = response.data.result;
        console.log("Fetched bookings:", apiBookings);

        // Lấy tất cả booking, nếu là checkout thì set status là "checkout"
        const formattedEvents = apiBookings
          .filter((booking: ApiBooking) => !booking.isCheckOut)
          .map((booking: any) => ({
            id: parseInt(booking.bookingId.replace(/\D/g, "") || "0"),
            title: `${booking.userEmail || ""} - ${
              booking.numberOfGuests
            } khách`,
            start: new Date(booking.checkInDate),
            end: new Date(booking.checkOutDate),
            resource: {
              status: booking.isCheckOut ? "checkout" : booking.status,
              amount: booking.totalPrice,
            },
          }));

        setCalendarEvents(formattedEvents);

        const formattedTableData = apiBookings
          .filter((booking: ApiBooking) => !booking.isCheckOut)
          .map((booking: any) => {
            const checkIn = new Date(booking.checkInDate);
            const checkOut = new Date(booking.checkOutDate);
            const formattedDates = `${checkIn.toLocaleDateString(
              "vi-VN"
            )} - ${checkOut.toLocaleDateString("vi-VN")}`;

            const customerName =
              booking.userEmail?.split("@")[0] || booking.userEmail || "";

            const roomName =
              booking.room?.name || booking.roomName || "Phòng không xác định";

            return {
              id: booking.bookingId,
              customerName: customerName,
              customerEmail: booking.userEmail || "",
              customerPhone: booking.userPhone || "",
              roomName: roomName,
              dates: formattedDates,
              amount: booking.totalPrice,
              status: booking.isCheckOut
                ? "checkout"
                : (booking.status as
                    | "confirmed"
                    | "pending"
                    | "cancelled"
                    | "checked_in"),
              numberOfGuests: booking.numberOfGuests,
            };
          });

        setTableBookings(formattedTableData);
      }
    } catch (err) {
      console.error("Error fetching booking calendar data:", err);
      setError("Failed to load calendar data. Please try again later.");
      // Fallback to mock data
      setCalendarEvents(bookings);
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event: any) => {
    let backgroundColor;

    switch (event.resource.status) {
      case "confirmed":
        backgroundColor = "#10b981"; // green
        break;
      case "pending":
        backgroundColor = "#f59e0b"; // amber
        break;
      case "cancelled":
        backgroundColor = "#ef4444"; // red
        break;
      default:
        backgroundColor = "#6366f1"; // indigo
    }

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

  const filteredBookings = tableBookings.filter(
    (booking) =>
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-amber-500/20 text-amber-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Fetch rooms for select
  const fetchRoomsList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getRooms(token || "");
      const items = res.data?.result || [];
      // Đảm bảo lấy đúng roomId, không lấy name
      setRoomsList(items.map((r: any) => ({ id: r.roomId, name: r.name })));
    } catch {
      setRoomsList([]);
    }
  };

  // Open modal and fetch rooms
  const openCreateModal = () => {
    setShowBookingModal(true);
    fetchRoomsList();
  };

  // Create booking handler
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Create booking request body:", createForm);
      const response = await axios.post(
        `${API_URL}/booking/create-booking-by-admin`,
        createForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Create booking response:", response.data);
      setShowCreateModal(false);
      setCreateForm({
        roomId: "",
        checkInDate: "",
        checkOutDate: "",
        numberOfGuests: 1,
        typeBooking: "daily",
        note: "",
        userEmail: "",
        userPhone: "",
        method: "BANK_TRANSFER",
      });
      fetchCalendarData(); // Refresh data
    } catch (err) {
      setCreating(false);
      showToast.error("Tạo booking thất bại");
    }
    setCreating(false);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/booking/create-booking-by-admin`,
        bookingForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowBookingModal(false);
      setBookingForm({
        roomId: "",
        checkInDate: "",
        checkOutDate: "",
        numberOfGuests: 1,
        typeBooking: "daily",
        note: "",
        userEmail: "",
        userPhone: "",
        method: "BANK_TRANSFER",
      });
      fetchCalendarData();
    } catch (err) {
      setCreating(false);
      showToast.error("Tạo booking thất bại");
    }
    setCreating(false);
  };

  // Update booking status handler
  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/booking/update-booking-status/${bookingId}`,
        status,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showToast.success("Cập nhật trạng thái thành công");
      fetchCalendarData(); // Refresh data
    } catch (err) {
      showToast.error("Cập nhật trạng thái thất bại");
    }
  };

  return (
    <div className="">
      <SectionHeader
        title="Quản lý đặt phòng"
        description="Lịch và danh sách đặt phòng"
      />

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          open={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          roomsList={roomsList}
          bookingForm={bookingForm}
          setBookingForm={setBookingForm}
          creating={creating}
          tableBookings={tableBookings}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Calendar View */}
      <div className="card-luxury rounded-2xl p-8 my-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-heading font-bold text-white">
            Lịch đặt phòng
          </h3>

          {loading && (
            <div className="text-lavender-300">
              <span className="inline-block animate-spin mr-2">⟳</span>
              Đang tải...
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={fetchCalendarData}
              className="btn-primary px-4 py-2 text-sm rounded-lg"
              disabled={loading}
            >
              Làm mới dữ liệu
            </button>
            <button
              onClick={openCreateModal}
              className="btn-gold px-4 py-2 text-sm rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Tạo booking
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl p-4" style={{ height: "500px" }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={eventStyleGetter}
            views={["month", "week", "day"]}
            defaultView="month"
            popup
            style={{ height: "100%", color: "black" }}
            onNavigate={() => fetchCalendarData()}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card-luxury rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-heading font-bold text-white">
            Danh sách đặt phòng
          </h3>

          {/* Search */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-lavender-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đặt phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 pr-4 py-2 rounded-xl font-body w-full bg-midnight-800/50 border border-royal-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-midnight-700/50">
                <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                  Khách hàng
                </th>
                <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                  Thông tin liên hệ
                </th>
                <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                  Phòng
                </th>
                <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                  Ngày
                </th>
                <th className="text-left py-4 px-4 font-heading font-semibold text-lavender-300">
                  Số khách
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
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-midnight-800/30 hover:bg-royal-500/5"
                >
                  <td className="py-4 px-4 font-body text-white">
                    {booking.customerName}
                  </td>
                  <td className="py-4 px-4 font-body text-lavender-300">
                    <div>{booking.customerEmail}</div>
                    <div className="text-xs text-lavender-400">
                      {booking.customerPhone}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-body text-lavender-300">
                    {booking.roomName}
                  </td>
                  <td className="py-4 px-4 font-body text-lavender-300">
                    {booking.dates}
                  </td>
                  <td className="py-4 px-4 font-body text-lavender-300 text-center">
                    {booking.numberOfGuests}
                  </td>
                  <td className="py-4 px-4 font-body text-infinity-400 font-semibold">
                    {formatCurrency(booking.amount)}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                        booking.status
                      )}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {/* Đổi nút Eye thành nút Check-in */}
                    {booking.status == "confirmed" && (
                      <button
                        className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors duration-300"
                        title="Check-in khách"
                        onClick={() =>
                          handleUpdateStatus(booking.id, "checked_in")
                        }
                      >
                        Check-in
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-lavender-400"
                  >
                    {searchTerm
                      ? "Không tìm thấy đặt phòng phù hợp"
                      : "Chưa có đơn đặt phòng nào"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsSection;
