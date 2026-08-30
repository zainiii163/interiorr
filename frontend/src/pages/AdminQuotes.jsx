import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Trash2, FileText, Download, Loader2, Mail } from 'lucide-react';
import { apiFetch, apiBaseUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminQuotes() {
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const leadIdParam = searchParams.get('leadId') || '';

  const [quotes, setQuotes] = useState([]);
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [downloadingPDF, setDownloadingPDF] = useState(null);
  const [emailingId, setEmailingId] = useState(null);

  const [formData, setFormData] = useState({
    leadId: leadIdParam,
    leadName: '',
    leadEmail: '',
    discount: 0,
    currency: 'AED',
    items: [
      { description: 'Luxury Custom Joinery & Wall Paneling', category: 'Joinery', quantity: 1, unitPrice: 35000 },
      { description: 'MEP Electrical & Linear AC Slot Diffusers', category: 'MEP', quantity: 1, unitPrice: 18000 }
    ]
  });

  const fetchQuotesAndLeads = async () => {
    try {
      const [qRes, lRes] = await Promise.all([
        apiFetch('/quotes'),
        apiFetch('/leads')
      ]);
      if (qRes.success) setQuotes(qRes.data);
      if (lRes.success) setLeads(lRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchQuotesAndLeads();
  }, []);

  useEffect(() => {
    if (!leadIdParam) return;
    setFormData((prev) => ({ ...prev, leadId: leadIdParam }));
    setShowModal(true);
  }, [leadIdParam]);

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', category: 'Fit-out', quantity: 1, unitPrice: 0 }]
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.items];
      updated[index][field] = field === 'quantity' || field === 'unitPrice' ? Number(value) : value;
      return { ...prev, items: updated };
    });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const subtotal = calculateSubtotal();
  const taxableAmount = Math.max(0, subtotal - formData.discount);
  const tax = taxableAmount * 0.05; // 5% UAE VAT
  const grandTotal = taxableAmount + tax;

  const handleCreateQuote = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/quotes', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.success) {
        setShowModal(false);
        fetchQuotesAndLeads();
        setSelectedQuote(res.data);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await apiFetch(`/quotes/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      if (res.success) fetchQuotesAndLeads();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteQuote = async (id) => {
    if (!window.confirm('Delete this quotation permanently?')) return;
    try {
      await apiFetch(`/quotes/${id}`, { method: 'DELETE' });
      if (selectedQuote?._id === id) setSelectedQuote(null);
      fetchQuotesAndLeads();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleEmailQuote = async (quote) => {
    if (!quote?.leadEmail && !quote?.lead?.email) {
      alert('This quote has no client email on the linked lead.');
      return;
    }
    setEmailingId(quote._id);
    try {
      const res = await apiFetch(`/quotes/${quote._id}/email`, {
        method: 'POST',
        body: JSON.stringify({ frontendOrigin: window.location.origin }),
      });
      if (res.success) {
        alert(res.message + (res.data?.portalUrl ? `\n${res.data.portalUrl}` : ''));
        fetchQuotesAndLeads();
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setEmailingId(null);
    }
  };

  const handleDownloadPDF = async (quoteId, quoteNumber) => {
    setDownloadingPDF(quoteId);
    try {
      const response = await fetch(`${apiBaseUrl}/quotes/${quoteId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Quote-${quoteNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      alert('Failed to download PDF: ' + e.message);
    } finally {
      setDownloadingPDF(null);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="admin-page-header">
        <div className="min-w-0">
          <h1 className="font-serif font-bold text-stone-900">Quotation Management (AED)</h1>
          <p className="text-xs text-stone-500 mt-1">Generate official BOQ quotes with 5% UAE VAT calculation and unique numbers Q-YYYY-NNNN</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Quotation</span>
        </button>
      </div>

      {/* Quote Preview Modal / Printable View */}
      {selectedQuote && (
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C4795A]">Official Quotation Invoice</span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">{selectedQuote.quoteNumber}</h2>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleDownloadPDF(selectedQuote._id, selectedQuote.quoteNumber)}
                disabled={downloadingPDF === selectedQuote._id}
                className="px-3 py-1.5 rounded-lg bg-[#C4795A] text-white text-xs font-semibold flex items-center space-x-1 hover:bg-[#A86548] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloadingPDF === selectedQuote._id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-3 py-1.5 rounded-lg bg-stone-200 text-stone-800 text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 uppercase">Client / Lead:</span>
              <div className="font-bold text-stone-900 text-sm">{selectedQuote.leadName}</div>
              <div className="text-stone-500">{selectedQuote.leadEmail}</div>
            </div>
            <div className="text-right">
              <span className="text-stone-400 uppercase">Valid Until:</span>
              <div className="font-bold text-stone-900">{new Date(selectedQuote.validUntil).toLocaleDateString()}</div>
              <div className="text-stone-500">Currency: {selectedQuote.currency}</div>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b text-stone-500 uppercase">
              <tr>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price ({selectedQuote.currency})</th>
                <th className="py-2.5 px-3 text-right">Line Total ({selectedQuote.currency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {selectedQuote.items.map((it, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 px-3">{it.description}</td>
                  <td className="py-2.5 px-3 text-stone-500">{it.category}</td>
                  <td className="py-2.5 px-3 text-center">{it.quantity}</td>
                  <td className="py-2.5 px-3 text-right">{it.unitPrice?.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-bold">{it.lineTotal?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t pt-4 flex flex-col items-end text-xs space-y-1 font-medium">
            <div>Subtotal: <span className="font-bold">{selectedQuote.subtotal?.toLocaleString()} AED</span></div>
            <div>Discount: <span className="text-rose-600">-{selectedQuote.discount?.toLocaleString()} AED</span></div>
            <div>UAE VAT (5%): <span className="font-bold">{selectedQuote.tax?.toLocaleString()} AED</span></div>
            <div className="text-base font-serif font-bold text-[#C4795A] pt-2">
              Grand Total: {selectedQuote.grandTotal?.toLocaleString()} AED
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm admin-table-wrap">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
            <tr>
              <th className="py-3.5 px-4">Quote Number</th>
              <th className="py-3.5 px-4">Client Name</th>
              <th className="py-3.5 px-4">Grand Total (AED)</th>
              <th className="py-3.5 px-4">Quote Status</th>
              <th className="py-3.5 px-4">Payment Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium">
            {quotes.map((q) => {
              const portalUrl = `${window.location.origin}/portal/${q.accessCode || q.quoteNumber}`;
              return (
                <tr key={q._id} className="hover:bg-stone-50 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-serif font-bold text-[#C4795A] text-sm">{q.quoteNumber}</div>
                    {q.accessCode && (
                      <div className="text-[10px] text-stone-400 font-mono">Code: {q.accessCode}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">{q.leadName}</td>
                  <td className="py-3.5 px-4 font-bold">{q.grandTotal?.toLocaleString()} AED</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={q.status}
                      onChange={(e) => handleStatusChange(q._id, e.target.value)}
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-stone-100 border border-stone-300"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      q.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                      q.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-stone-100 text-stone-600'
                    }`}>
                      {q.paymentStatus || 'unpaid'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(portalUrl);
                        alert(`Client Portal link copied to clipboard!\n${portalUrl}`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#C4795A] font-bold text-[11px]"
                      title="Copy Client Portal Access Link"
                    >
                      Client Portal Link
                    </button>
                    <button
                      onClick={() => handleEmailQuote(q)}
                      disabled={emailingId === q._id}
                      className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] disabled:opacity-50 inline-flex items-center gap-1"
                      title="Email quote + portal link to client"
                    >
                      {emailingId === q._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                      Email
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(q._id, q.quoteNumber)}
                      disabled={downloadingPDF === q._id}
                      className="px-2.5 py-1 rounded-lg bg-[#C4795A] hover:bg-[#A86548] text-white font-bold text-[11px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      title="Download PDF"
                    >
                      {downloadingPDF === q._id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Download className="w-3 h-3" />
                      )}
                      PDF
                    </button>
                    <button
                      onClick={() => setSelectedQuote(q)}
                      className="text-xs font-bold text-stone-700 hover:underline"
                    >
                      View BOQ
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteQuote(q._id)}
                        className="p-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 inline-flex align-middle"
                        title="Delete quote"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Generator Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-2xl space-y-4">
            <h2 className="font-serif text-xl font-bold text-stone-900">Create New Quotation</h2>
            
            <form onSubmit={handleCreateQuote} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Select Lead / Client</label>
                  <select
                    value={formData.leadId}
                    onChange={(e) => {
                      const selected = leads.find(l => l._id === e.target.value);
                      setFormData({
                        ...formData,
                        leadId: e.target.value,
                        leadName: selected ? selected.fullName : formData.leadName,
                        leadEmail: selected ? selected.email : formData.leadEmail
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="">-- Custom Client --</option>
                    {leads.map(l => (
                      <option key={l._id} value={l._id}>{l.fullName} ({l.service})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.leadName}
                    onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                    placeholder="Tariq Mansoor"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 uppercase tracking-wider text-[10px]">Quotation BOQ Line Items</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-[#C4795A] font-bold hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {formData.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <input
                      type="text"
                      placeholder="Item description..."
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="flex-1 px-3 py-1.5 border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-16 px-2 py-1.5 border rounded-lg text-center"
                    />
                    <input
                      type="number"
                      placeholder="Unit Price AED"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                      className="w-28 px-2 py-1.5 border rounded-lg text-right font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-stone-100 space-y-1 text-right font-semibold">
                <div>Subtotal: {subtotal.toLocaleString()} AED</div>
                <div>UAE VAT (5%): {tax.toLocaleString()} AED</div>
                <div className="text-sm font-bold text-[#C4795A]">Grand Total: {grandTotal.toLocaleString()} AED</div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 text-stone-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-terracotta px-5 py-2 rounded-xl font-semibold"
                >
                  Save & Generate Q-2026 Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
