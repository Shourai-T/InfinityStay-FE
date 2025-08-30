import React from "react";
import {
  Edit,
  Trash2,
  Hotel,
  Wifi,
  Coffee,
  Tv,
  ShowerHead,
} from "lucide-react";
import { formatCurrency } from "../../../utils/dateUtils";
import { Room } from "../../types/types";

interface RoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onDelete }) => {
  // Helper function to get icon for amenity
  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes("wifi")) return <Wifi className="h-3 w-3" />;
    if (lowerAmenity.includes("tv")) return <Tv className="h-3 w-3" />;
    if (lowerAmenity.includes("coffee") || lowerAmenity.includes("minibar"))
      return <Coffee className="h-3 w-3" />;
    if (lowerAmenity.includes("shower") || lowerAmenity.includes("bath"))
      return <ShowerHead className="h-3 w-3" />;
    return null;
  };

  const handleDelete = () => {
    if (room && room.id) {
      console.log(`Requesting deletion of room: ${room.id}`);
      onDelete(room.id);
    } else {
      console.error("Cannot delete room: ID is missing", room);
    }
  };

  return (
    <div className="card-luxury rounded-2xl overflow-hidden">
      <div className="h-48 bg-gradient-to-r from-royal-500 to-infinity-500 relative">
        {room.images && room.images.length > 0 ? (
          <img
            src={typeof room.images[0] === "string" ? room.images[0] : ""}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Hotel className="h-16 w-16 text-white" />
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-heading font-bold text-white">
            {room.name}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              room.type === "vip"
                ? "bg-gold-500/20 text-gold-400"
                : room.type === "suite"
                ? "bg-royal-500/20 text-royal-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {room.type.toUpperCase()}
          </span>
        </div>
        <p className="text-lavender-300 font-body text-sm mb-4">
          {room.shortDescription}
        </p>

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 text-xs text-lavender-400 bg-midnight-700/50 px-2 py-1 rounded-full"
                >
                  {getAmenityIcon(amenity)}
                  {amenity.length > 15
                    ? `${amenity.substring(0, 15)}...`
                    : amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="inline-flex items-center text-xs text-lavender-400 bg-midnight-700/50 px-2 py-1 rounded-full">
                  +{room.amenities.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-infinity-400 font-heading font-bold">
            {formatCurrency(room.price)}/đêm
          </span>
          <span className="text-lavender-400 font-body text-sm">
            {room.maxGuests} khách • {room.area}m²
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(room)}
            className="flex-1 btn-primary px-4 py-2 rounded-xl font-body flex items-center justify-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Sửa</span>
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors duration-300"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
