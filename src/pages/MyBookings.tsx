import React, { useState } from 'react';
import { Calendar, ArrowLeft, Eye, X, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { showToast } from '../utils/toast';
import { formatCurrency, formatDate, calculateNights } from '../utils/dateUtils';

export default function MyBookings() {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { state: bookingState, dispatch: bookingDispatch } = useBooking();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  if (!authState.user) {
    return (
      <div className="min-h-screen bg-gradient-luxury flex items-center justify-center">
        <div className="text-center card-luxury rounded-2xl p-12">
          <p className="text-lavender-300 font-body mb-6">Vui lòng đăng nhập để xem đặt phòng</p>
          <button
            onClick={() => navigate('/dang-nhap')}
            className="btn-primary px-6 py-3 rounded-xl font-heading font-semibold"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  const filteredBookings = bookingState.bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-400" />;
      default: return <Clock className="h-5 w-5 text-lavender-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xác nhận';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-lavender-500/20 text-lavender-400 border-lavender-500/30';
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) {
      bookingDispatch({
        type: 'UPDATE_BOOKING',
        payload: {
          id: bookingId,
          updates: { status: 'cancelled' }
        }
      });
      showToast.bookingCancelled();
    }
  };

  const canCancelBooking = (booking: any) => {
    if (booking.status === 'cancelled') return false;
    
    const checkInDate = new Date(booking.checkIn);
    const now = new Date();
    const timeDiff = checkInDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff >= 1; // Can cancel if check-in is at least 1 day away
  };

  return (
    <div className="min-h-screen bg-gradient-luxury">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-royal-400 hover:text-royal-300 mr-6 transition-colors duration-300 font-body"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </button>
          <div>
            <h1 className="text-4xl font-display font-bold text-gradient">Đặt phòng của tôi</h1>
            <p className="text-lavender-300 font-body mt-2">Quản lý các đặt phòng của bạn</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="card-luxury rounded-xl p-1 mb-8 inline-flex">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'confirmed', label: 'Đã xác nhận' },
            { key: 'pending', label: 'Chờ xác nhận' },
            { key: 'cancelled', label: 'Đã hủy' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-6 py-3 rounded-lg text-sm font-heading font-medium transition-all duration-300 ${
                filter === tab.key
                  ? 'bg-gradient-royal text-white shadow-royal'
                  : 'text-lavender-300 hover:text-soft-white hover:bg-royal-500/10'
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
              {filter === 'all' ? 'Chưa có đặt phòng nào' : `Không có đặt phòng ${getStatusText(filter)}`}
            </h3>
            <p className="text-lavender-300 font-body mb-8">
              {filter === 'all' 
                ? 'Hãy đặt phòng đầu tiên của bạn ngay hôm nay!'
                : 'Thử thay đổi bộ lọc để xem các đặt phòng khác'
              }
            </p>
            <button
              onClick={() => navigate('/phong')}
              className="btn-gold px-8 py-4 rounded-xl font-heading font-semibold"
            >
              Đặt phòng ngay
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="card-luxury rounded-2xl overflow-hidden luxury-hover">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <div className="flex items-center mb-3">
                        <h3 className="text-2xl font-heading font-semibold text-soft-white mr-4">
                          {booking.roomName}
                        </h3>
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-heading font-medium border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-2">{getStatusText(booking.status)}</span>
                        </span>
                      </div>
                      <p className="text-lavender-300 font-body">Mã đặt phòng: <span className="font-heading font-semibold text-infinity-400">{booking.id}</span></p>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                      <div className="text-3xl font-heading font-bold text-infinity-400">
                        {formatCurrency(booking.totalPrice)}
                      </div>
                      <div className="text-sm text-lavender-400 font-body">
                        {calculateNights(booking.checkIn, booking.checkOut)} đêm
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">Ngày nhận phòng</label>
                      <div className="text-soft-white font-body">{formatDate(booking.checkIn)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">Ngày trả phòng</label>
                      <div className="text-soft-white font-body">{formatDate(booking.checkOut)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-heading font-medium text-lavender-400 mb-2">Số khách</label>
                      <div className="text-soft-white font-body">{booking.guests} khách</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                      className="flex items-center justify-center px-6 py-3 border border-royal-500/30 rounded-xl hover:bg-royal-500/5 transition-colors duration-300 text-lavender-300 font-body"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {selectedBooking === booking.id ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                    </button>
                    
                    {canCancelBooking(booking) && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="flex items-center justify-center px-6 py-3 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/5 transition-colors duration-300 font-body"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hủy đặt phòng
                      </button>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {selectedBooking === booking.id && (
                    <div className="mt-8 pt-8 border-t border-royal-500/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-heading font-semibold text-soft-white mb-4">Thông tin khách hàng</h4>
                          <div className="space-y-3 text-sm font-body">
                            <div>
                              <span className="text-lavender-400">Họ và tên:</span>
                              <span className="ml-2 text-soft-white">{booking.guestName}</span>
                            </div>
                            <div>
                              <span className="text-lavender-400">Email:</span>
                              <span className="ml-2 text-soft-white">{booking.guestEmail}</span>
                            </div>
                            <div>
                              <span className="text-lavender-400">Điện thoại:</span>
                              <span className="ml-2 text-soft-white">{booking.guestPhone}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-heading font-semibold text-soft-white mb-4">Chi tiết đặt phòng</h4>
                          <div className="space-y-3 text-sm font-body">
                            <div>
                              <span className="text-lavender-400">Phương thức thanh toán:</span>
                              <span className="ml-2 text-soft-white">
                                {booking.paymentMethod === 'online' ? 'Thanh toán online' : 'Thanh toán tại khách sạn'}
                              </span>
                            </div>
                            <div>
                              <span className="text-lavender-400">Ngày đặt:</span>
                              <span className="ml-2 text-soft-white">{formatDate(booking.createdAt)}</span>
                            </div>
                            {booking.specialRequests && (
                              <div>
                                <span className="text-lavender-400">Yêu cầu đặc biệt:</span>
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