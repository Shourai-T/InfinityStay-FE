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
      'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    shortDescription: 'Cozy single room perfect for business travelers with modern amenities and city views.',
    fullDescription: 'Phòng Deluxe Single được thiết kế dành riêng cho khách doanh nhân và du khách một mình. Không gian 25m² được bố trí thông minh với khu vực làm việc riêng biệt, giường đơn cao cấp và view thành phố tuyệt đẹp. Phòng được trang bị đầy đủ tiện nghi hiện đại cùng dịch vụ 24/7.',
    features: [
      {
        icon: 'Building',
        title: 'City View',
        description: 'Tầm nhìn panorama ra trung tâm thành phố'
      },
      {
        icon: 'Briefcase',
        title: 'Business Ready',
        description: 'Khu vực làm việc riêng với WiFi tốc độ cao'
      },
      {
        icon: 'BedSingle',
        title: 'Premium Bedding',
        description: 'Giường đơn cao cấp với đệm memory foam'
      }
    ],
    reviews: [
      {
        id: '1',
        userName: 'Nguyễn Minh Tuấn',
        comment: 'Phòng rất sạch sẽ và tiện nghi. View thành phố đẹp, phù hợp cho công tác. Nhân viên phục vụ nhiệt tình.',
        date: '2024-01-15',
      },
      {
        id: '2',
        userName: 'Lê Thị Hương',   
        comment: 'Không gian nhỏ gọn nhưng đầy đủ tiện nghi. WiFi nhanh, phù hợp cho làm việc.',
        date: '2024-01-10',
      }
    ],
    totalReviews: 28,
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
      'https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    shortDescription: 'Phòng đôi rộng rãi với ban công riêng, thiết kế sang trọng và tầm nhìn tuyệt đẹp.',
    fullDescription: 'Superior Double Room mang đến không gian nghỉ dưỡng lý tưởng cho cặp đôi. Với diện tích 35m², phòng có ban công riêng biệt, giường đôi king-size và khu vực thư giãn thoải mái. Thiết kế nội thất hiện đại kết hợp với các tiện nghi cao cấp tạo nên trải nghiệm nghỉ dưỡng hoàn hảo.',
    features: [
      {
        icon: 'Sunset',
        title: 'Private Balcony',
        description: 'Ban công riêng với view thành phố tuyệt đẹp'
      },
      {
        icon: 'Bath',
        title: 'Luxury Bathroom',
        description: 'Phòng tắm cao cấp với bồn tắm riêng'
      },
      {
        icon: 'Heart',
        title: 'Romantic Setting',
        description: 'Không gian lãng mạn dành cho cặp đôi'
      }
    ],
    reviews: [
      {
        id: '3',
        userName: 'Trần Văn Nam',
        comment: 'Phòng tuyệt vời! Ban công có view đẹp, phòng tắm sang trọng. Rất phù hợp cho honeymoon.',
        date: '2024-01-20',
      },
      {
        id: '4',
        userName: 'Phạm Thị Lan',
        comment: 'Không gian rộng rãi, sạch sẽ. Dịch vụ room service tốt.',
        date: '2024-01-18',
      }
    ],
    totalReviews: 28,
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
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    shortDescription: 'Suite cao cấp với phòng khách riêng, bếp nhỏ và không gian làm việc chuyên nghiệp.',
    fullDescription: 'Executive Suite là lựa chọn hoàn hảo cho gia đình hoặc nhóm bạn. Với 65m² được chia thành các khu vực riêng biệt: phòng ngủ master, phòng khách rộng rãi, bếp nhỏ đầy đủ tiện nghi và khu vực làm việc. Thiết kế sang trọng với nội thất cao cấp và dịch vụ butler chuyên nghiệp.',
    features: [
      {
        icon: 'Sofa',
        title: 'Separate Living Area',
        description: 'Phòng khách riêng biệt với sofa cao cấp'
      },
      {
        icon: 'UtensilsCrossed',
        title: 'Kitchenette',
        description: 'Bếp nhỏ đầy đủ tiện nghi nấu nướng'
      },
      {
        icon: 'Bell',
        title: 'Butler Service',
        description: 'Dịch vụ butler cá nhân 24/7'
      }
    ],
    reviews: [
      {
        id: '5',
        userName: 'Hoàng Minh Đức',
        comment: 'Suite tuyệt vời cho gia đình! Không gian rộng, bếp tiện lợi, dịch vụ butler chuyên nghiệp.',
        date: '2024-01-25',
      },
      {
        id: '6',
        userName: 'Ngô Thị Mai',
        comment: 'Đáng đồng tiền bát gạo! Phòng khách rộng, view đẹp, tiện nghi đầy đủ.',
        date: '2024-01-22',
      }
    ],
    totalReviews: 28,
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
      'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    shortDescription: 'Đỉnh cao của sự sang trọng với tầm nhìn panorama, jacuzzi riêng và dịch vụ concierge.',
    fullDescription: 'Presidential VIP Suite - đỉnh cao của sự sang trọng tại Infinity Stay. Với 120m² được thiết kế như một căn penthouse, suite có tầm nhìn panorama 360 độ, jacuzzi riêng trên ban công, phòng ăn riêng và dịch vụ concierge cá nhân. Đây là lựa chọn hoàn hảo cho những dịp đặc biệt và khách VIP.',
    features: [
      {
        icon: 'Landmark',
        title: 'Panoramic View',
        description: 'Tầm nhìn 360 độ ra toàn thành phố'
      },
      {
        icon: 'Bath',
        title: 'Private Jacuzzi',
        description: 'Jacuzzi riêng trên ban công với view tuyệt đẹp'
      },
      {
        icon: 'GlassWater',
        title: 'VIP Concierge',
        description: 'Dịch vụ concierge cá nhân cao cấp'
      }
    ],
    reviews: [
      {
        id: '7',
        userName: 'Lý Quang Minh',
        comment: 'Trải nghiệm tuyệt vời! Suite như một penthouse, view đẹp không thể tả, dịch vụ hoàn hảo.',
        date: '2024-01-28',
      },
      {
        id: '8',
        userName: 'Vũ Thị Hồng',
        comment: 'Đáng giá từng đồng! Jacuzzi trên ban công tuyệt vời, concierge rất chuyên nghiệp.',
        date: '2024-01-26',
      }
    ],
    totalReviews: 18,
    available: true
  }
];
