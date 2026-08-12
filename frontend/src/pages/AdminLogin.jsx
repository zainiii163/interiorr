import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
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
      if (res.success) {
        navigate('/admin');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-950 p-8 rounded-2xl border border-stone-800 shadow-2xl space-y-6 text-white">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#C4795A] text-white flex items-center justify-center font-serif font-bold text-2xl mx-auto shadow-lg">
            A
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">Staff Portal Login</h1>
          <p className="text-stone-400 text-xs">
            Aura Interior Management & Renovation System
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 text-rose-300 border border-rose-800/80 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@interior.com"
                className="w-full pl-10 pr-4 py-3 bg-stone-900 border border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4795A] text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-stone-900 border border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4795A] text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-terracotta py-3.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-stone-900 text-center text-[11px] text-stone-500">
          Default Credentials: <code className="text-stone-300">admin@interior.com</code> / <code className="text-stone-300">Admin@123</code>
        </div>

      </div>
    </div>
  );
}
