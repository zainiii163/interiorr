import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { customerFetch } from '../services/customerApi';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMsg('Missing verification token. Please use the link from your email.');
      return;
    }
    customerFetch('/customers/auth/verify', { method: 'POST', body: JSON.stringify({ token }) })
      .then((res) => {
        setStatus('success');
        setMsg(res.message || 'Email verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMsg(err.message || 'Verification failed. The link may be invalid or expired.');
      });
  }, [token]);

  return (
    <div className="page-offset min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-stone-200 shadow-xl text-center space-y-4">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-[#C4795A] animate-spin mx-auto" />
            <p className="text-sm text-stone-500">Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
            <h1 className="font-serif text-2xl font-bold text-stone-900">Email Verified</h1>
            <p className="text-sm text-stone-600">{msg}</p>
            <Link to="/my-projects" className="btn-terracotta inline-block px-6 py-3 rounded-xl text-xs font-semibold">
              Go to My Projects
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-14 h-14 text-rose-600 mx-auto" />
            <h1 className="font-serif text-2xl font-bold text-stone-900">Verification Failed</h1>
            <p className="text-sm text-stone-600">{msg}</p>
            <Link to="/signup" className="btn-terracotta inline-block px-6 py-3 rounded-xl text-xs font-semibold">
              Try signing up again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
