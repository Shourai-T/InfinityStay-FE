import { Calendar, Filter, Users, ChevronDownIcon } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { setDateRange, setGuests, setRoomType } from "../../store/bookingSlice";
import { Filters, RoomType } from "../../types";

interface RoomsFilterSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  showFilters: boolean;
}

const RoomsFilterSidebar: React.FC<RoomsFilterSidebarProps> = ({
  filters,
  setFilters,
  showFilters,
}) => {
  const dispatch = useDispatch();

  // Nếu checkIn chưa có giá trị thì set mặc định là ngày hiện tại
  React.useEffect(() => {
    if (!filters.checkIn) {
      const today = new Date().toISOString().split("T")[0];
      setFilters((prev) => ({ ...prev, checkIn: today }));
      dispatch(setDateRange({ checkIn: today, checkOut: filters.checkOut }));
    }
  }, []);

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value;
    setFilters((prev) => ({ ...prev, checkIn: newCheckIn }));
    dispatch(setDateRange({ checkIn: newCheckIn, checkOut: filters.checkOut }));
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckOut = e.target.value;
    setFilters((prev) => ({ ...prev, checkOut: newCheckOut }));
    dispatch(setDateRange({ checkIn: filters.checkIn, checkOut: newCheckOut }));
  };

  const handleGuestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const guests = parseInt(e.target.value);
    setFilters((prev) => ({ ...prev, guests }));
    dispatch(setGuests(guests));
  };

  const handleRoomTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomType = e.target.value as RoomType;
    setFilters((prev) => ({ ...prev, roomType }));
    dispatch(setRoomType(roomType));
  };

  return (
    <div
      className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}
    >
      <div className="card-luxury rounded-2xl p-6 sticky top-24">
        <div className="flex items-center mb-6">
          <Filter className="h-5 w-5 text-royal-400 mr-2" />
          <h2 className="text-xl font-heading font-semibold text-soft-white">
            Bộ lọc tìm kiếm
          </h2>
        </div>

        {/* Date Selection */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-heading font-medium text-lavender-300 mb-3">
              Ngày nhận phòng
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-4 h-5 w-5 text-royal-400" />
              <input
                type="date"
                value={filters.checkIn}
                onChange={handleCheckInChange}
                className="form-input w-full pl-12 pr-4 py-4 rounded-xl font-body"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-heading font-medium text-lavender-300 mb-3">
              Ngày trả phòng
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-4 h-5 w-5 text-royal-400" />
              <input
                type="date"
                value={filters.checkOut}
                onChange={handleCheckOutChange}
                className="form-input w-full pl-12 pr-4 py-4 rounded-xl font-body"
                min={filters.checkIn || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="mb-8">
          <label className="block text-sm font-heading font-medium text-lavender-300 mb-3">
            Số khách
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-4 h-5 w-5 text-royal-400" />
            <select
              value={filters.guests}
              onChange={handleGuestsChange}
              className="form-input w-full pl-12 pr-4 py-4 rounded-xl font-body appearance-none"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num} className="bg-midnight-800">
                  {num} khách
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-royal-400 pointer-events-none" />
          </div>
        </div>

        {/* Room Type */}
        <div className="mb-8">
          <label className="block text-sm font-heading font-medium text-lavender-300 mb-3">
            Loại phòng
          </label>
          <div className="relative">
            <select
              value={filters.roomType}
              onChange={handleRoomTypeChange}
              className="form-input w-full px-4 py-4 rounded-xl font-body appearance-none"
            >
              <option value="all" className="bg-midnight-800">
                Tất cả
              </option>
              <option value="single" className="bg-midnight-800">
                Phòng đơn
              </option>
              <option value="double" className="bg-midnight-800">
                Phòng đôi
              </option>
              <option value="suite" className="bg-midnight-800">
                Phòng suite
              </option>
              <option value="vip" className="bg-midnight-800">
                Phòng VIP
              </option>
            </select>
            <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-royal-400 pointer-events-none" />
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <label className="block text-sm font-heading font-medium text-lavender-300 mb-3">
            Giá tối đa{" "}
            <span className="text-infinity-400 font-semibold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(filters.maxPrice)}
            </span>
          </label>
          <input
            type="range"
            min="1000000"
            max="6000000"
            step="500000"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                maxPrice: parseInt(e.target.value),
              }))
            }
            className="w-full h-3 bg-midnight-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default RoomsFilterSidebar;
