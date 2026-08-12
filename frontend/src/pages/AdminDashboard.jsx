import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, FileText, FolderKanban, TrendingUp, Plus, ArrowRight, Briefcase,
  Layers, Image as ImageIcon, Star, Package, AlertCircle,
} from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { roleLabel } from '../utils/roles';

export default function AdminDashboard() {
  const { user, canManageCrm, canViewAnalytics, isEditor } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await apiFetch('/dashboard/stats');
        if (res.success && res.data) {
          setStats(res.data);
        } else {
          setError(res.message || 'Failed to load dashboard');
        }
      } catch (e) {
        setError(e.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const overviewLabel = isEditor
    ? 'Content Workspace'
    : user?.role === 'manager'
      ? 'Sales & Operations'
      : 'Executive Overview';

  if (isEditor || stats.dashboardType === 'content') {
    return (
      <div className="space-y-8">
        <div className="bg-stone-900 text-white p-8 rounded-2xl shadow-xl border border-stone-800">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C4795A]">
            {overviewLabel}
          </span>
          <h1 className="font-serif text-3xl font-bold mt-1">Welcome back, {user?.name}</h1>
          <p className="text-stone-400 text-xs mt-1">
            Signed in as {roleLabel(user?.role)} · Manage published site content
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Active Services', value: stats.servicesActive, icon: Layers, to: '/admin/services', color: 'text-[#C4795A] bg-orange-50' },
            { label: 'Published Projects', value: stats.projectsPublished, icon: FolderKanban, to: '/admin/projects', color: 'text-emerald-700 bg-emerald-50' },
            { label: 'Draft Projects', value: stats.projectsDraft, icon: FolderKanban, to: '/admin/projects', color: 'text-amber-700 bg-amber-50' },
            { label: 'Media Assets', value: stats.mediaCount, icon: ImageIcon, to: '/admin/media', color: 'text-blue-700 bg-blue-50' },
            { label: 'Reviews', value: stats.reviewsCount, icon: Star, to: '/admin/reviews', color: 'text-purple-700 bg-purple-50' },
            { label: 'Materials', value: stats.materialsCount, icon: Package, to: '/admin/materials', color: 'text-stone-700 bg-stone-100' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                to={card.to}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between hover:border-[#C4795A]/40 transition"
              >
                <div>
                  <div className="text-stone-500 text-xs font-bold uppercase tracking-wider">{card.label}</div>
                  <div className="font-serif text-3xl font-bold text-stone-900 mt-2">
                    {loading ? '—' : card.value ?? 0}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-serif text-xl font-bold text-stone-900">Quick actions</h2>
          <p className="text-xs text-stone-500 mt-1">Jump into the CMS modules you use most</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/admin/services" className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold">
              Edit Services
            </Link>
            <Link to="/admin/projects" className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-stone-900 text-white">
              Manage Projects
            </Link>
            <Link to="/admin/media" className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-stone-300 text-stone-700">
              Media Library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    leadsToday = 0,
    openLeads = 0,
    myOpenLeads = 0,
    totalProjects = 0,
    quotesCount = 0,
    applicationsNew = 0,
    recentLeads = [],
  } = stats;

  return (
    <div className="space-y-8">
      <div className="bg-stone-900 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-stone-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C4795A]">
            {overviewLabel}
          </span>
          <h1 className="font-serif text-3xl font-bold mt-1">Welcome back, {user?.name}</h1>
          <p className="text-stone-400 text-xs mt-1">
            {loading
              ? 'Loading live metrics…'
              : `Signed in as ${roleLabel(user?.role)} · Live CRM from MongoDB`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {canViewAnalytics && (
            <Link
              to="/admin/analytics"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center space-x-2 shadow-md transition"
            >
              <TrendingUp className="w-4 h-4 text-[#C4795A]" />
              <span>View Analytics</span>
            </Link>
          )}
          {canManageCrm && (
            <Link
              to="/admin/quotes"
              className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Quote</span>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard label="New Leads Today" value={leadsToday} icon={Users} tone="amber" loading={loading} />
        <StatCard label="Open Pipeline" value={openLeads} icon={TrendingUp} tone="terracotta" loading={loading} />
        <StatCard label="Assigned to Me" value={myOpenLeads} icon={Users} tone="blue" loading={loading} />
        <StatCard label="Published Projects" value={totalProjects} icon={FolderKanban} tone="emerald" loading={loading} />
        <StatCard label="Quotations" value={quotesCount} icon={FileText} tone="purple" loading={loading} />
        <StatCard label="New Applications" value={applicationsNew} icon={Briefcase} tone="stone" loading={loading} />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">Recent Customer Leads</h2>
            <p className="text-xs text-stone-500">Live inquiry feed from the website</p>
          </div>
          <Link
            to="/admin/leads"
            className="text-xs font-semibold text-[#C4795A] hover:underline flex items-center space-x-1"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Phone / Email</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-4 font-bold text-stone-900">{lead.fullName}</td>
                    <td className="py-3.5 px-4">
                      <div>{lead.phone}</div>
                      <div className="text-stone-400 text-[11px]">{lead.email}</div>
                    </td>
                    <td className="py-3.5 px-4 capitalize">{lead.leadType || 'consultation'}</td>
                    <td className="py-3.5 px-4">{lead.service || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          lead.status === 'New'
                            ? 'bg-amber-100 text-amber-800'
                            : lead.status === 'Contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : lead.status === 'Quoted'
                                ? 'bg-purple-100 text-purple-800'
                                : lead.status === 'Won'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/admin/leads/${lead._id}`}
                        className="text-[#C4795A] hover:underline font-bold text-[11px]"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-stone-400">
                    {loading ? 'Loading…' : 'No leads recorded yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tone, loading }) {
  const tones = {
    amber: 'bg-amber-50 text-amber-600',
    terracotta: 'bg-orange-50 text-[#C4795A]',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-[#5C7A6B]',
    purple: 'bg-purple-50 text-purple-600',
    stone: 'bg-stone-100 text-stone-600',
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
      <div>
        <div className="text-stone-500 text-xs font-bold uppercase tracking-wider">{label}</div>
        <div
          className={`font-serif text-3xl font-bold mt-2 ${
            tone === 'terracotta' ? 'text-[#C4795A]' : 'text-stone-900'
          }`}
        >
          {loading ? '—' : value}
        </div>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tones[tone]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
