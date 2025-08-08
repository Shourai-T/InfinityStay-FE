import {
  Calendar,
  Filter,
  SlidersHorizontal,
  Users,
  ChevronDownIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { RoomCard } from "../components/common/RoomCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useRooms } from "../hooks/useRooms";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import RoomsFilterSidebar from "../components/rooms/RoomsFilterSidebar";
import RoomsList from "../components/rooms/RoomsList";
import { Filters, RoomType } from "../types";

const Rooms = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    checkIn: "",
    checkOut: "",
    guests: 1,
    maxPrice: 6000000,
    roomType: "all",
  });

  const bookingData = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      checkIn: bookingData.dateRange?.checkIn || "",
      checkOut: bookingData.dateRange?.checkOut || "",
      guests: bookingData.guests || 1,
      roomType: bookingData.roomType || "all",
    }));
  }, [bookingData]);

  const { rooms, loading, error, fetchMore, hasMore, refetch } = useRooms({
    filters,
  });
  const { isFetching, lastElementRef } = useInfiniteScroll(fetchMore, hasMore);

  return (
    <div className="min-h-screen bg-gradient-luxury">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-gradient">
              Phòng & Giá
            </h1>
            <p className="text-lavender-300 font-body mt-2">
              Khám phá các phòng nghỉ đẳng cấp của chúng tôi
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden btn-primary px-4 py-2 rounded-xl flex items-center space-x-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="font-body">Bộ lọc</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <RoomsFilterSidebar
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
          />
          {/* Rooms List */}
          <RoomsList
            rooms={rooms}
            loading={loading}
            error={error}
            hasMore={hasMore}
            isFetching={isFetching}
            lastElementRef={lastElementRef}
            onRefetch={refetch}
            onResetFilters={() =>
              setFilters({
                checkIn: "",
                checkOut: "",
                guests: 1,
                maxPrice: 6000000,
                roomType: "all",
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Rooms;
