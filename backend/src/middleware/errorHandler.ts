import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err.name === 'ZodError') {
    return sendError(res, err.errors[0].message, 400);
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return sendError(res, 'A record with this value already exists', 409);
    }
    if (err.code === 'P2025') {
      return sendError(res, 'Record not found', 404);
    }
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return sendError(res, message, statusCode);
};
