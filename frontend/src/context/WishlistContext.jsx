import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('shopsmart_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopsmart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch from server if logged in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const res = await api.get('/auth/wishlist');
          if (res.data.success && Array.isArray(res.data.data)) {
            setWishlist(res.data.data);
          }
        } catch (err) {
          console.warn('Wishlist server sync note:', err.message);
        }
      }
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    const productId = product._id || product;
    const exists = wishlist.some((item) => (item._id || item) === productId);

    let updated;
    if (exists) {
      updated = wishlist.filter((item) => (item._id || item) !== productId);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);

    if (user) {
      try {
        await api.post(`/auth/wishlist/${productId}`);
      } catch (err) {
        console.warn('Backend wishlist toggle note:', err.message);
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
