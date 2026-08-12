import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, CheckCircle } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ImageUploadField from '../components/admin/ImageUploadField';

export default function AdminProjects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Residential',
    location: 'Dubai, UAE',
    scope: 'Turnkey Villa Fit-out',
    duration: '12 Weeks',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    beforeImage: '',
    afterImage: '',
    isFeatured: false,
    isPublished: true
  });

  const fetchProjects = async () => {
    try {
      const res = await apiFetch('/projects');
      if (res.success) setProjects(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      title: '',
      category: 'Residential',
      location: 'Dubai, UAE',
      scope: 'Turnkey Villa Fit-out',
      duration: '12 Weeks',
      description: '',
      coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      beforeImage: '',
      afterImage: '',
      isFeatured: false,
      isPublished: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (proj) => {
    setEditId(proj._id);
    setFormData({
      title: proj.title,
      category: proj.category,
      location: proj.location,
      scope: proj.scope,
      duration: proj.duration,
      description: proj.description,
      coverImage: proj.coverImage,
      beforeImage: proj.beforeImages?.[0] || '',
      afterImage: proj.afterImages?.[0] || '',
      isFeatured: proj.isFeatured,
      isPublished: proj.isPublished
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      beforeImages: formData.beforeImage ? [formData.beforeImage] : [],
      afterImages: formData.afterImage ? [formData.afterImage] : []
    };

    try {
      if (editId) {
        await apiFetch(`/projects/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiFetch('/projects', { method: 'POST', body: JSON.stringify(payload) });
      }
      setShowModal(false);
      fetchProjects();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete project?')) return;
    try {
      await apiFetch(`/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Project Portfolio Administration</h1>
          <p className="text-xs text-stone-500 mt-1">Manage completed project showcases and Before/After slider images</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
            <tr>
              <th className="py-3.5 px-4">Project Title</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Featured (Max 6)</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium">
            {projects.map((proj) => (
              <tr key={proj._id} className="hover:bg-stone-50 transition">
                <td className="py-3.5 px-4 font-bold text-stone-900">{proj.title}</td>
                <td className="py-3.5 px-4 text-stone-600">{proj.category}</td>
                <td className="py-3.5 px-4 text-stone-600">{proj.location}</td>
                <td className="py-3.5 px-4">
                  {proj.isFeatured ? (
                    <span className="inline-flex items-center space-x-1 text-amber-600 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px]">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Featured</span>
                    </span>
                  ) : (
                    <span className="text-stone-400 text-[10px]">Standard</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    proj.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {proj.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(proj)} className="p-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  {isAdmin && (
                  <button onClick={() => handleDelete(proj._id)} className="p-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              {editId ? 'Edit Project' : 'Create Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Cover Image URL *"
                value={formData.coverImage}
                onChange={(url) => setFormData({ ...formData, coverImage: url })}
              />

              <div className="grid grid-cols-2 gap-3">
                <ImageUploadField
                  label="Before Image URL (Optional)"
                  value={formData.beforeImage}
                  onChange={(url) => setFormData({ ...formData, beforeImage: url })}
                />
                <ImageUploadField
                  label="After Image URL (Optional)"
                  value={formData.afterImage}
                  onChange={(url) => setFormData({ ...formData, afterImage: url })}
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Featured on Home Page (Max 6)</span>
                </label>

                <label className="flex items-center space-x-2 font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  />
                  <span>Published</span>
                </label>
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
