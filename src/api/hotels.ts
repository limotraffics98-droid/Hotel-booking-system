import { apiClient } from './client';
import { Hotel, Room, ApiResponse, PaginatedResponse, SearchFilters } from '../types';

export const hotelsApi = {
  searchHotels: async (
    filters: SearchFilters,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<Hotel>>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (filters.city) params.append('city', filters.city);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.minRating) params.append('minRating', filters.minRating.toString());
    if (filters.amenities) params.append('amenities', filters.amenities.join(','));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    return apiClient.get(`/hotels?${params.toString()}`);
  },

  getHotelById: async (id: string): Promise<ApiResponse<Hotel>> => {
    return apiClient.get(`/hotels/${id}`);
  },

  checkAvailability: async (
    hotelId: string,
    roomId: string,
    checkIn: string,
    checkOut: string,
    rooms: number
  ): Promise<
    ApiResponse<{
      available: boolean;
      availableRooms: number;
      totalRooms: number;
      requestedRooms: number;
    }>
  > => {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      roomId,
      rooms: rooms.toString(),
    });

    return apiClient.get(`/hotels/${hotelId}/availability?${params.toString()}`);
  },

  getHotelRooms: async (hotelId: string): Promise<ApiResponse<Room[]>> => {
    return apiClient.get(`/hotels/${hotelId}/rooms`);
  },
};
