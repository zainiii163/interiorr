import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Video, Upload } from 'lucide-react';
import { apiFetch, apiBaseUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminMedia() {
  const { isAdmin } = useAuth();
  const [media, setMedia] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    type: 'image',
    title: '',
    url: '',
    thumbnail: '',
    placement: 'home',
    order: 0,
  });

  const fetchMedia = async () => {
    try {
      const res = await apiFetch('/media');
      if (res.success) setMedia(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      type: 'image',
      title: '',
      url: '',
      thumbnail: '',
      placement: 'home',
      order: 0,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditId(item._id);
    setFormData({
      type: item.type || 'image',
      title: item.title || '',
      url: item.url || '',
      thumbnail: item.thumbnail || '',
      placement: item.placement || 'home',
      order: item.order || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiFetch(`/media/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/media', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      fetchMedia();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this media item?')) return;
    try {
      await apiFetch(`/media/${id}`, { method: 'DELETE' });
      fetchMedia();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const isVideo = file.type.startsWith('video/');
      const formData = new FormData();
      formData.append(isVideo ? 'file' : 'image', file);

      const res = await fetch(`${apiBaseUrl}${isVideo ? '/uploads/media' : '/uploads/image'}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          type: isVideo ? 'video' : 'image',
          url: data.data.url,
          thumbnail: isVideo ? (prev.thumbnail || '') : data.data.url,
        }));
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (e) {
      alert('Upload failed: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div className="min-w-0">
          <h1 className="font-serif font-bold text-stone-900">Media Library</h1>
          <p className="text-xs text-stone-500 mt-1">Manage images and videos for the website</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media</span>
        </button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map((item) => (
          <div key={item._id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="aspect-video bg-stone-100 relative">
              {item.type === 'video' ? (
                <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <Video className="w-12 h-12 text-stone-600" />
                  )}
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded text-white text-xs">
                {item.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-stone-900 text-sm truncate">{item.title || 'Untitled'}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-stone-500 capitalize">{item.placement}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="text-xs text-stone-600 hover:text-[#C4795A]"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-xs text-rose-600 hover:text-rose-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-lg space-y-4">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              {editId ? 'Edit Media' : 'Add New Media'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Media Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Media title"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">URL / Upload</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500">or</span>
                    <label className="flex items-center gap-2 cursor-pointer text-[#C4795A] hover:underline">
                      <Upload className="w-4 h-4" />
                      <span>Upload file</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {uploading && <span className="text-stone-500">Uploading...</span>}
                  </div>
                </div>
              </div>

              {formData.type === 'video' && (
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Thumbnail URL</label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-stone-700 mb-1">Placement</label>
                <select
                  value={formData.placement}
                  onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="home">Home Page</option>
                  <option value="about">About Page</option>
                  <option value="global">Global</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 text-stone-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-terracotta px-5 py-2 rounded-xl font-semibold"
                >
                  {editId ? 'Update' : 'Add'} Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
