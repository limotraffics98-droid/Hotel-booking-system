import { Router } from 'express';
import {
  register,
  login,
  refresh,
  getMe,
  updateProfile,
  updatePassword,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updatePasswordSchema,
} from '../utils/validation.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', refresh);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, validateRequest(updateProfileSchema), updateProfile);
router.put('/password', authenticate, validateRequest(updatePasswordSchema), updatePassword);

export default router;
