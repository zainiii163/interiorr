import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, ShieldCheck, CheckCircle2, Send, ArrowRight } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function Consultation() {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';

  const [activeServices, setActiveServices] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    propertyType: 'Villa',
    service: initialService || '',
    location: '',
    message: '',
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
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">Private Appointment</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2">Book a Design & Renovation Consultation</h1>
          <p className="text-stone-300 mt-3 max-w-2xl mx-auto text-sm">
            Meet with our senior Dubai architectural team at your property or in our Design District studio.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Hassan Al-Rashid"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C4795A] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="hassan@domain.ae"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C4795A] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Phone Number (+971 UAE) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+971 50 123 4567"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C4795A] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Property Type *
                  </label>
                  <select
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Required Service (FR-072 Dynamic) *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C4795A] text-sm bg-white"
                  >
                    {activeServices.length > 0 ? (
                      activeServices.map(s => (
                        <option key={s._id} value={s.name}>{s.name}</option>
                      ))
                    ) : (
                      <option value="">Loading services…</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Property Location in Dubai *
                  </label>
                  <input
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
                <div className="flex space-x-6">
                  {['WhatsApp', 'Phone', 'Email'].map((method) => (
                    <label key={method} className="flex items-center space-x-2 text-sm text-stone-800 cursor-pointer">
                      <input
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
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Project Notes & Timeline
                </label>
                <textarea
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
                className="w-full btn-terracotta py-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting Request...' : 'Confirm Consultation Request'}</span>
              </button>

            </form>
          </div>
        )}

      </section>

    </div>
  );
}
