import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export const HomeContact: React.FC = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-royal-950/50 to-infinity-950/50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="fade-in-up">
            <h2 className="text-4xl font-display font-bold pb-8 text-gradient">
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
                  <span className="text-infinity-400 font-semibold">24/7</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-lavender-800/30">
                  <span>Fine Dining Restaurant</span>
                  <span className="text-infinity-400 font-semibold">24/7</span>
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
                  <span className="text-infinity-400 font-semibold">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
