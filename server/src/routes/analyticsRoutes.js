import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { monthly, overview, streak, weekly } from '../controllers/analyticsController.js';

const router = Router();

router.get('/weekly', authMiddleware, weekly);
router.get('/monthly', authMiddleware, monthly);
router.get('/streak', authMiddleware, streak);
router.get('/overview', authMiddleware, overview);

export default router;
