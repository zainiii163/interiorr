import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Image as ImageIcon } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MultiImageField from '../components/admin/MultiImageField';

export default function AdminMaterials() {
  const { isAdmin } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'flooring',
    subcategory: '',
    description: '',
    images: [],
    specifications: {},
    pricePerUnit: 0,
    unit: 'sqm',
    inStock: true,
    isFeatured: false,
    order: 0,
    isActive: true,
  });

  const [specInput, setSpecInput] = useState({ key: '', value: '' });

  const fetchMaterials = async () => {
    try {
      const res = await apiFetch('/materials?includeInactive=true');
      if (res.success) setMaterials(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      name: '',
      category: 'flooring',
      subcategory: '',
      description: '',
      images: [],
      specifications: {},
      pricePerUnit: 0,
      unit: 'sqm',
      inStock: true,
      isFeatured: false,
      order: 0,
      isActive: true,
    });
    setSpecInput({ key: '', value: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (material) => {
    setEditId(material._id);
    setFormData({
      name: material.name,
      category: material.category,
      subcategory: material.subcategory || '',
      description: material.description || '',
      images: material.images || [],
      specifications: material.specifications || {},
      pricePerUnit: material.pricePerUnit || 0,
      unit: material.unit || 'sqm',
      inStock: material.inStock !== false,
      isFeatured: material.isFeatured || false,
      order: material.order || 0,
      isActive: material.isActive !== false,
    });
    setSpecInput({ key: '', value: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiFetch(`/materials/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/materials', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      fetchMaterials();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this material?')) return;
    try {
      await apiFetch(`/materials/${id}`, { method: 'DELETE' });
      fetchMaterials();
    } catch (e) {
      alert(e.message);
    }
  };

  const addSpecification = () => {
    if (specInput.key && specInput.value) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specInput.key]: specInput.value
        }
      });
      setSpecInput({ key: '', value: '' });
    }
  };

  const removeSpecification = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Material Catalog</h1>
          <p className="text-xs text-stone-500 mt-1">Manage flooring, marble, tiles, and fixtures</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Material</span>
        </button>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((material) => (
          <div key={material._id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="aspect-square bg-stone-100 relative">
              {material.images && material.images.length > 0 ? (
                <img
                  src={material.images[0]}
                  alt={material.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-stone-400" />
                </div>
              )}
              {material.isFeatured && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-[#C4795A] text-white text-xs font-bold rounded-full">
                  Featured
                </div>
              )}
              {!material.inStock && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-stone-800 text-white text-xs font-bold rounded-full">
                  Out of Stock
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="text-[10px] text-[#C4795A] font-bold uppercase tracking-wider mb-1">
                {material.category}
              </div>
              <h3 className="font-semibold text-stone-900 text-sm truncate">{material.name}</h3>
              {material.subcategory && (
                <div className="text-xs text-stone-500">{material.subcategory}</div>
              )}
              {material.pricePerUnit > 0 && (
                <div className="mt-2 font-bold text-[#C4795A] text-sm">
                  {material.pricePerUnit.toLocaleString()} {material.currency || 'AED'}/{material.unit}
                </div>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs ${material.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {material.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(material)}
                    className="text-xs text-stone-600 hover:text-[#C4795A]"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(material._id)}
                      className="text-xs text-rose-600 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
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
          <div className="modal-panel max-w-2xl space-y-4 max-h-[92dvh] overflow-y-auto">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              {editId ? 'Edit Material' : 'Add New Material'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Italian Marble"
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
                    <option value="flooring">Flooring</option>
                    <option value="marble">Marble & Stone</option>
                    <option value="tiles">Tiles</option>
                    <option value="fixtures">Fixtures</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Subcategory</label>
                <input
                  type="text"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder="Hardwood, Porcelain, Granite..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the material..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Images</label>
                <MultiImageField
                  images={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                  maxImages={4}
                />
              </div>

              {/* Specifications */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Specifications</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={specInput.key}
                      onChange={(e) => setSpecInput({ ...specInput, key: e.target.value })}
                      placeholder="Key (e.g., Origin)"
                      className="flex-1 px-3 py-2 border rounded-xl"
                    />
                    <input
                      type="text"
                      value={specInput.value}
                      onChange={(e) => setSpecInput({ ...specInput, value: e.target.value })}
                      placeholder="Value (e.g., Italy)"
                      className="flex-1 px-3 py-2 border rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="px-3 py-2 bg-stone-200 rounded-xl font-semibold"
                    >
                      Add
                    </button>
                  </div>
                  {Object.entries(formData.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between bg-stone-50 px-3 py-2 rounded-lg">
                      <span className="font-medium">{key}: {value}</span>
                      <button
                        type="button"
                        onClick={() => removeSpecification(key)}
                        className="text-rose-600 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price</label>
                  <input
                    type="number"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="sqm">sqm</option>
                    <option value="piece">piece</option>
                    <option value="meter">meter</option>
                    <option value="kg">kg</option>
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
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Active</span>
                </label>
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
                  {editId ? 'Update' : 'Add'} Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
