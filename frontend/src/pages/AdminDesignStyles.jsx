import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ImageUploadField from '../components/admin/ImageUploadField';

const emptyForm = {
  name: '',
  tagline: '',
  description: '',
  image: 'https://images.unsplash.com/photo-1618221195710-dd6b41fa6046?auto=format&fit=crop&w=800&q=80',
  characteristics: '',
  order: 0,
  isActive: true,
};

export default function AdminDesignStyles() {
  const { isAdmin } = useAuth();
  const [styles, setStyles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchStyles = async () => {
    try {
      const res = await apiFetch('/design-styles');
      if (res.success) setStyles(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStyles();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setFormData({ ...emptyForm, order: styles.length + 1 });
    setShowModal(true);
  };

  const openEdit = (style) => {
    setEditId(style._id);
    setFormData({
      name: style.name,
      tagline: style.tagline || '',
      description: style.description || '',
      image: style.image || '',
      characteristics: (style.characteristics || style.traits || []).join(', '),
      order: style.order || 0,
      isActive: style.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiFetch(`/design-styles/${editId}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await apiFetch('/design-styles', { method: 'POST', body: JSON.stringify(formData) });
      }
      setShowModal(false);
      fetchStyles();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this design style?')) return;
    try {
      await apiFetch(`/design-styles/${id}`, { method: 'DELETE' });
      fetchStyles();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Design Styles</h1>
          <p className="text-xs text-stone-500 mt-1">Interior design style catalog for the public gallery</p>
        </div>
        <button onClick={openCreate} className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md">
          <Plus className="w-4 h-4" />
          <span>Add Style</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {styles.map((style) => (
          <div key={style._id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="h-36 bg-stone-200">
              {style.image && <img src={style.image} alt={style.name} className="w-full h-full object-cover" />}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-stone-900">{style.name}</h3>
                  <p className="text-xs text-stone-500">{style.tagline}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${style.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                  {style.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => openEdit(style)} className="flex-1 py-2 rounded-lg bg-stone-100 text-xs font-semibold hover:bg-stone-200 flex items-center justify-center gap-1">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                {isAdmin && (
                <button onClick={() => handleDelete(style._id)} className="py-2 px-3 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-xl font-bold">{editId ? 'Edit Design Style' : 'Add Design Style'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Style Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold mb-1">Tagline</label>
                <input type="text" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <ImageUploadField
                label="Image URL"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />
              <div>
                <label className="block font-bold mb-1">Characteristics (comma-separated)</label>
                <input type="text" value={formData.characteristics} onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })} className="w-full px-3 py-2 border rounded-xl" placeholder="clean lines, neutral palette, modern materials" />
              </div>
              <div>
                <label className="block font-bold mb-1">Display Order</label>
                <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /> Active on website</label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-stone-100 font-semibold">Cancel</button>
                <button type="submit" className="btn-terracotta px-4 py-2 rounded-xl font-semibold">Save Style</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
