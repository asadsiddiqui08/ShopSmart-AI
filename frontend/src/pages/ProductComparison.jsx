import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Sparkles,
  Check,
  X,
  ShoppingBag,
  Trash2,
  Plus,
  ThumbsUp,
  Award,
  ArrowRight
} from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import RatingStars from '../components/RatingStars';

const ProductComparison = () => {
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const { addToCart } = useCart();

  const [comparisonData, setComparisonData] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);

  // Fetch available products so user can easily add items to compare
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await api.get('/products?limit=12');
        if (res.data.success) {
          setAvailableProducts(res.data.data.products || []);
        }
      } catch (err) {
        console.error('Catalog fetch error:', err);
      }
    };
    fetchCatalog();
  }, []);

  // When compareList has >= 2 items, fetch AI comparison
  useEffect(() => {
    const fetchAIComparison = async () => {
      if (compareList.length < 2) {
        setComparisonData(null);
        return;
      }

      setLoadingAI(true);
      try {
        const ids = compareList.map((p) => p._id);
        const res = await api.post('/ai/compare', { productIds: ids });
        if (res.data.success) {
          setComparisonData(res.data.data.comparison);
        }
      } catch (err) {
        console.error('AI comparison error:', err);
      } finally {
        setLoadingAI(false);
      }
    };

    fetchAIComparison();
  }, [compareList]);

  const handleQuickAddTwo = () => {
    if (availableProducts.length >= 2) {
      clearCompare();
      addToCompare(availableProducts[0]);
      addToCompare(availableProducts[1]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">
            <Scale size={14} /> Side-By-Side Evaluation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            AI Product Comparison ({compareList.length}/4)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare technical hardware specs and get Gemini's decisive recommendation.
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 self-start sm:self-auto"
          >
            <Trash2 size={13} /> Clear Comparison
          </button>
        )}
      </div>

      {/* If less than 2 items selected */}
      {compareList.length < 2 && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 text-center max-w-2xl mx-auto shadow-2xs space-y-6">
          <div className="w-16 h-16 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mx-auto">
            <Scale size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Select at least 2 products to compare
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Add products by clicking the comparison button on any product card, or click below to automatically load top comparison candidates.
            </p>
          </div>

          <button
            onClick={handleQuickAddTwo}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-md transition-colors"
          >
            <Sparkles size={14} />
            <span>Compare Top 2 Products Instantly</span>
          </button>

          {/* Quick Picker from catalog */}
          {availableProducts.length > 0 && (
            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Or pick from our catalog:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {availableProducts.slice(0, 4).map((p) => (
                  <button
                    key={p._id}
                    onClick={() => addToCompare(p)}
                    className="p-2.5 bg-slate-50 hover:bg-violet-50 border border-slate-200 rounded-xl text-left transition-colors flex items-center gap-2 text-xs"
                  >
                    <img src={p.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="truncate font-semibold text-slate-800">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Verdict Card */}
      {compareList.length >= 2 && (
        <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-violet-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={16} /> Gemini AI Objective Verdict
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold mb-3">
              The AI Decision
            </h2>

            {loadingAI ? (
              <div className="flex items-center gap-3 py-4 text-xs text-violet-200">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                <span>Gemini is analyzing specifications, price points, and buyer reviews...</span>
              </div>
            ) : comparisonData ? (
              <div className="space-y-6">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
                  {comparisonData.verdict}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {comparisonData.bestValue && (
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                        <Award size={15} /> Best Value Winner
                      </div>
                      <p className="text-sm font-bold text-white">{comparisonData.bestValue}</p>
                    </div>
                  )}

                  {comparisonData.premiumPick && (
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                      <div className="flex items-center gap-2 text-violet-300 text-xs font-bold mb-1">
                        <Sparkles size={15} /> Flagship / Premium Pick
                      </div>
                      <p className="text-sm font-bold text-white">{comparisonData.premiumPick}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Side by Side Comparison Grid */}
      {compareList.length >= 2 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="p-4 sm:p-6 w-48 text-slate-400 font-bold uppercase text-[10px]">
                  Feature / Product
                </th>
                {compareList.map((product) => (
                  <th key={product._id} className="p-4 sm:p-6 min-w-[220px]">
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(product._id)}
                        className="absolute -top-2 -right-2 p-1 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full border border-slate-200 shadow-2xs"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-2xl border border-slate-100 mb-3 mx-auto"
                      />
                      <Link
                        to={`/products/${product._id}`}
                        className="font-bold text-slate-900 hover:text-violet-600 block line-clamp-2 text-center"
                      >
                        {product.name}
                      </Link>
                      <p className="text-center text-sm font-extrabold text-slate-900 mt-1">
                        ${product.discountPrice || product.price}
                      </p>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="mt-3 w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <ShoppingBag size={13} /> Add to Cart
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 sm:p-6 font-bold text-slate-500">Brand</td>
                {compareList.map((p) => (
                  <td key={p._id} className="p-4 sm:p-6 font-semibold text-slate-800">
                    {p.brand}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-6 font-bold text-slate-500">Category</td>
                {compareList.map((p) => (
                  <td key={p._id} className="p-4 sm:p-6 font-semibold text-slate-800">
                    {p.categoryName || p.category?.name || 'Electronics'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-6 font-bold text-slate-500">Rating</td>
                {compareList.map((p) => (
                  <td key={p._id} className="p-4 sm:p-6">
                    <RatingStars rating={p.rating} numReviews={p.numReviews} size={14} />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-6 font-bold text-slate-500">Stock Status</td>
                {compareList.map((p) => (
                  <td key={p._id} className="p-4 sm:p-6">
                    <span className={`font-semibold ${p.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {p.stock > 0 ? `In Stock (${p.stock})` : 'Out of Stock'}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-6 font-bold text-slate-500">Key Specs</td>
                {compareList.map((p) => (
                  <td key={p._id} className="p-4 sm:p-6 space-y-1">
                    {p.specs?.map((s, idx) => (
                      <p key={idx} className="text-[11px] text-slate-600">
                        <strong className="text-slate-800">{s.name}:</strong> {s.value}
                      </p>
                    ))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductComparison;
