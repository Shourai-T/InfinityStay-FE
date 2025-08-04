import React, { forwardRef } from 'react';
import { Users, Star, Sparkles } from 'lucide-react';
import { Room } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const RoomCard = forwardRef<HTMLDivElement, RoomCardProps>(
  ({ room, onBook, className = '', style }, ref) => {
    return (
      <div 
        ref={ref}
        className={`group luxury-hover card-luxury rounded-2xl overflow-hidden ${className}`}
        style={style}
      >
        <div className="relative">
          <img
            src={room.images[0]}
            alt={room.name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/80 via-transparent to-transparent" />
          
          {/* Price Badge */}
          <div className="absolute top-4 right-4 glass-effect px-4 py-2 rounded-xl">
            <span className="text-sm font-heading font-semibold text-infinity-400">
              {formatCurrency(room.price)}/đêm
            </span>
          </div>
          
          {/* Rating */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center space-x-1">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="h-4 w-4 text-infinity-400 fill-current" />
              ))}
            </div>
          </div>

          {/* VIP Badge */}
          {room.type === 'vip' && (
            <div className="absolute top-4 left-4 bg-gradient-gold px-3 py-1 rounded-full flex items-center space-x-1">
              <Sparkles className="h-3 w-3 text-midnight-900" />
              <span className="text-xs font-heading font-bold text-midnight-900">VIP</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-heading font-semibold mb-3 text-soft-white group-hover:text-royal-300 transition-colors duration-300">
            {room.name}
          </h3>
          
          <div className="flex items-center mb-3 text-sm text-lavender-400 font-body">
            <Users className="h-4 w-4 mr-2" />
            <span>Tối đa {room.maxGuests} khách</span>
            <span className="mx-2">•</span>
            <span>{room.area}m²</span>
          </div>
          
          <p className="text-lavender-300 text-sm mb-4 line-clamp-2 font-body leading-relaxed">
            {room.description}
          </p>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span 
                  key={index}
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
          
          <button
            onClick={() => onBook(room)}
            className="btn-gold w-full py-3 px-4 rounded-xl font-heading font-semibold group-hover:scale-105 transition-transform duration-300"
          >
            Đặt phòng ngay
          </button>
        </div>
      </div>
    );
  }
);

RoomCard.displayName = 'RoomCard';