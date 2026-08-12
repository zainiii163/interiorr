import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  title: '',
  description: '',
  icon: 'ShieldCheck',
  section: 'promise',
  order: 0,
};

export default function AdminTrustPillars() {
  const { isAdmin } = useAuth();
  const [pillars, setPillars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchPillars = async () => {
    try {
      const res = await apiFetch('/trust-pillars');
      if (res.success) setPillars(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPillars();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setFormData({ ...emptyForm, order: pillars.length + 1 });
    setShowModal(true);
  };

  const openEdit = (pillar) => {
    setEditId(pillar._id);
    setFormData({
      title: pillar.title,
      description: pillar.description || '',
      icon: pillar.icon || 'ShieldCheck',
      section: pillar.section || 'promise',
      order: pillar.order || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiFetch(`/trust-pillars/${editId}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await apiFetch('/trust-pillars', { method: 'POST', body: JSON.stringify(formData) });
      }
      setShowModal(false);
      fetchPillars();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trust pillar?')) return;
    try {
      await apiFetch(`/trust-pillars/${id}`, { method: 'DELETE' });
      fetchPillars();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Trust Pillars</h1>
          <p className="text-xs text-stone-500 mt-1">Promise grid items shown on the homepage</p>
        </div>
        <button onClick={openCreate} className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md">
          <Plus className="w-4 h-4" />
          <span>Add Pillar</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
            <tr>
              <th className="py-3.5 px-4">Title</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4">Section</th>
              <th className="py-3.5 px-4">Icon</th>
              <th className="py-3.5 px-4">Order</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {pillars.map((p) => (
              <tr key={p._id} className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-bold text-stone-900">{p.title}</td>
                <td className="py-3.5 px-4 text-stone-500 max-w-xs truncate">{p.description}</td>
                <td className="py-3.5 px-4 capitalize">{p.section || 'promise'}</td>
                <td className="py-3.5 px-4">{p.icon}</td>
                <td className="py-3.5 px-4">{p.order}</td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded bg-stone-100 hover:bg-stone-200"><Edit className="w-3.5 h-3.5" /></button>
                  {isAdmin && (
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h2 className="font-serif text-xl font-bold">{editId ? 'Edit Pillar' : 'Add Pillar'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Section</label>
                  <select value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} className="w-full px-3 py-2 border rounded-xl">
                    <option value="promise">Promise (homepage grid)</option>
                    <option value="expertise">Expertise (what we do)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Lucide Icon Name</label>
                  <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-3 py-2 border rounded-xl" placeholder="ShieldCheck" />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Order</label>
                <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border text-stone-600">Cancel</button>
                <button type="submit" className="btn-terracotta px-4 py-2 rounded-xl font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
