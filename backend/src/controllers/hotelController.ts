import { Request, Response } from 'express';
import { AuthRequest } from '../types/index.js';
import prisma from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getPaginationParams } from '../utils/pagination.js';

export const getHotels = async (req: Request, res: Response) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      minRating,
      amenities,
      sortBy = 'rating_desc',
      page,
      limit,
    } = req.query;

    const { skip, limit: take } = getPaginationParams(page as string, limit as string);

    const where: any = {};

    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' };
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating as string) };
    }

    if (amenities && typeof amenities === 'string') {
      const amenityNames = amenities.split(',');
      where.amenities = {
        some: {
          amenity: {
            name: { in: amenityNames },
          },
        },
      };
    }

    if (minPrice || maxPrice) {
      where.rooms = {
        some: {
          pricePerNight: {
            ...(minPrice && { gte: parseFloat(minPrice as string) }),
            ...(maxPrice && { lte: parseFloat(maxPrice as string) }),
          },
        },
      };
    }

    let orderBy: any = { rating: 'desc' };
    if (sortBy === 'price_asc') {
      orderBy = { rooms: { _min: { pricePerNight: 'asc' } } };
    } else if (sortBy === 'price_desc') {
      orderBy = { rooms: { _min: { pricePerNight: 'desc' } } };
    }

    const [hotels, total] = await Promise.all([
      prisma.hotel.findMany({
        where,
        include: {
          images: { take: 1 },
          amenities: {
            include: { amenity: true },
          },
          rooms: {
            select: { pricePerNight: true },
            orderBy: { pricePerNight: 'asc' },
            take: 1,
          },
          _count: {
            select: { reviews: true },
          },
        },
        skip,
        take,
        orderBy,
      }),
      prisma.hotel.count({ where }),
    ]);

    const formattedHotels = hotels.map((hotel) => ({
      ...hotel,
      amenities: hotel.amenities.map((a) => a.amenity.name),
      startingPrice: hotel.rooms[0]?.pricePerNight || 0,
      reviewCount: hotel._count.reviews,
    }));

    return sendSuccess(res, {
      hotels: formattedHotels,
      pagination: {
        total,
        page: Math.floor(skip / take) + 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('GetHotels error:', error);
    return sendError(res, 'Failed to fetch hotels', 500);
  }
};

export const getHotelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        images: true,
        amenities: {
          include: { amenity: true },
        },
        rooms: {
          include: {
            images: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!hotel) {
      return sendError(res, 'Hotel not found', 404);
    }

    const formattedHotel = {
      ...hotel,
      amenities: hotel.amenities.map((a) => a.amenity.name),
      reviewCount: hotel._count.reviews,
    };

    return sendSuccess(res, formattedHotel);
  } catch (error) {
    console.error('GetHotelById error:', error);
    return sendError(res, 'Failed to fetch hotel', 500);
  }
};

export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, roomId, rooms = '1' } = req.query;

    if (!checkIn || !checkOut || !roomId) {
      return sendError(res, 'checkIn, checkOut, and roomId are required', 400);
    }

    const checkInDate = new Date(checkIn as string);
    const checkOutDate = new Date(checkOut as string);
    const requestedRooms = parseInt(rooms as string, 10);

    if (checkInDate >= checkOutDate) {
      return sendError(res, 'Check-out must be after check-in', 400);
    }

    const room = await prisma.room.findFirst({
      where: {
        id: roomId as string,
        hotelId: id,
      },
    });

    if (!room) {
      return sendError(res, 'Room not found', 404);
    }

    const overlappingBookings = await prisma.booking.findMany({
      where: {
        roomId: roomId as string,
        status: {
          in: ['CONFIRMED', 'PENDING_PAYMENT'],
        },
        checkIn: { lt: checkOutDate },
        checkOut: { gt: checkInDate },
      },
      select: {
        roomsCount: true,
      },
    });

    const bookedRooms = overlappingBookings.reduce(
      (sum, booking) => sum + booking.roomsCount,
      0
    );

    const availableRooms = room.totalRooms - bookedRooms;
    const isAvailable = availableRooms >= requestedRooms;

    return sendSuccess(res, {
      available: isAvailable,
      availableRooms,
      totalRooms: room.totalRooms,
      requestedRooms,
    });
  } catch (error) {
    console.error('CheckAvailability error:', error);
    return sendError(res, 'Failed to check availability', 500);
  }
};

export const getHotelRooms = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const rooms = await prisma.room.findMany({
      where: { hotelId: id },
      include: {
        images: true,
      },
    });

    return sendSuccess(res, rooms);
  } catch (error) {
    console.error('GetHotelRooms error:', error);
    return sendError(res, 'Failed to fetch rooms', 500);
  }
};
