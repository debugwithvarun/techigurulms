import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Eye, EyeOff, Loader2, AlertCircle,
  Shield, ChevronRight, UserCheck
} from 'lucide-react';

const HRLogin = () => {
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
      // Only allow headhr (or admin)
      if (!['headhr', 'admin'].includes(data?.role)) {
        setError('Access denied. This portal is for Head HR only.');
        setLoading(false);
        return;
      }
      navigate('/hr-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#0f0a1e' }}>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(135deg, #1a0a3e 0%, #2d1b6e 50%, #1e1148 100%)' }}>

        {/* Decorative orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-white font-black text-xl tracking-tight">TechiGuru</span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-8 backdrop-blur-sm">
            <Shield size={28} className="text-purple-300" />
          </div>
          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Head HR<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              Command Center
            </span>
          </h1>
          <p className="text-purple-200 text-base leading-relaxed max-w-sm">
            Manage internship applications, schedule interviews, assign coordinators, and track your talent pipeline — all in one place.
          </p>

          {/* Feature pills */}
          <div className="mt-8 space-y-3">
            {[
              'View & manage all applications',
              'Schedule interviews with Meet links',
              'Assign Sub HR coordinators',
              'Approve offer letters & certificates',
            ].map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-500/30 border border-purple-400/40 flex items-center justify-center shrink-0">
                  <ChevronRight size={11} className="text-purple-300" />
                </div>
                <span className="text-purple-200 text-sm">{f}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-purple-400 text-xs">© {new Date().getFullYear()} TechiGuru. Authorized access only.</p>
        </div>
      </div>

      {/* ── Right panel — Login form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-white font-black text-lg">TechiGuru</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
              <Shield size={12} /> HEAD HR PORTAL
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Welcome back</h2>
            <p className="text-gray-400 text-sm">Sign in to your HR dashboard</p>
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
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="hr@techiguru.in"
                className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.7)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange} required
                  placeholder="••••••••••"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.7)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              type="submit" disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 mt-2 transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 8px 32px rgba(124,58,237,0.35)' }}>
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Signing in...</>
                : <><Shield size={16} /> Sign In to HR Dashboard</>}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-xs text-gray-600">other portals</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Links to other portals */}
          <div className="grid grid-cols-2 gap-3">
            <Link to="/subhr-login"
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
              <UserCheck size={13} /> Sub HR Login
            </Link>
            <Link to="/login"
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
              Student Login
            </Link>
          </div>

          <p className="text-center text-xs text-gray-600 mt-6">
            Account not working?{' '}
            <a href="mailto:techiguru.in@gmail.com" className="text-purple-400 hover:text-purple-300">
              Contact admin
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HRLogin;
