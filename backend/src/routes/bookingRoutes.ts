import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createBookingSchema } from '../utils/validation.js';

const router = Router();

router.post('/', authenticate, validateRequest(createBookingSchema), createBooking);
router.get('/my', authenticate, getMyBookings);
router.get('/:id', authenticate, getBookingById);
router.patch('/:id/cancel', authenticate, cancelBooking);

export default router;
