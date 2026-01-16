import { Response } from 'express';
import { AuthRequest } from '../types/index.js';
import prisma from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getPaginationParams } from '../utils/pagination.js';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalHotels,
      totalBookings,
      totalRevenue,
      totalUsers,
      recentBookings,
    ] = await Promise.all([
      prisma.hotel.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: { totalAmount: true },
      }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          hotel: { select: { name: true, city: true } },
        },
      }),
    ]);

    return sendSuccess(res, {
      totalHotels,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalUsers,
      recentBookings,
    });
  } catch (error) {
    console.error('GetStats error:', error);
    return sendError(res, 'Failed to fetch stats', 500);
  }
};

export const createHotel = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      city,
      address,
      description,
      latitude,
      longitude,
      mainImage,
      images,
      amenities,
    } = req.body;

    const hotel = await prisma.hotel.create({
      data: {
        name,
        city,
        address,
        description,
        latitude,
        longitude,
        mainImage,
        ...(images && {
          images: {
            create: images.map((url: string) => ({ imageUrl: url })),
          },
        }),
      },
    });

    if (amenities && amenities.length > 0) {
      const amenityRecords = await Promise.all(
        amenities.map(async (amenityName: string) => {
          return prisma.amenity.upsert({
            where: { name: amenityName },
            create: { name: amenityName },
            update: {},
          });
        })
      );

      await prisma.hotelAmenity.createMany({
        data: amenityRecords.map((amenity) => ({
          hotelId: hotel.id,
          amenityId: amenity.id,
        })),
      });
    }

    return sendSuccess(res, hotel, 'Hotel created successfully', 201);
  } catch (error) {
    console.error('CreateHotel error:', error);
    return sendError(res, 'Failed to create hotel', 500);
  }
};

export const updateHotel = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      city,
      address,
      description,
      latitude,
      longitude,
      mainImage,
    } = req.body;

    const hotel = await prisma.hotel.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(city && { city }),
        ...(address && { address }),
        ...(description && { description }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(mainImage && { mainImage }),
      },
    });

    return sendSuccess(res, hotel, 'Hotel updated successfully');
  } catch (error) {
    console.error('UpdateHotel error:', error);
    return sendError(res, 'Failed to update hotel', 500);
  }
};

export const deleteHotel = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.hotel.delete({
      where: { id },
    });

    return sendSuccess(res, null, 'Hotel deleted successfully');
  } catch (error) {
    console.error('DeleteHotel error:', error);
    return sendError(res, 'Failed to delete hotel', 500);
  }
};

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { id: hotelId } = req.params;
    const {
      name,
      roomType,
      capacity,
      pricePerNight,
      totalRooms,
      description,
      images,
    } = req.body;

    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      return sendError(res, 'Hotel not found', 404);
    }

    const room = await prisma.room.create({
      data: {
        hotelId,
        name,
        roomType,
        capacity,
        pricePerNight,
        totalRooms,
        description,
        ...(images && {
          images: {
            create: images.map((url: string) => ({ imageUrl: url })),
          },
        }),
      },
      include: {
        images: true,
      },
    });

    return sendSuccess(res, room, 'Room created successfully', 201);
  } catch (error) {
    console.error('CreateRoom error:', error);
    return sendError(res, 'Failed to create room', 500);
  }
};

export const updateRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.params;
    const {
      name,
      roomType,
      capacity,
      pricePerNight,
      totalRooms,
      description,
    } = req.body;

    const room = await prisma.room.update({
      where: { id: roomId },
      data: {
        ...(name && { name }),
        ...(roomType && { roomType }),
        ...(capacity !== undefined && { capacity }),
        ...(pricePerNight !== undefined && { pricePerNight }),
        ...(totalRooms !== undefined && { totalRooms }),
        ...(description !== undefined && { description }),
      },
    });

    return sendSuccess(res, room, 'Room updated successfully');
  } catch (error) {
    console.error('UpdateRoom error:', error);
    return sendError(res, 'Failed to update room', 500);
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.params;

    await prisma.room.delete({
      where: { id: roomId },
    });

    return sendSuccess(res, null, 'Room deleted successfully');
  } catch (error) {
    console.error('DeleteRoom error:', error);
    return sendError(res, 'Failed to delete room', 500);
  }
};

export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page, limit } = req.query;
    const { skip, limit: take } = getPaginationParams(page as string, limit as string);

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          hotel: { select: { id: true, name: true, city: true } },
          room: { select: { id: true, name: true, roomType: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.booking.count({ where }),
    ]);

    return sendSuccess(res, {
      bookings,
      pagination: {
        total,
        page: Math.floor(skip / take) + 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('GetAllBookings error:', error);
    return sendError(res, 'Failed to fetch bookings', 500);
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
      include: {
        user: { select: { name: true, email: true } },
        hotel: { select: { name: true } },
      },
    });

    return sendSuccess(res, booking, 'Booking status updated successfully');
  } catch (error) {
    console.error('UpdateBookingStatus error:', error);
    return sendError(res, 'Failed to update booking status', 500);
  }
};
