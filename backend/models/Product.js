import mongoose from 'mongoose';

const specSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    slug: {
      type: String,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0']
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price must be positive'],
      default: null
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    categoryName: {
      type: String,
      default: ''
    },
    brand: {
      type: String,
      default: 'ShopSmart'
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 10
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    numReviews: {
      type: Number,
      default: 0
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: [v => v.length > 0, 'At least one image is required']
    },
    specs: [specSchema],
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false
    },
    isTrending: {
      type: Boolean,
      default: false
    },
    aiHighlights: [String],
    aiSentimentSummary: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Index for search functionality
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
