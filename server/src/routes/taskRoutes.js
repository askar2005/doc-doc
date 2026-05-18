import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getTodayTask, history, summary, updateTask } from '../controllers/taskController.js';

const router = Router();

router.get('/today', authMiddleware, getTodayTask);
router.patch('/update', authMiddleware, updateTask);
router.patch('/', authMiddleware, updateTask);
router.get('/summary', authMiddleware, summary);
router.get('/history', authMiddleware, history);

export default router;
