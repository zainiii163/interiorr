import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, User } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function CustomerLogin() {
  const { login } = useCustomerAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login(email, password);
      if (res.success) navigate('/my-projects');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-offset min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-stone-900 text-[#C4795A] flex items-center justify-center font-serif font-bold text-2xl mx-auto shadow-lg">
            <User className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900">Welcome Back</h1>
          <p className="text-stone-500 text-xs">Log in to view your quotes and project updates</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs">{errorMsg}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="customer-email" className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" aria-hidden="true" />
              <input
                id="customer-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4795A] text-xs text-stone-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="customer-password" className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" aria-hidden="true" />
              <input
                id="customer-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4795A] text-xs text-stone-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full btn-terracotta py-3.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg disabled:opacity-60"
          >
            <span>{loading ? 'Logging in...' : 'Log In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-stone-200 text-xs text-stone-600 space-y-2">
          <p className="text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#C4795A] font-semibold hover:underline">
              Create one
            </Link>
          </p>
          <p className="text-center text-[11px] text-stone-400">
            Have a quote access code?{' '}
            <Link to="/portal" className="text-[#C4795A] hover:underline">
              Open the client portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
