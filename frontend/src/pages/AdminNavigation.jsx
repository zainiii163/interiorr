import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

const KNOWN_ROUTES = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Projects', path: '/projects' },
  { label: 'Design Styles', path: '/design-styles' },
  { label: 'Reviews', path: '/reviews' },
  { label: 'Contact', path: '/contact' },
  { label: 'Careers', path: '/careers' },
];

const emptyChild = { label: '', path: '', image: '', order: 0, isActive: true };

const emptyForm = {
  label: '',
  path: '/',
  order: 0,
  isActive: true,
  openInNewTab: false,
  placement: 'header',
  menuType: 'link',
  megaMenuSource: 'none',
  megaMenuTitle: '',
  megaMenuCtaLabel: '',
  megaMenuCtaPath: '',
  children: [],
};

export default function AdminNavigation() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('header');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchItems = async () => {
    try {
      const res = await apiFetch(`/navigation?placement=${filter}`);
      if (res.success) setItems(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const openCreate = () => {
    setEditId(null);
    setFormData({ ...emptyForm, placement: filter, order: items.length + 1 });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditId(item._id);
    setFormData({
      label: item.label,
      path: item.path,
      order: item.order,
      isActive: item.isActive,
      openInNewTab: item.openInNewTab,
      placement: item.placement,
      menuType: item.menuType || 'link',
      megaMenuSource: item.megaMenuSource || 'none',
      megaMenuTitle: item.megaMenuTitle || '',
      megaMenuCtaLabel: item.megaMenuCtaLabel || '',
      megaMenuCtaPath: item.megaMenuCtaPath || '',
      children: item.children || [],
    });
    setShowModal(true);
  };

  const applyPreset = (preset) => {
    setFormData((prev) => ({ ...prev, label: preset.label, path: preset.path }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      menuType: formData.menuType,
      megaMenuSource: formData.menuType === 'mega' ? formData.megaMenuSource : 'none',
    };
    try {
      if (editId) {
        await apiFetch(`/navigation/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiFetch('/navigation', { method: 'POST', body: JSON.stringify(payload) });
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this navigation link?')) return;
    try {
      await apiFetch(`/navigation/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      alert(err.message);
    }
  };

  const addChild = () => {
    setFormData((prev) => ({
      ...prev,
      children: [...prev.children, { ...emptyChild, order: prev.children.length + 1 }],
    }));
  };

  const updateChild = (index, field, value) => {
    setFormData((prev) => {
      const children = [...prev.children];
      children[index] = { ...children[index], [field]: value };
      return { ...prev, children };
    });
  };

  const removeChild = (index) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Navigation Menu</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage navbar links and mega menus (Halo-style dropdown with scroll + image preview)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="text-xs border rounded-xl px-3 py-2">
            <option value="header">Header Navbar</option>
            <option value="footer">Footer Quick Links</option>
          </select>
          <button onClick={openCreate} className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Link</span>
          </button>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
        <p><strong>Mega menu:</strong> Set type to &quot;Mega Menu&quot; and choose auto-source (Services, Projects, Design Styles) — sub-links and preview images load from the API.</p>
        <p><strong>Custom mega:</strong> Use &quot;Custom links&quot; to manually add sub-items with optional preview images.</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b">
            <tr>
              <th className="py-3.5 px-4">Label</th>
              <th className="py-3.5 px-4">Path</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Order</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.length > 0 ? items.map((item) => (
              <tr key={item._id} className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-bold text-stone-900">{item.label}</td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500 truncate max-w-[140px]">{item.path}</td>
                <td className="py-3.5 px-4">
                  {item.menuType === 'mega' ? (
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                      Mega · {item.megaMenuSource}
                    </span>
                  ) : (
                    <span className="text-stone-400">Link</span>
                  )}
                </td>
                <td className="py-3.5 px-4">{item.order}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                    {item.isActive ? 'Visible' : 'Hidden'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded bg-stone-100 hover:bg-stone-200"><Edit className="w-3.5 h-3.5" /></button>
                  {isAdmin && (
                    <button onClick={() => handleDelete(item._id)} className="p-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-stone-400">No navigation links yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-xl font-bold">{editId ? 'Edit Link' : 'Add Navigation Link'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Menu Label *</label>
                  <input type="text" required value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Main Path *</label>
                  <input type="text" required value={formData.path} onChange={(e) => setFormData({ ...formData, path: e.target.value })} className="w-full px-3 py-2 border rounded-xl font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Menu Type</label>
                  <select
                    value={formData.menuType}
                    onChange={(e) => setFormData({ ...formData, menuType: e.target.value, megaMenuSource: e.target.value === 'mega' ? 'services' : 'none' })}
                    className="w-full px-3 py-2 border rounded-xl"
                    disabled={formData.placement === 'footer'}
                  >
                    <option value="link">Simple Link</option>
                    <option value="mega">Mega Menu (dropdown panel)</option>
                  </select>
                </div>
                {formData.menuType === 'mega' && (
                  <div>
                    <label className="block font-bold mb-1">Sub-links Source</label>
                    <select value={formData.megaMenuSource} onChange={(e) => setFormData({ ...formData, megaMenuSource: e.target.value })} className="w-full px-3 py-2 border rounded-xl">
                      <option value="services">Auto: All Services</option>
                      <option value="projects">Auto: All Projects</option>
                      <option value="design-styles">Auto: Design Styles</option>
                      <option value="custom">Custom links (manual)</option>
                    </select>
                  </div>
                )}
              </div>

              {formData.menuType === 'mega' && (
                <div className="p-4 rounded-xl bg-stone-50 border space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Panel title (optional)" value={formData.megaMenuTitle} onChange={(e) => setFormData({ ...formData, megaMenuTitle: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
                    <input type="text" placeholder="CTA button label" value={formData.megaMenuCtaLabel} onChange={(e) => setFormData({ ...formData, megaMenuCtaLabel: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                  <input type="text" placeholder="CTA button path" value={formData.megaMenuCtaPath} onChange={(e) => setFormData({ ...formData, megaMenuCtaPath: e.target.value })} className="w-full px-3 py-2 border rounded-xl font-mono" />

                  {formData.megaMenuSource === 'custom' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Custom sub-links</span>
                        <button type="button" onClick={addChild} className="text-[#C4795A] font-bold">+ Add sub-link</button>
                      </div>
                      {formData.children.map((child, i) => (
                        <div key={i} className="grid grid-cols-12 gap-2 items-center">
                          <input type="text" placeholder="Label" value={child.label} onChange={(e) => updateChild(i, 'label', e.target.value)} className="col-span-3 px-2 py-1.5 border rounded-lg" />
                          <input type="text" placeholder="/path" value={child.path} onChange={(e) => updateChild(i, 'path', e.target.value)} className="col-span-4 px-2 py-1.5 border rounded-lg font-mono" />
                          <input type="text" placeholder="Image URL" value={child.image} onChange={(e) => updateChild(i, 'image', e.target.value)} className="col-span-4 px-2 py-1.5 border rounded-lg" />
                          <button type="button" onClick={() => removeChild(i)} className="col-span-1 text-rose-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Sort Order</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Placement</label>
                  <select value={formData.placement} onChange={(e) => setFormData({ ...formData, placement: e.target.value })} className="w-full px-3 py-2 border rounded-xl">
                    <option value="header">Header</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                <span className="font-semibold">Visible on website</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border">Cancel</button>
                <button type="submit" className="btn-terracotta px-4 py-2 rounded-xl font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
