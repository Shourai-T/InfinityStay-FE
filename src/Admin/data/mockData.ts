import { Room, User, ChatMessage, BookingEvent } from "../types/types";

export const revenueData = [
  { month: "T1", revenue: 45000000, bookings: 120 },
  { month: "T2", revenue: 52000000, bookings: 140 },
  { month: "T3", revenue: 48000000, bookings: 130 },
  { month: "T4", revenue: 61000000, bookings: 165 },
  { month: "T5", revenue: 55000000, bookings: 150 },
  { month: "T6", revenue: 67000000, bookings: 180 },
];

export const roomTypeData = [
  { name: "Single", value: 25, color: "#10b981" },
  { name: "Double", value: 45, color: "#6366f1" },
  { name: "Suite", value: 30, color: "#fbbf24" },
  { name: "Vip", value: 25, color: "#ef4444" },
];

export const mockBookings: BookingEvent[] = [
  {
    id: 1,
    title: "Nguyễn Văn A - Deluxe",
    start: new Date(2024, 11, 15, 14, 0),
    end: new Date(2024, 11, 17, 12, 0),
    resource: { status: "confirmed", amount: 2500000 },
  },
  {
    id: 2,
    title: "Trần Thị B - Suite",
    start: new Date(2024, 11, 18, 14, 0),
    end: new Date(2024, 11, 20, 12, 0),
    resource: { status: "pending", amount: 4200000 },
  },
];

export const mockRooms: Room[] = [
  {
    id: "1",
    name: "Deluxe Ocean View",
    type: "double",
    price: 2500000,
    maxGuests: 2,
    area: 45,
    amenities: ["WiFi", "TV", "Minibar", "AC"],
    images: [
      "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
    ],
    shortDescription: "Phòng deluxe với view biển tuyệt đẹp",
    fullDescription:
      "Phòng deluxe cao cấp với tầm nhìn ra biển, đầy đủ tiện nghi hiện đại.",
  },
  {
    id: "2",
    name: "Presidential Suite",
    type: "suite",
    price: 5000000,
    maxGuests: 4,
    area: 80,
    amenities: ["WiFi", "TV", "Minibar", "AC", "Jacuzzi"],
    images: [
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    ],
    shortDescription: "Suite tổng thống sang trọng",
    fullDescription:
      "Suite cao cấp nhất với không gian rộng rãi và tiện nghi 5 sao.",
  },
];

export const mockUsers: User[] = [
  {
    id: "1",
    email: "user1@example.com",
    firstName: "Nguyễn",
    lastName: "Văn A",
    phoneNumber: "0901234567",
    verified: true,
    role: "user",
    joinDate: "2024-01-15",
    totalBookings: 5,
    totalSpent: 12500000,
    status: "active",
  },
  {
    id: "2",
    email: "user2@example.com",
    firstName: "Trần",
    lastName: "Thị B",
    phoneNumber: "0907654321",
    verified: false,
    role: "user",
    joinDate: "2024-02-20",
    totalBookings: 3,
    totalSpent: 8400000,
    status: "active",
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    userId: "1",
    userName: "Nguyễn Văn A",
    message: "Xin chào, tôi muốn hỏi về phòng suite",
    timestamp: new Date(2024, 11, 15, 10, 30),
    isAdmin: false,
  },
  {
    id: "2",
    userId: "1",
    userName: "Admin",
    message: "Chào bạn! Tôi có thể giúp gì cho bạn về phòng suite?",
    timestamp: new Date(2024, 11, 15, 10, 32),
    isAdmin: true,
  },
  {
    id: "3",
    userId: "2",
    userName: "Nguyễn Văn A",
    message: "Xin chào, tôi muốn hỏi về phòng suite",
    timestamp: new Date(2024, 11, 15, 10, 30),
    isAdmin: false,
  },
  {
    id: "4",
    userId: "2",
    userName: "Admin",
    message: "Chào bạn! Tôi có thể giúp gì cho bạn về phòng suite?",
    timestamp: new Date(2024, 11, 15, 10, 32),
    isAdmin: true,
  },
];
