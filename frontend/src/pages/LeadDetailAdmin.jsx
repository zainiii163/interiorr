import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function LeadDetailAdmin() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [status, setStatus] = useState('New');
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchLead = async () => {
    try {
      const res = await apiFetch(`/leads/${id}`);
      if (res.success) {
        setLead(res.data);
        setStatus(res.data.status);
      }
    } catch (e) {
      console.error('Error loading lead detail:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setStatus(newStatus);
    try {
      const res = await apiFetch(`/leads/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      if (res.success) {
        setMsg('Status updated to ' + newStatus);
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    try {
      const res = await apiFetch(`/leads/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ content: noteContent })
      });
      if (res.success) {
        setNoteContent('');
        setLead(res.data);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div className="p-8 text-center font-serif text-lg">Loading Lead Details...</div>;
  if (!lead) return <div className="p-8 text-center font-serif text-lg">Lead Not Found</div>;

  return (
    <div className="space-y-6">
      
      <div className="flex items-center space-x-3">
        <Link to="/admin/leads" className="p-2 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-stone-900">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Lead Detail: {lead.fullName}</h1>
          <p className="text-xs text-stone-500">Submitted on {new Date(lead.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details & Status */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">Customer & Property Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Full Name</span>
                <span className="font-bold text-stone-900 text-sm">{lead.fullName}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Phone (+971 UAE)</span>
                <span className="font-semibold text-stone-900 text-sm">{lead.phone}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Email</span>
                <span className="font-medium text-stone-800">{lead.email}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Preferred Contact Method</span>
                <span className="font-semibold text-emerald-600">{lead.preferredContactMethod}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Requested Service</span>
                <span className="font-bold text-[#C4795A]">{lead.service}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Property Type & Location</span>
                <span className="font-medium text-stone-800">{lead.propertyType} ({lead.location})</span>
              </div>
            </div>

            {lead.message && (
              <div className="pt-3 border-t border-stone-100">
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block mb-1">Customer Message / Brief</span>
                <p className="text-xs text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 leading-relaxed italic">
                  "{lead.message}"
                </p>
              </div>
            )}
          </div>

          {/* FR-084: Internal Notes Stream */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">Internal Notes & History</h2>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add internal staff note (e.g. Call attempted, quote sent via WhatsApp)..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#C4795A]"
              />
              <button
                type="submit"
                className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Add Note</span>
              </button>
            </form>

            <div className="space-y-3 pt-2">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((n, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-stone-400 text-[10px]">
                      <span className="font-bold text-stone-700">{n.author}</span>
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-stone-800 font-medium">{n.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-stone-400 italic py-2">No internal notes added yet.</div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Status Controls & Actions */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900">Pipeline Status</h3>
            
            <div className="space-y-2">
              {['New', 'Contacted', 'Quoted', 'Won', 'Lost'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusUpdate(st)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    status === st
                      ? 'bg-stone-900 text-white shadow-md'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <span>{st}</span>
                  {status === st && <CheckCircle2 className="w-4 h-4 text-[#C4795A]" />}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100">
              <Link
                to={`/admin/quotes?leadId=${lead._id}`}
                className="w-full btn-terracotta text-center py-2.5 rounded-xl text-xs font-semibold block shadow-md"
              >
                Create Official Quotation (Q-2026)
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
