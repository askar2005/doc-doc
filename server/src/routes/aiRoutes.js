import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { chat, history } from '../controllers/aiController.js';

const router = Router();

router.post('/chat', authMiddleware, chat);
router.get('/history', authMiddleware, history);

export default router;
