import axios from "axios";
import { Room } from "../types";

interface GetRoomsParams {
  page: number;
  limit: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  maxPrice?: number;
  roomType?: string;
}

interface GetRoomsResponse {
  data: Room[];
  total: number;
  page: number;
  hasMore: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

class RoomsService {
  async getRooms(params: GetRoomsParams): Promise<GetRoomsResponse> {
    const { roomType, ...rest } = params;
    const queryParams = {
      page: rest.page,
      limit: rest.limit,
      checkInDate: rest.checkIn,
      checkOutDate: rest.checkOut,
      numberOfGuests: rest.guests,
      maxPrice: rest.maxPrice,
      ...(roomType && roomType !== "all" ? { roomType } : {}),
    };
    const response = await axios.get(`${API_URL}/booking/get-available-rooms`, {
      params: queryParams,
    });

    const roomsApi = response.data.result || [];
    const rooms: Room[] = roomsApi.map((r: any) => ({
      id: r._id,
      name: r.name,
      type: r.roomType as Room["type"],
      price: r.priceByDay,
      maxGuests: r.maxPeople,
      area: r.sizeRoom,          // map về area
      amenities: r.amenities || [],
      image: r.image || [],      // giữ array luôn (theo interface của bạn)
      shortDescription: r.shortDescription || "",
      fullDescription: r.fullDescription || "",
    }));
    return {
      data: rooms,
      total: rooms.length,
      page: params.page,
      hasMore: (params.page * params.limit) < (rooms.length || 0),
    };
  }

  async getRoomById(id: string): Promise<Room | null> {
    const response = await axios.get(`${API_URL}/rooms/${id}`);
    const r = response.data?.result;
    if (!r) return null;

    return {
      id: r._id,
      name: r.name,
      type: r.roomType as Room["type"],
      price: r.priceByDay,
      maxGuests: r.maxPeople,
      area: r.sizeRoom,          // map về area
      amenities: r.amenities || [],
      image: r.image || [],      // giữ array luôn (theo interface của bạn)
      shortDescription: r.shortDescription || "",
      fullDescription: r.fullDescription || "",
    };
  }
}

export const roomsService = new RoomsService();
