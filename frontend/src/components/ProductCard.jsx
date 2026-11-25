import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeftRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import RatingStars from './RatingStars';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [addedAnim, setAddedAnim] = useState(false);

  const inWish = isInWishlist(product._id);
  const inCmp = isInCompare(product._id);

  const price = product.price;
  const discountPrice = product.discountPrice;
  const hasDiscount = discountPrice !== null && discountPrice !== undefined && discountPrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;
  const displayPrice = hasDiscount ? discountPrice : price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCmp) {
      removeFromCompare(product._id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {hasDiscount && (
          <span className="bg-rose-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            -{discountPercent}%
          </span>
        )}
        {product.isFeatured && !hasDiscount && (
          <span className="bg-violet-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
            Featured
          </span>
        )}
        {product.isTrending && (
          <span className="bg-amber-500 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
            Trending
          </span>
        )}
      </div>

      {/* Action Buttons Overlay */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleWishlistToggle}
          title={inWish ? "Remove from wishlist" : "Add to wishlist"}
          className={`p-2 rounded-full shadow-md backdrop-blur-md transition-all ${
            inWish
              ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
              : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart size={16} className={inWish ? 'fill-rose-500' : ''} />
        </button>
        <button
          onClick={handleCompareToggle}
          title={inCmp ? "Remove from comparison" : "Add to comparison"}
          className={`p-2 rounded-full shadow-md backdrop-blur-md transition-all ${
            inCmp
              ? 'bg-violet-50 text-violet-600 hover:bg-violet-100'
              : 'bg-white/90 text-slate-600 hover:text-violet-600 hover:bg-white'
          }`}
        >
          <ArrowLeftRight size={16} />
        </button>
      </div>

      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="relative block pt-[80%] overflow-hidden bg-slate-50">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium text-slate-500 uppercase tracking-wider text-[10px]">
              {product.brand}
            </span>
            <span className="capitalize text-slate-400 text-[11px]">
              {product.categoryName || product.category?.name || 'Electronics'}
            </span>
          </div>

          <Link to={`/products/${product._id}`} className="block">
            <h3 className="font-semibold text-slate-800 group-hover:text-violet-600 transition-colors line-clamp-2 text-sm leading-snug mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mb-3">
            <RatingStars rating={product.rating} numReviews={product.numReviews} size={13} />
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900">
                ${displayPrice?.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ${price?.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              addedAnim
                ? 'bg-emerald-600 text-white'
                : product.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm hover:shadow-violet-200'
            }`}
          >
            {addedAnim ? (
              <>
                <Check size={14} /> Added
              </>
            ) : product.stock <= 0 ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingBag size={14} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
