import Product from '../models/Product.js';
import UserActivity from '../models/UserActivity.js';

export const getPersonalizedRecommendations = async ({ userId, sessionId, limit = 4, excludeId = null }) => {
  try {
    // 1. Fetch recent activities for this user or session
    const query = userId ? { user: userId } : { sessionId };
    const recentActivities = await UserActivity.find(query)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('product');

    const viewedCategories = recentActivities
      .map(a => a.category || a.product?.category)
      .filter(Boolean);

    const viewedProductIds = recentActivities
      .map(a => a.product?._id)
      .filter(Boolean);

    if (excludeId) {
      viewedProductIds.push(excludeId);
    }

    // 2. If user has category history, recommend top products from those categories
    if (viewedCategories.length > 0) {
      const categoryRecs = await Product.find({
        category: { $in: viewedCategories },
        _id: { $nin: viewedProductIds }
      })
        .sort({ rating: -1, isFeatured: -1 })
        .limit(limit)
        .populate('category', 'name slug');

      if (categoryRecs.length >= limit) {
        return categoryRecs;
      }
    }

    // 3. Fallback to top-rated & trending products
    const filter = excludeId ? { _id: { $ne: excludeId } } : {};
    const fallbackRecs = await Product.find(filter)
      .sort({ rating: -1, isTrending: -1, createdAt: -1 })
      .limit(limit)
      .populate('category', 'name slug');

    return fallbackRecs;
  } catch (err) {
    console.error('Error fetching personalized recommendations:', err.message);
    return await Product.find(excludeId ? { _id: { $ne: excludeId } } : {})
      .sort({ rating: -1 })
      .limit(limit)
      .populate('category', 'name slug');
  }
};

export const getRelatedProducts = async (productId, categoryId, limit = 4) => {
  try {
    const products = await Product.find({
      _id: { $ne: productId },
      category: categoryId
    })
      .sort({ rating: -1 })
      .limit(limit)
      .populate('category', 'name slug');

    if (products.length < limit) {
      const additional = await Product.find({
        _id: { $nin: [productId, ...products.map(p => p._id)] }
      })
        .sort({ isFeatured: -1, rating: -1 })
        .limit(limit - products.length)
        .populate('category', 'name slug');

      return [...products, ...additional];
    }

    return products;
  } catch (err) {
    console.error('Error in getRelatedProducts:', err.message);
    return [];
  }
};
