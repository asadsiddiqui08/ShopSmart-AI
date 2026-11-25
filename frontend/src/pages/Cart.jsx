import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Truck,
  CheckCircle2,
  Tag,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const {
    cartItems,
    cartCount,
    rawSubtotal,
    discountAmount,
    subtotal,
    shipping,
    tax,
    total,
    coupon,
    couponError,
    freeShippingProgress,
    freeShippingThreshold,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
          Looks like you haven't added anything to your cart yet. Explore our top-tier catalog for inspiration!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-md transition-colors text-sm"
        >
          <span>Discover Products</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
        Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
      </h1>
      <p className="text-xs text-slate-500 mb-8">
        Review your items and proceed with secure checkout.
      </p>

      {/* Free Shipping Meter Banner */}
      <div className="mb-8 p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
          <span className="flex items-center gap-1.5">
            <Truck size={16} className="text-violet-600" />
            {remainingForFreeShipping > 0 ? (
              <>
                Add <strong className="text-violet-600">${remainingForFreeShipping.toFixed(2)}</strong> more to get <strong>Free Standard Shipping</strong>!
              </>
            ) : (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 size={15} /> You unlocked Free Shipping!
              </span>
            )}
          </span>
          <span className="text-slate-400 font-medium">
            Threshold: ${freeShippingThreshold}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-2xs divide-y divide-slate-100">
            {cartItems.map((item) => {
              const prodId = item.product?._id || item.product;
              return (
                <div key={prodId} className="py-4 sm:py-5 first:pt-0 last:pb-0 flex gap-4 sm:gap-6 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-slate-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${prodId}`}
                      className="font-bold text-xs sm:text-sm text-slate-900 hover:text-violet-600 transition-colors line-clamp-2 mb-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs font-bold text-slate-800">
                      ${item.price?.toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                        <button
                          onClick={() => updateQuantity(prodId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-40"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(prodId, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:text-slate-800"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(prodId)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs pt-2">
            <Link to="/products" className="font-semibold text-violet-600 hover:text-violet-700">
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-slate-400 hover:text-rose-500 transition-colors font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Right Col: Order Summary */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h3>

          {/* Coupon input */}
          <div>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code (e.g. SMART20)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                Apply
              </button>
            </form>
            {couponError && (
              <p className="text-[11px] text-rose-500 mt-1.5">{couponError}</p>
            )}
            {coupon && (
              <div className="mt-2 flex items-center justify-between bg-violet-50 text-violet-700 text-xs px-3 py-1.5 rounded-xl font-semibold">
                <span className="flex items-center gap-1.5">
                  <Tag size={13} /> {coupon.code} ({coupon.discountPercent}% OFF)
                </span>
                <button onClick={removeCoupon} className="text-violet-500 hover:text-violet-900">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Calculations */}
          <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-800">${rawSubtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promotional Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-slate-800">
                {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Sales Tax (8%)</span>
              <span className="font-semibold text-slate-800">${tax.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-900">Total</span>
              <span className="text-xl font-extrabold text-slate-900">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md shadow-violet-200 flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={15} />
          </button>

          <div className="text-[11px] text-slate-400 text-center space-y-1">
            <p>🔒 256-Bit Encrypted Secure Checkout</p>
            <p>Instant digital confirmation & invoice generated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
