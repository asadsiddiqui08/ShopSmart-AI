import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Calendar, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/myorders');
        if (res.data.success) {
          setOrders(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-44 bg-white rounded-3xl border border-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-6">
          <Package size={36} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Orders Placed Yet</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
          You haven't made any purchases yet. Your confirmed orders will show up here with live status tracking.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-md transition-colors text-sm"
        >
          <span>Start Shopping</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Order History ({orders.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your previous purchases, tracking status, and invoices.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden"
          >
            {/* Header info bar */}
            <div className="bg-slate-50 p-4 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Placed</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Amount</span>
                  <span className="font-extrabold text-slate-900">${order.totalPrice?.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Ship To</span>
                  <span className="font-medium text-slate-800">{order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  #{order._id.slice(-8).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Items in order */}
            <div className="p-4 sm:p-6 divide-y divide-slate-100">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl border border-slate-100"
                    />
                    <div>
                      <Link
                        to={`/products/${item.product}`}
                        className="text-xs font-bold text-slate-800 hover:text-violet-600 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Qty: {item.quantity} × ${item.price?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-900 shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
