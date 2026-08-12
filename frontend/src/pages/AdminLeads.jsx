import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MessageSquare, Phone, ChevronRight } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let queryStr = '?limit=50';
      if (statusFilter) queryStr += `&status=${statusFilter}`;
      if (search) queryStr += `&search=${encodeURIComponent(search)}`;
      
      const res = await apiFetch(`/leads${queryStr}`);
      if (res.success) setLeads(res.data);
    } catch (e) {
      console.error('Error fetching leads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, search]);

  const statuses = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Lead & Inquiry Management</h1>
          <p className="text-xs text-stone-500 mt-1">Track consultation submissions and assign renovation specialists</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#C4795A]"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === '' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Leads
          </button>
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                statusFilter === st ? 'bg-[#C4795A] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Property</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-4 text-stone-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">{lead.fullName}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1">
                        <span>{lead.phone}</span>
                      </div>
                      <div className="text-stone-400 text-[11px]">{lead.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-800">{lead.service}</td>
                    <td className="py-3.5 px-4">{lead.propertyType} ({lead.location})</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        lead.status === 'New' ? 'bg-amber-100 text-amber-800' :
                        lead.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'Quoted' ? 'bg-purple-100 text-purple-800' :
                        lead.status === 'Won' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/leads/${lead._id}`}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-[#C4795A] hover:underline"
                      >
                        <span>Manage & Notes</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-stone-400">
                    {loading ? 'Loading leads...' : 'No matching leads found.'}
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
