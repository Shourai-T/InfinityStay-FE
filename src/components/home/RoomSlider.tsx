import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Star,
  Sparkles,
  Crown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { roomDetails } from "../../data/roomDetails";
import { formatCurrency } from "../../utils/dateUtils";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { flushSync } from "react-dom";

export const RoomSlider: React.FC = () => {
  const navigate = useNavigate();
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const handleBookRoom = (slug: string) => {
    navigate(`/phong/${slug}`);
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case "vip":
        return <Crown className="h-5 w-5 text-infinity-400" />;
      case "suite":
        return <Sparkles className="h-5 w-5 text-royal-400" />;
      default:
        return <Star className="h-5 w-5 text-royal-400" />;
    }
  };

  const getRoomTypeBadge = (type: string) => {
    switch (type) {
      case "vip":
        return "bg-gradient-gold text-midnight-900 border-infinity-500/30";
      case "suite":
        return "bg-gradient-royal text-white border-royal-500/30";
      case "double":
        return "bg-royal-500/20 text-royal-300 border-royal-500/30";
      default:
        return "bg-lavender-500/20 text-lavender-300 border-lavender-500/30";
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      {/* <div className="absolute top-10 left-10 animate-pulse">
        <Sparkles className="h-8 w-8 text-royal-400 opacity-30" />
      </div>
      <div className="absolute bottom-20 right-20 animate-pulse delay-1000">
        <Crown className="h-10 w-10 text-infinity-400 opacity-20" />
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gradient">
            Khám phá loại phòng
          </h2>
          <p className="text-xl text-lavender-300 font-body max-w-3xl mx-auto leading-relaxed">
            Từ phòng tiêu chuẩn đến suite tổng thống, mỗi không gian đều được
            thiết kế để mang lại sự thoải mái tuyệt đối
          </p>
        </div>

        {/* Custom Navigation Buttons */}
        <div className="flex justify-center items-center mb-8 space-x-4">
          <button
            ref={prevRef}
            className="group w-14 h-14 bg-gradient-royal rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-royal"
          >
            <ChevronLeft className="h-6 w-6 text-white group-hover:text-infinity-200 transition-colors duration-300" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-royal-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-royal-400 rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 bg-royal-400 rounded-full animate-pulse delay-400"></div>
          </div>

          <button
            ref={nextRef}
            className="group w-14 h-14 bg-gradient-royal rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-royal"
          >
            <ChevronRight className="h-6 w-6 text-white group-hover:text-infinity-200 transition-colors duration-300" />
          </button>
        </div>

        {/* Swiper Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            effect="coverflow"
            coverflowEffect={{
              rotate: 15,
              stretch: 0,
              depth: 200,
              modifier: 1,
              slideShadows: true,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet !bg-royal-400 !opacity-50",
              bulletActiveClass:
                "swiper-pagination-bullet-active !bg-infinity-400 !opacity-100",
            }}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 2.5,
                spaceBetween: 40,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 50,
              },
            }}
            onBeforeInit={(swiper) => {
              if (
                swiper.params.navigation &&
                typeof swiper.params.navigation !== "boolean"
              ) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            className="room-slider pb-16"
          >
            {roomDetails.map((room, index) => (
              <SwiperSlide key={room.id} className="!h-auto mb-10">
                <div className="group card-luxury rounded-3xl overflow-hidden h-full">
                  {/* Room Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/90 via-midnight-900/20 to-transparent" />

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 glass-effect px-4 py-2 rounded-xl">
                      <span className="text-sm font-heading font-bold text-infinity-400">
                        {formatCurrency(room.price)}/đêm
                      </span>
                    </div>

                    {/* Room Type Badge */}
                    <div
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full border flex items-center space-x-1 ${getRoomTypeBadge(
                        room.type
                      )}`}
                    >
                      {getRoomTypeIcon(room.type)}
                      <span className="text-xs font-heading font-bold uppercase">
                        {room.type === "vip" ? "VIP" : room.type}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= room.averageRating
                                ? "text-infinity-400 fill-current"
                                : "text-lavender-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-lavender-300 font-body">
                        ({room.totalReviews})
                      </span>
                    </div>
                  </div>

                  {/* Room Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-heading font-bold mb-3 text-soft-white group-hover:text-royal-300 transition-colors duration-300">
                      {room.name}
                    </h3>

                    <div className="flex items-center mb-4 text-sm text-lavender-400 font-body">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Tối đa {room.maxGuests} khách</span>
                      <span className="mx-2">•</span>
                      <span>{room.area}m²</span>
                    </div>

                    <p className="text-lavender-300 text-sm mb-6 line-clamp-3 font-body leading-relaxed">
                      {room.shortDescription}
                    </p>

                    {/* Amenities Preview */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-royal-500/20 text-royal-300 px-3 py-1 rounded-full font-body border border-royal-500/30"
                          >
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="text-xs text-lavender-400 font-body px-3 py-1">
                            +{room.amenities.length - 3} tiện nghi khác
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleBookRoom(room.slug)}
                      className="btn-gold w-full py-4 px-6 rounded-xl font-heading font-bold text-lg group-hover:scale-105 transition-all duration-300 shadow-gold"
                    >
                      Đặt ngay
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 fade-in-up">
          <button
            onClick={() => navigate("/phong")}
            className="btn-primary px-8 py-4 rounded-xl font-heading font-semibold text-lg"
          >
            Xem tất cả phòng
          </button>
        </div>
      </div>
    </section>
  );
};
