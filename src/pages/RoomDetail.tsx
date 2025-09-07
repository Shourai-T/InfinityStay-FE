import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Star,
  Wifi,
  Car,
  Coffee,
  Shield,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";
import { useAuth } from "../contexts/AuthContext.tsx";
import { formatCurrency, formatDate } from "../utils/dateUtils.ts";
import { showToast } from "../utils/toast.tsx";
import { Room } from "../types/index.ts";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { rooms } from "../data/rooms.ts";
import { generateRoomSlug } from "../utils/slugify.ts";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRoom } from "../store/bookingSlice.ts";
import * as Icons from "lucide-react";
import { roomsService } from "../services/roomsService.ts";
import axios from "axios";
import { RootState } from "../store/index.ts";

export default function RoomDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const [room, setRoom] = useState<Room | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [newReview, setNewReview] = useState({ comment: "" });
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [loading, setLoading] = useState(true);

  const idFromSlug = slug ? slug.split("-")[0] : "";

  useEffect(() => {
    if (!slug) return;

    const idFromSlug = slug.split("-")[0];

    const fetchRoom = async () => {
      try {
        setLoading(true);
        const fetchedRoom = await roomsService.getRoomById(idFromSlug);
        if (!fetchedRoom) {
          navigate("/404");
          return;
        }
        setRoom(fetchedRoom);

        // Nếu slug trên URL không trùng với slug thực tế → điều hướng lại URL đúng
        const correctSlug = generateRoomSlug(fetchedRoom);
        if (slug !== correctSlug) {
          navigate(`/phong/${correctSlug}`, { replace: true });
        }
      } catch (error) {
        console.error("Failed to fetch room detail:", error);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [slug, navigate]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await axios.get(
        `https://infinity-stay.mtri.online/api/comments/room/${idFromSlug}`
      );
      const reviewData = res.data.result || [];
      setReviews(reviewData);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetchReviews();
  }, [slug]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast.loginRequired();
      navigate("/dang-nhap");
      return;
    }
    if (!newReview.comment.trim()) {
      showToast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await axios.post(
        "https://infinity-stay.mtri.online/api/comments",
        {
          room: idFromSlug,
          userEmail: user.email,
          content: newReview.comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
          },
        }
      );

      showToast.success("Đánh giá của bạn đã được gửi thành công!");
      setNewReview({ comment: "" });
      await fetchReviews(); // Load lại đánh giá sau khi gửi thành công
    } catch (err) {
      showToast.error("Gửi đánh giá thất bại");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleBooking = () => {
    dispatch(setSelectedRoom(room));
    navigate("/dat-phong");
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-luxury flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-luxury lg:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-royal-400 hover:text-royal-300 mr-6 transition-colors duration-300 font-body"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </button>
          <div>
            <h1 className="text-4xl font-display font-bold text-gradient">
              {room.name}
            </h1>
            <div className="flex items-center mt-2 space-x-4">
              <span className="text-2xl font-heading font-bold text-infinity-400">
                {formatCurrency(room.price)}/đêm
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="card-luxury rounded-2xl overflow-hidden">
              <Swiper
                modules={[Navigation, Pagination, Thumbs, FreeMode]}
                spaceBetween={10}
                navigation={true}
                pagination={{ clickable: true }}
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                className="room-gallery-main h-96"
              >
                {room.image.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`${room.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                modules={[FreeMode, Navigation, Thumbs]}
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                className="room-gallery-thumbs h-24 mt-4 px-4 pb-4"
              >
                {room.image.map((image, index) => (
                  <SwiperSlide key={index} className="cursor-pointer">
                    <img
                      src={image}
                      alt={`${room.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Room Description */}
            <div className="card-luxury rounded-2xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-6 text-soft-white">
                Mô tả phòng
              </h2>
              <p className="text-lavender-300 font-body leading-relaxed mb-6">
                {room.fullDescription}
              </p>

              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {room.features.map((feature, index) => {
                  const IconComponent = Icons[
                    feature.icon as keyof typeof Icons
                  ] as React.ElementType;
                  return (
                    <div
                      key={index}
                      className="text-center p-4 bg-midnight-800/50 rounded-xl"
                    >
                      <div className="flex justify-center text-3xl mb-3">
                        {IconComponent ? <IconComponent /> : feature.icon}
                      </div>
                      <h3 className="font-heading font-semibold text-soft-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-lavender-400 font-body">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div> */}
            </div>

            {/* Amenities */}
            <div className="card-luxury rounded-2xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-6 text-soft-white">
                Tiện nghi phòng
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-royal-500/10 rounded-xl border border-royal-500/20"
                  >
                    <div className="w-2 h-2 bg-royal-400 rounded-full"></div>
                    <span className="text-lavender-300 font-body">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="card-luxury rounded-2xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-6 text-soft-white">
                Đánh giá từ khách hàng ({reviews.length})
              </h2>

              {/* Review Form */}
              {user ? (
                <form
                  onSubmit={handleSubmitReview}
                  className="mb-8 p-6 bg-midnight-800/50 rounded-xl border border-royal-500/20"
                >
                  <h3 className="font-heading font-semibold text-soft-white mb-4">
                    Viết đánh giá của bạn
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                      Đánh giá của bạn
                    </label>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-heading font-medium text-lavender-300 mb-2">
                      Nội dung đánh giá
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                      className="form-input w-full px-4 py-3 rounded-xl font-body resize-none"
                      rows={4}
                      placeholder="Chia sẻ trải nghiệm của bạn về phòng này..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="btn-primary px-6 py-3 rounded-xl font-heading font-semibold flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmittingReview ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Gửi đánh giá</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="mb-8 p-6 bg-royal-500/10 rounded-xl border border-royal-500/20 text-center">
                  <p className="text-lavender-300 font-body mb-4">
                    Bạn cần đăng nhập để viết đánh giá
                  </p>
                  <button
                    onClick={() => navigate("/dang-nhap")}
                    className="btn-primary px-6 py-3 rounded-xl font-heading font-semibold"
                  >
                    Đăng nhập ngay
                  </button>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-6 bg-midnight-800/30 rounded-xl border border-lavender-800/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-royal rounded-full flex items-center justify-center">
                          <span className="text-white font-heading font-semibold">
                            {review.userEmail.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-heading font-semibold text-soft-white">
                              {review.userEmail}
                            </h4>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-lavender-400 font-body">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-lavender-300 font-body leading-relaxed">
                      {review.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-luxury rounded-2xl p-8 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-heading font-bold text-infinity-400 mb-2">
                  {formatCurrency(room.price)}
                </div>
                <div className="text-lavender-400 font-body">mỗi đêm</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-lavender-300 font-body">
                  <Users className="h-5 w-5 mr-3 text-royal-400" />
                  <span>Tối đa {room.maxGuests} khách</span>
                </div>
                <div className="flex items-center text-lavender-300 font-body">
                  <MapPin className="h-5 w-5 mr-3 text-royal-400" />
                  <span>Diện tích {room.area}m²</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="btn-gold w-full py-4 px-6 rounded-xl font-heading font-bold text-lg mb-4"
              >
                Đặt phòng ngay
              </button>

              <button
                onClick={() => navigate("/phong")}
                className="w-full py-3 px-6 border border-royal-500/30 rounded-xl text-lavender-300 hover:bg-royal-500/5 transition-colors duration-300 font-body"
              >
                Xem phòng khác
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
