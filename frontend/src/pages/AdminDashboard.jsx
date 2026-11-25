import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Plus,
  Sparkles,
  Trash2,
  Edit,
  AlertTriangle,
  CheckCircle2,
  X,
  Search
} from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders'
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    discountPrice: '',
    category: '',
    brand: 'ShopSmart',
    stock: 10,
    images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    tags: 'audio, wireless, gadget',
    isFeatured: false,
    isTrending: false
  });

  // AI Description Generator Modal / Tool State
  const [aiGenFeatures, setAiGenFeatures] = useState('Active noise cancellation, 40h battery, titanium drivers');
  const [aiGenTone, setAiGenTone] = useState('Persuasive & Premium');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiNotice, setAiNotice] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, ordersRes, catRes] = await Promise.all([
        api.get('/users/dashboard-stats'),
        api.get('/products?limit=50'),
        api.get('/orders'),
        api.get('/categories')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (prodRes.data.success) setProducts(prodRes.data.data.products || []);
      if (ordersRes.data.success) setOrders(ordersRes.data.data || []);
      if (catRes.data.success) {
        setCategories(catRes.data.data || []);
        if (catRes.data.data?.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: catRes.data.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  // AI Description Generator
  const handleGenerateAIDescription = async () => {
    if (!formData.name) {
      alert('Please enter a Product Name first so Gemini knows what to describe.');
      return;
    }
    const catObj = categories.find(c => c._id === formData.category);
    const catName = catObj ? catObj.name : 'Electronics';

    setGeneratingAI(true);
    setAiNotice('');
    try {
      const res = await api.post('/ai/generate-description', {
        name: formData.name,
        category: catName,
        features: aiGenFeatures.split(',').map(s => s.trim()),
        tone: aiGenTone
      });

      if (res.data.success) {
        const { title, shortDescription, description, tags } = res.data.data;
        setFormData(prev => ({
          ...prev,
          name: title || prev.name,
          shortDescription: shortDescription || prev.shortDescription,
          description: description || prev.description,
          tags: Array.isArray(tags) ? tags.join(', ') : prev.tags
        }));
        setAiNotice('✨ Description and SEO tags generated with Gemini AI!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'AI generation failed');
    } finally {
      setGeneratingAI(false);
    }
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        category: formData.category,
        brand: formData.brand,
        stock: Number(formData.stock),
        images: formData.images.split(',').map(s => s.trim()),
        tags: formData.tags.split(',').map(s => s.trim()),
        isFeatured: formData.isFeatured,
        isTrending: formData.isTrending
      };

      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct._id}`, payload);
        if (res.data.success) {
          setProductModalOpen(false);
          loadDashboardData();
        }
      } else {
        const res = await api.post('/products', payload);
        if (res.data.success) {
          setProductModalOpen(false);
          loadDashboardData();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description,
      shortDescription: prod.shortDescription || '',
      price: prod.price,
      discountPrice: prod.discountPrice || '',
      category: prod.category?._id || prod.category,
      brand: prod.brand || 'ShopSmart',
      stock: prod.stock,
      images: prod.images?.join(', ') || '',
      tags: prod.tags?.join(', ') || '',
      isFeatured: prod.isFeatured || false,
      isTrending: prod.isTrending || false
    });
    setAiNotice('');
    setProductModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      discountPrice: '',
      category: categories[0]?._id || '',
      brand: 'ShopSmart',
      stock: 10,
      images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      tags: 'premium, modern, tech',
      isFeatured: false,
      isTrending: false
    });
    setAiNotice('');
    setProductModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">
            <Sparkles size={14} /> Store Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Admin Management Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor sales revenue, manage product catalog with Gemini AI description generator, and process orders.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus size={15} /> Add New Product
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-violet-600 text-violet-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Overview & Stats
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'products'
              ? 'border-violet-600 text-violet-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Products Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-violet-600 text-violet-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <DollarSign size={20} />
              </div>
              <p className="text-xs font-semibold text-slate-400">Total Sales Revenue</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">${stats.totalRevenue?.toFixed(2)}</h3>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs">
              <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                <ShoppingBag size={20} />
              </div>
              <p className="text-xs font-semibold text-slate-400">Total Orders Placed</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalOrders}</h3>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Package size={20} />
              </div>
              <p className="text-xs font-semibold text-slate-400">Products in Catalog</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalProducts}</h3>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Users size={20} />
              </div>
              <p className="text-xs font-semibold text-slate-400">Registered Customers</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.totalUsers}</h3>
            </div>
          </div>

          {/* Low Stock Warnings */}
          {stats.lowStockProducts?.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <AlertTriangle size={16} /> Low Inventory Alerts
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.lowStockProducts.map(p => (
                  <div key={p._id} className="bg-white p-3 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate max-w-[180px]">{p.name}</span>
                    <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{p.stock} units left</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS TABLE */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-xl border border-slate-100" />
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.brand}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    {p.categoryName || p.category?.name}
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    ${p.discountPrice || p.price}
                  </td>
                  <td className="p-4">
                    <span className={`font-semibold ${p.stock <= 5 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">
                    ★ {p.rating}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-800">
                    #{o._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">{o.user?.name || 'Customer'}</p>
                    <p className="text-[10px] text-slate-400">{o.user?.email}</p>
                  </td>
                  <td className="p-4 text-slate-600">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    ${o.totalPrice?.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-50 text-violet-700">
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL WITH AI DESCRIPTION GENERATOR */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* AI Generator Box */}
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/80 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-violet-600" />
                  Gemini AI Description & Copy Generator
                </span>
                <span className="text-[10px] text-violet-600 font-semibold">Gemini 2.5 Flash</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Type the product name below, then customize features/tone and click generate to automatically fill compelling marketing copy!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Key Selling Points</label>
                  <input
                    type="text"
                    value={aiGenFeatures}
                    onChange={(e) => setAiGenFeatures(e.target.value)}
                    placeholder="e.g. 50h battery, titanium body"
                    className="w-full bg-white border border-violet-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tone of Voice</label>
                  <select
                    value={aiGenTone}
                    onChange={(e) => setAiGenTone(e.target.value)}
                    className="w-full bg-white border border-violet-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                  >
                    <option value="Persuasive & Premium">Persuasive & Premium</option>
                    <option value="Technical & Detailed">Technical & Detailed</option>
                    <option value="Casual & Vibrant">Casual & Vibrant</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateAIDescription}
                disabled={generatingAI}
                className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles size={13} />
                <span>{generatingAI ? 'Gemini is writing copy...' : 'Generate with Gemini AI'}</span>
              </button>

              {aiNotice && (
                <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={13} /> {aiNotice}
                </p>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. AuraSound Pro Headphones"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-violet-500"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="Optional"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description Hook</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Punchy one sentence hook"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Product Description</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URLs (comma-separated)</label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-violet-600"
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="w-4 h-4 rounded text-violet-600"
                  />
                  <span>Trending Product</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-colors shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
