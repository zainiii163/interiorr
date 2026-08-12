import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

const emptyForm = { title: '', type: 'Full Time', location: 'Dubai, UAE', description: '', order: 0, isActive: true };

export default function AdminJobOpenings() {
  const { isAdmin } = useAuth();
  const [openings, setOpenings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchOpenings = async () => {
    const res = await apiFetch('/job-openings');
    if (res.success) setOpenings(res.data);
  };

  useEffect(() => { fetchOpenings(); }, []);

  const openCreate = () => { setEditId(null); setFormData({ ...emptyForm, order: openings.length + 1 }); setShowModal(true); };
  const openEdit = (o) => { setEditId(o._id); setFormData({ title: o.title, type: o.type, location: o.location, description: o.description, order: o.order, isActive: o.isActive }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await apiFetch(`/job-openings/${editId}`, { method: 'PUT', body: JSON.stringify(formData) });
    else await apiFetch('/job-openings', { method: 'POST', body: JSON.stringify(formData) });
    setShowModal(false);
    fetchOpenings();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job opening?')) return;
    await apiFetch(`/job-openings/${id}`, { method: 'DELETE' });
    fetchOpenings();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Job Openings</h1>
          <p className="text-xs text-stone-500 mt-1">Positions shown on the public Careers page</p>
        </div>
        <button onClick={openCreate} className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Add Opening</span></button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b">
            <tr>
              <th className="py-3.5 px-4">Position</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {openings.map((o) => (
              <tr key={o._id} className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-bold">{o.title}</td>
                <td className="py-3.5 px-4">{o.type}</td>
                <td className="py-3.5 px-4">{o.location}</td>
                <td className="py-3.5 px-4">{o.isActive ? 'Active' : 'Hidden'}</td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button onClick={() => openEdit(o)} className="p-1.5 rounded bg-stone-100"><Edit className="w-3.5 h-3.5" /></button>
                  {isAdmin && <button onClick={() => handleDelete(o._id)} className="p-1.5 rounded bg-rose-100 text-rose-700"><Trash2 className="w-3.5 h-3.5" /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h2 className="font-serif text-xl font-bold">{editId ? 'Edit Opening' : 'Add Opening'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <input type="text" required placeholder="Job title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              <input type="text" placeholder="Type (Full Time)" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              <textarea rows={3} placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /> Active on Careers page</label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="btn-terracotta px-4 py-2 rounded-xl font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
