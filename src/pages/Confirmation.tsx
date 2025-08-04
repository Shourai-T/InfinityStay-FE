import React from 'react';
import { CheckCircle, Calendar, Users, CreditCard, Phone, Mail, MapPin, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../contexts/BookingContext';
import { formatCurrency, formatDate, calculateNights } from '../utils/dateUtils';

export default function Confirmation() {
  const navigate = useNavigate();
  const { state: bookingState } = useBooking();
  
  const latestBooking = bookingState.bookings[bookingState.bookings.length - 1];
  
  if (!latestBooking) {
    return (
      <div className="min-h-screen bg-gradient-luxury flex items-center justify-center">
        <div className="text-center card-luxury rounded-2xl p-12">
          <p className="text-lavender-300 font-body mb-6">Không tìm thấy thông tin đặt phòng</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary px-6 py-3 rounded-xl font-heading font-semibold"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const nights = calculateNights(latestBooking.checkIn, latestBooking.checkOut);

  return (
    <div className="min-h-screen bg-gradient-luxury">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl font-display font-bold mb-4">Đặt phòng thành công!</h1>
          <p className="text-xl opacity-90 font-body">
            Cảm ơn bạn đã đặt phòng tại Infinity Stay
          </p>
          <p className="text-lg opacity-80 mt-2 font-body">
            Chúng tôi đã gửi email xác nhận đến {latestBooking.guestEmail}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center px-6 py-3 border border-royal-500/30 rounded-xl hover:bg-royal-500/5 transition-colors duration-300 text-lavender-300 font-body"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Về trang chủ
          </button>
          <button
            onClick={() => navigate('/dat-phong-cua-toi')}
            className="flex items-center justify-center px-6 py-3 btn-primary rounded-xl font-body"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Xem đặt phòng của tôi
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center px-6 py-3 border border-royal-500/30 rounded-xl hover:bg-royal-500/5 transition-colors duration-300 text-lavender-300 font-body"
          >
            <Download className="h-5 w-5 mr-2" />
            In xác nhận
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Info */}
            <div className="card-luxury rounded-2xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-6 text-soft-white border-b border-royal-500/30 pb-4">
                Thông tin đặt phòng
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">Mã đặt phòng</label>
                  <div className="text-lg font-heading font-semibold text-infinity-400">{latestBooking.id}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">Trạng thái</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-heading font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    Đã xác nhận
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">Loại phòng</label>
                  <div className="text-lg font-heading font-semibold text-soft-white">{latestBooking.roomName}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">Số khách</label>
                  <div className="flex items-center text-soft-white font-body">
                    <Users className="h-5 w-5 mr-2 text-royal-400" />
                    {latestBooking.guests} khách
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="card-luxury rounded-2xl p-8">
              <h3 className="text-xl font-heading font-semibold mb-6 text-soft-white border-b border-royal-500/30 pb-4">
                Thông tin khách hàng
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">Họ và tên</label>
                  <div className="text-soft-white font-body">{latestBooking.guestName}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">Email</label>
                  <div className="flex items-center text-soft-white font-body">
                    <Mail className="h-4 w-4 mr-2 text-royal-400" />
                    {latestBooking.guestEmail}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">Số điện thoại</label>
                  <div className="flex items-center text-soft-white font-body">
                    <Phone className="h-4 w-4 mr-2 text-royal-400" />
                    {latestBooking.guestPhone}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">Phương thức thanh toán</label>
                  <div className="flex items-center text-soft-white font-body">
                    <CreditCard className="h-4 w-4 mr-2 text-royal-400" />
                    {latestBooking.paymentMethod === 'online' ? 'Thanh toán online' : 'Thanh toán tại khách sạn'}
                  </div>
                </div>
              </div>
              
              {latestBooking.specialRequests && (
                <div className="mt-6 pt-6 border-t border-royal-500/30">
                  <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">Yêu cầu đặc biệt</label>
                  <div className="text-soft-white font-body bg-midnight-800/50 p-4 rounded-xl">
                    {latestBooking.specialRequests}
                  </div>
                </div>
              )}
            </div>

            {/* Check-in Instructions */}
            <div className="bg-royal-500/10 border border-royal-500/30 rounded-2xl p-8">
              <h3 className="text-xl font-heading font-semibold mb-4 text-royal-300">Hướng dẫn nhận phòng</h3>
              <ul className="space-y-3 text-lavender-300 font-body">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-royal-400 rounded-full mt-2 mr-3"></span>
                  <span>Nhận phòng từ 14:00, trả phòng trước 12:00</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-royal-400 rounded-full mt-2 mr-3"></span>
                  <span>Vui lòng mang theo CMND/CCCD và mã đặt phòng</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-royal-400 rounded-full mt-2 mr-3"></span>
                  <span>Liên hệ lễ tân: +84 28 1234 5678 nếu cần hỗ trợ</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-royal-400 rounded-full mt-2 mr-3"></span>
                  <span>Hủy miễn phí trước 24 giờ</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="card-luxury rounded-2xl p-8 sticky top-8">
              <h3 className="text-xl font-heading font-semibold mb-6 text-soft-white">Tóm tắt đặt phòng</h3>
              
              {/* Dates */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-lavender-300 font-body">
                  <Calendar className="h-5 w-5 mr-3 text-royal-400" />
                  <div>
                    <div className="font-heading font-medium text-soft-white">Ngày nhận phòng</div>
                    <div className="text-sm">{formatDate(latestBooking.checkIn)}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-lavender-300 font-body">
                  <Calendar className="h-5 w-5 mr-3 text-royal-400" />
                  <div>
                    <div className="font-heading font-medium text-soft-white">Ngày trả phòng</div>
                    <div className="text-sm">{formatDate(latestBooking.checkOut)}</div>
                  </div>
                </div>
                
                <div className="text-sm text-lavender-300 font-body pl-8">
                  {nights} đêm
                </div>
              </div>
              
              {/* Price Details */}
              <div className="border-t border-royal-500/30 pt-6 space-y-3">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-lavender-300">Phòng ({nights} đêm)</span>
                  <span className="text-soft-white">{formatCurrency(latestBooking.totalPrice)}</span>
                </div>
                
                <div className="flex justify-between text-sm font-body">
                  <span className="text-lavender-300">Thuế & phí</span>
                  <span className="text-soft-white">Đã bao gồm</span>
                </div>
                
                <div className="border-t border-royal-500/30 pt-3">
                  <div className="flex justify-between text-xl font-heading font-bold">
                    <span className="text-soft-white">Tổng cộng</span>
                    <span className="text-infinity-400">{formatCurrency(latestBooking.totalPrice)}</span>
                  </div>
                </div>
              </div>
              
              {/* Hotel Contact */}
              <div className="mt-6 pt-6 border-t border-royal-500/30">
                <h4 className="font-heading font-semibold text-soft-white mb-3">Thông tin khách sạn</h4>
                <div className="space-y-2 text-sm text-lavender-300 font-body">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-royal-400" />
                    <span>123 Đường Luxury, Quận 1, TP.HCM</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-royal-400" />
                    <span>+84 28 1234 5678</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-royal-400" />
                    <span>concierge@infinitystay.vn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}