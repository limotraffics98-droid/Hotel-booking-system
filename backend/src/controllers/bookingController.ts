import { Response } from 'express';
import { AuthRequest } from '../types/index.js';
import prisma from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { hotelId, roomId, checkIn, checkOut, guests, roomsCount } = req.body;
    const userId = req.user!.id;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return sendError(res, 'Check-out must be after check-in', 400);
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { hotel: true },
    });

    if (!room || room.hotelId !== hotelId) {
      return sendError(res, 'Room not found', 404);
    }

    const overlappingBookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: { in: ['CONFIRMED', 'PENDING_PAYMENT'] },
        checkIn: { lt: checkOutDate },
        checkOut: { gt: checkInDate },
      },
      select: { roomsCount: true },
    });

    const bookedRooms = overlappingBookings.reduce(
      (sum, booking) => sum + booking.roomsCount,
      0
    );

    const availableRooms = room.totalRooms - bookedRooms;

    if (availableRooms < roomsCount) {
      return sendError(
        res,
        `Only ${availableRooms} room(s) available for selected dates`,
        400
      );
    }

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalAmount = room.pricePerNight * roomsCount * nights;

    const booking = await prisma.booking.create({
      data: {
        userId,
        hotelId,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        roomsCount,
        totalAmount,
        status: 'PENDING_PAYMENT',
      },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            mainImage: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
            roomType: true,
            pricePerNight: true,
          },
        },
      },
    });

    return sendSuccess(res, booking, 'Booking created successfully', 201);
  } catch (error) {
    console.error('CreateBooking error:', error);
    return sendError(res, 'Failed to create booking', 500);
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status } = req.query;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            mainImage: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
            roomType: true,
            pricePerNight: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();
    const categorizedBookings = {
      upcoming: bookings.filter(
        (b) => b.status === 'CONFIRMED' && new Date(b.checkIn) > now
      ),
      past: bookings.filter(
        (b) => b.status === 'COMPLETED' || new Date(b.checkOut) < now
      ),
      cancelled: bookings.filter((b) => b.status === 'CANCELLED'),
      pending: bookings.filter((b) => b.status === 'PENDING_PAYMENT'),
    };

    return sendSuccess(res, categorizedBookings);
  } catch (error) {
    console.error('GetMyBookings error:', error);
    return sendError(res, 'Failed to fetch bookings', 500);
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        hotel: true,
        room: {
          include: { images: true },
        },
        payment: true,
      },
    });

    if (!booking) {
      return sendError(res, 'Booking not found', 404);
    }

    if (booking.userId !== userId && req.user!.role !== 'ADMIN') {
      return sendError(res, 'Access denied', 403);
    }

    return sendSuccess(res, booking);
  } catch (error) {
    console.error('GetBookingById error:', error);
    return sendError(res, 'Failed to fetch booking', 500);
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return sendError(res, 'Booking not found', 404);
    }

    if (booking.userId !== userId && req.user!.role !== 'ADMIN') {
      return sendError(res, 'Access denied', 403);
    }

    if (booking.status === 'CANCELLED') {
      return sendError(res, 'Booking is already cancelled', 400);
    }

    if (booking.status === 'COMPLETED') {
      return sendError(res, 'Cannot cancel completed booking', 400);
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        hotel: {
          select: { name: true },
        },
        room: {
          select: { name: true },
        },
      },
    });

    return sendSuccess(res, updatedBooking, 'Booking cancelled successfully');
  } catch (error) {
    console.error('CancelBooking error:', error);
    return sendError(res, 'Failed to cancel booking', 500);
  }
};
