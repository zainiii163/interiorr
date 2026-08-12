import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'editor',
  status: 'active',
};

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchUsers = async () => {
    try {
      const res = await apiFetch('/users');
      if (res.success) setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (currentUser?.role !== 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const openCreate = () => {
    setEditId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditId(u._id);
    setFormData({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      status: u.status || (u.isActive ? 'active' : 'inactive'),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (editId && !payload.password) delete payload.password;

    try {
      if (editId) {
        await apiFetch(`/users/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiFetch('/users', { method: 'POST', body: JSON.stringify(payload) });
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user account?')) return;
    try {
      await apiFetch(`/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">User Management</h1>
          <p className="text-xs text-stone-500 mt-1">Admin and editor accounts for the staff portal</p>
        </div>
        <button onClick={openCreate} className="btn-terracotta px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md">
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
            <tr>
              <th className="py-3.5 px-4">Name</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-bold text-stone-900">
                  {u.name}
                  {u._id === currentUser?.id && (
                    <span className="ml-2 text-[10px] text-[#C4795A] font-bold">(YOU)</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-stone-600">{u.email}</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold uppercase">
                    <Shield className="w-3 h-3" />
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    (u.status || (u.isActive ? 'active' : 'inactive')) === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-600'
                  }`}>
                    {u.status || (u.isActive ? 'active' : 'inactive')}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button onClick={() => openEdit(u)} className="p-1.5 rounded bg-stone-100 hover:bg-stone-200">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  {u._id !== currentUser?.id && (
                    <button onClick={() => handleDelete(u._id)} className="p-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
            <h2 className="font-serif text-xl font-bold">{editId ? 'Edit User' : 'Create User'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Full Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold mb-1">Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold mb-1">{editId ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                <input type="password" required={!editId} minLength={8} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Role</label>
                  <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-3 py-2 border rounded-xl">
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-xl">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-stone-100 font-semibold">Cancel</button>
                <button type="submit" className="btn-terracotta px-4 py-2 rounded-xl font-semibold">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
