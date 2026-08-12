import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, Download, Sparkles, Building2 } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get('quoteId');
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyAndConfirm = async () => {
      if (!quoteId) {
        setError('Missing quote reference.');
        setLoading(false);
        return;
      }
      try {
        const res = await apiFetch('/payments/confirm-payment', {
          method: 'POST',
          body: JSON.stringify({ quoteId, sessionId }),
        });
        if (res.success && res.data) {
          setPaymentInfo(res.data);
        } else {
          setError(res.message || 'Payment confirmation failed');
        }
      } catch (err) {
        setError(err.message || 'Failed to confirm payment status.');
      } finally {
        setLoading(false);
      }
    };
    verifyAndConfirm();
  }, [quoteId, sessionId]);

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-stone-950 p-8 rounded-3xl border border-stone-800 shadow-2xl text-center space-y-6">
        
        {loading ? (
          <div className="space-y-4 py-8">
            <div className="w-12 h-12 border-4 border-[#C4795A] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-stone-400 text-sm">Verifying Stripe payment confirmation...</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-rose-950/60 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-800">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">Payment Status Pending</h2>
            <p className="text-stone-400 text-xs">{error}</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs rounded-xl"
            >
              Return Home
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/50 shadow-xl shadow-emerald-900/40 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-800">
                Payment Confirmed
              </span>
              <h1 className="font-serif text-3xl font-bold text-white mt-2">Contract Confirmed!</h1>
              <p className="text-stone-400 text-xs mt-1">
                Thank you for confirming your quote. Your fit-out project phase 1 is now active.
              </p>
            </div>

            <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-stone-800 pb-2">
                <span className="text-stone-400">Quote Reference:</span>
                <span className="font-mono text-white font-bold">{paymentInfo?.quote?.quoteNumber || quoteId}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-2">
                <span className="text-stone-400">Transaction ID:</span>
                <span className="font-mono text-stone-300">{paymentInfo?.paymentDetails?.transactionRef || sessionId}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-2">
                <span className="text-stone-400">Amount Paid:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {paymentInfo?.quote?.grandTotal?.toLocaleString()} {paymentInfo?.quote?.currency || 'AED'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Date:</span>
                <span className="text-stone-300">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to={`/portal/${paymentInfo?.quote?.accessCode || paymentInfo?.quote?.quoteNumber || ''}`}
                className="flex-1 py-3 bg-[#C4795A] hover:bg-[#b06749] text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 transition"
              >
                <span>View Project Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
