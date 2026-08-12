import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ImageUploadField from '../components/admin/ImageUploadField';
import DragReorderList from '../components/admin/DragReorderList';

export default function AdminServices() {
  const { isAdmin } = useAuth();
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Renovation',
    shortDescription: '',
    description: '',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    isFeatured: false,
  });

  const fetchServices = async () => {
    try {
      const res = await apiFetch('/services');
      if (res.success) setServices(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      name: '',
      category: 'Renovation',
      shortDescription: '',
      description: '',
      heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      isActive: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (serv) => {
    setEditId(serv._id);
    setFormData({
      name: serv.name,
      category: serv.category,
      shortDescription: serv.shortDescription,
      description: serv.description,
      heroImage: serv.heroImage,
      isActive: serv.isActive,
      isFeatured: serv.isFeatured || false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiFetch(`/services/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/services', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      fetchServices();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await apiFetch(`/services/${id}`, { method: 'DELETE' });
      fetchServices();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleReorder = async (nextItems) => {
    setServices(nextItems);
    try {
      await apiFetch('/services/reorder', {
        method: 'PATCH',
        body: JSON.stringify({
          items: nextItems.map((item, order) => ({ id: item._id, order })),
        }),
      });
    } catch (e) {
      alert(e.message);
      fetchServices();
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Services Catalog Management</h1>
          <p className="text-xs text-stone-500 mt-1">Drag to reorder · configure renovation and fit-out offerings</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <DragReorderList
        items={services}
        onReorder={handleReorder}
        renderItem={(serv) => (
          <div className="flex items-center justify-between gap-3 text-xs py-1">
            <div className="min-w-0">
              <div className="font-bold text-stone-900">{serv.name}</div>
              <div className="text-stone-500 truncate">{serv.category} · {serv.shortDescription}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                serv.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
              }`}>
                {serv.isActive ? 'Active' : 'Inactive'}
              </span>
              <button type="button" onClick={() => handleOpenEdit(serv)} className="p-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700">
                <Edit className="w-3.5 h-3.5" />
              </button>
              {isAdmin && (
                <button type="button" onClick={() => handleDelete(serv._id)} className="p-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              {editId ? 'Edit Service' : 'Create Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Short Summary *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Scope Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <ImageUploadField
                label="Hero Image URL"
                value={formData.heroImage}
                onChange={(url) => setFormData({ ...formData, heroImage: url })}
              />
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
                <label htmlFor="isFeatured" className="font-bold text-stone-700">Featured on Homepage</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <label htmlFor="isActive" className="font-bold text-stone-700">Display on Public Website (Active)</label>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-terracotta px-4 py-2 rounded-xl font-semibold"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
