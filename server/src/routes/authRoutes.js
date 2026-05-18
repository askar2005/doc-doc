import { Router } from 'express';
import { login, me, register, signup } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, me);

export default router;
