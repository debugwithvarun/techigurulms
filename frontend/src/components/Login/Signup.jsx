import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
    Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight,
    BookOpen, Trophy, Users, CheckCircle
} from 'lucide-react';

const Benefit = ({ icon: Icon, text, delay }) => (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
        className="flex items-center gap-2.5 text-sm text-slate-400">
        <div className="w-6 h-6 bg-indigo-500/15 rounded-lg flex items-center justify-center shrink-0">
            <Icon size={12} className="text-indigo-400" />
        </div>
        {text}
    </motion.div>
);

const Signup = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: credentials, 2: profile
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => {
        setError('');
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleStep1 = (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await register(form.name, form.email, form.password, form.role);
            if (result?.success) {
                if (result.pendingApproval) {
                    navigate('/?registered=pending');
                } else {
                    navigate('/');
                }
            } else {
                setError(result?.message || 'Registration failed');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans bg-[#05070f]">
            {/* ── LEFT PANEL ──────────────────────────────────────────────── */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 xl:w-[55%] relative overflow-hidden p-14">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0c1024] via-[#0f1438] to-[#0a0c20]" />
                <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-indigo-700/15 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-700/10 rounded-full blur-3xl" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                            <span className="text-white font-black text-lg">T</span>
                        </div>
                        <span className="text-white font-black text-xl tracking-tight">TechiGuru</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-8">
                    <div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-5">
                            Free to join
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tight">
                            Start your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                tech career today
                            </span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                            className="text-slate-400 mt-5 text-lg leading-relaxed max-w-md">
                            Join thousands of learners building in-demand skills with expert-led courses.
                        </motion.p>
                    </div>

                    <div className="space-y-3">
                        <Benefit icon={BookOpen} text="Unlimited access to 500+ premium courses" delay={0.6} />
                        <Benefit icon={Trophy} text="Industry-recognised certificates" delay={0.7} />
                        <Benefit icon={Users} text="Community of 50,000+ active learners" delay={0.8} />
                        <Benefit icon={CheckCircle} text="Hands-on projects with real mentors" delay={0.9} />
                    </div>
                </div>

                {/* Stats */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    className="relative z-10 grid grid-cols-3 gap-4">
                    {[['50K+', 'Students'], ['500+', 'Courses'], ['98%', 'Satisfaction']].map(([val, label]) => (
                        <div key={label} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 text-center">
                            <p className="text-2xl font-black text-white">{val}</p>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ── RIGHT PANEL ─────────────────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#08090f] relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.06),transparent_60%)]" />

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg"><span className="text-white font-black">T</span></div>
                        <span className="text-white font-bold">TechiGuru</span>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center gap-3 mb-8">
                        {[1, 2].map(s => (
                            <div key={s} className={`flex items-center gap-2 ${s === step ? 'text-indigo-400' : s < step ? 'text-emerald-400' : 'text-slate-600'}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border ${s === step ? 'border-indigo-500 bg-indigo-500/10' : s < step ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-transparent'}`}>
                                    {s < step ? '✓' : s}
                                </div>
                                <span className="text-xs font-bold hidden sm:block">{s === 1 ? 'Account' : 'Profile'}</span>
                                {s < 2 && <div className="w-12 h-px bg-slate-800" />}
                            </div>
                        ))}
                    </div>

                    <div className="mb-6">
                        <h2 className="text-3xl font-black text-white tracking-tight">
                            {step === 1 ? 'Create account' : 'Your profile'}
                        </h2>
                        <p className="text-slate-500 mt-1.5 text-sm">
                            {step === 1 ? <>Already have an account? <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">Sign in →</Link></> : 'Help us personalize your experience'}
                        </p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            className="bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
                            <span>⚠</span> {error}
                        </motion.div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleStep1} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input type="email" name="email" value={form.email} onChange={handleChange} required
                                        placeholder="you@example.com"
                                        className="w-full h-12 pl-11 pr-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                                        placeholder="Min. 6 characters"
                                        className="w-full h-12 pl-11 pr-12 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                                    <button type="button" onClick={() => setShowPassword(p => !p)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm Password</label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required
                                        placeholder="Repeat password"
                                        className="w-full h-12 pl-11 pr-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                                </div>
                            </div>
                            <button type="submit"
                                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                                Continue <ArrowRight size={15} />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                <div className="relative">
                                    <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input type="text" name="name" value={form.name} onChange={handleChange} required
                                        placeholder="Your full name"
                                        className="w-full h-12 pl-11 pr-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500/60 transition-all" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">I am joining as</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'student', label: '🎓 Student', desc: 'I want to learn' },
                                        { value: 'instructor', label: '🧑‍💻 Instructor', desc: 'I want to teach' }
                                    ].map(r => (
                                        <button key={r.value} type="button" onClick={() => setForm(p => ({ ...p, role: r.value }))}
                                            className={`p-3 rounded-xl border text-left transition-all ${form.role === r.value ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/[0.08] text-slate-500 hover:border-white/20'}`}>
                                            <p className="font-bold text-sm">{r.label}</p>
                                            <p className="text-[11px] mt-0.5 opacity-70">{r.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {form.role === 'instructor' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400/80">
                                    ⚠ Instructor accounts require admin approval before publishing courses.
                                </motion.div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setStep(1)}
                                    className="h-12 px-5 bg-white/5 border border-white/10 text-slate-300 font-bold rounded-xl hover:bg-white/8 transition-all text-sm">
                                    ← Back
                                </button>
                                <button type="submit" disabled={loading}
                                    className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(99,102,241,0.3)] disabled:opacity-50">
                                    {loading ? <><Loader2 size={16} className="animate-spin" />Creating...</> : <>Create Account <ArrowRight size={15} /></>}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/[0.06] flex justify-between items-center">
                        <Link to="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">← Back to home</Link>
                        <p className="text-[11px] text-slate-700">By signing up, you agree to our Terms</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
