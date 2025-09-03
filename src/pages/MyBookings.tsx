import React, { useEffect, useState } from "react";
import {
  Calendar,
  ArrowLeft,
  Eye,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import {
  formatCurrency,
  formatDate,
  calculateNights,
} from "../utils/dateUtils";
import { useDispatch, useSelector } from "react-redux";
import {
  updateBookingStatus,
  getMyBookings,
  cancelBooking,
} from "../store/bookingSlice";
import ConfirmDialog from "../components/common/ConfirmToast";
import { RootState, AppDispatch } from "../store";

export default function MyBookings() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Lấy state từ Redux
  const authState = useSelector((state: RootState) => state.auth);
  const { bookings, loading, error } = useSelector(
    (state: RootState) => state.booking
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    | "all"
    | "confirmed"
    | "pending"
    | "canceled"
    | "payment_url"
    | "checked_in"
    | "failed"
  >("all");

  // Scroll lên đầu khi load component
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch bookings when component mounts
  useEffect(() => {
    if (authState.user) {
      dispatch(getMyBookings({ params: { limit: 10, page: 1 } }));
    }
  }, [dispatch, authState.user]);

  if (!authState.user) {
    return (
      <div className="min-h-screen bg-gradient-luxury flex items-center justify-center">
        <div className="text-center card-luxury rounded-2xl p-12">
          <p className="text-lavender-300 font-body mb-6">
            Vui lòng đăng nhập để xem đặt phòng
          </p>
          <button
            onClick={() => navigate("/dang-nhap")}
            className="btn-primary px-6 py-3 rounded-xl font-heading font-semibold"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-luxury flex items-center justify-center">
        <div className="text-center card-luxury rounded-2xl p-12">
          <Loader className="h-16 w-16 text-royal-400 mx-auto mb-6 animate-spin" />
          <p className="text-lavender-300 font-body">
            Đang tải danh sách đặt phòng...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-luxury flex items-center justify-center">
        <div className="text-center card-luxury rounded-2xl p-12">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h3 className="text-2xl font-heading font-semibold text-soft-white mb-4">
            Có lỗi xảy ra
          </h3>
          <p className="text-lavender-300 font-body mb-6">{error}</p>
          <button
            onClick={() =>
              dispatch(getMyBookings({ params: { limit: 10, page: 1 } }))
            }
            className="btn-primary px-6 py-3 rounded-xl font-heading font-semibold"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter((booking: any) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "pending":
        return <Clock className="h-5 w-5 text-blue-400" />;
      case "payment_url":
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case "checked_in":
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case "canceled":
        return <XCircle className="h-5 w-5 text-red-400" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-lavender-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Đang xử lý";
      case "payment_url":
        return "Chờ thanh toán";
      case "checked_in":
        return "Đã check in";
      case "canceled":
        return "Đã hủy";
      case "failed":
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "payment_url":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "checked_in":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "canceled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "failed":
        return "bg-red-600/20 text-red-500 border-red-600/30";
      default:
        return "bg-lavender-500/20 text-lavender-400 border-lavender-500/30";
    }
  };

  // const handleCancelBooking = (bookingId: string) => {
  //   if (window.confirm("Bạn có chắc chắn muốn hủy đặt phòng này?")) {
  //     dispatch(updateBookingStatus({ id: bookingId, status: "cancelled" }));
  //     showToast.bookingCancelled();
  //   }
  // };

  const handleCancelBooking = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setConfirmOpen(true);
  };

  const confirmCancel = async () => {
    if (selectedBookingId) {
      try {
        await dispatch(cancelBooking(selectedBookingId)).unwrap();
        showToast.bookingCancelled();
      } catch (error: any) {
        showToast.error(error || "Có lỗi xảy ra khi hủy đặt phòng");
      }
    }
    setConfirmOpen(false);
    setSelectedBookingId(null);
  };

  const cancelAction = () => {
    showToast.info("Hủy thao tác");
    setConfirmOpen(false);
  };

  const canCancelBooking = (booking: any) => {
    if (
      booking.status === "canceled" ||
      booking.status === "failed" ||
      booking.status === "checked_in"
    )
      return false;
    const checkInDate = new Date(booking.checkInDate);
    const now = new Date();
    const daysDiff = Math.ceil(
      (checkInDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
    );
    return daysDiff >= 1;
  };

  return (
    <div className="min-h-screen bg-gradient-luxury">
      <ConfirmDialog
        open={confirmOpen}
        message="Bạn có chắc chắn muốn hủy đặt phòng này?"
        onConfirm={confirmCancel}
        onCancel={cancelAction}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-royal-400 hover:text-royal-300 mr-6 transition-colors duration-300 font-body"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </button>
          <div>
            <h1 className="text-4xl font-display font-bold text-gradient">
              Đặt phòng của tôi
            </h1>
            <p className="text-lavender-300 font-body mt-2">
              Quản lý các đặt phòng của bạn
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="card-luxury rounded-xl p-1 mb-8 inline-flex">
          {[
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Đang xử lý" },
            { key: "payment_url", label: "Chờ thanh toán" },
            { key: "confirmed", label: "Đã xác nhận" },
            { key: "checked_in", label: "Đã check in" },
            { key: "canceled", label: "Đã hủy" },
            { key: "failed", label: "Thất bại" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-6 py-3 rounded-lg text-sm font-heading font-medium transition-all duration-300 ${
                filter === tab.key
                  ? "bg-gradient-royal text-white shadow-royal"
                  : "text-lavender-300 hover:text-soft-white hover:bg-royal-500/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="card-luxury rounded-2xl p-12 text-center">
            <Calendar className="h-16 w-16 text-royal-400 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-heading font-semibold text-soft-white mb-4">
              {filter === "all"
                ? "Chưa có đặt phòng nào"
                : `Không có đặt phòng ${getStatusText(filter)}`}
            </h3>
            <p className="text-lavender-300 font-body mb-8">
              {filter === "all"
                ? "Hãy đặt phòng đầu tiên của bạn ngay hôm nay!"
                : "Thử thay đổi bộ lọc để xem các đặt phòng khác"}
            </p>
            <button
              onClick={() => navigate("/phong")}
              className="btn-gold px-8 py-4 rounded-xl font-heading font-semibold"
            >
              Đặt phòng ngay
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking: any) => (
              <div
                key={booking.id}
                className="card-luxury rounded-2xl overflow-hidden luxury-hover"
              >
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <div className="flex items-center mb-3">
                        <h3 className="text-2xl font-heading font-semibold text-soft-white mr-4">
                          {booking.room.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-heading font-medium border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          <span className="ml-2">
                            {getStatusText(booking.status)}
                          </span>
                        </span>
                      </div>
                      <p className="text-lavender-300 font-body">
                        Mã đặt phòng:{" "}
                        <span className="font-heading font-semibold text-infinity-400">
                          {booking.bookingId}
                        </span>
                      </p>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                      <div className="text-3xl font-heading font-bold text-infinity-400">
                        {formatCurrency(booking.totalPrice)}
                      </div>
                      <div className="text-sm text-lavender-400 font-body">
                        {calculateNights(
                          booking.checkInDate,
                          booking.checkOutDate
                        )}{" "}
                        đêm
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">
                        Ngày nhận phòng
                      </label>
                      <div className="text-soft-white font-body">
                        {formatDate(booking.checkInDate)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">
                        Ngày trả phòng
                      </label>
                      <div className="text-soft-white font-body">
                        {formatDate(booking.checkOutDate)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">
                        Số khách
                      </label>
                      <div className="text-soft-white font-body">
                        {booking.numberOfGuests} khách
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() =>
                        setSelectedBooking(
                          selectedBooking === booking.bookingId
                            ? null
                            : booking.bookingId
                        )
                      }
                      className="flex items-center justify-center px-6 py-3 border border-royal-500/30 rounded-xl hover:bg-royal-500/5 transition-colors duration-300 text-lavender-300 font-body"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {selectedBooking === booking.bookingId
                        ? "Ẩn chi tiết"
                        : "Xem chi tiết"}
                    </button>

                    {canCancelBooking(booking) && (
                      <button
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        className="flex items-center justify-center px-6 py-3 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/5 transition-colors duration-300 font-body"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hủy đặt phòng
                      </button>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {selectedBooking === booking.bookingId && (
                    <div className="mt-8 pt-8 border-t border-royal-500/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-heading font-semibold text-soft-white mb-4">
                            Thông tin khách hàng
                          </h4>
                          <div className="space-y-3 text-sm font-body">
                            <div>
                              <span className="text-lavender-400">
                                Họ và tên:
                              </span>
                              <span className="ml-2 text-soft-white">
                                {booking.guestName}
                              </span>
                            </div>
                            <div>
                              <span className="text-lavender-400">Email:</span>
                              <span className="ml-2 text-soft-white">
                                {booking.guestEmail}
                              </span>
                            </div>
                            <div>
                              <span className="text-lavender-400">
                                Điện thoại:
                              </span>
                              <span className="ml-2 text-soft-white">
                                {booking.phoneNumber}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-heading font-semibold text-soft-white mb-4">
                            Chi tiết đặt phòng
                          </h4>
                          <div className="space-y-3 text-sm font-body">
                            <div>
                              <span className="text-lavender-400">
                                Phương thức thanh toán:
                              </span>
                              <span className="ml-2 text-soft-white">
                                {booking.paymentMethod === "online"
                                  ? "Thanh toán online"
                                  : "Thanh toán tại khách sạn"}
                              </span>
                            </div>
                            <div>
                              <span className="text-lavender-400">
                                Ngày đặt:
                              </span>
                              <span className="ml-2 text-soft-white">
                                {formatDate(booking.createAt)}
                              </span>
                            </div>
                            {booking.specialRequests && (
                              <div>
                                <span className="text-lavender-400">
                                  Yêu cầu đặc biệt:
                                </span>
                                <div className="mt-2 p-4 bg-midnight-800/50 rounded-xl text-soft-white">
                                  {booking.specialRequests}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
