import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, RotateCcw, Headphones, Mail, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 mt-20 border-t border-slate-800">
      {/* Value Badges Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/20">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Fast Shipping</h4>
              <p className="text-xs text-slate-400">On all orders over $50</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Authenticity Guarantee</h4>
              <p className="text-xs text-slate-400">100% verified products</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/20">
              <RotateCcw size={22} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">30-Day Easy Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free money back</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/20">
              <Headphones size={22} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">24/7 AI Assistance</h4>
              <p className="text-xs text-slate-400">Instant expert advice</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group inline-block">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md">
                <Sparkles size={18} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                ShopSmart<span className="text-violet-400">.ai</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
              ShopSmart AI merges modern e-commerce with Google Gemini intelligence to deliver hyper-personalized recommendations, side-by-side product comparisons, and AI review sentiments.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Powered by Gemini 2.5 Flash
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">
                  Product Comparison
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Categories
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products?category=audio-headphones" className="hover:text-white transition-colors">
                  Audio & Headphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=laptops-computers" className="hover:text-white transition-colors">
                  Laptops & Computers
                </Link>
              </li>
              <li>
                <Link to="/products?category=smartphones-tablets" className="hover:text-white transition-colors">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=smart-wearables" className="hover:text-white transition-colors">
                  Smart Wearables
                </Link>
              </li>
              <li>
                <Link to="/products?category=smart-home-iot" className="hover:text-white transition-colors">
                  Smart Home & IoT
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Stay in the Loop
            </h5>
            <p className="text-xs text-slate-400 mb-3">
              Get notified of VIP exclusive drops and seasonal AI deals.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
                <CheckCircle2 size={14} /> You're on the VIP list!
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopSmart AI. Built with React, Tailwind, Express & Google Gemini.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
