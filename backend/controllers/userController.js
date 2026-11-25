import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import UserActivity from '../models/UserActivity.js';

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return res.json({
      success: true,
      data: users
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get dashboard metrics & statistics (Admin)
// @route   GET /api/users/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Compute total sales
    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const processingOrders = await Order.countDocuments({ status: 'Processing' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

    // Recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Low stock products (< 5)
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select('name stock price images')
      .limit(5);

    return res.json({
      success: true,
      data: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        totalProducts,
        totalUsers,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        recentOrders,
        lowStockProducts
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Log user interaction / activity
// @route   POST /api/users/activity
// @access  Public
export const logActivity = async (req, res) => {
  try {
    const { action, product, category, query, metadata, sessionId } = req.body;

    if (!action) {
      return res.status(400).json({
        success: false,
        message: 'Action is required'
      });
    }

    const activity = await UserActivity.create({
      user: req.user ? req.user._id : null,
      sessionId: sessionId || '',
      action,
      product: product || null,
      category: category || '',
      query: query || '',
      metadata: metadata || {}
    });

    return res.status(201).json({
      success: true,
      data: activity
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
