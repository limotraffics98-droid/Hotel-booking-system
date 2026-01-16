import { apiClient } from './client';
import { Booking, ApiResponse } from '../types';

export const bookingsApi = {
  createBooking: async (data: {
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    roomsCount: number;
  }): Promise<ApiResponse<Booking>> => {
    return apiClient.post('/bookings', data);
  },

  getMyBookings: async (): Promise<
    ApiResponse<{
      upcoming: Booking[];
      past: Booking[];
      cancelled: Booking[];
      pending: Booking[];
    }>
  > => {
    return apiClient.get('/bookings/my');
  },

  getBookingById: async (id: string): Promise<ApiResponse<Booking>> => {
    return apiClient.get(`/bookings/${id}`);
  },

  cancelBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    return apiClient.patch(`/bookings/${id}/cancel`);
  },
};
