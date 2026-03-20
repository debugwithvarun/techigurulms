import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Eye, EyeOff, Loader2, AlertCircle,
  Users, ChevronRight, Shield
} from 'lucide-react';

const SubHRLogin = () => {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = e =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form.email, form.password);
      if (!['subhr', 'headhr', 'admin'].includes(data?.role)) {
        setError('Access denied. This portal is for Sub HR coordinators only.');
        setLoading(false);
        return;
      }
      navigate('/subhr-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#080f1a' }}>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2847 50%, #0d1e3a 100%)' }}>

        {/* Orbs */}
        <div className="absolute top-[-80px] right-[-40px] w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.25) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-40px] left-[-60px] w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)' }} />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-900/50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-white font-black text-xl tracking-tight">TechiGuru</span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm"
            style={{ background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.25)' }}>
            <Users size={28} className="text-sky-300" />
          </div>
          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Sub HR<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300">
              Coordinator
            </span>
          </h1>
          <p className="text-blue-200/70 text-base leading-relaxed max-w-sm">
            Manage your assigned interns, track tasks, conduct weekly reviews, and resolve support tickets.
          </p>

          {/* Features */}
          <div className="mt-8 space-y-3">
            {[
              'View your assigned interns',
              'Assign & review intern tasks',
              'Send meet links individually or to groups',
              'Mark weekly performance ratings',
              'Resolve intern support tickets',
            ].map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.35)' }}>
                  <ChevronRight size={11} className="text-sky-300" />
                </div>
                <span className="text-blue-200/70 text-sm">{f}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-blue-400/40 text-xs">© {new Date().getFullYear()} TechiGuru. Authorized access only.</p>
        </div>
      </div>

      {/* ── Right panel — Login form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-white font-black text-lg">TechiGuru</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.25)', color: '#7dd3fc' }}>
              <Users size={12} /> SUB HR COORDINATOR PORTAL
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Welcome back</h2>
            <p className="text-gray-500 text-sm">Sign in to your coordinator dashboard</p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                <AlertCircle size={15} className="shrink-0" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="subhr@techiguru.in"
                className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-700 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(14,165,233,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange} required
                  placeholder="••••••••••"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm text-white placeholder-gray-700 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(14,165,233,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              type="submit" disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 mt-2 disabled:opacity-60 transition-all"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', boxShadow: '0 8px 32px rgba(14,165,233,0.3)' }}>
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Signing in...</>
                : <><Users size={16} /> Sign In to Sub HR Dashboard</>}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-xs text-gray-700">other portals</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link to="/hr-login"
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b7280' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
              <Shield size={13} /> Head HR Login
            </Link>
            <Link to="/login"
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b7280' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
              Student Login
            </Link>
          </div>

          <p className="text-center text-xs text-gray-700 mt-6">
            Account not working?{' '}
            <a href="mailto:techiguru.in@gmail.com" className="text-sky-500 hover:text-sky-400">
              Contact admin
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SubHRLogin;
