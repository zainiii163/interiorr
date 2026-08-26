import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, ShieldCheck, CheckCircle2, Send, ArrowRight, Loader2 } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useSite } from '../context/SiteContext';
import { usePageCopy } from '../utils/pageCopy';
import FormPrivacyNote from '../components/FormPrivacyNote';

export default function Consultation() {
  const { settings } = useSite();
  const copy = usePageCopy(settings);
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';
  const materialHint = searchParams.get('material') || '';
  const styleHint = searchParams.get('style') || '';

  const [activeServices, setActiveServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    propertyType: 'Villa',
    service: initialService || '',
    location: '',
    message: [
      materialHint ? `Interested in material: ${materialHint}.` : '',
      styleHint ? `Preferred design style: ${styleHint}.` : '',
    ]
      .filter(Boolean)
      .join(' '),
    preferredContactMethod: 'WhatsApp'
  });

  const [loading, setLoading] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiFetch('/services');
        if (res.success && res.data.length > 0) {
          setActiveServices(res.data);
          if (!initialService) {
            setFormData(prev => ({ ...prev, service: res.data[0].name }));
          }
        }
      } catch (e) {
        console.error('Error fetching services:', e);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, [initialService]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // FR-074: Phone validation
    if (!formData.phone || formData.phone.length < 8) {
      setErrorMsg('Please enter a valid telephone number (e.g. +971 50 123 4567)');
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch('/leads', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          source: 'Consultation Booking Page',
          leadType: 'consultation',
          utmSource: searchParams.get('utm_source') || '',
          utmMedium: searchParams.get('utm_medium') || '',
          utmCampaign: searchParams.get('utm_campaign') || ''
        })
      });

      if (res.success) {
        setSubmittedLead(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Consultation booking failed. Please check your fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-offset pb-20">
      
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">{copy.consultBadge}</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2">{copy.consultTitle}</h1>
          <p className="text-stone-300 mt-3 max-w-2xl mx-auto text-sm">
            {copy.consultSubtitle}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] gap-8 items-start">
        
        {submittedLead ? (
          <div className="bg-white p-10 rounded-2xl border border-stone-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-stone-900">Consultation Request Confirmed!</h2>
            <p className="text-stone-600 max-w-xl mx-auto text-sm">
              Thank you, <strong className="text-stone-900">{submittedLead.fullName}</strong>. Our senior Dubai project coordinator will contact you via {submittedLead.preferredContactMethod} at {submittedLead.phone} within 2 hours.
            </p>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 max-w-md mx-auto space-y-1">
              <div><strong>Requested Service:</strong> {submittedLead.service}</div>
              <div><strong>Property Type:</strong> {submittedLead.propertyType} ({submittedLead.location})</div>
            </div>
            <button
              onClick={() => setSubmittedLead(null)}
              className="btn-terracotta px-8 py-3 rounded-xl text-xs font-semibold"
            >
              Book Another Consultation
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-200 shadow-xl">
            
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-sm mb-6">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="consult-fullName" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="consult-fullName"
                    type="text"
                    required
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Hassan Al-Rashid"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C4795A] text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="consult-email" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="consult-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="hassan@domain.ae"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C4795A] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="consult-phone" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Phone Number (+971 UAE) *
                  </label>
                  <input
                    id="consult-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+971 50 123 4567"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C4795A] text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="consult-propertyType" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    id="consult-propertyType"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C4795A] text-sm bg-white"
                  >
                    <option value="Villa">Villa (Standalone / Compound)</option>
                    <option value="Apartment">Apartment / Penthouse</option>
                    <option value="Office">Corporate Office</option>
                    <option value="Commercial">Commercial Showroom</option>
                    <option value="Retail">Retail Boutique</option>
                    <option value="Other">Other Property</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="consult-service" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Service Required *
                  </label>
                  <div className="relative">
                    <select
                      id="consult-service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      disabled={servicesLoading}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C4795A] text-sm bg-white disabled:opacity-60"
                    >
                      {activeServices.length > 0 ? (
                        activeServices.map(s => (
                          <option key={s._id} value={s.name}>{s.name}</option>
                        ))
                      ) : (
                        <option value="">Loading services...</option>
                      )}
                    </select>
                    {servicesLoading && (
                      <Loader2 className="w-4 h-4 text-[#C4795A] animate-spin absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="consult-location" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Property Location in Dubai *
                  </label>
                  <input
                    id="consult-location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Palm Jumeirah, Dubai Hills, Downtown"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C4795A] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Preferred Contact Method *
                </label>
                <div className="flex flex-wrap gap-4 sm:gap-6" role="radiogroup" aria-label="Preferred contact method">
                  {['WhatsApp', 'Phone', 'Email'].map((method) => (
                    <label key={method} htmlFor={`consult-contact-${method}`} className="flex items-center space-x-2 text-sm text-stone-800 cursor-pointer">
                      <input
                        id={`consult-contact-${method}`}
                        type="radio"
                        name="preferredContactMethod"
                        value={method}
                        checked={formData.preferredContactMethod === method}
                        onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
                        className="text-[#C4795A] focus:ring-[#C4795A]"
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="consult-message" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Project Notes & Timeline
                </label>
                <textarea
                  id="consult-message"
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details like target start date, square footage, budget expectations..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C4795A] text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="w-full btn-terracotta py-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting Request...' : 'Confirm Consultation Request'}</span>
              </button>

              <FormPrivacyNote />

            </form>
          </div>
        )}

          <aside className="space-y-4">
            <div className="p-6 rounded-2xl bg-emerald-950/5 border border-emerald-200/60">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-3" />
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Your privacy matters</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Consultation requests are handled by our in-house team only. We never share your details with
                third-party marketers.{' '}
                <Link to="/privacy" className="text-[#C4795A] font-semibold hover:underline">
                  Read our privacy policy
                </Link>
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-stone-900 text-white">
              <Calendar className="w-6 h-6 text-[#C4795A] mb-3" />
              <h3 className="font-serif text-lg font-bold mb-2">{copy.consultNextTitle}</h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                {copy.consultNextBody}
              </p>
            </div>
            {(copy.consultCards || []).map((item) => {
              const Icon = item.link ? ArrowRight : item.title?.toLowerCase().includes('warrant') ? ShieldCheck : CheckCircle2;
              const inner = (
                <>
                  <Icon className="w-5 h-5 text-[#5C7A6B] mb-2" />
                  <h3 className="font-serif font-bold text-stone-900">{item.title}</h3>
                  <p className="text-xs text-stone-600 mt-1">{item.body}</p>
                </>
              );
              return item.link ? (
                <Link key={item.title} to={item.link} className="block p-6 rounded-2xl bg-white border border-stone-200 hover:border-[#C4795A]/40 transition">
                  {inner}
                </Link>
              ) : (
                <div key={item.title} className="p-6 rounded-2xl bg-white border border-stone-200">
                  {inner}
                </div>
              );
            })}
          </aside>
        </div>
      </section>

    </div>
  );
}
