import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const createHotelSchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  description: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  mainImage: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  amenities: z.array(z.string()).optional(),
});

export const updateHotelSchema = createHotelSchema.partial();

export const createRoomSchema = z.object({
  name: z.string().min(1),
  roomType: z.string().min(1),
  capacity: z.number().int().positive(),
  pricePerNight: z.number().positive(),
  totalRooms: z.number().int().positive(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
});

export const updateRoomSchema = createRoomSchema.partial();

export const createBookingSchema = z.object({
  hotelId: z.string().uuid(),
  roomId: z.string().uuid(),
  checkIn: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid check-in date'),
  checkOut: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid check-out date'),
  guests: z.number().int().positive(),
  roomsCount: z.number().int().positive(),
});

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});
