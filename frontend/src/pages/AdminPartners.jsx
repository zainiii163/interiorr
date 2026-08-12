import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ImageUploadField from '../components/admin/ImageUploadField';

const emptyForm = {
  name: '',
  logo: '',
  website: '',
  order: 0,
  isActive: true,
};

export default function AdminPartners() {
  const { isAdmin } = useAuth();
  const [partners, setPartners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchPartners = async () => {
    try {
      const res = await apiFetch('/partners');
      if (res.success) setPartners(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setFormData({ ...emptyForm, order: partners.length + 1 });
    setShowModal(true);
  };

  const openEdit = (partner) => {
    setEditId(partner._id);
    setFormData({
      name: partner.name,
      logo: partner.logo || '',
      website: partner.website || '',
      order: partner.order || 0,
      isActive: partner.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiFetch(`/partners/${editId}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await apiFetch('/partners', { method: 'POST', body: JSON.stringify(formData) });
      }
      setShowModal(false);
      fetchPartners();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this partner?')) return;
    try {
      await apiFetch(`/partners/${id}`, { method: 'DELETE' });
      fetchPartners();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Brand Partners</h1>
          <p className="text-xs text-stone-500 mt-1">Logos and names shown in the partners section on the home page</p>
        </div>
        <button onClick={openCreate} className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md">
          <Plus className="w-4 h-4" />
          <span>Add Partner</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
            <tr>
              <th className="py-3.5 px-4">Partner</th>
              <th className="py-3.5 px-4">Website</th>
              <th className="py-3.5 px-4">Order</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {partners.map((p) => (
              <tr key={p._id} className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-bold text-stone-900">{p.name}</td>
                <td className="py-3.5 px-4 text-stone-500 truncate max-w-xs">{p.website || '—'}</td>
                <td className="py-3.5 px-4">{p.order}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                    {p.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
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
            <h2 className="font-serif text-xl font-bold">{editId ? 'Edit Partner' : 'Add Partner'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Partner Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <ImageUploadField
                label="Logo URL"
                value={formData.logo}
                onChange={(url) => setFormData({ ...formData, logo: url })}
              />
              <div>
                <label className="block font-bold mb-1">Website</label>
                <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full px-3 py-2 border rounded-xl" placeholder="https://..." />
              </div>
              <div>
                <label className="block font-bold mb-1">Display Order</label>
                <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /> Show on website</label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-stone-100 font-semibold">Cancel</button>
                <button type="submit" className="btn-terracotta px-4 py-2 rounded-xl font-semibold">Save Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
