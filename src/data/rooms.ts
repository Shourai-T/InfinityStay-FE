import { Room } from '../types';

export const rooms: Room[] = [
  {
    id: '1',
    name: 'Deluxe Single Room',
    type: 'single',
    price: 1200000,
    maxGuests: 1,
    area: 25,
    amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'City View', 'Work Desk'],
    images: [
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Cozy single room perfect for business travelers with modern amenities and city views.',
    available: true
  },
  {
    id: '2',
    name: 'Superior Double Room',
    type: 'double',
    price: 1800000,
    maxGuests: 2,
    area: 35,
    amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Room Service', 'Safe'],
    images: [
      'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Spacious double room with elegant décor and private balcony overlooking the city.',
    available: true
  },
  {
    id: '3',
    name: 'Executive Suite',
    type: 'suite',
    price: 3500000,
    maxGuests: 4,
    area: 65,
    amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Living Area', 'Kitchenette', 'Balcony', 'Butler Service'],
    images: [
      'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Luxurious suite with separate living area, kitchenette and premium amenities.',
    available: true
  },
  {
    id: '4',
    name: 'Presidential VIP Suite',
    type: 'vip',
    price: 5500000,
    maxGuests: 6,
    area: 120,
    amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Jacuzzi', 'Private Dining', 'Concierge', 'Panoramic View', 'Private Balcony'],
    images: [
      'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'The pinnacle of luxury with panoramic city views, private jacuzzi and personalized service.',
    available: true
  }
];