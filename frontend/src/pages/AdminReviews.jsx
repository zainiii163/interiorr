import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  customerName: '',
  authorTitle: 'Client',
  rating: 5,
  reviewText: '',
  source: 'google',
  isFeatured: false,
  isPublished: true,
};

export default function AdminReviews() {
  const { isAdmin } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchReviews = async () => {
    try {
      const res = await apiFetch('/reviews');
      if (res.success) setReviews(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (review) => {
    setEditId(review._id);
    setFormData({
      customerName: review.customerName,
      authorTitle: review.authorTitle || 'Client',
      rating: review.rating,
      reviewText: review.reviewText,
      source: review.source || 'google',
      isFeatured: review.isFeatured,
      isPublished: review.isPublished,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiFetch(`/reviews/${editId}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await apiFetch('/reviews', { method: 'POST', body: JSON.stringify(formData) });
      }
      setShowModal(false);
      fetchReviews();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await apiFetch(`/reviews/${id}`, { method: 'DELETE' });
      fetchReviews();
    } catch (err) {
      alert(err.message);
    }
  };

  const [syncingGoogle, setSyncingGoogle] = useState(false);

  const handleSyncGoogle = async () => {
    setSyncingGoogle(true);
    try {
      const res = await apiFetch('/reviews/sync-google', { method: 'POST' });
      if (res.success) {
        alert(res.message || 'Google Business reviews synced successfully!');
        fetchReviews();
      }
    } catch (err) {
      alert('Failed to sync Google reviews: ' + err.message);
    } finally {
      setSyncingGoogle(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Customer & Google Reviews</h1>
          <p className="text-xs text-stone-500 mt-1">Manage testimonials and auto-synced Google Business Profile reviews</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSyncGoogle}
            disabled={syncingGoogle}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white flex items-center space-x-2 shadow-md transition disabled:opacity-50"
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{syncingGoogle ? 'Syncing...' : 'Sync Google Reviews'}</span>
          </button>
          <button onClick={openCreate} className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md">
            <Plus className="w-4 h-4" />
            <span>Add Review</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
            <tr>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Source</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Review</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {reviews.map((rev) => (
              <tr key={rev._id} className="hover:bg-stone-50">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-stone-900">{rev.customerName || rev.authorName}</div>
                  <div className="text-stone-500">{rev.authorTitle}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    rev.source === 'google' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {rev.source === 'google' ? 'G-Business' : 'Direct'}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current mr-1 text-amber-400" />
                    {rev.rating}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-stone-600 max-w-md truncate">{rev.reviewText || rev.content}</td>
                <td className="py-3.5 px-4 space-x-1">
                  {rev.isFeatured && <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">FEATURED</span>}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${rev.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                    {rev.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button onClick={() => openEdit(rev)} className="p-1.5 rounded bg-stone-100 hover:bg-stone-200"><Edit className="w-3.5 h-3.5" /></button>
                  {isAdmin && (
                  <button onClick={() => handleDelete(rev._id)} className="p-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700"><Trash2 className="w-3.5 h-3.5" /></button>
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
            <h2 className="font-serif text-xl font-bold">{editId ? 'Edit Review' : 'Add Review'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Customer Name *</label>
                  <input type="text" required value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Title</label>
                  <input type="text" value={formData.authorTitle} onChange={(e) => setFormData({ ...formData, authorTitle: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Rating (1–5) *</label>
                <select value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Review Text *</label>
                <textarea rows="4" required value={formData.reviewText} onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} /> Featured on Home</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} /> Published</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-stone-100 font-semibold">Cancel</button>
                <button type="submit" className="btn-terracotta px-4 py-2 rounded-xl font-semibold">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
