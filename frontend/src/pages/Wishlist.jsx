import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveAllToCart = () => {
    wishlist.forEach((prod) => {
      addToCart(prod, 1);
    });
  };

  if (wishlistCount === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-6">
          <Heart size={36} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Wishlist is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
          Save your favorite products while you explore and easily return to them anytime.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-md transition-colors text-sm"
        >
          <span>Explore Products</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Wishlist ({wishlistCount})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Items you have saved for later.
          </p>
        </div>

        <button
          onClick={handleMoveAllToCart}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-xs"
        >
          <ShoppingBag size={14} />
          <span>Move All to Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
