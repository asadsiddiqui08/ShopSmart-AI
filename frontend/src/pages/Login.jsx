import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(redirect === 'checkout' ? '/checkout' : redirect);
      } else {
        setErrorMsg(res.message || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center mx-auto shadow-md shadow-violet-200">
            <Sparkles size={22} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to access your orders, wishlist, and AI recommendations.
          </p>
        </div>

        {/* Demo Fast-Fill Buttons */}
        <div className="p-3.5 bg-violet-50/70 border border-violet-100 rounded-2xl space-y-2">
          <p className="text-[11px] font-bold text-violet-800 text-center uppercase tracking-wider">
            ⚡ Quick Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@shopsmart.ai', 'AdminPassword123!')}
              className="py-1.5 px-2 bg-white hover:bg-violet-100 text-violet-700 font-semibold rounded-xl border border-violet-200 transition-colors shadow-2xs"
            >
              Demo Admin 👑
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('alex@shopsmart.ai', 'UserPassword123!')}
              className="py-1.5 px-2 bg-white hover:bg-violet-100 text-violet-700 font-semibold rounded-xl border border-violet-200 transition-colors shadow-2xs"
            >
              Demo Customer 👤
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 text-rose-600 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle size={15} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-2xl text-xs transition-colors shadow-md shadow-violet-200"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to={`/register${redirect ? `?redirect=${redirect}` : ''}`} className="font-bold text-violet-600 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
