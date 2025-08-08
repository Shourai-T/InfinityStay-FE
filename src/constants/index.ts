export const API_ENDPOINTS = {
  ROOMS: '/api/rooms',
  BOOKINGS: '/api/bookings',
  AUTH: '/api/auth'
};

export const PAGINATION = {
  ROOMS_PER_PAGE: 6,
  INITIAL_PAGE: 1
};

export const ROOM_TYPES = {
  SINGLE: 'single',
  DOUBLE: 'double',
  SUITE: 'suite',
  VIP: 'vip'
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
} as const;

export const PAYMENT_METHODS = {
  ONLINE: 'online',
  ONSITE: 'onsite'
} as const;