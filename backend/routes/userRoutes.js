import express from 'express';
import {
  getAllUsers,
  getDashboardStats,
  logActivity
} from '../controllers/userController.js';
import { protect, admin, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getAllUsers);
router.get('/dashboard-stats', protect, admin, getDashboardStats);
router.post('/activity', optionalAuth, logActivity);

export default router;
