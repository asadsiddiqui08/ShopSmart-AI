import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Zap,
  ShieldCheck,
  RotateCcw,
  Bot,
  Scale,
  ThumbsUp,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featRes, catRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/categories')
        ]);

        if (featRes.data.success) {
          setFeaturedProducts(featRes.data.data.featured || []);
          setTrendingProducts(featRes.data.data.trending || []);
          setDealProducts(featRes.data.data.deals || []);
        }

        if (catRes.data.success) {
          setCategories(catRes.data.data || []);
        }
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const displayList =
    activeTab === 'featured'
      ? featuredProducts
      : activeTab === 'trending'
      ? trendingProducts
      : dealProducts;

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-violet-50/60 via-white to-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-400/20 to-purple-400/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* AI Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-2xs">
              <Sparkles size={14} className="text-violet-600 animate-pulse" />
              <span>Next-Gen E-Commerce with Google Gemini</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6">
              Shop Smarter with <br />
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Discover curated premium tech, compare specs with instant AI insights, analyze real customer sentiment, and let our Gemini shopping agent find your exact match.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all text-sm group"
              >
                <span>Browse Catalog</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/compare"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-8 py-3.5 rounded-2xl border border-slate-200 shadow-xs transition-all text-sm"
              >
                <Scale size={16} className="text-violet-600" />
                <span>AI Product Compare</span>
              </Link>
            </div>

            {/* Trust stats row */}
            <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-medium">Genuine Hardware</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-violet-600">2.5 Flash</p>
                <p className="text-xs text-slate-500 font-medium">Gemini AI Speed</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">30-Day</p>
                <p className="text-xs text-slate-500 font-medium">Risk-Free Returns</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Curated Tech Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Engineered for productivity, audio fidelity, and smart living
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md transition-all bg-white flex flex-col"
            >
              <div className="relative pt-[70%] bg-slate-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="font-semibold text-sm text-slate-900 group-hover:text-violet-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-slate-400 mt-1">
                  {cat.itemCount || 0} Products
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured & Trending Tabbed Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">
              <Zap size={14} /> Catalog Highlights
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Explore Our Collection
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'featured'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Featured Picks
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'trending'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trending Now
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'deals'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Special Deals 🔥
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : displayList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayList.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <p className="text-sm text-slate-500">No products available in this tab.</p>
          </div>
        )}
      </section>

      {/* AI Features Interactive Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold mb-6">
              <Bot size={15} />
              Intelligent Shopping Redefined
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Meet Your Always-On Gemini Assistant
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
              Don't guess what to buy. Open our floating chat widget to compare noise cancellation ratings, inquire about battery runtime, get budget alternatives, and get instant recommendations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
                <Scale className="text-violet-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-semibold text-white">AI Product Compare</h4>
                  <p className="text-xs text-slate-400 mt-1">Multi-product spec analysis with decisive verdict</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
                <ThumbsUp className="text-violet-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-semibold text-white">Sentiment Breakdown</h4>
                  <p className="text-xs text-slate-400 mt-1">Instant summary of verified buyer sentiment</p>
                </div>
              </div>
            </div>

            <Link
              to="/compare"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-colors text-sm"
            >
              <span>Try AI Comparison Now</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
