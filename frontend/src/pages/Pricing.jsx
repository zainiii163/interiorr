import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function Pricing() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch('/memberships');
        if (res.success) setMemberships(res.data);
      } catch (err) {
        setErrorMsg(err.message || 'Could not load membership plans.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page-offset">
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">Membership</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2">Priority Access Plans</h1>
          <p className="text-stone-300 mt-3 max-w-2xl mx-auto text-sm">
            Join our membership for priority scheduling, exclusive discounts and a dedicated team for your property.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-sm mb-8 text-center">{errorMsg}</div>
        )}

        {loading ? (
          <div className="text-center text-stone-400 text-sm py-10">Loading plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {memberships.map((m) => (
              <div
                key={m._id}
                className={`relative flex flex-col rounded-3xl p-6 sm:p-8 border transition ${
                  m.isFeatured
                    ? 'bg-stone-900 text-white border-stone-900 shadow-2xl md:-mt-4 md:mb-4'
                    : 'bg-white text-stone-900 border-stone-200 shadow-md'
                }`}
              >
                {m.isFeatured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C4795A] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                )}

                <h3 className={`font-serif text-xl font-bold ${m.isFeatured ? 'text-white' : 'text-stone-900'}`}>{m.name}</h3>
                <p className={`text-xs mt-1 ${m.isFeatured ? 'text-stone-300' : 'text-stone-500'}`}>{m.tagline}</p>

                <div className="mt-5 mb-6">
                  <span className="font-serif text-4xl font-bold">
                    {m.price === 0 ? 'Free' : `AED ${m.price.toLocaleString()}`}
                  </span>
                  <span className={`text-sm ${m.isFeatured ? 'text-stone-300' : 'text-stone-500'}`}>
                    {m.billingInterval && m.billingInterval !== 'one-time' ? ` / ${m.billingInterval}` : ''}
                  </span>
                </div>

                <ul className="space-y-3 flex-1">
                  {m.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${m.isFeatured ? 'text-[#C4795A]' : 'text-emerald-600'}`} />
                      <span className={m.isFeatured ? 'text-stone-200' : 'text-stone-600'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/consultation?service=${encodeURIComponent(m.name)}&membership=${encodeURIComponent(m.name)}`}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition ${
                    m.isFeatured
                      ? 'btn-terracotta shadow-xl'
                      : 'border border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 rounded-2xl bg-emerald-950/5 border border-emerald-200/60 text-sm text-stone-600 flex gap-3 max-w-3xl mx-auto">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p>
            Interested in a plan? Submit your details and our team will reach out to set up your membership.
            For one-time project quotes,{' '}
            <Link to="/consultation" className="text-[#C4795A] font-semibold hover:underline">book a free consultation</Link> instead.
          </p>
        </div>
      </section>
    </div>
  );
}
