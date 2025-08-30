export type Tab = "overview" | "bookings" | "rooms" | "users" | "chat";

export interface Room {
  id: string;
  name: string;
  type: "single" | "double" | "suite" | "vip";
  price: number;
  maxGuests: number;
  area: number;
  amenities: string[];
  images: (string | File)[];
  shortDescription: string;
  fullDescription: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  verified: boolean;
  role: string;
  joinDate: string;
  totalBookings: number;
  totalSpent: number;
  status: "active" | "inactive";
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isAdmin: boolean;
}

export interface BookingEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: { status: string; amount: number };
}

export interface ApiBookingResponse {
  statusCode: number;
  message: string;
  result: ApiBooking[];
}

export interface ApiBooking {
  kind: string;
  isCheckOut: boolean;
  bookingId: string;
  status: string;
  roomId: string | null;
  userEmail: string;
  userPhone: string;
  totalPrice: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
}

export interface ApiRevenueResponse {
  statusCode: number;
  message: string;
  result: ApiRevenueItem[];
}

export interface ApiRevenueItem {
  month: string;
  revenue: number;
  count: number;
}
