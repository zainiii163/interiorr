import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FileText, Package, LogOut, ExternalLink, Inbox } from 'lucide-react';
import { customerFetch } from '../services/customerApi';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const STATUS_STYLES = {
  draft: 'bg-stone-100 text-stone-600',
  sent: 'bg-blue-50 text-blue-700',
  accepted: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-rose-50 text-rose-700',
};

export default function MyProjects() {
  const { customer, logout } = useCustomerAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!customer) return;
    const load = async () => {
      try {
        const res = await customerFetch('/customers/auth/me/quotes');
        if (res.success) setQuotes(res.data);
      } catch (err) {
        setErrorMsg(err.message || 'Could not load your projects.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [customer]);

  if (customer === null) return <Navigate to="/login" replace />;

  return (
    <div className="page-offset bg-stone-50 min-h-screen pb-20">
      <section className="bg-stone-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">My Account</p>
            <h1 className="font-serif text-3xl font-bold mt-1">
              {customer ? `Welcome, ${customer.name.split(' ')[0]}` : 'My Projects'}
            </h1>
            <p className="text-stone-300 text-sm mt-1">Your quotes and project updates</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 transition"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-sm mb-6">{errorMsg}</div>
        )}

        {loading ? (
          <div className="text-center text-stone-400 text-sm py-20">Loading your projects...</div>
        ) : quotes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Inbox className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900">No projects yet</h2>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              When a member of our team creates a quote for your email address, it will appear here for you to review, accept and pay.
            </p>
            <Link to="/consultation" className="btn-terracotta inline-block px-6 py-3 rounded-xl text-xs font-semibold">
              Book a Consultation
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map((q) => (
              <div key={q.id} className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C4795A]/10 text-[#C4795A] flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-sm">{q.quoteNumber}</p>
                    <p className="text-xs text-stone-500">
                      {q.leadName || 'Quote'} · {new Date(q.createdAt).toLocaleDateString()}
                    </p>
                    <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${STATUS_STYLES[q.status] || STATUS_STYLES.draft}`}>
                      {q.status}
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="font-serif text-lg font-bold text-stone-900">
                    {(q.currency || 'AED')} {(q.grandTotal || 0).toLocaleString()}
                  </p>
                  <Link
                    to={`/portal/${q.accessCode}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C4795A] hover:underline"
                  >
                    Open project <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-5 rounded-2xl bg-emerald-950/5 border border-emerald-200/60 text-sm text-stone-600 flex gap-3">
          <Package className="w-5 h-5 text-emerald-600 shrink-0" />
          <p>
            Have an access code to a project not linked to this account? Use the{' '}
            <Link to="/portal" className="text-[#C4795A] font-semibold hover:underline">client portal</Link> instead.
          </p>
        </div>
      </section>
    </div>
  );
}
