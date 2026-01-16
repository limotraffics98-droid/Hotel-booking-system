import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { verifyAccessToken } from '../utils/auth.js';
import { sendError } from '../utils/response.js';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'No token provided', 401);
  }

  const token = authHeader.substring(7);
  const decoded = verifyAccessToken(token);

  if (!decoded || typeof decoded === 'string') {
    return sendError(res, 'Invalid or expired token', 401);
  }

  req.user = {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  };

  next();
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return sendError(res, 'Admin access required', 403);
  }
  next();
};
