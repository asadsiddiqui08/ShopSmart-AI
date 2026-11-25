import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { analyzeReviewSentiment } from '../services/geminiService.js';

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: reviews
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Add review for a product with AI sentiment analysis
// @route   POST /api/reviews/product/:productId
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { rating, comment, title } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this product'
      });
    }

    // Check if user actually purchased product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'orderItems.product': productId
    });

    // Run AI Sentiment Analysis on the review
    const sentimentAnalysis = await analyzeReviewSentiment({
      reviewText: comment,
      rating: Number(rating),
      productName: product.name
    });

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      name: req.user.name,
      rating: Number(rating),
      title: title || '',
      comment,
      verifiedPurchase: !!hasPurchased,
      sentiment: {
        label: sentimentAnalysis.sentiment,
        score: sentimentAnalysis.score,
        summary: sentimentAnalysis.summary
      }
    });

    // Recalculate product rating
    const allReviews = await Review.find({ product: productId });
    product.numReviews = allReviews.length;
    product.rating = parseFloat(
      (allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length).toFixed(1)
    );
    product.aiSentimentSummary = sentimentAnalysis.summary;
    await product.save();

    await review.populate('user', 'name avatar');

    return res.status(201).json({
      success: true,
      message: 'Review submitted and analyzed successfully',
      data: review
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Cannot delete other user review'
      });
    }

    const productId = review.product;
    await Review.deleteOne({ _id: review._id });

    // Recalculate product rating
    const allReviews = await Review.find({ product: productId });
    const product = await Product.findById(productId);
    if (product) {
      product.numReviews = allReviews.length;
      product.rating = allReviews.length > 0
        ? parseFloat((allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length).toFixed(1))
        : 5.0;
      await product.save();
    }

    return res.json({
      success: true,
      message: 'Review removed successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
