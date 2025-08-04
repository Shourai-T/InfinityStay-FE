export interface RoomDetail {
  id: string;
  slug: string;
  name: string;
  type: 'single' | 'double' | 'suite' | 'vip';
  price: number;
  maxGuests: number;
  area: number;
  shortDescription: string;
  fullDescription: string;
  amenities: string[];
  images: string[];
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  reviews: {
    id: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
  }[];
  averageRating: number;
  totalReviews: number;
}

export const roomDetails: RoomDetail[] = [
  {
    id: '1',
    slug: 'deluxe-single-room',
    name: 'Deluxe Single Room',
    type: 'single',
    price: 1200000,
    maxGuests: 1,
    area: 25,
    shortDescription: 'Phòng đơn tinh tế dành cho khách doanh nhân với thiết kế hiện đại và đầy đủ tiện nghi.',
    fullDescription: 'Phòng Deluxe Single được thiết kế dành riêng cho khách doanh nhân và du khách một mình. Không gian 25m² được bố trí thông minh với khu vực làm việc riêng biệt, giường đơn cao cấp và view thành phố tuyệt đẹp. Phòng được trang bị đầy đủ tiện nghi hiện đại cùng dịch vụ 24/7.',
    amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'City View', 'Work Desk', 'Safe Box'],
    images: [
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: [
      {
        icon: '🏢',
        title: 'City View',
        description: 'Tầm nhìn panorama ra trung tâm thành phố'
      },
      {
        icon: '💼',
        title: 'Business Ready',
        description: 'Khu vực làm việc riêng với WiFi tốc độ cao'
      },
      {
        icon: '🛏️',
        title: 'Premium Bedding',
        description: 'Giường đơn cao cấp với đệm memory foam'
      }
    ],
    reviews: [
      {
        id: '1',
        userName: 'Nguyễn Minh Tuấn',
        rating: 5,
        comment: 'Phòng rất sạch sẽ và tiện nghi. View thành phố đẹp, phù hợp cho công tác. Nhân viên phục vụ nhiệt tình.',
        date: '2024-01-15',
        verified: true
      },
      {
        id: '2',
        userName: 'Lê Thị Hương',
        rating: 4,
        comment: 'Không gian nhỏ gọn nhưng đầy đủ tiện nghi. WiFi nhanh, phù hợp cho làm việc.',
        date: '2024-01-10',
        verified: true
      }
    ],
    averageRating: 4.5,
    totalReviews: 28
  },
  {
    id: '2',
    slug: 'superior-double-room',
    name: 'Superior Double Room',
    type: 'double',
    price: 1800000,
    maxGuests: 2,
    area: 35,
    shortDescription: 'Phòng đôi rộng rãi với ban công riêng, thiết kế sang trọng và tầm nhìn tuyệt đẹp.',
    fullDescription: 'Superior Double Room mang đến không gian nghỉ dưỡng lý tưởng cho cặp đôi. Với diện tích 35m², phòng có ban công riêng biệt, giường đôi king-size và khu vực thư giãn thoải mái. Thiết kế nội thất hiện đại kết hợp với các tiện nghi cao cấp tạo nên trải nghiệm nghỉ dưỡng hoàn hảo.',
    amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Room Service', 'Safe Box', 'Bathtub'],
    images: [
      'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: [
      {
        icon: '🌅',
        title: 'Private Balcony',
        description: 'Ban công riêng với view thành phố tuyệt đẹp'
      },
      {
        icon: '🛁',
        title: 'Luxury Bathroom',
        description: 'Phòng tắm cao cấp với bồn tắm riêng'
      },
      {
        icon: '👫',
        title: 'Romantic Setting',
        description: 'Không gian lãng mạn dành cho cặp đôi'
      }
    ],
    reviews: [
      {
        id: '3',
        userName: 'Trần Văn Nam',
        rating: 5,
        comment: 'Phòng tuyệt vời! Ban công có view đẹp, phòng tắm sang trọng. Rất phù hợp cho honeymoon.',
        date: '2024-01-20',
        verified: true
      },
      {
        id: '4',
        userName: 'Phạm Thị Lan',
        rating: 4,
        comment: 'Không gian rộng rãi, sạch sẽ. Dịch vụ room service tốt.',
        date: '2024-01-18',
        verified: true
      }
    ],
    averageRating: 4.7,
    totalReviews: 42
  },
  {
    id: '3',
    slug: 'executive-suite',
    name: 'Executive Suite',
    type: 'suite',
    price: 3500000,
    maxGuests: 4,
    area: 65,
    shortDescription: 'Suite cao cấp với phòng khách riêng, bếp nhỏ và không gian làm việc chuyên nghiệp.',
    fullDescription: 'Executive Suite là lựa chọn hoàn hảo cho gia đình hoặc nhóm bạn. Với 65m² được chia thành các khu vực riêng biệt: phòng ngủ master, phòng khách rộng rãi, bếp nhỏ đầy đủ tiện nghi và khu vực làm việc. Thiết kế sang trọng với nội thất cao cấp và dịch vụ butler chuyên nghiệp.',
    amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Living Area', 'Kitchenette', 'Balcony', 'Butler Service', 'Jacuzzi'],
    images: [
      'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: [
      {
        icon: '🏠',
        title: 'Separate Living Area',
        description: 'Phòng khách riêng biệt với sofa cao cấp'
      },
      {
        icon: '👨‍🍳',
        title: 'Kitchenette',
        description: 'Bếp nhỏ đầy đủ tiện nghi nấu nướng'
      },
      {
        icon: '🛎️',
        title: 'Butler Service',
        description: 'Dịch vụ butler cá nhân 24/7'
      }
    ],
    reviews: [
      {
        id: '5',
        userName: 'Hoàng Minh Đức',
        rating: 5,
        comment: 'Suite tuyệt vời cho gia đình! Không gian rộng, bếp tiện lợi, dịch vụ butler chuyên nghiệp.',
        date: '2024-01-25',
        verified: true
      },
      {
        id: '6',
        userName: 'Ngô Thị Mai',
        rating: 5,
        comment: 'Đáng đồng tiền bát gạo! Phòng khách rộng, view đẹp, tiện nghi đầy đủ.',
        date: '2024-01-22',
        verified: true
      }
    ],
    averageRating: 4.8,
    totalReviews: 35
  },
  {
    id: '4',
    slug: 'presidential-vip-suite',
    name: 'Presidential VIP Suite',
    type: 'vip',
    price: 5500000,
    maxGuests: 6,
    area: 120,
    shortDescription: 'Đỉnh cao của sự sang trọng với tầm nhìn panorama, jacuzzi riêng và dịch vụ concierge.',
    fullDescription: 'Presidential VIP Suite - đỉnh cao của sự sang trọng tại Infinity Stay. Với 120m² được thiết kế như một căn penthouse, suite có tầm nhìn panorama 360 độ, jacuzzi riêng trên ban công, phòng ăn riêng và dịch vụ concierge cá nhân. Đây là lựa chọn hoàn hảo cho những dịp đặc biệt và khách VIP.',
    amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Jacuzzi', 'Private Dining', 'Concierge', 'Panoramic View', 'Private Balcony', 'Wine Cellar'],
    images: [
      'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    features: [
      {
        icon: '🌆',
        title: 'Panoramic View',
        description: 'Tầm nhìn 360 độ ra toàn thành phố'
      },
      {
        icon: '🛁',
        title: 'Private Jacuzzi',
        description: 'Jacuzzi riêng trên ban công với view tuyệt đẹp'
      },
      {
        icon: '🥂',
        title: 'VIP Concierge',
        description: 'Dịch vụ concierge cá nhân cao cấp'
      }
    ],
    reviews: [
      {
        id: '7',
        userName: 'Lý Quang Minh',
        rating: 5,
        comment: 'Trải nghiệm tuyệt vời! Suite như một penthouse, view đẹp không thể tả, dịch vụ hoàn hảo.',
        date: '2024-01-28',
        verified: true
      },
      {
        id: '8',
        userName: 'Vũ Thị Hồng',
        rating: 5,
        comment: 'Đáng giá từng đồng! Jacuzzi trên ban công tuyệt vời, concierge rất chuyên nghiệp.',
        date: '2024-01-26',
        verified: true
      }
    ],
    averageRating: 4.9,
    totalReviews: 18
  }
];