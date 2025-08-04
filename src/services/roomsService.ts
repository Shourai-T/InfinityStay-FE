import { Room } from '../types';
import { rooms as mockRooms } from '../data/rooms';

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
  hasMore: boolean;
  total: number;
  page: number;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class RoomsService {
  async getRooms(params: GetRoomsParams): Promise<GetRoomsResponse> {
    // Simulate API call delay
    await delay(800);

    let filteredRooms = [...mockRooms];

    // Apply filters
    if (params.roomType && params.roomType !== 'all') {
      filteredRooms = filteredRooms.filter(room => room.type === params.roomType);
    }

    if (params.maxPrice) {
      filteredRooms = filteredRooms.filter(room => room.price <= params.maxPrice);
    }

    if (params.guests) {
      filteredRooms = filteredRooms.filter(room => room.maxGuests >= params.guests);
    }

    // Simulate pagination by duplicating rooms with different IDs
    const totalRooms = filteredRooms.length * 5; // Simulate more rooms
    const allRooms: Room[] = [];
    
    for (let i = 0; i < 5; i++) {
      filteredRooms.forEach((room, index) => {
        allRooms.push({
          ...room,
          id: `${room.id}-${i}-${index}`,
          name: `${room.name} ${i > 0 ? `(${i + 1})` : ''}`
        });
      });
    }

    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedRooms = allRooms.slice(startIndex, endIndex);

    return {
      data: paginatedRooms,
      hasMore: endIndex < totalRooms,
      total: totalRooms,
      page: params.page
    };
  }

  async getRoomById(id: string): Promise<Room | null> {
    await delay(300);
    return mockRooms.find(room => room.id === id) || null;
  }
}

export const roomsService = new RoomsService();