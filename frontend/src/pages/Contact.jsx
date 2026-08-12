import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { useSite } from '../context/SiteContext';
import { apiFetch } from '../services/api';

export default function Contact() {
  const { settings } = useSite();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await apiFetch('/leads', {
        method: 'POST',
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          service: 'General Contact Inquiry',
          source: 'Contact Page Form',
          leadType: 'contact',
          propertyType: 'other',
        })
      });

      if (res.success) {
        setSuccessMsg(res.message);
        setFormData({ fullName: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-offset pb-20">
      
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">Connect With Us</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2">Contact Aura Interiors</h1>
          <p className="text-stone-300 mt-3 max-w-2xl mx-auto text-sm">
            Visit our Dubai Design District studio or drop us a message below.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Details */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-stone-900">Get In Touch</h2>
              <p className="text-stone-600 mt-2 text-sm">
                Our interior consultants and project managers are available Monday through Saturday.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-5 rounded-xl bg-white border border-stone-200 shadow-sm">
                <MapPin className="w-6 h-6 text-[#C4795A] shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-base">Studio Address</h4>
                  <p className="text-stone-600 text-sm mt-1">{settings.address}</p>
                </div>
              </div>

              <a href={`tel:${(settings.phone || '+97148009988').replace(/[^+\d]/g, '')}`} className="flex items-start space-x-4 p-5 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-[#C4795A] transition">
                <Phone className="w-6 h-6 text-[#C4795A] shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-base">Telephone</h4>
                  <p className="text-stone-600 text-sm mt-1">{settings.phone}</p>
                </div>
              </a>

              <a href={`mailto:${settings.email || 'info@aurainteriors.ae'}`} className="flex items-start space-x-4 p-5 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-[#C4795A] transition">
                <Mail className="w-6 h-6 text-[#C4795A] shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-base">Email Inquiry</h4>
                  <p className="text-stone-600 text-sm mt-1">{settings.email}</p>
                </div>
              </a>

              {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\+/g, '')}?text=Hello`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-4 p-5 rounded-xl bg-emerald-950/10 border border-emerald-500/30 hover:bg-emerald-950/20 transition"
              >
                <WhatsAppIcon className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-base">WhatsApp Business (+971)</h4>
                  <p className="text-stone-600 text-sm mt-1">Chat directly with senior project management</p>
                </div>
              </a>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-lg">
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-6">Send Us a Message</h3>

            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm flex items-center space-x-2 mb-6">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-sm mb-6">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Tariq Mansoor"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C4795A] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tariq@domain.ae"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C4795A] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Phone (+971 UAE) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+971 50 123 4567"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C4795A] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Message / Project Brief
                </label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your property location, desired timeline, or scope..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C4795A] text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-terracotta py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </form>
          </div>

        </div>

        {settings.mapEmbedUrl && (
        <div className="mt-16 rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-stone-200 h-80">
          <iframe
            title="Office Location"
            src={settings.mapEmbedUrl}
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        )}
      </section>

    </div>
  );
}
