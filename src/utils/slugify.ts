import { Room } from "../types";

// Generates a slug for a room based on its ID and name
// Example: "12345-deluxe-suite"
export function generateRoomSlug(room: Room): string {
  const slugifiedName = room.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // thay khoảng trắng bằng -
    .replace(/[^a-z0-9-]/g, '') // loại bỏ ký tự đặc biệt
    .replace(/-+$/g, '');       // loại bỏ dấu - ở cuối

  return `${room.id}-${slugifiedName}`;
}