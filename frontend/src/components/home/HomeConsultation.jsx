import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Send, Briefcase } from 'lucide-react';
import { apiFetch } from '../../services/api';
import ScrollReveal from '../ui/ScrollReveal';
import FormPrivacyNote from '../FormPrivacyNote';

const PROPERTY_TYPES = ['Villa', 'Apartment', 'Office', 'Commercial', 'Retail', 'Other'];

export default function HomeConsultation({ copy = {} }) {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    propertyType: 'Villa',
    service: '',
    location: '',
    message: '',
    preferredContactMethod: 'WhatsApp',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    apiFetch('/services')
      .then((res) => {
        if (res.success && res.data?.length) {
          setServices(res.data);
          setFormData((prev) => ({ ...prev, service: prev.service || res.data[0].name }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 8) {
      setErrorMsg('Please enter a valid telephone number (e.g. +971 50 123 4567)');
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch('/leads', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          source: 'Homepage Consultation Form',
          leadType: 'consultation',
        }),
      });
      if (res.success) setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-[#1A1817] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScrollReveal>
            <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">
              {copy.homeConsultBadge || 'Book Online'}
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mt-3 mb-4">
              {copy.homeConsultTitle || 'Book a Consultation With Us'}
            </h2>
            <p className="text-stone-400 leading-relaxed mb-8">
              {copy.homeConsultBody ||
                'We would love to meet you in person. Share your property details and our planners will prepare a custom proposal with a detailed scope of work — no hidden costs, free basic design for confirmed projects.'}
            </p>
            <ul className="space-y-3 text-sm text-stone-300 mb-10">
              {(copy.homeConsultBullets || [
                'Free site visit and transparent quotation',
                '8–10 week average timeline for full home renovation',
                'In-house NOC and authority approvals team',
                'Up to 10-year warranty on kitchens and wardrobes',
              ]).map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C4795A] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-300 hover:text-white border-b border-stone-600 hover:border-[#C4795A] pb-0.5 transition"
            >
              <Briefcase className="w-4 h-4" />
              Applying for a job? Use the careers form — inquiry submissions are not considered.
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="bg-white text-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold">Request received</h3>
                  <p className="text-sm text-stone-600">
                    Thank you, {formData.fullName}. A project coordinator will contact you within 2 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-sm font-semibold text-[#C4795A] hover:underline"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold mb-1">We would love to meet you</h3>
                  <p className="text-xs text-stone-500 mb-4">All fields marked * are required.</p>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      required
                      type="text"
                      placeholder="Full name *"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#C4795A] outline-none"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#C4795A] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      required
                      type="tel"
                      placeholder="Phone +971 *"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#C4795A] outline-none"
                    />
                    <input
                      required
                      type="text"
                      placeholder="Community / location *"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#C4795A] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm bg-white focus:ring-2 focus:ring-[#C4795A] outline-none"
                    >
                      {services.length ? (
                        services.map((s) => (
                          <option key={s._id} value={s.name}>
                            {s.name}
                          </option>
                        ))
                      ) : (
                        <option value="">Loading services…</option>
                      )}
                    </select>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm bg-white focus:ring-2 focus:ring-[#C4795A] outline-none"
                    >
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Project notes, timeline, or budget (optional)"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#C4795A] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-terracotta py-3.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Submitting…' : 'Book Free Consultation'}
                  </button>
                  <FormPrivacyNote />
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
