import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  FileText, Calendar, CheckCircle2, Clock, AlertCircle, ShieldCheck, 
  CreditCard, ArrowRight, Download, Check, Sparkles, Phone, MessageSquare, Building2, ChevronRight, Lock
} from 'lucide-react';
import { apiFetch } from '../services/api';
import { useSite } from '../context/SiteContext';

export default function ClientPortal() {
  const { code: routeCode } = useParams();
  const [searchParams] = useSearchParams();
  const queryCode = searchParams.get('code');
  const initialCode = routeCode || queryCode || '';

  const { settings } = useSite();
  const [inputCode, setInputCode] = useState(initialCode);
  const [activeCode, setActiveCode] = useState(initialCode);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(initialCode));
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('quote'); // 'quote' | 'timeline'
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchPortalData = async (accessCode) => {
    if (!accessCode) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/client/portal/${encodeURIComponent(accessCode)}`);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.message || 'Quote or client access record not found.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load client portal details. Please check your access code.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeCode) {
      fetchPortalData(activeCode);
    }
  }, [activeCode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setActiveCode(inputCode.trim());
    }
  };

  const handleAcceptAndPay = async () => {
    if (!data?.quote) return;
    setIsProcessingPayment(true);
    try {
      // First ensure quote is marked as accepted
      await apiFetch(`/client/quote/${data.quote._id}/accept`, { method: 'POST' });

      // Trigger Stripe payment checkout session
      const payRes = await apiFetch('/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ quoteId: data.quote._id }),
      });

      if (payRes.success && payRes.data?.url) {
        window.location.href = payRes.data.url;
      } else {
        fetchPortalData(activeCode);
      }
    } catch (err) {
      alert('Error initializing payment: ' + err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleReject = async () => {
    if (!data?.quote) return;
    try {
      await apiFetch(`/client/quote/${data.quote._id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason: rejectReason }),
      });
      setRejectModalOpen(false);
      fetchPortalData(activeCode);
    } catch (err) {
      alert('Failed to submit response: ' + err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans pb-20">
      
      {/* Top Banner */}
      <header className="bg-stone-950 border-b border-stone-800 py-4 px-6 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#C4795A] text-white flex items-center justify-center font-serif font-bold text-lg shadow-md">
              A
            </div>
            <div>
              <span className="font-serif font-bold text-xl tracking-wide text-white">AURA</span>
              <span className="block text-[9px] uppercase tracking-widest text-[#C4795A] font-semibold">
                CLIENT PORTAL
              </span>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <a
              href={`https://wa.me/${settings?.whatsapp || '971550000000'}`}
              target="_blank"
              rel="noreferrer"
              className="btn-terracotta px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md hover:scale-105 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Project Manager</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Access Code Search Bar if no code or error */}
        {(!activeCode || error) && (
          <div className="max-w-lg mx-auto bg-stone-950 p-8 rounded-3xl border border-stone-800 shadow-2xl text-center my-12">
            <div className="w-14 h-14 bg-[#C4795A]/10 text-[#C4795A] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#C4795A]/20">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white">Client Portal Access</h1>
            <p className="text-stone-400 text-xs mt-2 mb-6">
              Enter your Quote Reference Number or Access Code to view your customized quote, specifications, and project timeline.
            </p>
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="e.g. Q-2026-0001 or P-8F92"
                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white text-sm text-center font-mono focus:border-[#C4795A] focus:outline-none uppercase tracking-wider"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#C4795A] hover:bg-[#b06749] text-white font-semibold text-xs rounded-xl shadow-lg transition"
              >
                Access Portal
              </button>
            </form>
            {error && (
              <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl text-rose-300 text-xs">
                {error}
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#C4795A] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-stone-400 text-sm">Retrieving quote details & project timeline...</p>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-8">
            
            {/* Executive Header Card */}
            <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C4795A]/5 rounded-full blur-3xl -z-0"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-[#C4795A]/20 text-[#C4795A] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#C4795A]/30">
                      Ref: {data.quote.quoteNumber}
                    </span>
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                      data.quote.status === 'accepted' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      data.quote.status === 'rejected' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {data.quote.status}
                    </span>
                    {data.quote.paymentStatus === 'paid' && (
                      <span className="px-3 py-1 bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Paid in Full</span>
                      </span>
                    )}
                  </div>

                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {data.quote.leadName ? `${data.quote.leadName}'s Fit-out Project` : 'Interior Quotation'}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-stone-400 text-xs mt-2">
                    {data.quote.leadEmail && (
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-[#C4795A]" />
                        <span>{data.quote.leadEmail}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C4795A]" />
                      <span>Valid until: {data.quote.validUntil ? new Date(data.quote.validUntil).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Overall Timeline Progress Indicator */}
                <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800 min-w-[240px]">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-stone-400">Project Progress</span>
                    <span className="text-[#C4795A] font-bold">{data.project.overallProgress}%</span>
                  </div>
                  <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#C4795A] to-amber-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${data.project.overallProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-2 flex justify-between">
                    <span>{data.project.completedMilestones} of {data.project.totalMilestones} Milestones</span>
                    <span className="text-stone-300 font-medium">Dubai, UAE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-800 space-x-8 text-sm font-medium">
              <button
                onClick={() => setActiveTab('quote')}
                className={`pb-4 flex items-center space-x-2 border-b-2 transition ${
                  activeTab === 'quote'
                    ? 'border-[#C4795A] text-[#C4795A] font-bold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Quotation & Items ({data.quote.currency} {data.quote.grandTotal?.toLocaleString()})</span>
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`pb-4 flex items-center space-x-2 border-b-2 transition ${
                  activeTab === 'timeline'
                    ? 'border-[#C4795A] text-[#C4795A] font-bold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Project Timeline & Milestones</span>
              </button>
            </div>

            {/* TAB 1: QUOTE DETAILS */}
            {activeTab === 'quote' && (
              <div className="space-y-6">
                
                <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-white">Itemized Scope & Cost Breakdown</h2>
                      <p className="text-stone-400 text-xs mt-1">Turnkey fit-out & bespoke joinery detailed quote</p>
                    </div>
                    <button
                      onClick={handlePrint}
                      className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>

                  {/* Line Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-stone-300">
                      <thead className="bg-stone-900 text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-800">
                        <tr>
                          <th className="py-3.5 px-4">#</th>
                          <th className="py-3.5 px-4">Description</th>
                          <th className="py-3.5 px-4">Category</th>
                          <th className="py-3.5 px-4 text-center">Qty / Unit</th>
                          <th className="py-3.5 px-4 text-right">Unit Price ({data.quote.currency})</th>
                          <th className="py-3.5 px-4 text-right">Total ({data.quote.currency})</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/60 font-medium">
                        {data.quote.lineItems && data.quote.lineItems.length > 0 ? (
                          data.quote.lineItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-stone-900/40 transition">
                              <td className="py-4 px-4 text-stone-500 font-mono">{idx + 1}</td>
                              <td className="py-4 px-4 font-bold text-white">{item.description}</td>
                              <td className="py-4 px-4 capitalize text-stone-400">{item.category}</td>
                              <td className="py-4 px-4 text-center">{item.quantity} {item.unit}</td>
                              <td className="py-4 px-4 text-right font-mono">{item.unitPrice?.toLocaleString()}</td>
                              <td className="py-4 px-4 text-right font-mono font-bold text-white">
                                {(item.total || (item.quantity * item.unitPrice))?.toLocaleString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="py-6 text-center text-stone-500">No line items specified.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Totals */}
                  <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row justify-between gap-6">
                    <div className="text-stone-400 text-xs space-y-2 max-w-md">
                      <div className="font-semibold text-stone-200">Notes & Payment Terms:</div>
                      <p className="text-stone-400 leading-relaxed">
                        {data.quote.notes || '50% advance upon contract signing, 40% upon joinery delivery on site, 10% upon key handover & completion certificate.'}
                      </p>
                    </div>

                    <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-3 min-w-[280px]">
                      <div className="flex justify-between text-xs text-stone-400">
                        <span>Subtotal:</span>
                        <span className="font-mono text-white">{data.quote.subtotal?.toLocaleString()} {data.quote.currency}</span>
                      </div>
                      <div className="flex justify-between text-xs text-stone-400">
                        <span>UAE VAT (5%):</span>
                        <span className="font-mono text-white">{data.quote.tax?.toLocaleString()} {data.quote.currency}</span>
                      </div>
                      {data.quote.discount > 0 && (
                        <div className="flex justify-between text-xs text-emerald-400">
                          <span>Discount:</span>
                          <span className="font-mono">-{data.quote.discount?.toLocaleString()} {data.quote.currency}</span>
                        </div>
                      )}
                      <div className="border-t border-stone-800 pt-3 flex justify-between text-sm font-bold text-white">
                        <span>Grand Total:</span>
                        <span className="font-mono text-[#C4795A] text-lg">
                          {data.quote.grandTotal?.toLocaleString()} {data.quote.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons for Quote Acceptance & Stripe Payment */}
                  <div className="bg-stone-900/60 p-6 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-stone-400">
                      <div className="font-bold text-white flex items-center space-x-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Secure Stripe 256-bit Encrypted Acceptance & Payment</span>
                      </div>
                      <p className="mt-0.5">Instant booking confirmation upon digital acceptance</p>
                    </div>

                    {data.quote.status !== 'accepted' && (
                      <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <button
                          onClick={() => setRejectModalOpen(true)}
                          className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs rounded-xl border border-stone-700 transition"
                        >
                          Decline Quote
                        </button>
                        <button
                          onClick={handleAcceptAndPay}
                          disabled={isProcessingPayment}
                          className="px-6 py-3 bg-[#C4795A] hover:bg-[#b06749] text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 transition hover:scale-105 disabled:opacity-50"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>{isProcessingPayment ? 'Processing...' : 'Accept & Pay via Stripe'}</span>
                        </button>
                      </div>
                    )}

                    {data.quote.status === 'accepted' && (
                      <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold bg-emerald-950/60 px-4 py-3 rounded-xl border border-emerald-800">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Quote Accepted & Contract Confirmed</span>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: PROJECT TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <div className="bg-stone-950 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-8">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-white">Interactive Project Timeline</h2>
                    <p className="text-stone-400 text-xs mt-1">Live phase-by-phase status tracking of your renovation project</p>
                  </div>

                  {/* Milestones Stepper */}
                  <div className="relative border-l-2 border-stone-800 ml-4 sm:ml-8 space-y-8 pl-6 sm:pl-10">
                    {data.project.timeline.map((milestone, idx) => {
                      const isCompleted = milestone.status === 'completed';
                      const isInProgress = milestone.status === 'in_progress';

                      return (
                        <div key={idx} className="relative group">
                          {/* Dot / Icon */}
                          <div
                            className={`absolute -left-[35px] sm:-left-[51px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition ${
                              isCompleted
                                ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/50'
                                : isInProgress
                                ? 'bg-[#C4795A] border-[#C4795A] text-white animate-pulse shadow-lg shadow-[#C4795A]/50'
                                : 'bg-stone-900 border-stone-700 text-stone-500'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : isInProgress ? (
                              <Clock className="w-4 h-4 animate-spin" />
                            ) : (
                              <span className="text-xs font-mono">{idx + 1}</span>
                            )}
                          </div>

                          {/* Milestone Box */}
                          <div className={`p-5 rounded-2xl border transition ${
                            isInProgress
                              ? 'bg-stone-900 border-[#C4795A]/50 shadow-lg'
                              : isCompleted
                              ? 'bg-stone-900/40 border-stone-800'
                              : 'bg-stone-950/60 border-stone-900'
                          }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                                <span>{milestone.title}</span>
                                {isInProgress && (
                                  <span className="px-2 py-0.5 bg-[#C4795A]/20 text-[#C4795A] text-[9px] font-bold uppercase rounded">
                                    Current Phase
                                  </span>
                                )}
                              </h3>
                              <span className="text-xs text-stone-400 font-mono">
                                {milestone.targetDate ? `Target: ${new Date(milestone.targetDate).toLocaleDateString()}` : 'Scheduled'}
                              </span>
                            </div>

                            <p className="text-stone-400 text-xs mt-2 leading-relaxed">{milestone.description}</p>

                            {/* Progress bar per milestone */}
                            <div className="mt-3 flex items-center space-x-3">
                              <div className="flex-1 bg-stone-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-[#C4795A]' : 'bg-stone-700'
                                  }`}
                                  style={{ width: `${milestone.progressPercentage || (isCompleted ? 100 : isInProgress ? 50 : 0)}%` }}
                                ></div>
                              </div>
                              <span className="text-[10px] font-bold text-stone-400 font-mono">
                                {milestone.progressPercentage || (isCompleted ? 100 : isInProgress ? 50 : 0)}%
                              </span>
                            </div>

                            {milestone.notes && (
                              <div className="mt-3 p-2.5 bg-stone-950/80 rounded-xl text-[11px] text-stone-300 border border-stone-800 flex items-start space-x-2">
                                <Sparkles className="w-3.5 h-3.5 text-[#C4795A] shrink-0 mt-0.5" />
                                <span>{milestone.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Decline Quote Modal */}
        {rejectModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 max-w-md w-full space-y-4">
              <h3 className="font-serif text-lg font-bold text-white">Decline Quotation</h3>
              <p className="text-stone-400 text-xs">
                Please provide feedback so we can adjust our proposal to meet your requirements.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for declining or requested modifications..."
                rows="4"
                className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C4795A]"
              ></textarea>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 bg-stone-900 text-stone-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
                >
                  Submit Response
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
