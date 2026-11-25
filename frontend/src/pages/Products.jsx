import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Star,
  Check,
  ChevronDown,
  Sparkles,
  Search,
  RotateCcw
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Filter states
  const categoryParam = searchParams.get('category') || 'all';
  const keywordParam = searchParams.get('keyword') || '';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category & keyword from URL query params
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
  }, [searchParams]);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch filtered products
  const fetchProducts = async (targetPage = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', targetPage);
      params.append('limit', 9);

      if (keywordParam) params.append('keyword', keywordParam);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedBrand && selectedBrand !== 'all') params.append('brand', selectedBrand);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (minRating > 0) params.append('rating', minRating);
      if (inStockOnly) params.append('inStock', 'true');
      if (sortOption) params.append('sort', sortOption);

      const res = await api.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.data.products || []);
        setPage(res.data.data.page || 1);
        setPages(res.data.data.pages || 1);
        setTotal(res.data.data.total || 0);
        if (res.data.data.availableBrands) {
          setAvailableBrands(res.data.data.availableBrands);
        }
      }
    } catch (err) {
      console.error('Products fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [selectedCategory, selectedBrand, minPrice, maxPrice, minRating, inStockOnly, sortOption, keywordParam]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setInStockOnly(false);
    setSortOption('popular');
    setSearchParams({});
  };

  const hasActiveFilters =
    (selectedCategory && selectedCategory !== 'all') ||
    (selectedBrand && selectedBrand !== 'all') ||
    minPrice !== '' ||
    maxPrice !== '' ||
    minRating > 0 ||
    inStockOnly ||
    keywordParam !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {keywordParam
              ? `Results for "${keywordParam}"`
              : selectedCategory !== 'all'
              ? categories.find(c => c.slug === selectedCategory)?.name || 'Catalog'
              : 'All Products'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <strong className="text-slate-800">{products.length}</strong> of <strong className="text-slate-800">{total}</strong> products available
          </p>
        </div>

        {/* Sort and Mobile Filter Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs"
          >
            <SlidersHorizontal size={14} />
            Filters {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-violet-600" />}
          </button>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-2xs">
            <span className="text-slate-400 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs self-start sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-violet-600" />
              Filter By
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1"
              >
                <RotateCcw size={12} /> Reset
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Category
            </h4>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-violet-50 text-violet-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === c.slug
                      ? 'bg-violet-50 text-violet-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] text-slate-400">({c.itemCount || 0})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Price Range ($)
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Brands */}
          {availableBrands.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Brand
              </h4>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => setSelectedBrand('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg ${
                    selectedBrand === 'all' ? 'text-violet-600 font-bold' : 'text-slate-600'
                  }`}
                >
                  All Brands
                </button>
                {availableBrands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg ${
                      selectedBrand === b ? 'text-violet-600 font-bold' : 'text-slate-600'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rating Filter */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Minimum Rating
            </h4>
            <div className="space-y-1 text-xs">
              {[4, 3, 2].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(minRating === r ? 0 : r)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                    minRating === r ? 'bg-violet-50 text-violet-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-400">
                      {[...Array(r)].map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-400" />
                      ))}
                    </div>
                    <span>{r} Stars & above</span>
                  </div>
                  {minRating === r && <Check size={14} className="text-violet-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only Toggle */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center justify-between cursor-pointer text-xs font-medium text-slate-700">
              <span>In Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300"
              />
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="col-span-1 md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-2xl border border-slate-100 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {[...Array(pages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchProducts(pageNum)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          page === pageNum
                            ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                No matching products found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Try loosening your filters, clearing your search keywords, or exploring other categories.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Category */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Category</h4>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c._id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* In stock */}
            <div>
              <label className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span>In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-violet-600"
                />
              </label>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-violet-600 text-white font-semibold py-2.5 rounded-xl text-xs"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
