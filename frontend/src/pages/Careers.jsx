import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Send, CheckCircle2, Upload } from 'lucide-react';
import { apiFetch, getAuthToken } from '../services/api';
import { useSite } from '../context/SiteContext';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export default function Careers() {
  const { settings } = useSite();
  const [openings, setOpenings] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', experience: '', resumeUrl: '', coverLetter: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    apiFetch('/job-openings').then((res) => {
      if (res.success && res.data.length) {
        setOpenings(res.data);
        setSelectedPosition(res.data[0].title);
      } else {
        setSelectedPosition('General Application');
      }
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const body = new FormData();
      body.append('fullName', formData.fullName);
      body.append('email', formData.email);
      body.append('phone', formData.phone);
      body.append('position', selectedPosition);
      body.append('experience', formData.experience || '');
      body.append('coverLetter', formData.coverLetter || '');
      if (formData.resumeUrl) body.append('resumeUrl', formData.resumeUrl);
      if (resumeFile) body.append('resume', resumeFile);

      const headers = {};
      const token = getAuthToken();
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/job-applications`, {
        method: 'POST',
        body,
        headers,
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed');

      setSuccessMsg(data.message || 'Application submitted successfully.');
      setFormData({ fullName: '', email: '', phone: '', experience: '', resumeUrl: '', coverLetter: '' });
      setResumeFile(null);
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-offset pb-20">
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">Join Our Team</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2">Careers at {settings.companyName}</h1>
          <p className="text-stone-300 mt-3 max-w-2xl mx-auto text-sm">{settings.tagline}</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 space-y-12">
        <div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-6">Open Positions</h2>
          {openings.length > 0 ? (
            <div className="space-y-6">
              {openings.map((j) => (
                <div key={j._id} className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700">{j.type}</span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 mt-2">{j.title}</h3>
                  <p className="text-stone-600 text-sm mt-2">{j.description}</p>
                  <div className="flex items-center space-x-1 text-xs text-stone-500 mt-3">
                    <MapPin className="w-3.5 h-3.5 text-[#C4795A]" />
                    <span>{j.location}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-500">No open positions at the moment. You can still submit a general application below.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Briefcase className="w-5 h-5 text-[#C4795A]" />
            <h2 className="font-serif text-2xl font-bold text-stone-900">Apply Online</h2>
          </div>

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" /><span>{successMsg}</span>
            </div>
          )}
          {errorMsg && <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-800 text-sm">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Position *</label>
              {openings.length > 0 ? (
                <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl" required>
                  {openings.map((j) => <option key={j._id} value={j.title}>{j.title}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  placeholder="e.g. General Application / Interior Architect"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl"
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-4 py-3 border border-stone-200 rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Phone *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border border-stone-200 rounded-xl" />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Email *</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-stone-200 rounded-xl" />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Experience</label>
              <input type="text" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="w-full px-4 py-3 border border-stone-200 rounded-xl" placeholder="e.g. 5 years residential fit-out" />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Upload Resume (PDF / Word)</label>
              <label className="flex items-center gap-3 px-4 py-3 border border-dashed border-stone-300 rounded-xl cursor-pointer hover:border-[#C4795A] transition">
                <Upload className="w-4 h-4 text-[#C4795A]" />
                <span className="text-stone-600 text-xs">
                  {resumeFile ? resumeFile.name : 'Choose file (max 8MB)'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Or Resume / Portfolio URL</label>
              <input type="url" value={formData.resumeUrl} onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })} className="w-full px-4 py-3 border border-stone-200 rounded-xl" placeholder="https://drive.google.com/..." />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Cover Letter</label>
              <textarea rows={4} value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} className="w-full px-4 py-3 border border-stone-200 rounded-xl" />
            </div>
            <button type="submit" disabled={loading} className="btn-terracotta px-8 py-3 rounded-xl font-semibold text-sm flex items-center space-x-2 disabled:opacity-60">
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting…' : 'Submit Application'}</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
