import { Router } from 'express';
import {
  getStats,
  createHotel,
  updateHotel,
  deleteHotel,
  createRoom,
  updateRoom,
  deleteRoom,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createHotelSchema,
  updateHotelSchema,
  createRoomSchema,
  updateRoomSchema,
} from '../utils/validation.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/stats', getStats);

router.post('/hotels', validateRequest(createHotelSchema), createHotel);
router.put('/hotels/:id', validateRequest(updateHotelSchema), updateHotel);
router.delete('/hotels/:id', deleteHotel);

router.post('/hotels/:id/rooms', validateRequest(createRoomSchema), createRoom);
router.put('/rooms/:roomId', validateRequest(updateRoomSchema), updateRoom);
router.delete('/rooms/:roomId', deleteRoom);

router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

export default router;
