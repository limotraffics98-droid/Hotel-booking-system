import { Response } from 'express';
import { AuthRequest } from '../types/index.js';
import prisma from '../utils/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id: hotelId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user!.id;

    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      return sendError(res, 'Hotel not found', 404);
    }

    const hasBooking = await prisma.booking.findFirst({
      where: {
        userId,
        hotelId,
        status: { in: ['COMPLETED', 'CONFIRMED'] },
      },
    });

    if (!hasBooking) {
      return sendError(
        res,
        'You can only review hotels you have booked',
        403
      );
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        hotelId,
      },
    });

    if (existingReview) {
      return sendError(res, 'You have already reviewed this hotel', 400);
    }

    const review = await prisma.review.create({
      data: {
        userId,
        hotelId,
        rating,
        comment,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    const avgRating = await prisma.review.aggregate({
      where: { hotelId },
      _avg: { rating: true },
    });

    await prisma.hotel.update({
      where: { id: hotelId },
      data: { rating: avgRating._avg.rating || 0 },
    });

    return sendSuccess(res, review, 'Review created successfully', 201);
  } catch (error) {
    console.error('CreateReview error:', error);
    return sendError(res, 'Failed to create review', 500);
  }
};

export const getHotelReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { id: hotelId } = req.params;
    const { page, limit } = req.query;

    const skip = page ? (parseInt(page as string) - 1) * parseInt(limit as string || '10') : 0;
    const take = parseInt(limit as string || '10');

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { hotelId },
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.review.count({ where: { hotelId } }),
    ]);

    return sendSuccess(res, {
      reviews,
      pagination: {
        total,
        page: Math.floor(skip / take) + 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('GetHotelReviews error:', error);
    return sendError(res, 'Failed to fetch reviews', 500);
  }
};
