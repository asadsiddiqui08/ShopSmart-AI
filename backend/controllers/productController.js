import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const query = {};

    // Search keyword
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { brand: { $regex: req.query.keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.keyword, 'i')] } }
      ];
    }

    // Category filter (by ID or Slug)
    if (req.query.category && req.query.category !== 'all') {
      if (req.query.category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = req.query.category;
      } else {
        const cat = await Category.findOne({ slug: req.query.category });
        if (cat) {
          query.category = cat._id;
        }
      }
    }

    // Brand filter
    if (req.query.brand && req.query.brand !== 'all') {
      query.brand = { $regex: req.query.brand, $options: 'i' };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Rating filter
    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    // In Stock filter
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Featured / Trending filter
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }
    if (req.query.trending === 'true') {
      query.isTrending = true;
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sort === 'price_asc') {
      sort = { price: 1 };
    } else if (req.query.sort === 'price_desc') {
      sort = { price: -1 };
    } else if (req.query.sort === 'rating') {
      sort = { rating: -1 };
    } else if (req.query.sort === 'popular') {
      sort = { numReviews: -1, rating: -1 };
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Also get unique brands and categories for filter sidebar
    const brands = await Product.distinct('brand');

    return res.json({
      success: true,
      data: {
        products,
        page,
        pages: Math.ceil(count / pageSize) || 1,
        total: count,
        availableBrands: brands
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: id }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Fetch reviews for this product
    const reviews = await Review.find({ product: product._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: {
        ...product.toObject(),
        reviews
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get featured and trending products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const featured = await Product.find({ isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);

    const trending = await Product.find({ isTrending: true })
      .populate('category', 'name slug')
      .limit(8);

    const deals = await Product.find({ discountPrice: { $ne: null } })
      .populate('category', 'name slug')
      .limit(4);

    return res.json({
      success: true,
      data: {
        featured,
        trending,
        deals
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Create a product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      discountPrice,
      category,
      brand,
      stock,
      images,
      specs,
      tags,
      isFeatured,
      isTrending,
      aiHighlights
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Get category name
    let categoryName = '';
    const cat = await Category.findById(category);
    if (cat) {
      categoryName = cat.name;
      cat.itemCount += 1;
      await cat.save();
    }

    const product = new Product({
      name,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description,
      shortDescription,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      category,
      categoryName,
      brand: brand || 'ShopSmart',
      stock: Number(stock) || 0,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'],
      specs: specs || [],
      tags: tags || [],
      isFeatured: !!isFeatured,
      isTrending: !!isTrending,
      aiHighlights: aiHighlights || []
    });

    const createdProduct = await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: createdProduct
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const fields = [
      'name', 'description', 'shortDescription', 'price', 'discountPrice',
      'category', 'brand', 'stock', 'images', 'specs', 'tags',
      'isFeatured', 'isTrending', 'aiHighlights', 'aiSentimentSummary'
    ];

    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        product[f] = req.body[f];
      }
    });

    if (req.body.category) {
      const cat = await Category.findById(req.body.category);
      if (cat) {
        product.categoryName = cat.name;
      }
    }

    const updated = await product.save();

    return res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.deleteOne({ _id: product._id });
    await Review.deleteMany({ product: product._id });

    // Decrement category item count
    if (product.category) {
      await Category.findByIdAndUpdate(product.category, { $inc: { itemCount: -1 } });
    }

    return res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
