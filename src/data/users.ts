// src/mock/users.ts

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  avatar?: string;
  role: "guest" | "admin";
}

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Nguyễn Văn A",
    email: "anhtuan@example.com",
    password: "password123",
    phone: "0901234567",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "guest",
  },
  {
    id: "u2",
    name: "Trần Thị B",
    email: "thib@example.com",
    phone: "0907654321",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "guest",
  },
  {
    id: "u3",
    name: "Admin Hotel",
    email: "admin@infinitystay.com",
    phone: "0912345678",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    role: "admin",
  },
];
