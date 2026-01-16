import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendError } from '../utils/response.js';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error.errors && error.errors[0]) {
        return sendError(res, error.errors[0].message, 400);
      }
      return sendError(res, 'Validation error', 400);
    }
  };
};
