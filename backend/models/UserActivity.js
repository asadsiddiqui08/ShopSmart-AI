import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    sessionId: {
      type: String,
      default: ''
    },
    action: {
      type: String,
      enum: ['view_product', 'search', 'add_to_cart', 'add_to_wishlist', 'compare', 'purchase'],
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null
    },
    category: {
      type: String,
      default: ''
    },
    query: {
      type: String,
      default: ''
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

userActivitySchema.index({ user: 1, action: 1, createdAt: -1 });
userActivitySchema.index({ sessionId: 1, action: 1 });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);
export default UserActivity;
