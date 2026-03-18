import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight,
  BookOpen, Trophy, Users, CheckCircle, Shield, RefreshCw, KeyRound
} from 'lucide-react';

// ── Re-use Neural Canvas (same as Login) ──────────────────────────────────────
const NeuralCanvas = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.ox = this.x; this.oy = this.y;
        this.vx = 0; this.vy = 0;
        this.r = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.4 + 0.15;
        this.pulse = Math.random() * Math.PI * 2;
        this.speed = 0.008 + Math.random() * 0.008;
      }
      update() {
        this.pulse += this.speed;
        const dx = mouse.current.x - this.x, dy = mouse.current.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ATTRACT = 130, REPEL = 55;
        if (dist < REPEL) { const f = (REPEL - dist) / REPEL * 0.08; this.vx -= (dx / dist) * f; this.vy -= (dy / dist) * f; }
        else if (dist < ATTRACT) { const f = (dist - REPEL) / (ATTRACT - REPEL) * 0.012; this.vx += (dx / dist) * f; this.vy += (dy / dist) * f; }
        this.vx += (this.ox - this.x) * 0.015; this.vy += (this.oy - this.y) * 0.015;
        this.vx *= 0.88; this.vy *= 0.88; this.x += this.vx; this.y += this.vy;
      }
      draw() {
        const pa = this.alpha + Math.sin(this.pulse) * 0.1;
        const dx = mouse.current.x - this.x, dy = mouse.current.y - this.y;
        const near = Math.sqrt(dx * dx + dy * dy) < 100;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r * (near ? 1.6 : 1), 0, Math.PI * 2);
        ctx.fillStyle = near ? `rgba(192,132,252,${pa * 1.4})` : `rgba(139,92,246,${pa})`; ctx.fill();
      }
    }

    const init = () => { resize(); particles = Array.from({ length: 70 }, () => new Particle()); };

    const drawEdges = () => {
      for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const nearMouse = Math.sqrt((mouse.current.x - a.x) ** 2 + (mouse.current.y - a.y) ** 2) < 130
            || Math.sqrt((mouse.current.x - b.x) ** 2 + (mouse.current.y - b.y) ** 2) < 130;
          const alpha = (1 - dist / 120) * (nearMouse ? 0.3 : 0.08);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = nearMouse ? `rgba(192,132,252,${alpha})` : `rgba(109,40,217,${alpha})`;
          ctx.lineWidth = nearMouse ? 0.7 : 0.4; ctx.stroke();
        }
      }
    };

    const drawCursorWeb = () => {
      particles.map(p => ({ p, d: Math.sqrt((mouse.current.x - p.x) ** 2 + (mouse.current.y - p.y) ** 2) }))
        .filter(o => o.d < 110).sort((a, b) => a.d - b.d).slice(0, 6)
        .forEach(({ p, d }) => {
          ctx.beginPath(); ctx.moveTo(mouse.current.x, mouse.current.y); ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(192,132,252,${(1 - d / 110) * 0.55})`; ctx.lineWidth = 0.8; ctx.stroke();
        });
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H); drawEdges();
      particles.forEach(p => { p.update(); p.draw(); }); drawCursorWeb();
      animRef.current = requestAnimationFrame(loop);
    };

    init(); loop();
    const onMove = e => { mouse.current.x = e.clientX; mouse.current.y = e.clientY; };
    const onLeave = () => { mouse.current.x = -999; mouse.current.y = -999; };
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', () => { resize(); particles.forEach(p => p.reset()); });
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.65 }} />;
};

// ── OTP Box Input ──────────────────────────────────────────────────────────────
const OtpBoxes = ({ value, onChange, length = 6 }) => {
  const inputs = useRef([]);
  const vals = value.split('').concat(Array(length).fill('')).slice(0, length);

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const arr = vals.slice(); arr[idx] = ''; onChange(arr.join(''));
      if (idx > 0 && !vals[idx]) inputs.current[idx - 1]?.focus();
      else if (vals[idx]) inputs.current[idx]?.focus();
      else if (idx > 0) inputs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && idx > 0) inputs.current[idx - 1]?.focus();
    else if (e.key === 'ArrowRight' && idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const handleChange = (e, idx) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = vals.slice(); arr[idx] = char; onChange(arr.join(''));
    if (char && idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted.padEnd(length, '').slice(0, length));
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex gap-2.5 justify-center">
      {Array.from({ length }, (_, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="relative">
          <input
            ref={el => inputs.current[i] = el}
            type="text" inputMode="numeric" maxLength={1}
            value={vals[i]} onChange={e => handleChange(e, i)} onKeyDown={e => handleKey(e, i)} onPaste={handlePaste}
            className={`w-11 h-14 text-center text-xl font-bold font-mono rounded-xl border-2 outline-none transition-all duration-200
              bg-white/[0.03] text-white caret-violet-400
              ${vals[i]
                ? 'border-violet-400/80 bg-violet-500/8 shadow-[0_0_16px_rgba(139,92,246,0.3)]'
                : 'border-white/[0.1] hover:border-white/20 focus:border-violet-400/60 focus:bg-violet-500/[0.05] focus:shadow-[0_0_12px_rgba(139,92,246,0.18)]'
              }`}
          />
          {vals[i] && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400" />
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ── Password Strength Meter ────────────────────────────────────────────────────
const getStrength = (pw) => {
  let score = 0;
  const checks = {
    length:  pw.length >= 8,
    long:    pw.length >= 12,
    upper:   /[A-Z]/.test(pw),
    lower:   /[a-z]/.test(pw),
    digit:   /\d/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
  score += checks.length ? 1 : 0;
  score += checks.long   ? 1 : 0;
  score += checks.upper  ? 1 : 0;
  score += checks.lower  ? 1 : 0;
  score += checks.digit  ? 1 : 0;
  score += checks.special ? 1 : 0;

  const level = score <= 1 ? 0 : score <= 2 ? 1 : score <= 3 ? 2 : score <= 4 ? 3 : 4;
  const labels = ['Too weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#a855f7'];
  return { score, level, label: labels[level], color: colors[level], checks };
};

const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const { level, label, color, checks } = getStrength(password);
  const segments = 4;

  const rules = [
    { key: 'length',  text: '8+ characters' },
    { key: 'upper',   text: 'Uppercase letter' },
    { key: 'digit',   text: 'Number' },
    { key: 'special', text: 'Special character (!@#...)' },
  ];

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2.5 space-y-2.5">
      {/* Segmented bar */}
      <div className="flex gap-1.5 items-center">
        {Array.from({ length: segments }, (_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: i < level + 1 ? '100%' : '0%' }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              style={{ background: i < level + 1 ? color : 'transparent' }}
            />
          </div>
        ))}
        <span className="text-[11px] font-bold ml-1 whitespace-nowrap" style={{ color, fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
      </div>
      {/* Rule checklist */}
      <div className="grid grid-cols-2 gap-1">
        {rules.map(r => (
          <div key={r.key} className="flex items-center gap-1.5">
            <motion.div
              animate={{ scale: checks[r.key] ? [1.3, 1] : 1 }}
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                checks[r.key] ? 'bg-purple-400/20 border border-purple-400/50' : 'bg-white/[0.04] border border-white/10'
              }`}
            >
              {checks[r.key] && <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
            </motion.div>
            <span className={`text-[10px] transition-colors ${checks[r.key] ? 'text-slate-400' : 'text-slate-600'}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>{r.text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ── Step Indicator ─────────────────────────────────────────────────────────────
const StepIndicator = ({ current, total }) => {
  const labels = ['Credentials', 'Verify Email', 'Profile'];
  return (
    <div className="flex items-center gap-0 mb-8">
      {Array.from({ length: total }, (_, i) => i + 1).map((s, idx) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300
              ${s === current ? 'border-violet-400/60 bg-violet-400/10 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
              : s < current  ? 'border-purple-400/50 bg-purple-400/10 text-purple-300'
                             : 'border-white/10 text-slate-600'}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {s < current ? '✓' : s}
            </div>
            <span className={`text-[9px] mt-1 transition-colors ${s === current ? 'text-violet-400' : s < current ? 'text-purple-400' : 'text-slate-700'}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>{labels[idx]}</span>
          </div>
          {s < total && (
            <div className="flex-1 mx-1.5 mb-4">
              <div className="h-px w-full bg-white/[0.06] relative overflow-hidden">
                <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-400/50 to-violet-400/50"
                  initial={{ scaleX: 0 }} animate={{ scaleX: s < current ? 1 : 0 }}
                  style={{ transformOrigin: 'left' }} transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ── Shared Atoms ───────────────────────────────────────────────────────────────
const PrimaryButton = ({ children, type = 'button', disabled, onClick, className = '' }) => (
  <button type={type} disabled={disabled} onClick={onClick}
    className={`w-full h-12 relative overflow-hidden rounded-xl font-bold text-sm transition-all duration-200
      bg-gradient-to-r from-violet-600/25 to-purple-600/15
      border border-violet-500/40 text-violet-200
      hover:border-violet-400/70 hover:from-violet-600/35 hover:to-purple-600/25
      hover:shadow-[0_0_28px_rgba(139,92,246,0.25)]
      disabled:opacity-30 disabled:cursor-not-allowed
      flex items-center justify-center gap-2 ${className}`}
    style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '0.04em' }}
  >
    {children}
  </button>
);

const AlertBanner = ({ type, msg }) => {
  if (!msg) return null;
  const s = {
    error:   'bg-red-500/[0.08] border-red-500/25 text-red-400',
    success: 'bg-purple-500/[0.08] border-purple-500/25 text-purple-400',
    warn:    'bg-amber-500/[0.08] border-amber-500/25 text-amber-400',
  };
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      className={`border rounded-xl px-4 py-3 text-sm mb-4 flex items-start gap-2.5 ${s[type]}`}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <span className="mt-0.5 shrink-0">{type === 'error' ? '⚠' : '✓'}</span><span>{msg}</span>
    </motion.div>
  );
};

const InputField = ({ icon: Icon, label, rightLabel, type = 'text', name, value, onChange, placeholder, required, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      {label && <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{label}</label>}
      {rightLabel}
    </div>
    <div className="relative group">
      {Icon && <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" />}
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className={`w-full h-12 ${Icon ? 'pl-11' : 'pl-4'} pr-4 bg-white/[0.03] border border-white/[0.08] rounded-xl
          text-white placeholder:text-slate-700 text-sm
          focus:outline-none focus:border-violet-400/40 focus:bg-white/[0.05]
          focus:shadow-[0_0_0_3px_rgba(139,92,246,0.06)] transition-all duration-200`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      />
      {children}
    </div>
  </div>
);

const Benefit = ({ icon: Icon, text, delay }) => (
  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
    className="flex items-center gap-3 text-sm text-slate-400">
    <div className="w-6 h-6 bg-violet-400/8 rounded-lg flex items-center justify-center shrink-0 border border-violet-400/10">
      <Icon size={12} className="text-violet-400" />
    </div>
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>{text}</span>
  </motion.div>
);

// ── Main Signup ────────────────────────────────────────────────────────────────
const Signup = () => {
  const { sendSignupOTP, verifyAndRegister } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  const handleChange = e => { setError(''); setForm(p => ({ ...p, [e.target.name]: e.target.value })); };

  const startCountdown = () => {
    setCountdown(60);
    const t = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; }), 1000);
  };

  const handleStep1 = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    const { level } = getStrength(form.password);
    if (level < 2) { setError('Please choose a stronger password'); return; }
    setLoading(true); setError('');
    const result = await sendSignupOTP(form.email);
    setLoading(false);
    if (result.success) { setSuccess(`Code sent to ${form.email}`); setStep(2); startCountdown(); }
    else setError(result.message);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.replace(/\s/g, '').length !== 6) { setError('Please enter the 6-digit code'); return; }
    setError(''); setStep(3);
  };

  const handleResend = async () => {
    setResendLoading(true); setError(''); setSuccess('');
    const result = await sendSignupOTP(form.email);
    setResendLoading(false);
    if (result.success) { setSuccess('New code sent!'); startCountdown(); }
    else setError(result.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    const result = await verifyAndRegister(form.name, form.email, form.password, form.role, otp);
    setLoading(false);
    if (result?.success) navigate(result.pendingApproval ? '/?registered=pending' : '/');
    else {
      setError(result?.message || 'Registration failed');
      if (result?.message?.toLowerCase().includes('otp')) setStep(2);
    }
  };

  const pwStrength = getStrength(form.password);

  return (
    <div className="min-h-screen flex" style={{ background: '#03050d', fontFamily: "'JetBrains Mono', monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap');`}</style>

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[48%] xl:w-[52%] relative overflow-hidden p-14">
        <NeuralCanvas />
        <div className="absolute inset-0 bg-gradient-to-br from-[#03050d] via-[#060a18] to-[#03050d]" />
        <div className="absolute top-1/3 -left-24 w-96 h-96 bg-violet-600/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-8 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-400/10 border border-violet-400/25 flex items-center justify-center">
            <span className="text-violet-400 font-black text-base" style={{ fontFamily: "'Syne', sans-serif" }}>T</span>
          </div>
          <span className="text-white font-black text-lg tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Techi<span className="text-violet-400">guru</span>
          </span>
        </div>

        {/* Copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 border rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-5
                bg-purple-400/[0.06] border-purple-400/20 text-purple-400"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Free to join
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              Start your<br />
              <span style={{ background: 'linear-gradient(120deg,#8b5cf6,#d946ef)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                tech career
              </span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-slate-400 mt-4 leading-relaxed max-w-sm" style={{ fontSize: '0.85rem' }}>
              Join thousands of learners building in-demand skills with expert-led courses.
            </motion.p>
          </div>

          {/* Verified badge */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}
            className="flex items-center gap-3 bg-violet-400/[0.05] border border-violet-400/15 rounded-2xl px-5 py-4">
            <div className="w-9 h-9 bg-violet-400/10 rounded-xl flex items-center justify-center shrink-0 border border-violet-400/20">
              <Shield size={15} className="text-violet-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>OTP-Verified Signup</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Only real emails can register</p>
            </div>
          </motion.div>

          <div className="space-y-3">
            <Benefit icon={BookOpen}     text="Access 500+ premium courses instantly" delay={0.6} />
            <Benefit icon={Trophy}       text="Industry-recognised certificates"       delay={0.7} />
            <Benefit icon={Users}        text="Community of 50,000+ learners"          delay={0.8} />
            <Benefit icon={CheckCircle}  text="Hands-on projects with real mentors"    delay={0.9} />
          </div>
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="relative z-10 grid grid-cols-3 gap-3">
          {[['50K+', 'Students'], ['500+', 'Courses'], ['98%', 'Satisfaction']].map(([val, label]) => (
            <div key={label} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{val}</p>
              <p className="text-slate-600 text-[11px] mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 relative overflow-hidden" style={{ background: '#06080f' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 80%, rgba(139,92,246,0.07), transparent)' }} />

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
          className="w-full max-w-md relative">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-violet-400/10 border border-violet-400/25 flex items-center justify-center">
              <span className="text-violet-400 font-black text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>T</span>
            </div>
            <span className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Techiguru</span>
          </div>

          <StepIndicator current={step} total={3} />

          <div className="mb-6">
            <h2 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              {step === 1 ? 'Create account' : step === 2 ? 'Verify email' : 'Your profile'}
            </h2>
            <p className="text-slate-500 mt-1.5 text-sm">
              {step === 1 ? <><span>Have an account? </span><Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">Sign in →</Link></>
                : step === 2 ? `Enter the 6-digit code sent to ${form.email}`
                : 'Almost there — tell us about yourself'}
            </p>
          </div>

          <AnimatePresence>
            {error   && <AlertBanner key="err" type="error"   msg={error} />}
            {success && <AlertBanner key="suc" type="success" msg={success} />}
          </AnimatePresence>

          <AnimatePresence mode="wait">

            {/* ── Step 1 ── */}
            {step === 1 && (
              <motion.form key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={handleStep1} className="space-y-4">
                <InputField icon={Mail} label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />

                <div>
                  <InputField icon={Lock} label="Password"
                    type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                    placeholder="Min. 8 characters" required>
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </InputField>
                  {form.password && <PasswordStrength password={form.password} />}
                </div>

                <InputField icon={Lock} label="Confirm Password"
                  type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                  placeholder="Repeat password" required>
                  <button type="button" onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  {/* Match indicator */}
                  {form.confirmPassword && (
                    <div className={`absolute right-10 top-1/2 -translate-y-1/2 text-xs font-bold ${form.password === form.confirmPassword ? 'text-purple-400' : 'text-red-400'}`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {form.password === form.confirmPassword ? '✓' : '✗'}
                    </div>
                  )}
                </InputField>

                <div className="pt-1">
                  <PrimaryButton type="submit" disabled={loading}>
                    {loading ? <><Loader2 size={14} className="animate-spin" />Sending code…</> : <>Send Verification Code <ArrowRight size={14} /></>}
                  </PrimaryButton>
                </div>
              </motion.form>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <motion.form key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOTP} className="space-y-6">

                <div className="flex items-center gap-3 bg-violet-400/[0.04] border border-violet-400/12 rounded-xl px-4 py-3.5">
                  <Mail size={14} className="text-violet-400 shrink-0" />
                  <p className="text-slate-400 text-sm">Code sent to <span className="text-white font-semibold">{form.email}</span></p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em] block text-center"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>Enter 6-digit verification code</label>
                  <OtpBoxes value={otp} onChange={setOtp} />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem' }}>Didn't receive it?</span>
                  {countdown > 0
                    ? <span className="text-slate-600 font-mono text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Resend in {countdown}s</span>
                    : <button type="button" onClick={handleResend} disabled={resendLoading}
                        className="text-violet-400 font-semibold hover:text-violet-300 transition-colors flex items-center gap-1.5 disabled:opacity-40 text-sm"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {resendLoading ? <><RefreshCw size={12} className="animate-spin" />Sending…</> : 'Resend code'}
                      </button>
                  }
                </div>

                <div className="flex gap-2.5">
                  <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); setSuccess(''); }}
                    className="h-12 px-5 bg-white/[0.04] border border-white/[0.08] text-slate-400 font-bold rounded-xl hover:bg-white/[0.07] transition-all text-sm"
                    style={{ fontFamily: "'Syne', sans-serif" }}>← Back</button>
                  <PrimaryButton type="submit" disabled={otp.replace(/\s/g, '').length !== 6} className="flex-1 w-auto">
                    Verify <ArrowRight size={14} />
                  </PrimaryButton>
                </div>
              </motion.form>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <motion.form key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit} className="space-y-4">
                <InputField icon={User} label="Full Name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Joining as</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { value: 'student',    emoji: '🎓', label: 'Student',    desc: 'I want to learn' },
                      { value: 'instructor', emoji: '🧑‍💻', label: 'Instructor', desc: 'I want to teach' },
                    ].map(r => (
                      <button key={r.value} type="button" onClick={() => setForm(p => ({ ...p, role: r.value }))}
                        className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                          form.role === r.value
                            ? 'border-violet-400/50 bg-violet-400/[0.06] shadow-[0_0_14px_rgba(139,92,246,0.08)]'
                            : 'border-white/[0.07] text-slate-500 hover:border-white/15'
                        }`}>
                        <p className="font-bold text-sm text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{r.emoji} {r.label}</p>
                        <p className="text-[11px] mt-0.5 text-slate-500">{r.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {form.role === 'instructor' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="bg-amber-500/[0.06] border border-amber-500/18 rounded-xl p-3.5 text-[11px] text-amber-400/80"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      ⚠ Instructor accounts require admin approval before publishing courses.
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-2.5 pt-1">
                  <button type="button" onClick={() => { setStep(2); setError(''); }}
                    className="h-12 px-5 bg-white/[0.04] border border-white/[0.08] text-slate-400 font-bold rounded-xl hover:bg-white/[0.07] transition-all text-sm"
                    style={{ fontFamily: "'Syne', sans-serif" }}>← Back</button>
                  <PrimaryButton type="submit" disabled={loading} className="flex-1 w-auto">
                    {loading ? <><Loader2 size={14} className="animate-spin" />Creating…</> : <>Create Account <ArrowRight size={14} /></>}
                  </PrimaryButton>
                </div>
              </motion.form>
            )}

          </AnimatePresence>

          <div className="mt-7 pt-5 border-t border-white/[0.05] flex justify-between items-center">
            <Link to="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">← Back to home</Link>
            <p className="text-[11px] text-slate-700">By signing up you agree to our Terms</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;