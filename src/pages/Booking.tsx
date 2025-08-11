import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  User,
  Phone,
  Mail,
  MessageSquare,
  ChevronDownIcon,
} from "lucide-react";
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBooking } from "../contexts/BookingContext";
import { showToast } from "../utils/toast";
import {
  formatCurrency,
  calculateNights,
  formatDate,
  generateBookingId,
} from "../utils/dateUtils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { addBooking } from "../store/bookingSlice";

export default function Booking() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedRoom, dateRange, guests } = useSelector(
    (state: RootState) => state.booking
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [bookingData, setBookingData] = useState({
    guestName: user?.name || "",
    guestEmail: user?.email || "",
    guestPhone: user?.phone || "",
    guests: guests || 1,
    specialRequests: "",
    paymentMethod: "online" as "online" | "onsite",
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!selectedRoom || !dateRange) {
    return (
      <div className="min-h-screen bg-gradient-luxury flex items-center justify-center">
        <div className="text-center card-luxury rounded-2xl p-12">
          <p className="text-lavender-300 font-body mb-6">
            Vui lòng chọn phòng và ngày để đặt phòng
          </p>
          <button
            onClick={() => navigate("/phong")}
            className="btn-primary px-6 py-3 rounded-xl font-heading font-semibold"
          >
            Chọn phòng
          </button>
        </div>
      </div>
    );
  }

  const nights = calculateNights(dateRange.checkIn, dateRange.checkOut);
  const totalPrice = selectedRoom.price * nights;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast.loginRequired();
      navigate("/dang-nhap");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const booking = {
        id: generateBookingId(),
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        checkIn: dateRange.checkIn,
        checkOut: dateRange.checkOut,
        guests: bookingData.guests,
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        guestPhone: bookingData.guestPhone,
        specialRequests: bookingData.specialRequests,
        totalPrice,
        status: "confirmed" as const,
        paymentMethod: bookingData.paymentMethod,
        createdAt: new Date().toISOString(),
      };

      // Lưu booking vào redux
      dispatch(addBooking(booking));

      showToast.bookingSuccess(booking.id);
      navigate("/xac-nhan");
      setIsLoading(false);
    }, 2000);
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingData((prev) => ({
      ...prev,
      paymentMethod: e.target.value as "online" | "onsite",
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-luxury py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/phong")}
            className="flex items-center text-royal-400 hover:text-royal-300 mr-6 transition-colors duration-300 font-body"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </button>
          <div>
            <h1 className="text-4xl font-display font-bold text-gradient">
              Đặt phòng
            </h1>
            <p className="text-lavender-300 font-body mt-2">
              Hoàn tất thông tin để xác nhận đặt phòng
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Guest Information */}
              <div className="card-luxury rounded-2xl p-8">
                <h2 className="text-2xl font-heading font-semibold mb-6 text-soft-white flex items-center">
                  <User className="h-6 w-6 mr-3 text-royal-400" />
                  Thông tin khách hàng
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-heading font-medium text-lavender-300 mb-3">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingData.guestName}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          guestName: e.target.value,
                        })
                      }
                      className="form-input w-full px-4 py-4 rounded-xl font-body"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-heading font-medium text-lavender-300 mb-3">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-royal-400" />
                      <input
                        type="email"
                        required
                        value={bookingData.guestEmail}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            guestEmail: e.target.value,
                          })
                        }
                        className="form-input w-full pl-12 pr-4 py-4 rounded-xl font-body"
                        placeholder="Nhập email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-heading font-medium text-lavender-300 mb-3">
                      Số điện thoại *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 h-5 w-5 text-royal-400" />
                      <input
                        type="tel"
                        required
                        value={bookingData.guestPhone}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            guestPhone: e.target.value,
                          })
                        }
                        className="form-input w-full pl-12 pr-4 py-4 rounded-xl font-body"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-heading font-medium text-lavender-300 mb-3">
                      Số khách
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-4 h-5 w-5 text-royal-400" />
                      <select
                        value={bookingData.guests}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            guests: parseInt(e.target.value),
                          })
                        }
                        className="form-input w-full pl-12 pr-4 py-4 rounded-xl font-body appearance-none"
                      >
                        {Array.from(
                          { length: selectedRoom.maxGuests },
                          (_, i) => i + 1
                        ).map((num) => (
                          <option
                            key={num}
                            value={num}
                            className="bg-midnight-800"
                          >
                            {num} khách
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-royal-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-heading font-medium text-lavender-300 mb-3">
                    Yêu cầu đặc biệt
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-royal-400" />
                    <textarea
                      value={bookingData.specialRequests}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          specialRequests: e.target.value,
                        })
                      }
                      className="form-input w-full pl-12 pr-4 py-4 rounded-xl font-body resize-none"
                      rows={3}
                      placeholder="Ví dụ: Tầng cao, giường đôi, không hút thuốc..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card-luxury rounded-2xl p-8">
                <h2 className="text-2xl font-heading font-semibold mb-6 text-soft-white flex items-center">
                  <CreditCard className="h-6 w-6 mr-3 text-royal-400" />
                  Phương thức thanh toán
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center p-6 border border-royal-500/30 rounded-xl cursor-pointer hover:bg-royal-500/5 transition-colors duration-300">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={bookingData.paymentMethod === "online"}
                      onChange={handlePaymentChange}
                      className="h-5 w-5 text-royal-500 border-royal-400 focus:ring-royal-500 bg-midnight-800"
                    />
                    <div className="ml-4">
                      <div className="font-heading font-semibold text-soft-white">
                        Thanh toán online
                      </div>
                      <div className="text-sm text-lavender-300 font-body">
                        Thanh toán ngay qua thẻ tín dụng/ghi nợ
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-6 border border-royal-500/30 rounded-xl cursor-pointer hover:bg-royal-500/5 transition-colors duration-300">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="onsite"
                      checked={bookingData.paymentMethod === "onsite"}
                      onChange={handlePaymentChange}
                      className="h-5 w-5 text-royal-500 border-royal-400 focus:ring-royal-500 bg-midnight-800"
                    />
                    <div className="ml-4">
                      <div className="font-heading font-semibold text-soft-white">
                        Thanh toán tại khách sạn
                      </div>
                      <div className="text-sm text-lavender-300 font-body">
                        Thanh toán khi nhận phòng
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-gold w-full py-4 px-6 rounded-xl font-heading font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-midnight-900 mr-2"></div>
                    Đang xử lý...
                  </span>
                ) : (
                  "Xác nhận đặt phòng"
                )}
              </button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="card-luxury rounded-2xl p-8 sticky top-8">
              <h2 className="text-2xl font-heading font-semibold mb-6 text-soft-white">
                Chi tiết đặt phòng
              </h2>

              {/* Room Image */}
              <div className="mb-6">
                <img
                  src={selectedRoom.images[0]}
                  alt={selectedRoom.name}
                  className="w-full h-40 object-cover rounded-xl"
                />
              </div>

              {/* Room Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-heading font-semibold text-soft-white text-lg">
                    {selectedRoom.name}
                  </h3>
                  <p className="text-sm text-lavender-400 font-body">
                    {selectedRoom.area}m² • Tối đa {selectedRoom.maxGuests}{" "}
                    khách
                  </p>
                </div>

                <div className="flex items-center text-sm text-lavender-300 font-body">
                  <Calendar className="h-4 w-4 mr-2 text-royal-400" />
                  <span>
                    {formatDate(dateRange.checkIn)} -{" "}
                    {formatDate(dateRange.checkOut)}
                  </span>
                </div>

                <div className="text-sm text-lavender-300 font-body">
                  {nights} đêm
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-royal-500/30 pt-6 space-y-3">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-lavender-300">
                    {formatCurrency(selectedRoom.price)} x {nights} đêm
                  </span>
                  <span className="text-soft-white">
                    {formatCurrency(selectedRoom.price * nights)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-body">
                  <span className="text-lavender-300">Thuế & phí</span>
                  <span className="text-soft-white">Đã bao gồm</span>
                </div>

                <div className="border-t border-royal-500/30 pt-3">
                  <div className="flex justify-between text-xl font-heading font-bold">
                    <span className="text-soft-white">Tổng cộng</span>
                    <span className="text-infinity-400">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-6 pt-6 border-t border-royal-500/30">
                <h4 className="font-heading font-semibold text-soft-white mb-3">
                  Tiện nghi phòng
                </h4>
                <div className="space-y-1">
                  {selectedRoom.amenities.slice(0, 4).map((amenity, index) => (
                    <div
                      key={index}
                      className="text-sm text-lavender-300 font-body"
                    >
                      • {amenity}
                    </div>
                  ))}
                  {selectedRoom.amenities.length > 4 && (
                    <div className="text-sm text-royal-400 font-body">
                      +{selectedRoom.amenities.length - 4} tiện nghi khác
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
