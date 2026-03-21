import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import {
  UserPlus, Trash2, Shield, Users, Mail,
  Eye, EyeOff, Loader2, AlertCircle, CheckCircle,
  RefreshCw, X, Search, UserCheck
} from 'lucide-react';

// ── Create HR Modal ────────────────────────────────────────────────────────────
const CreateHRModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', hrRole: 'subhr',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/admin/hr-users', form);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <UserPlus size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">Create HR Account</h3>
              <p className="text-purple-200 text-xs">Admin access required</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30">
            <X size={15} className="text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <AlertCircle size={15} className="shrink-0" /> {error}
            </div>
          )}

          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'headhr', label: 'Head HR',   icon: Shield, desc: 'Full access' },
                { value: 'subhr',  label: 'Sub HR',    icon: Users,  desc: 'Intern management' },
              ].map(({ value, label, icon: Icon, desc }) => (
                <button key={value} type="button" onClick={() => setForm(p => ({ ...p, hrRole: value }))}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left
                    ${form.hrRole === value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                    ${form.hrRole === value ? 'bg-purple-100' : 'bg-gray-100'}`}>
                    <Icon size={15} className={form.hrRole === value ? 'text-purple-600' : 'text-gray-500'} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${form.hrRole === value ? 'text-purple-700' : 'text-gray-700'}`}>{label}</p>
                    <p className="text-[10px] text-gray-400">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
              placeholder="e.g. Priya Sharma"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-50" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address *</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required
              placeholder="hr@techiguru.in"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-50" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password *</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-3 pr-12 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-50" />
              <button type="button" onClick={() => setShowPwd(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
              Create Account
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ── Main HR Management Tab ─────────────────────────────────────────────────────
const HRManagement = () => {
  const [hrUsers, setHrUsers]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [deleteId, setDeleteId]         = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [search, setSearch]             = useState('');
  const [roleFilter, setRoleFilter]     = useState('all');
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadHRUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/hr-users');
      setHrUsers(data || []);
    } catch (err) {
      showToast('Failed to load HR users', 'error');
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadHRUsers(); }, [loadHRUsers]);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await api.delete(`/admin/hr-users/${id}`);
      setHrUsers(prev => prev.filter(u => u._id !== id));
      setDeleteId(null);
      showToast('HR account removed successfully');
    } catch (err) {
      showToast('Failed to delete user', 'error');
    }
    setDeleting(false);
  };

  const filtered = hrUsers.filter(u => {
    const matchRole   = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const headCount = hrUsers.filter(u => u.role === 'headhr').length;
  const subCount  = hrUsers.filter(u => u.role === 'subhr').length;

  return (
    <div className="space-y-6">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg text-sm font-semibold
              ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">HR Account Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Create and manage Head HR and Sub HR accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadHRUsers}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 shadow-sm">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-200">
            <UserPlus size={15} /> Create HR Account
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total HR Staff',  value: hrUsers.length, icon: Users,     color: '#7c3aed', bg: 'bg-purple-50' },
          { label: 'Head HR',         value: headCount,       icon: Shield,    color: '#4f46e5', bg: 'bg-indigo-50' },
          { label: 'Sub HR',          value: subCount,        icon: UserCheck, color: '#0ea5e9', bg: 'bg-sky-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} mb-3`}>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex-1 shadow-sm">
          <Search size={14} className="text-gray-400" />
          <input type="text" placeholder="Search by name or email..."
            className="flex-1 text-sm outline-none text-gray-700"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'headhr', 'subhr'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all capitalize
                ${roleFilter === r ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              {r === 'headhr' ? 'Head HR' : r === 'subhr' ? 'Sub HR' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-gray-400">
            <Loader2 size={28} className="animate-spin mb-3" />
            <p className="text-sm">Loading HR accounts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-gray-400">
            <Users size={36} className="mb-3 opacity-20" />
            <p className="font-semibold">No HR accounts found</p>
            <p className="text-xs mt-1">Create one using the button above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5 text-left">Name</th>
                  <th className="px-6 py-3.5 text-left">Email</th>
                  <th className="px-6 py-3.5 text-left">Role</th>
                  <th className="px-6 py-3.5 text-left">Created</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                          ${user.role === 'headhr' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Mail size={13} className="shrink-0" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
                        ${user.role === 'headhr'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-sky-50 text-sky-700 border-sky-200'}`}>
                        {user.role === 'headhr' ? <Shield size={11} /> : <Users size={11} />}
                        {user.role === 'headhr' ? 'Head HR' : 'Sub HR'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {deleteId === user._id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-gray-500">Confirm?</span>
                          <button onClick={() => handleDelete(user._id)} disabled={deleting}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 disabled:opacity-50">
                            {deleting ? <Loader2 size={12} className="animate-spin" /> : 'Yes, Delete'}
                          </button>
                          <button onClick={() => setDeleteId(null)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteId(user._id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Important note */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800">
        <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-600" />
        <div>
          <p className="font-bold mb-0.5">Login Portal URLs</p>
          <p className="text-xs leading-relaxed text-amber-700">
            Head HR: <strong>techiguru.in/hr-login</strong> &nbsp;·&nbsp;
            Sub HR: <strong>techiguru.in/subhr-login</strong> &nbsp;·&nbsp;
            Share these links with newly created HR staff.
          </p>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <CreateHRModal
            onClose={() => setShowModal(false)}
            onCreated={() => { loadHRUsers(); showToast('HR account created successfully!'); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HRManagement;
