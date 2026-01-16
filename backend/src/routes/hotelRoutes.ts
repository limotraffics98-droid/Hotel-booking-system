import { Router } from 'express';
import {
  getHotels,
  getHotelById,
  checkAvailability,
  getHotelRooms,
} from '../controllers/hotelController.js';

const router = Router();

router.get('/', getHotels);
router.get('/:id', getHotelById);
router.get('/:id/availability', checkAvailability);
router.get('/:id/rooms', getHotelRooms);

export default router;
