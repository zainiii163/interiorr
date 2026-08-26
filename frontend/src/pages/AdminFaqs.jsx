import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DragReorderList from '../components/admin/DragReorderList';

const PAGES = [
  { value: 'commercial', label: 'Commercial page' },
  { value: 'consultation', label: 'Consultation page' },
  { value: 'home', label: 'Homepage' },
  { value: 'general', label: 'General / other' },
];

const emptyForm = {
  question: '',
  answer: '',
  page: 'commercial',
  order: 0,
  isActive: true,
};

export default function AdminFaqs() {
  const { isAdmin } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchFaqs = async () => {
    try {
      const res = await apiFetch('/faqs');
      if (res.success) setFaqs(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (faq) => {
    setEditId(faq._id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      page: faq.page || 'general',
      order: faq.order || 0,
      isActive: faq.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiFetch(`/faqs/${editId}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await apiFetch('/faqs', { method: 'POST', body: JSON.stringify(formData) });
      }
      setShowModal(false);
      fetchFaqs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await apiFetch(`/faqs/${id}`, { method: 'DELETE' });
      fetchFaqs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReorder = async (nextItems) => {
    setFaqs(nextItems);
    try {
      await apiFetch('/faqs/reorder', {
        method: 'PATCH',
        body: JSON.stringify({
          items: nextItems.map((item, order) => ({ id: item._id, order })),
        }),
      });
    } catch (e) {
      alert(e.message);
      fetchFaqs();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">FAQs</h1>
          <p className="text-xs text-stone-500 mt-1">
            Questions shown on Commercial, Consultation, and other public pages
          </p>
        </div>
        <button
          onClick={openCreate}
          className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      <DragReorderList
        items={faqs}
        onReorder={handleReorder}
        renderItem={(faq) => (
          <div className="flex items-start justify-between gap-3 text-xs py-1">
            <div className="min-w-0">
              <div className="font-bold text-stone-900">{faq.question}</div>
              <div className="text-stone-500 truncate">{faq.answer}</div>
              <div className="text-[10px] uppercase tracking-wider text-[#C4795A] mt-1">{faq.page}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  faq.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {faq.isActive ? 'Active' : 'Hidden'}
              </span>
              <button
                type="button"
                onClick={() => openEdit(faq)}
                className="p-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => handleDelete(faq._id)}
                  className="p-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      />

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-lg space-y-4">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              {editId ? 'Edit FAQ' : 'Create FAQ'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Answer *</label>
                <textarea
                  required
                  rows="4"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Show on</label>
                <select
                  value={formData.page}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  {PAGES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 font-bold text-stone-700">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Active on public website
              </label>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-terracotta px-4 py-2 rounded-xl font-semibold">
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
