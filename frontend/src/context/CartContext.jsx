import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('shopsmart_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [coupon, setCoupon] = useState(null); // { code: 'SMART20', discountPercent: 20 }
  const [couponError, setCouponError] = useState('');

  // Sync cart to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem('shopsmart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // If user logs in, fetch backend cart
  useEffect(() => {
    const fetchUserCart = async () => {
      if (user) {
        try {
          const res = await api.get('/cart');
          if (res.data.success && res.data.data?.items?.length > 0) {
            setCartItems(res.data.data.items);
          }
        } catch (err) {
          console.warn('Could not sync user cart from server, using local:', err.message);
        }
      }
    };
    fetchUserCart();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    const effectivePrice = product.discountPrice !== null && product.discountPrice !== undefined
      ? product.discountPrice
      : product.price;

    const existingIndex = cartItems.findIndex(
      (item) => (item.product?._id || item.product) === (product._id || product)
    );

    let updated;
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex].quantity += Number(quantity);
    } else {
      updated = [
        ...cartItems,
        {
          product: product._id || product,
          name: product.name,
          image: Array.isArray(product.images) ? product.images[0] : product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
          price: effectivePrice,
          stock: product.stock !== undefined ? product.stock : 99,
          quantity: Number(quantity),
        },
      ];
    }
    setCartItems(updated);

    // If logged in, also sync to backend
    if (user) {
      try {
        await api.post('/cart', {
          productId: product._id || product,
          quantity: Number(quantity),
        });
      } catch (err) {
        console.warn('Backend cart sync note:', err.message);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    const updated = cartItems.map((item) => {
      const id = item.product?._id || item.product;
      if (id === productId) {
        return { ...item, quantity: Number(quantity) };
      }
      return item;
    });
    setCartItems(updated);

    if (user) {
      try {
        await api.put(`/cart/items/${productId}`, { quantity: Number(quantity) });
      } catch (err) {
        console.warn('Backend cart update note:', err.message);
      }
    }
  };

  const removeFromCart = async (productId) => {
    const updated = cartItems.filter(
      (item) => (item.product?._id || item.product) !== productId
    );
    setCartItems(updated);

    if (user) {
      try {
        await api.delete(`/cart/items/${productId}`);
      } catch (err) {
        console.warn('Backend cart remove note:', err.message);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    setCoupon(null);
    localStorage.removeItem('shopsmart_cart');

    if (user) {
      try {
        await api.delete('/cart');
      } catch (err) {
        console.warn('Backend clear cart note:', err.message);
      }
    }
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SMART20') {
      setCoupon({ code: 'SMART20', discountPercent: 20 });
      setCouponError('');
      return true;
    } else if (cleanCode === 'WELCOME10') {
      setCoupon({ code: 'WELCOME10', discountPercent: 10 });
      setCouponError('');
      return true;
    } else {
      setCouponError('Invalid coupon code. Try "SMART20" for 20% off!');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  // Computations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const rawSubtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );
  const discountAmount = coupon
    ? (rawSubtotal * coupon.discountPercent) / 100
    : 0;
  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const shipping = subtotal >= 50 || cartItems.length === 0 ? 0 : 10.0;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));
  const freeShippingThreshold = 50;
  const freeShippingProgress = Math.min(100, (rawSubtotal / freeShippingThreshold) * 100);

  return (
    <CartContext.Provider
      value={{
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
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
