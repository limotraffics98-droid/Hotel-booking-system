import { Router } from 'express';
import { createReview, getHotelReviews } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createReviewSchema } from '../utils/validation.js';

const router = Router();

router.post('/:id/reviews', authenticate, validateRequest(createReviewSchema), createReview);
router.get('/:id/reviews', getHotelReviews);

export default router;
