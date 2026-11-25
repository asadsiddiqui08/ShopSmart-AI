import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');

  // Add Address Form
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newCountry, setNewCountry] = useState('United States');

  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMsg('');
    setErrMsg('');

    try {
      const payload = { name, phone, avatar, addresses };
      if (password) payload.password = password;

      const res = await updateProfile(payload);
      if (res.success) {
        setMsg('Profile updated successfully!');
        setPassword('');
      } else {
        setErrMsg(res.message || 'Failed to update profile');
      }
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPostalCode) return;

    const newAddr = {
      street: newStreet,
      city: newCity,
      state: newState,
      postalCode: newPostalCode,
      country: newCountry,
      isDefault: addresses.length === 0
    };

    setAddresses([...addresses, newAddr]);
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewPostalCode('');
    setShowAddAddress(false);
  };

  const handleDeleteAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          My Account
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal information, security credentials, and delivery addresses.
        </p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 text-emerald-700 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 size={16} /> {msg}
        </div>
      )}
      {errMsg && (
        <div className="p-4 bg-rose-50 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle size={16} /> {errMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Column: Profile Card & Quick Nav */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs text-center space-y-4">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name}
              className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-violet-100 shadow-sm"
            />
            <div>
              <h2 className="text-base font-bold text-slate-900">{user?.name}</h2>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <span className="inline-block mt-2 bg-violet-100 text-violet-700 text-[10px] font-bold px-3 py-0.5 rounded-full capitalize">
                {user?.role} Account
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs space-y-1 text-xs font-semibold">
            <Link
              to="/orders"
              className="flex items-center gap-2.5 p-3 rounded-2xl hover:bg-slate-50 text-slate-700 hover:text-violet-600 transition-colors"
            >
              <Package size={16} className="text-violet-600" />
              <span>My Orders</span>
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center gap-2.5 p-3 rounded-2xl hover:bg-slate-50 text-slate-700 hover:text-rose-600 transition-colors"
            >
              <Heart size={16} className="text-rose-500" />
              <span>Saved Wishlist</span>
            </Link>
          </div>
        </div>

        {/* Right 2 Columns: Edit Profile & Addresses */}
        <div className="md:col-span-2 space-y-6">
          {/* Edit Info Form */}
          <form onSubmit={handleUpdateProfile} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="text-xs pt-2">
              <label className="block font-bold text-slate-700 mb-1">Change Password (leave empty to keep current)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (optional)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-violet-500"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              {updating ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>

          {/* Addresses Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin size={16} className="text-violet-600" />
                Shipping Addresses ({addresses.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
              >
                <Plus size={14} /> Add New Address
              </button>
            </div>

            {/* Add Address Form */}
            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="123 Street Ave"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="Seattle"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">State / Province</label>
                    <input
                      type="text"
                      required
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      placeholder="WA"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={newPostalCode}
                      onChange={(e) => setNewPostalCode(e.target.value)}
                      placeholder="98101"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-violet-600 text-white rounded-xl font-bold"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* Existing addresses */}
            <div className="space-y-3">
              {addresses.map((addr, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{addr.street}</p>
                    <p className="text-slate-500">
                      {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                    </p>
                    {addr.isDefault && (
                      <span className="inline-block mt-1 bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.2 rounded-full">
                        Default Address
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
