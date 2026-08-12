import React, { useState, useEffect } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['New', 'Reviewing', 'Interview', 'Rejected', 'Hired'];

export default function AdminJobApplications() {
  const { isAdmin } = useAuth();
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');

  const fetchApplications = async () => {
    try {
      const query = filter ? `?status=${encodeURIComponent(filter)}` : '';
      const res = await apiFetch(`/job-applications${query}`);
      if (res.success) setApplications(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await apiFetch(`/job-applications/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      fetchApplications();
      if (selected?._id === id) {
        setSelected((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await apiFetch(`/job-applications/${id}`, { method: 'DELETE' });
      setSelected(null);
      fetchApplications();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Job Applications</h1>
          <p className="text-xs text-stone-500 mt-1">Careers page submissions</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="text-xs border rounded-xl px-3 py-2">
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Position</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {applications.length > 0 ? applications.map((app) => (
                <tr key={app._id} className="hover:bg-stone-50">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900">{app.fullName}</div>
                    <div className="text-stone-400 text-[11px]">{app.email}</div>
                  </td>
                  <td className="py-3.5 px-4">{app.position}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app._id, e.target.value)}
                      className="text-[10px] border rounded-lg px-2 py-1"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button onClick={() => setSelected(app)} className="p-1.5 rounded bg-stone-100 hover:bg-stone-200"><Eye className="w-3.5 h-3.5" /></button>
                    {isAdmin && (
                      <button onClick={() => handleDelete(app._id)} className="p-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700"><Trash2 className="w-3.5 h-3.5" /></button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-stone-400">No applications yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 text-xs">
          {selected ? (
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold">{selected.fullName}</h2>
              <p><span className="font-bold">Position:</span> {selected.position}</p>
              <p><span className="font-bold">Phone:</span> {selected.phone}</p>
              <p><span className="font-bold">Email:</span> {selected.email}</p>
              {selected.experience && <p><span className="font-bold">Experience:</span> {selected.experience}</p>}
              {selected.resumeUrl && (
                <p>
                  <span className="font-bold">Resume:</span>{' '}
                  <a href={selected.resumeUrl} target="_blank" rel="noreferrer" className="text-[#C4795A] underline">View link</a>
                </p>
              )}
              {selected.coverLetter && (
                <div>
                  <span className="font-bold block mb-1">Cover letter</span>
                  <p className="text-stone-600 whitespace-pre-wrap">{selected.coverLetter}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-stone-400 text-center py-8">Select an application to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
