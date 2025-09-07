import React from "react";
import { X, Save } from "lucide-react";

interface RoomItem {
  id: string;
  name: string;
}

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  roomsList: RoomItem[];
  bookingForm: any;
  setBookingForm: React.Dispatch<React.SetStateAction<any>>;
  creating: boolean;
  tableBookings: any[];
  onSubmit: (e: React.FormEvent) => void;
}

export default function BookingModal({
  open,
  onClose,
  roomsList,
  bookingForm,
  setBookingForm,
  creating,
  tableBookings,
  onSubmit,
}: BookingModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-card rounded-2xl shadow-luxury max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-royal-500/20">
        <div className="flex items-center justify-between p-6 border-b border-midnight-700/50">
          <h3 className="text-xl font-heading font-bold text-white">
            Tạo booking mới
          </h3>
          <button
            onClick={onClose}
            className="text-lavender-400 hover:text-white transition-colors duration-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Room Selection */}
          <div>
            <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
              Chọn phòng <span className="text-red-400">*</span>
            </label>
            <select
              value={bookingForm.roomId}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, roomId: e.target.value })
              }
              className="form-input w-full px-4 py-3 rounded-xl font-body"
              required
            >
              <option value="">Chọn phòng</option>
              {roomsList.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          {/* Check-in and Check-out Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                Ngày nhận phòng <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={bookingForm.checkInDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    checkInDate: e.target.value,
                    checkOutDate:
                      bookingForm.checkOutDate &&
                      bookingForm.checkOutDate <= e.target.value
                        ? ""
                        : bookingForm.checkOutDate,
                  })
                }
                className="form-input w-full px-4 py-3 rounded-xl font-body"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                Ngày trả phòng <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={bookingForm.checkOutDate}
                min={
                  bookingForm.checkInDate
                    ? bookingForm.checkInDate
                    : new Date().toISOString().split("T")[0]
                }
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    checkOutDate: e.target.value,
                  })
                }
                className="form-input w-full px-4 py-3 rounded-xl font-body"
                required
              />
            </div>
          </div>

          {/* Number of Guests */}
          <div>
            <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
              Số khách
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={bookingForm.numberOfGuests}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  numberOfGuests: parseInt(e.target.value),
                })
              }
              className="form-input w-full px-4 py-3 rounded-xl font-body"
            />
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                Email khách hàng <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={bookingForm.userEmail}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    userEmail: e.target.value,
                  })
                }
                className="form-input w-full px-4 py-3 rounded-xl font-body"
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                Số điện thoại <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={bookingForm.userPhone}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    userPhone: e.target.value,
                  })
                }
                className="form-input w-full px-4 py-3 rounded-xl font-body"
                placeholder="0123456789"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
              Phương thức thanh toán
            </label>
            <select
              value={bookingForm.method}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  method: e.target.value as any,
                })
              }
              className="form-input w-full px-4 py-3 rounded-xl font-body"
            >
              <option value="BANK_TRANSFER">Chuyển khoản</option>
              <option value="CASH_ON_DELIVERY">Tiền mặt</option>
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
              Ghi chú
            </label>
            <textarea
              value={bookingForm.note}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, note: e.target.value })
              }
              className="form-input w-full px-4 py-3 rounded-xl font-body resize-none"
              rows={3}
              placeholder="Yêu cầu đặc biệt từ khách hàng..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="submit"
              className="btn-gold px-6 py-3 rounded-xl font-heading font-semibold flex items-center space-x-2"
              disabled={creating}
            >
              <Save className="h-4 w-4" />
              <span>Tạo booking</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-royal-500/30 rounded-xl text-lavender-300 hover:bg-royal-500/5 transition-colors duration-300 font-body"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
