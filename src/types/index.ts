export interface Room {
  id: string;
  name: string;
  type: 'single' | 'double' | 'suite' | 'vip';
  price: number;
  maxGuests: number;
  area: number;
  amenities: string[];
  images: string[];
  description: string;
  available: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentMethod: 'online' | 'onsite';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface DateRange {
  checkIn: string;
  checkOut: string;
}