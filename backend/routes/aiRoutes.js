import express from 'express';
import {
  chatWithAssistant,
  getChatHistory,
  getRecommendations,
  compareProducts,
  analyzeSentiment,
  generateDescription
} from '../controllers/aiController.js';
import { protect, admin, optionalAuth } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply AI rate limiter to all AI endpoints
router.use(aiLimiter);

router.post('/chat', optionalAuth, chatWithAssistant);
router.get('/chat/:sessionId', getChatHistory);
router.get('/recommendations', optionalAuth, getRecommendations);
router.post('/compare', compareProducts);
router.post('/sentiment', analyzeSentiment);
router.post('/generate-description', protect, admin, generateDescription);

export default router;
