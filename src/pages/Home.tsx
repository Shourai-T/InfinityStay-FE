import React, { useState } from "react";
import {
  Calendar,
  Users,
  Star,
  Wifi,
  Car,
  Coffee,
  Shield,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Crown,
  Gem,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import { rooms } from "../data/rooms";
import { formatCurrency } from "../utils/dateUtils";
import HomeImg from "../assets/imgs/home_img.jpg";
import { RoomSlider } from "../components/home/RoomSlider";

export default function Home() {
  const navigate = useNavigate();
  const [searchDates, setSearchDates] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleSearch = () => {};

  const handleBookRoom = (room: (typeof rooms)[0]) => {};

  return (
    <div className="min-h-screen bg-gradient-luxury">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${HomeImg})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-midnight-950/90 via-midnight-900/80 to-royal-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="fade-in-up">
            <h1 className="text-5xl md:text-7xl font-display font-bold pb-3 mb-5 text-gradient leading-tight">
              Infinity Stay
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-lavender-200 font-body max-w-3xl mx-auto">
              Where comfort meets infinity
            </p>
            <p className="text-lg md:text-xl mb-12 text-lavender-300 font-body max-w-2xl mx-auto opacity-90">
              Trải nghiệm sự sang trọng và tiện nghi tại trung tâm thành phố với
              dịch vụ đẳng cấp quốc tế
            </p>

            {/* Search Form */}
            <div className="glass-effect rounded-3xl shadow-luxury p-8 max-w-5xl mx-auto border-gradient">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-heading font-medium text-lavender-300">
                    Ngày nhận phòng
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={searchDates.checkIn}
                      onChange={(e) =>
                        setSearchDates({
                          ...searchDates,
                          checkIn: e.target.value,
                        })
                      }
                      className="form-input w-full pl-12 pr-4 py-4 rounded-xl font-body"
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <Calendar className="absolute right-4 top-4 h-5 w-5 text-royal-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-heading font-medium text-lavender-300">
                    Ngày trả phòng
                  </label>
                  <div className="relative">
                    {/* <Calendar className="absolute left-4 top-4 h-5 w-5 text-royal-400" /> */}
                    <input
                      type="date"
                      value={searchDates.checkOut}
                      onChange={(e) =>
                        setSearchDates({
                          ...searchDates,
                          checkOut: e.target.value,
                        })
                      }
                      className="form-input w-full pl-12 pr-4 py-4 rounded-xl font-body"
                      min={
                        searchDates.checkIn ||
                        new Date().toISOString().split("T")[0]
                      }
                    />
                    <Calendar className="absolute right-4 top-4 h-5 w-5 text-royal-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-heading font-medium text-lavender-300">
                    Số khách
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-4 h-5 w-5 text-royal-400" />
                    <select
                      value={searchDates.guests}
                      onChange={(e) =>
                        setSearchDates({
                          ...searchDates,
                          guests: parseInt(e.target.value),
                        })
                      }
                      className="form-input w-full pl-12 pr-4 py-4 rounded-xl font-body"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option
                          key={num}
                          value={num}
                          className="bg-midnight-800"
                        >
                          {num} khách
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    className="btn-primary w-full py-4 px-6 rounded-xl font-heading font-semibold text-lg"
                  >
                    Tìm phòng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl font-display font-bold mb-6 text-gradient">
              Tại sao chọn Infinity Stay?
            </h2>
            <p className="text-xl text-lavender-300 font-body max-w-3xl mx-auto">
              Chúng tôi mang đến trải nghiệm nghỉ dưỡng đẳng cấp với những tiện
              ích hiện đại nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Wifi,
                title: "WiFi tốc độ cao",
                desc: "Kết nối internet fiber optic tốc độ gigabit trong toàn bộ khách sạn",
                color: "text-royal-400",
              },
              {
                icon: Car,
                title: "Valet Parking",
                desc: "Dịch vụ đỗ xe cao cấp với bảo vệ 24/7 và rửa xe miễn phí",
                color: "text-infinity-400",
              },
              {
                icon: Coffee,
                title: "Fine Dining",
                desc: "Nhà hàng Michelin với đầu bếp quốc tế phục vụ 24/7",
                color: "text-royal-400",
              },
              {
                icon: Shield,
                title: "An ninh tuyệt đối",
                desc: "Hệ thống bảo mật AI và đội ngũ an ninh chuyên nghiệp",
                color: "text-infinity-400",
              },
            ].map((feature, index) => (
              <div key={index} className="group luxury-hover">
                <div className="card-luxury rounded-2xl p-8 text-center h-full">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-royal mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-4 text-soft-white">
                    {feature.title}
                  </h3>
                  <p className="text-lavender-300 font-body leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Slider Section */}
      <RoomSlider />

      {/* Contact Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-royal-950/50 to-infinity-950/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="fade-in-up">
              <h2 className="text-4xl font-display font-bold mb-8 text-gradient">
                Liên hệ với chúng tôi
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-royal rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-soft-white mb-1">
                      Địa chỉ
                    </p>
                    <p className="text-lavender-300 font-body">
                      123 Đường Luxury, Quận 1, TP.HCM
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-royal rounded-xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-soft-white mb-1">
                      Hotline 24/7
                    </p>
                    <p className="text-lavender-300 font-body">
                      +84 28 1234 5678
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-royal rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-soft-white mb-1">
                      Email
                    </p>
                    <p className="text-lavender-300 font-body">
                      concierge@infinitystay.vn
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="fade-in-up">
              <div className="card-luxury rounded-2xl p-8">
                <h3 className="text-2xl font-heading font-semibold mb-6 text-soft-white">
                  Giờ phục vụ
                </h3>
                <div className="space-y-4 text-lavender-300 font-body">
                  <div className="flex justify-between items-center py-2 border-b border-lavender-800/30">
                    <span>Lễ tân & Concierge</span>
                    <span className="text-infinity-400 font-semibold">
                      24/7
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-lavender-800/30">
                    <span>Fine Dining Restaurant</span>
                    <span className="text-infinity-400 font-semibold">
                      24/7
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-lavender-800/30">
                    <span>Spa & Wellness</span>
                    <span className="text-infinity-400 font-semibold">
                      6:00 - 23:00
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-lavender-800/30">
                    <span>Infinity Pool & Bar</span>
                    <span className="text-infinity-400 font-semibold">
                      6:00 - 24:00
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Business Center</span>
                    <span className="text-infinity-400 font-semibold">
                      24/7
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
