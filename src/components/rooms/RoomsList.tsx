import React from "react";
import { RoomCard } from "../common/RoomCard";
import LoadingSpinner from "../ui/LoadingSpinner";
import { Room } from "../../types";
import { ErrorMessage } from "../common/ErrorMessage";
import { generateRoomSlug } from "../../utils/slugify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { showToast } from "../../utils/toast";

interface RoomsListProps {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  isFetching: boolean;
  lastElementRef: (node: HTMLElement | null) => void;
  onRefetch: () => void;
  onResetFilters: () => void;
}

const RoomsList: React.FC<RoomsListProps> = ({
  rooms,
  loading,
  error,
  hasMore,
  isFetching,
  lastElementRef,
  onRefetch,
  onResetFilters,
}) => {
  const navigate = useNavigate();
  const dateRange = useSelector((state: RootState) => state.booking.dateRange);
  const checkIn = dateRange?.checkIn ?? null;
  const checkOut = dateRange?.checkOut ?? null;

  if (error && rooms.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-8">
            <h1 className="text-4xl font-display font-bold text-gradient">
              Phòng & Giá
            </h1>
          </div>
          <ErrorMessage message={error} onRetry={onRefetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      {/* Header Result */}
      <div className="mb-8 flex items-center justify-between">
        <p className="text-lavender-300 font-body text-lg">
          {loading && rooms.length === 0 ? (
            <span className="flex items-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Đang tìm kiếm phòng phù hợp...
            </span>
          ) : (
            `Tìm thấy ${rooms.length} phòng phù hợp với yêu cầu của bạn`
          )}
        </p>
      </div>

      {/* Initial Loading */}
      {loading && rooms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner size="lg" />
          <p className="text-lavender-300 font-body mt-4">
            Đang tìm kiếm phòng tốt nhất cho bạn...
          </p>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="space-y-6">
        {rooms.map((room, index) => (
          <RoomCard
            key={room.id}
            room={room}
            onBook={() => {
              if (!checkIn || !checkOut) {
                showToast.dateRequired();
                return;
              }
              const slug = generateRoomSlug(room);
              navigate(`/phong/${slug}`);
            }}
            ref={index === rooms.length - 1 ? lastElementRef : undefined}
            className="fade-in-up"
            style={{ animationDelay: `${(index % 6) * 0.1}s` }}
          />
        ))}
      </div>

      {/* Infinite Scroll Loading */}
      {isFetching && rooms.length > 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner />
          <span className="ml-2 text-lavender-300 font-body mt-2">
            Đang tải thêm phòng tuyệt vời...
          </span>
        </div>
      )}

      {/* No More Results */}
      {!hasMore && rooms.length > 0 && (
        <div className="text-center py-12">
          <div className="card-luxury rounded-2xl p-8 inline-block">
            <p className="text-lavender-300 font-body text-lg">
              Đã hiển thị tất cả phòng phù hợp
            </p>
            <p className="text-lavender-400 font-body text-sm mt-2">
              Thử thay đổi bộ lọc để khám phá thêm lựa chọn
            </p>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && rooms.length === 0 && !error && (
        <div className="text-center py-20">
          <div className="card-luxury rounded-2xl p-12 max-w-md mx-auto">
            <h3 className="text-2xl font-heading font-semibold text-soft-white mb-4">
              Không tìm thấy phòng phù hợp
            </h3>
            <p className="text-lavender-300 font-body mb-6">
              Thử điều chỉnh ngày tháng hoặc tiêu chí tìm kiếm để khám phá thêm
              lựa chọn
            </p>
            <button
              onClick={onResetFilters}
              className="btn-primary px-6 py-3 rounded-xl font-heading font-semibold"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsList;
