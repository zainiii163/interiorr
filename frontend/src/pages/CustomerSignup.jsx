import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function CustomerSignup() {
  const { signup } = useCustomerAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (form.password !== form.confirm) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await signup({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      if (res.success) {
        if (res.data?.verificationSent) {
          setSuccessMsg('Account created. We emailed you a verification link — please verify to complete sign-up.');
          setForm({ name: '', email: '', phone: '', password: '', confirm: '' });
        } else {
          navigate('/my-projects');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Signup failed. Please try again.');
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
          <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900">Create Your Account</h1>
          <p className="text-stone-500 text-xs">Track your quotes, payments and project timeline in one place</p>
        </div>

        {errorMsg && <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs">{errorMsg}</div>}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" aria-hidden="true" />
              <input type="text" required autoComplete="name" value={form.name} onChange={set('name')}
                placeholder="Your full name"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4795A] text-xs" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" aria-hidden="true" />
              <input type="email" required autoComplete="email" value={form.email} onChange={set('email')}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4795A] text-xs" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">Phone (optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" aria-hidden="true" />
              <input type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')}
                placeholder="+971 50 123 4567"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4795A] text-xs" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" aria-hidden="true" />
              <input type="password" required autoComplete="new-password" value={form.password} onChange={set('password')}
                placeholder="Min 8 chars, with A-z and 0-9"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4795A] text-xs" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" aria-hidden="true" />
              <input type="password" required autoComplete="new-password" value={form.confirm} onChange={set('confirm')}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4795A] text-xs" />
            </div>
          </div>

          <button type="submit" disabled={loading} aria-busy={loading}
            className="w-full btn-terracotta py-3.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg disabled:opacity-60">
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-stone-200 text-xs text-stone-600 space-y-2">
          <p className="text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C4795A] font-semibold hover:underline">Log in</Link>
          </p>
          <p className="text-center text-[11px] text-stone-400">
            Creating an account links any existing quotes to your email so you can track them here.
          </p>
        </div>
      </div>
    </div>
  );
}
