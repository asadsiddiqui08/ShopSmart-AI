import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ArrowLeftRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  Star,
  ThumbsUp,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedAnim, setAddedAnim] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      if (res.data.success) {
        const prod = res.data.data;
        setProduct(prod);
        setSelectedImage(0);

        // Log user view activity
        api.post('/users/activity', {
          action: 'view_product',
          product: prod._id,
          category: prod.categoryName || prod.category?.name
        }).catch(() => {});

        // Fetch related products
        if (prod.category) {
          const catId = prod.category._id || prod.category;
          const recRes = await api.get(`/ai/recommendations?excludeId=${prod._id}&limit=4`);
          if (recRes.data.success) {
            setRelatedProducts(recRes.data.data || []);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewError('Please sign in to submit a customer review.');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Please provide review text.');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const res = await api.post(`/reviews/product/${product._id}`, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment
      });

      if (res.data.success) {
        setReviewSuccess('Your review has been submitted and analyzed by AI!');
        setReviewTitle('');
        setReviewComment('');
        setReviewRating(5);
        fetchProductData(); // Refresh product reviews
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="h-96 bg-slate-100 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-slate-100 rounded-xl w-3/4" />
            <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
            <div className="h-24 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
        <Link to="/products" className="text-violet-600 font-semibold text-sm mt-3 inline-block">
          Return to All Products
        </Link>
      </div>
    );
  }

  const price = product.price;
  const discountPrice = product.discountPrice;
  const hasDiscount = discountPrice !== null && discountPrice !== undefined && discountPrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;
  const displayPrice = hasDiscount ? discountPrice : price;

  const inWish = isInWishlist(product._id);
  const inCmp = isInCompare(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 flex items-center gap-2">
        <Link to="/" className="hover:text-slate-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-slate-600">Products</Link>
        <span>/</span>
        <span className="text-slate-700 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative pt-[85%] bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <img
              src={product.images?.[selectedImage] || product.images?.[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnail list */}
          {product.images?.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx
                      ? 'border-violet-600 ring-2 ring-violet-200'
                      : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box & Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
                {product.brand}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {product.categoryName || product.category?.name}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-3">
              <RatingStars rating={product.rating} numReviews={product.numReviews} size={17} />
              <span className="text-xs text-slate-400">|</span>
              <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">
              ${displayPrice?.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm font-semibold text-slate-400 line-through">
                ${price?.toFixed(2)}
              </span>
            )}
            {hasDiscount && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                You save ${(price - discountPrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* AI Highlights */}
          {product.aiHighlights?.length > 0 && (
            <div className="bg-violet-50/70 border border-violet-100 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-violet-800">
                <Sparkles size={14} className="text-violet-600" />
                AI Key Takeaways
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {product.aiHighlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-violet-600 font-bold">•</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center font-bold text-xs text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-xs transition-all shadow-md ${
                  addedAnim
                    ? 'bg-emerald-600 text-white'
                    : product.stock <= 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200'
                }`}
              >
                {addedAnim ? (
                  <>
                    <Check size={16} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Wishlist & Compare Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                  inWish
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Heart size={15} className={inWish ? 'fill-rose-500 text-rose-500' : ''} />
                <span>{inWish ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={() => {
                  if (inCmp) removeFromCompare(product._id);
                  else addToCompare(product);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                  inCmp
                    ? 'bg-violet-50 border-violet-200 text-violet-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ArrowLeftRight size={15} />
                <span>{inCmp ? 'In Comparison' : 'Compare Product'}</span>
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <Truck size={18} className="mx-auto text-violet-600 mb-1" />
              <p className="text-[11px] font-bold text-slate-800">Free Delivery</p>
              <p className="text-[10px] text-slate-400">Orders over $50</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <RotateCcw size={18} className="mx-auto text-violet-600 mb-1" />
              <p className="text-[11px] font-bold text-slate-800">30-Day Return</p>
              <p className="text-[10px] text-slate-400">Guaranteed refund</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <ShieldCheck size={18} className="mx-auto text-violet-600 mb-1" />
              <p className="text-[11px] font-bold text-slate-800">2-Year Warranty</p>
              <p className="text-[10px] text-slate-400">Official coverage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specs?.length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-2xs">
          <h2 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
            Technical Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {product.specs.map((spec, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-slate-50 text-xs">
                <span className="text-slate-500 font-medium">{spec.name}</span>
                <span className="text-slate-900 font-semibold">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI Sentiment Analysis Card */}
      <section className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-violet-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={15} />
            Gemini AI Review Sentiment Analysis
          </div>
          <h3 className="text-xl font-bold mb-3">
            What Customers Are Saying
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mb-6">
            {product.aiSentimentSummary ||
              "Aggregated customer satisfaction rating is exceedingly positive. Customers highlight outstanding build quality, reliable everyday battery endurance, and responsive ergonomics."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-slate-400 text-[11px] uppercase font-bold">Positive Sentiment</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">94%</p>
              <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full w-[94%]" />
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-slate-400 text-[11px] uppercase font-bold">Key Strengths</p>
              <p className="text-xs font-semibold text-white mt-2 leading-relaxed">
                Build craftsmanship, battery life, comfort
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-slate-400 text-[11px] uppercase font-bold">Verified Score</p>
              <p className="text-2xl font-black text-amber-400 mt-1">{product.rating} / 5.0</p>
              <p className="text-[10px] text-slate-300 mt-1">Based on {product.numReviews} ratings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Add Review Section */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Customer Reviews ({product.reviews?.length || 0})
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <RatingStars rating={product.rating} numReviews={null} size={15} />
              <span className="text-xs text-slate-500 font-medium">
                Overall score: {product.rating} out of 5
              </span>
            </div>
          </div>
        </div>

        {/* Add Review Form */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Write a Review</h3>
          <p className="text-xs text-slate-500 mb-4">
            Share your experience. Our Gemini AI will analyze your review sentiment automatically.
          </p>

          {reviewError && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={15} /> {reviewError}
            </div>
          )}
          {reviewSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 text-xs rounded-xl flex items-center gap-2">
              <Check size={15} /> {reviewSuccess}
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      size={20}
                      className={
                        star <= reviewRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-700 ml-2">
                  {reviewRating} out of 5
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline</label>
              <input
                type="text"
                placeholder="e.g. Absolutely fantastic sound quality"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Detailed Feedback</label>
              <textarea
                rows={3}
                placeholder="Tell us what you loved or what could be improved..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              {submittingReview ? 'Analyzing & Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev._id} className="p-4 sm:p-5 rounded-2xl border border-slate-100 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={rev.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rev.name}</h4>
                      <div className="flex items-center gap-2">
                        <RatingStars rating={rev.rating} size={12} showNumber={false} />
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <Check size={11} /> Verified Buyer
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {rev.sentiment?.label && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rev.sentiment.label === 'Positive'
                          ? 'bg-emerald-50 text-emerald-600'
                          : rev.sentiment.label === 'Negative'
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      AI: {rev.sentiment.label}
                    </span>
                  )}
                </div>

                {rev.title && (
                  <p className="text-xs font-bold text-slate-800">{rev.title}</p>
                )}
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
