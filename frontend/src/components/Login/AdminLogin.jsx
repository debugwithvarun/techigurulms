import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, Mail, Shield, AlertCircle } from 'lucide-react';

/**
 * Hidden Admin Login Page
 * Route: /secure-admin-signin (not linked anywhere in the UI)
 * Only admins know this URL exists.
 */
const AdminLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => { setError(''); setForm(p => ({ ...p, [e.target.name]: e.target.value })); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // loginAs='instructor' passes admin through (admins pass the instructor check too)
            const result = await login(form.email, form.password, 'instructor');
            if (result?.success) {
                const role = result.user?.role;
                if (role !== 'admin') {
                    setError('Access denied. This login is for administrators only.');
                    // Logout the non-admin who just logged in
                    localStorage.removeItem('userInfo');
                    return;
                }
                navigate('/admin', { replace: true });
            } else {
                setError(result?.message || 'Invalid credentials');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#05070f] flex items-center justify-center px-4 font-sans">
            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            {/* Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full max-w-sm"
            >
                {/* Badge */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-full">
                        <Shield size={14} className="text-rose-400" />
                        <span className="text-rose-400 text-xs font-bold uppercase tracking-widest">Admin Access</span>
                    </div>
                </div>

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-rose-500/20">
                        <span className="text-white font-black text-2xl">T</span>
                    </div>
                    <h1 className="text-2xl font-black text-white">TechiGuru Admin</h1>
                    <p className="text-slate-500 text-sm mt-1">Restricted access — authorised personnel only</p>
                </div>

                {/* Error */}
                {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl px-4 py-3.5 text-sm mb-5">
                        <AlertCircle size={15} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </motion.div>
                )}

                {/* Form */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 space-y-5">
                    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Email</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email" name="email" value={form.email} onChange={handleChange}
                                    required autoComplete="new-email"
                                    placeholder="admin@techiguru.in"
                                    className="w-full h-12 pl-11 pr-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-rose-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                                    required autoComplete="new-password"
                                    placeholder="••••••••••"
                                    className="w-full h-12 pl-11 pr-11 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-rose-500/50 transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(244,63,94,0.25)] disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                            {loading
                                ? <><Loader2 size={16} className="animate-spin" /> Authenticating...</>
                                : <><Shield size={15} /> Access Admin Panel</>}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-700 text-xs mt-6">
                    This page is not linked from the public site. All access attempts are logged.
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
