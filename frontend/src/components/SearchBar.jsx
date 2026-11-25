import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import api from '../services/api';

const SearchBar = ({ placeholder = "Search laptops, headphones, smartphones...", className = "" }) => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products?keyword=${encodeURIComponent(keyword.trim())}&limit=5`);
        if (res.data.success) {
          setSuggestions(res.data.data.products || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.warn('Search query error:', err.message);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [keyword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setIsOpen(false);
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const handleSelectProduct = (product) => {
    setIsOpen(false);
    setKeyword('');
    navigate(`/products/${product._id}`);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-slate-800 text-sm rounded-full border border-slate-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
        {keyword && (
          <button
            type="button"
            onClick={() => {
              setKeyword('');
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
          >
            <X size={15} />
          </button>
        )}
      </form>

      {/* Auto-suggest dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in duration-150">
          {loading && (
            <div className="p-4 text-center text-xs text-slate-400">
              Searching catalogue...
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Products
              </div>
              {suggestions.map((p) => (
                <div
                  key={p._id}
                  onClick={() => handleSelectProduct(p)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded-lg border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      ${p.discountPrice || p.price}
                    </p>
                  </div>
                  <ArrowRight size={14} className="text-slate-300" />
                </div>
              ))}
              <div
                onClick={handleSubmit}
                className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-center text-xs font-semibold text-violet-600 cursor-pointer border-t border-slate-100 flex items-center justify-center gap-1.5"
              >
                View all results for "{keyword}"
              </div>
            </div>
          )}

          {!loading && suggestions.length === 0 && keyword.trim() && (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching products found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
