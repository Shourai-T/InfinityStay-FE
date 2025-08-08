import React from "react";
import { Wifi, Car, Coffee, Shield } from "lucide-react";

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
}

const features: FeatureItem[] = [
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
];

export const HomeFeatures: React.FC = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-display font-bold pb-6 text-gradient">
            Tại sao chọn Infinity Stay?
          </h2>
          <p className="text-xl text-lavender-300 font-body max-w-3xl mx-auto">
            Chúng tôi mang đến trải nghiệm nghỉ dưỡng đẳng cấp với những tiện
            ích hiện đại nhất
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
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
  );
};
