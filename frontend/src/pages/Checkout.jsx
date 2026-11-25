import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Checkout = () => {
  const { cartItems, rawSubtotal, discountAmount, subtotal, shipping, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Address form
  const [street, setStreet] = useState(user?.addresses?.[0]?.street || '100 Silicon Way, Suite 400');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'San Francisco');
  const [state, setState] = useState(user?.addresses?.[0]?.state || 'CA');
  const [postalCode, setPostalCode] = useState(user?.addresses?.[0]?.postalCode || '94107');
  const [country, setCountry] = useState(user?.addresses?.[0]?.country || 'United States');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!street || !city || !postalCode) {
      setErrorMsg('Please complete all shipping address fields.');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMsg('Your cart is empty.');
      return;
    }

    setPlacingOrder(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product?._id || item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          street,
          city,
          state,
          postalCode,
          country
        },
        paymentMethod
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        setOrderSuccess(res.data.data);
        clearCart();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to place order. Please check item stock.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={44} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Order Confirmed!</h1>
        <p className="text-sm text-slate-500 mb-6">
          Thank you for shopping with ShopSmart AI. Your order <span className="font-mono font-bold text-slate-800">#{orderSuccess._id.slice(-8).toUpperCase()}</span> has been placed and is currently being processed.
        </p>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs max-w-md mx-auto text-left space-y-3 mb-8 text-xs text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400">Order ID:</span>
            <span className="font-mono font-bold text-slate-800">{orderSuccess._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Paid:</span>
            <span className="font-bold text-slate-900">${orderSuccess.totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Shipping To:</span>
            <span className="font-semibold text-slate-800">{orderSuccess.shippingAddress.street}, {orderSuccess.shippingAddress.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{orderSuccess.status}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/orders"
            className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs px-6 py-3.5 rounded-2xl shadow-md transition-colors"
          >
            View Order History
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-6 py-3.5 rounded-2xl transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Checkout</h1>
      <p className="text-xs text-slate-500 mb-8">Complete your shipping and payment details.</p>

      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Shipping & Payment details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              <Truck size={17} className="text-violet-600" />
              1. Shipping Address
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="123 Innovation Boulevard"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="San Francisco"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="CA"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="94107"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              <CreditCard size={17} className="text-violet-600" />
              2. Payment Method
            </div>

            <div className="grid grid-cols-3 gap-3">
              {['Credit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-2xl border text-center text-xs font-semibold transition-all ${
                    paymentMethod === method
                      ? 'border-violet-600 bg-violet-50 text-violet-700 ring-2 ring-violet-200'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            {paymentMethod === 'Credit Card' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Expiration</label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Order Items & Submit */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Review ({cartItems.length} items)
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.product?._id || item.product} className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-xl border border-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                  <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">${rawSubtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-slate-800">
                {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span className="font-semibold text-slate-800">${tax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-900">Total</span>
              <span className="text-lg font-black text-slate-900">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={placingOrder}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md shadow-violet-200 flex items-center justify-center gap-2"
          >
            <Lock size={14} />
            <span>{placingOrder ? 'Processing Order...' : `Pay $${total.toFixed(2)}`}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
