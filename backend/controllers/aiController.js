import Product from '../models/Product.js';
import ChatHistory from '../models/ChatHistory.js';
import {
  chatShoppingAssistant,
  analyzeReviewSentiment,
  compareProductsAI,
  generateProductDescriptionAI
} from '../services/geminiService.js';
import { getPersonalizedRecommendations } from '../services/recommendationService.js';

// @desc    Gemini-powered shopping assistant chatbot
// @route   POST /api/ai/chat
// @access  Public (Optional user auth)
export const chatWithAssistant = async (req, res) => {
  try {
    const { message, sessionId = `guest_${Date.now()}`, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Fetch active catalog for context
    const catalog = await Product.find({ stock: { $gt: 0 } })
      .populate('category', 'name')
      .limit(20);

    const result = await chatShoppingAssistant({
      message,
      history,
      catalog
    });

    // Save conversation to ChatHistory
    let chat = await ChatHistory.findOne({ sessionId });
    if (!chat) {
      chat = new ChatHistory({
        sessionId,
        user: req.user ? req.user._id : null,
        messages: []
      });
    }

    chat.messages.push({
      role: 'user',
      text: message
    });

    chat.messages.push({
      role: 'model',
      text: result.reply,
      productSuggestions: result.suggestions?.map(p => p._id) || []
    });

    await chat.save();

    return res.json({
      success: true,
      data: {
        reply: result.reply,
        suggestions: result.suggestions,
        sessionId
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get Chat History
// @route   GET /api/ai/chat/:sessionId
// @access  Public
export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await ChatHistory.findOne({ sessionId }).populate(
      'messages.productSuggestions',
      'name price discountPrice images rating category'
    );

    return res.json({
      success: true,
      data: history ? history.messages : []
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Smart AI Product Recommendations
// @route   GET /api/ai/recommendations
// @access  Public
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.query.sessionId || '';
    const excludeId = req.query.excludeId || null;
    const limit = Number(req.query.limit) || 4;

    const recommendations = await getPersonalizedRecommendations({
      userId,
      sessionId,
      limit,
      excludeId
    });

    return res.json({
      success: true,
      data: recommendations
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    AI Product Comparison
// @route   POST /api/ai/compare
// @access  Public
export const compareProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 product IDs to compare'
      });
    }

    const products = await Product.find({ _id: { $in: productIds } }).populate('category', 'name');

    if (products.length < 2) {
      return res.status(404).json({
        success: false,
        message: 'Could not find the specified products for comparison'
      });
    }

    const comparisonResult = await compareProductsAI({ products });

    return res.json({
      success: true,
      data: {
        products,
        comparison: comparisonResult
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    AI Review Sentiment Analysis tester/utility
// @route   POST /api/ai/sentiment
// @access  Public
export const analyzeSentiment = async (req, res) => {
  try {
    const { reviewText, rating = 5, productName = 'General Product' } = req.body;

    if (!reviewText) {
      return res.status(400).json({
        success: false,
        message: 'Review text is required'
      });
    }

    const analysis = await analyzeReviewSentiment({
      reviewText,
      rating: Number(rating),
      productName
    });

    return res.json({
      success: true,
      data: analysis
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    AI Product Description Generator for Admin
// @route   POST /api/ai/generate-description
// @access  Private/Admin
export const generateDescription = async (req, res) => {
  try {
    const { name, category, features, tone } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product name and category are required'
      });
    }

    const generated = await generateProductDescriptionAI({
      name,
      category,
      features,
      tone
    });

    return res.json({
      success: true,
      data: generated
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
