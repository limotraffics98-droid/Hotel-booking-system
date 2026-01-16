export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  rating: number;
  latitude?: number;
  longitude?: number;
  mainImage?: string;
  images?: HotelImage[];
  amenities: string[];
  rooms?: Room[];
  reviews?: Review[];
  startingPrice?: number;
  reviewCount?: number;
}

export interface HotelImage {
  id: string;
  imageUrl: string;
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  totalRooms: number;
  description?: string;
  images?: RoomImage[];
}

export interface RoomImage {
  id: string;
  imageUrl: string;
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomsCount: number;
  totalAmount: number;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  hotel?: Hotel;
  room?: Room;
}

export interface Review {
  id: string;
  userId: string;
  hotelId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  hotels?: T[];
  bookings?: T[];
  reviews?: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SearchFilters {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  amenities?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'rating_desc';
}
