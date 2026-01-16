import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface SearchFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  amenities?: string[];
  propertyType?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'rating_desc';
}
