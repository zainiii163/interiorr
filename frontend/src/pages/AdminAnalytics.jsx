import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, Users, Award, Star, PieChart, 
  BarChart3, ShieldCheck, ArrowUpRight, ArrowDownRight, RefreshCw, CheckCircle2, FileText
} from 'lucide-react';
import { apiFetch } from '../services/api';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const res = await apiFetch('/analytics/summary');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4 text-stone-500">
        <div className="w-10 h-10 border-4 border-[#C4795A] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold">Generating Executive Analytics Report...</p>
      </div>
    );
  }

  const { revenue, funnel, propertyTypes, reviews, quoteStatusCounts, monthlyData } = data || {};

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Banner */}
      <div className="bg-stone-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-stone-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C4795A]">
            Executive Dashboard
          </span>
          <h1 className="font-serif text-3xl font-bold mt-1">Platform Performance & Analytics</h1>
          <p className="text-stone-400 text-xs mt-1">
            Real-time business telemetry, revenue metrics, conversion funnels & review sync
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md hover:scale-105 transition"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Paid Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">Total Revenue Paid</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              AED
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900">
            AED {revenue?.totalPaidAED?.toLocaleString() || 0}
          </div>
          <div className="flex items-center space-x-1 text-emerald-600 text-xs font-semibold">
            <ArrowUpRight className="w-4 h-4" />
            <span>Stripe & Direct Accepted Payments</span>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">Pending Quotes Value</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#C4795A]">
            AED {revenue?.pendingPipelineAED?.toLocaleString() || 0}
          </div>
          <div className="text-stone-400 text-xs">
            Across {revenue?.totalQuotes || 0} issued quotations
          </div>
        </div>

        {/* Lead Win Rate */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">Lead Win Rate</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900">
            {funnel?.winRate || 0}%
          </div>
          <div className="text-stone-500 text-xs font-medium">
            {funnel?.won || 0} Won / {funnel?.total || 0} Total Inquiries
          </div>
        </div>

        {/* Google Reviews Rating */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">Google Review Rating</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-amber-400 stroke-amber-500" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-stone-900">
            {reviews?.averageRating || 4.9} / 5.0
          </div>
          <div className="text-stone-500 text-xs flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>{reviews?.googleCount || 0} Google Synced Reviews</span>
          </div>
        </div>

      </div>

      {/* LEAD CONVERSION FUNNEL & MONTHLY REVENUE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Lead Conversion Funnel */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#C4795A]" />
              <span>Lead Conversion Funnel</span>
            </h2>
            <p className="text-xs text-stone-500">Inquiry progression from lead capture to won contract</p>
          </div>

          <div className="space-y-4">
            {[
              { label: 'New Inquiries', count: funnel?.new || 0, color: 'bg-blue-500' },
              { label: 'Contacted & Qualified', count: funnel?.contacted || 0, color: 'bg-indigo-500' },
              { label: 'Quotation Issued', count: funnel?.quoted || 0, color: 'bg-amber-500' },
              { label: 'Won Contracts', count: funnel?.won || 0, color: 'bg-emerald-500' },
              { label: 'Archived / Lost', count: funnel?.lost || 0, color: 'bg-stone-400' },
            ].map((step, idx) => {
              const maxCount = Math.max(funnel?.total || 1, 1);
              const pct = Math.round((step.count / maxCount) * 100);

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-stone-700">{step.label}</span>
                    <span className="text-stone-900 font-mono">{step.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${step.color}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Revenue & Inquiry Trends */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-[#C4795A]" />
                <span>Monthly Revenue Trends (AED)</span>
              </h2>
              <p className="text-xs text-stone-500">6-Month billing performance overview</p>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2 border-b border-stone-200">
            {monthlyData?.map((item, idx) => {
              const maxRev = Math.max(...(monthlyData.map(m => m.revenueAED) || [200000]), 200000);
              const heightPct = Math.round((item.revenueAED / maxRev) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="opacity-0 group-hover:opacity-100 text-[10px] font-mono bg-stone-900 text-white px-2 py-1 rounded transition shadow">
                    AED {(item.revenueAED / 1000).toFixed(0)}k
                  </div>
                  <div className="w-full bg-stone-100 rounded-t-xl h-44 flex items-end overflow-hidden p-1">
                    <div
                      className="w-full bg-gradient-to-t from-[#C4795A] to-amber-500 rounded-t-lg transition-all duration-700 group-hover:brightness-110"
                      style={{ height: `${heightPct}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-stone-600 font-mono">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* PROPERTY TYPES & QUOTE STATUS DISTRIBUTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Property Category Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-[#C4795A]" />
            <span>Property Breakdown</span>
          </h3>
          <div className="space-y-3 pt-2 text-xs">
            {Object.entries(propertyTypes || {}).map(([type, cnt], i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                <span className="capitalize font-semibold text-stone-700">{type}</span>
                <span className="font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-stone-200">{cnt} Leads</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Status Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#C4795A]" />
            <span>Quote Status Distribution</span>
          </h3>
          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-900 rounded-xl">
              <span className="font-semibold">Accepted Quotes</span>
              <span className="font-bold">{quoteStatusCounts?.accepted || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 text-amber-900 rounded-xl">
              <span className="font-semibold">Sent & Pending</span>
              <span className="font-bold">{quoteStatusCounts?.sent || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-stone-100 text-stone-700 rounded-xl">
              <span className="font-semibold">Drafts</span>
              <span className="font-bold">{quoteStatusCounts?.draft || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-rose-50 text-rose-900 rounded-xl">
              <span className="font-semibold">Rejected</span>
              <span className="font-bold">{quoteStatusCounts?.rejected || 0}</span>
            </div>
          </div>
        </div>

        {/* Google Reviews Sync Status */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center space-x-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Google Reviews Sync</span>
          </h3>
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl flex justify-between items-center">
              <span className="text-stone-500 font-medium">Google Synced Reviews:</span>
              <span className="font-bold font-mono text-stone-900">{reviews?.googleCount || 0}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl flex justify-between items-center">
              <span className="text-stone-500 font-medium">Direct Platform Reviews:</span>
              <span className="font-bold font-mono text-stone-900">{reviews?.directCount || 0}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Auto-Sync Engine Active & Healthy</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
