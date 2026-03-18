import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import {
  Eye, EyeOff, Loader2, Mail, Lock, ArrowRight,
  GraduationCap, Shield, Zap, BookOpen, CheckCircle,
  ChevronLeft, KeyRound, Users
} from 'lucide-react';

// ── Neural Cursor Canvas ────────────────────────────────────────────────────────
const NeuralCanvas = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.ox = this.x; this.oy = this.y;
        this.vx = 0; this.vy = 0;
        this.r = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.4 + 0.15;
        this.pulse = Math.random() * Math.PI * 2;
        this.speed = 0.008 + Math.random() * 0.008;
      }
      update() {
        this.pulse += this.speed;
        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ATTRACT = 130, REPEL = 55;

        if (dist < REPEL) {
          const f = (REPEL - dist) / REPEL * 0.08;
          this.vx -= (dx / dist) * f;
          this.vy -= (dy / dist) * f;
        } else if (dist < ATTRACT) {
          const f = (dist - REPEL) / (ATTRACT - REPEL) * 0.012;
          this.vx += (dx / dist) * f;
          this.vy += (dy / dist) * f;
        }

        // Spring back to origin
        this.vx += (this.ox - this.x) * 0.015;
        this.vy += (this.oy - this.y) * 0.015;
        this.vx *= 0.88; this.vy *= 0.88;
        this.x += this.vx; this.y += this.vy;
      }
      draw() {
        const pa = this.alpha + Math.sin(this.pulse) * 0.1;
        const dx = mouse.current.x - this.x, dy = mouse.current.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const near = dist < 100;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * (near ? 1.6 : 1), 0, Math.PI * 2);
        ctx.fillStyle = near
          ? `rgba(192,132,252,${pa * 1.4})`
          : `rgba(139,92,246,${pa})`;
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      particles = Array.from({ length: 70 }, () => new Particle());
    };

    const drawEdges = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const nearMouse = Math.sqrt((mouse.current.x - a.x) ** 2 + (mouse.current.y - a.y) ** 2) < 130
              || Math.sqrt((mouse.current.x - b.x) ** 2 + (mouse.current.y - b.y) ** 2) < 130;
            const alpha = (1 - dist / 120) * (nearMouse ? 0.3 : 0.08);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = nearMouse ? `rgba(192,132,252,${alpha})` : `rgba(109,40,217,${alpha})`;
            ctx.lineWidth = nearMouse ? 0.7 : 0.4;
            ctx.stroke();
          }
        }
      }
    };

    const drawCursorWeb = () => {
      const close = particles
        .map(p => ({ p, d: Math.sqrt((mouse.current.x - p.x) ** 2 + (mouse.current.y - p.y) ** 2) }))
        .filter(o => o.d < 110).sort((a, b) => a.d - b.d).slice(0, 6);
      close.forEach(({ p, d }) => {
        ctx.beginPath();
        ctx.moveTo(mouse.current.x, mouse.current.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(192,132,252,${(1 - d / 110) * 0.55})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      drawEdges();
      particles.forEach(p => { p.update(); p.draw(); });
      drawCursorWeb();
      animRef.current = requestAnimationFrame(loop);
    };

    init();
    loop();

    const onMove = e => { mouse.current.x = e.clientX; mouse.current.y = e.clientY; };
    const onLeave = () => { mouse.current.x = -999; mouse.current.y = -999; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', () => { resize(); particles.forEach(p => p.reset()); });

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.65 }}
    />
  );
};

// ── OTP Box Input ────────────────────────────────────────────────────────────────
const OtpBoxes = ({ value, onChange, length = 6 }) => {
  const inputs = useRef([]);
  const vals = value.split('').concat(Array(length).fill('')).slice(0, length);

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = vals.map((v, i) => i === idx ? '' : v).join('').padEnd(0, '');
      const arr = vals.slice(); arr[idx] = '';
      onChange(arr.join(''));
      if (idx > 0 && !vals[idx]) inputs.current[idx - 1]?.focus();
      else if (vals[idx]) inputs.current[idx]?.focus();
      else if (idx > 0) inputs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && idx > 0) inputs.current[idx - 1]?.focus();
    else if (e.key === 'ArrowRight' && idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const handleChange = (e, idx) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = vals.slice(); arr[idx] = char;
    onChange(arr.join(''));
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
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="relative"
        >
          <input
            ref={el => inputs.current[i] = el}
            type="text" inputMode="numeric" maxLength={1}
            value={vals[i]}
            onChange={e => handleChange(e, i)}
            onKeyDown={e => handleKey(e, i)}
            onPaste={handlePaste}
            className={`w-11 h-14 text-center text-xl font-bold font-mono rounded-xl border-2 outline-none transition-all duration-200
              bg-white/[0.03] text-white caret-violet-400
              ${vals[i]
                ? 'border-violet-400/80 bg-violet-500/8 shadow-[0_0_16px_rgba(139,92,246,0.3)]'
                : 'border-white/[0.1] hover:border-white/20 focus:border-violet-400/60 focus:bg-violet-500/[0.05] focus:shadow-[0_0_12px_rgba(139,92,246,0.18)]'
              }`}
          />
          {vals[i] && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ── Feature Pill ───────────────────────────────────────────────────────────────
const FeaturePill = ({ icon: Icon, text, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-3 py-1.5"
  >
    <Icon size={12} className="text-violet-400" />
    <span className="text-xs text-slate-400 font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{text}</span>
  </motion.div>
);

// ── Role Tab ───────────────────────────────────────────────────────────────────
const RoleTab = ({ role, selected, onClick }) => {
  const cfg = {
    student:    { icon: GraduationCap, label: 'Student',    desc: 'Continue learning' },
    instructor: { icon: Users,         label: 'Instructor', desc: 'Manage courses' },
  }[role];
  const Icon = cfg.icon;
  return (
    <button
      type="button" onClick={() => onClick(role)}
      className={`flex-1 flex items-center gap-2.5 px-3 py-3 rounded-xl border transition-all duration-200 ${
        selected
          ? 'border-violet-400/50 bg-violet-400/[0.06] text-white shadow-[0_0_16px_rgba(139,92,246,0.08)]'
          : 'border-white/[0.07] text-slate-500 hover:border-white/15 hover:text-slate-300'
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-violet-400/15' : 'bg-white/[0.04]'}`}>
        <Icon size={14} className={selected ? 'text-violet-400' : 'text-slate-500'} />
      </div>
      <div className="text-left">
        <p className="font-bold text-sm leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>{cfg.label}</p>
        <p className={`text-[10px] mt-0.5 ${selected ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>{cfg.desc}</p>
      </div>
    </button>
  );
};

// ── Input Field ────────────────────────────────────────────────────────────────
const InputField = ({ icon: Icon, label, rightLabel, type = 'text', name, value, onChange, placeholder, required, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      {label && <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{label}</label>}
      {rightLabel}
    </div>
    <div className="relative group">
      {Icon && <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" />}
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className={`w-full h-12 ${Icon ? 'pl-11' : 'pl-4'} pr-4 bg-white/[0.03] border border-white/[0.08] rounded-xl
          text-white placeholder:text-slate-700 text-sm
          focus:outline-none focus:border-violet-400/40 focus:bg-white/[0.05]
          focus:shadow-[0_0_0_3px_rgba(139,92,246,0.06)]
          transition-all duration-200`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      />
      {children}
    </div>
  </div>
);

// ── Verify Account Panel ───────────────────────────────────────────────────────
const VerifyAccountPanel = ({ prefillEmail, onBack }) => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState(prefillEmail || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sendOTP = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post('/auth/send-verify-otp', { email });
      setStep('otp'); setSuccess('OTP sent! Check your inbox.');
    } catch (err) { setError(err.response?.data?.message || 'Failed to send OTP.'); }
    finally { setLoading(false); }
  };

  const verifyOTP = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post('/auth/verify-account-otp', { email, otp });
      setStep('done');
    } catch (err) { setError(err.response?.data?.message || 'Invalid or expired OTP.'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div key="verify" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="w-full max-w-md">
      <button onClick={onBack} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-sm mb-8" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <ChevronLeft size={15} /> Back to login
      </button>

      {step === 'done' ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
          <div className="w-20 h-20 rounded-full bg-purple-400/10 border border-purple-400/25 flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_rgba(168,85,247,0.12)]">
            <CheckCircle size={34} className="text-purple-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Account Verified!</h2>
          <p className="text-slate-400 text-sm mb-8" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Your account is confirmed. You can now sign in.</p>
          <PrimaryButton onClick={onBack}>Go to Login <ArrowRight size={14} /></PrimaryButton>
        </motion.div>
      ) : (
        <>
          <div className="mb-8">
            <div className="w-11 h-11 rounded-xl bg-violet-400/[0.08] border border-violet-400/20 flex items-center justify-center mb-4">
              <KeyRound size={18} className="text-violet-400" />
            </div>
            <h2 className="text-3xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Verify Account</h2>
            <p className="text-slate-500 mt-2 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {step === 'email' ? 'Enter your email to receive a verification code.' : `Code sent to ${email}`}
            </p>
          </div>
          <AlertBanner type="error" msg={error} />
          {success && step === 'otp' && <AlertBanner type="success" msg={success} />}

          {step === 'email' && (
            <form onSubmit={sendOTP} className="space-y-4">
              <InputField icon={Mail} label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              <PrimaryButton type="submit" disabled={loading}>
                {loading ? <><Loader2 size={14} className="animate-spin" />Sending…</> : <>Send Code <ArrowRight size={14} /></>}
              </PrimaryButton>
            </form>
          )}
          {step === 'otp' && (
            <form onSubmit={verifyOTP} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em] block mb-4 text-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Enter 6-digit code</label>
                <OtpBoxes value={otp} onChange={setOtp} />
              </div>
              <PrimaryButton type="submit" disabled={loading || otp.replace(/\s/g,'').length < 6}>
                {loading ? <><Loader2 size={14} className="animate-spin" />Verifying…</> : <>Verify Account <ArrowRight size={14} /></>}
              </PrimaryButton>
              <button type="button" onClick={() => { setStep('email'); setError(''); setSuccess(''); }}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors py-1"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Resend OTP
              </button>
            </form>
          )}
        </>
      )}
    </motion.div>
  );
};

// ── Shared UI Atoms ─────────────────────────────────────────────────────────────
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
  const styles = {
    error:   'bg-red-500/[0.08] border-red-500/25 text-red-400',
    success: 'bg-purple-500/[0.08] border-purple-500/25 text-purple-400',
    warn:    'bg-amber-500/[0.08] border-amber-500/25 text-amber-400',
  };
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      className={`border rounded-xl px-4 py-3 text-sm mb-4 flex items-start gap-2.5 ${styles[type]}`}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <span className="mt-0.5 shrink-0">{type === 'error' ? '⚠' : type === 'success' ? '✓' : '!'}</span>
      <span>{msg}</span>
    </motion.div>
  );
};

// ── Left Panel Decoration ──────────────────────────────────────────────────────
const LeftPanel = ({ title, subtitle, badge, badgeColor = 'violet', children }) => (
  <div className="hidden lg:flex flex-col justify-between w-[48%] xl:w-[52%] relative overflow-hidden p-14">
    <NeuralCanvas />
    <div className="absolute inset-0 bg-gradient-to-br from-[#03050d] via-[#060a18] to-[#03050d]" />
    <div className="absolute top-1/3 -left-24 w-96 h-96 bg-violet-600/12 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-1/4 right-8 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
    {/* Grid */}
    <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
      style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />

    {/* Logo */}
    <div className="relative z-10 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400/20 to-purple-400/10 border border-violet-400/30 flex items-center justify-center">
        <span className="text-violet-400 font-black text-base" style={{ fontFamily: "'Syne', sans-serif" }}>T</span>
      </div>
      <span className="text-white font-black text-lg tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
        Techi<span className="text-violet-400">guru</span>
      </span>
    </div>

    {/* Main copy */}
    <div className="relative z-10 space-y-8">
      <div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`inline-flex items-center gap-2 border rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-5
            bg-violet-400/[0.06] border-violet-400/20 text-violet-400`}
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          {badge}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {title}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-slate-400 mt-4 text-base leading-relaxed max-w-sm"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem' }}
        >
          {subtitle}
        </motion.p>
      </div>
      {children}
    </div>
  </div>
);

// ── Main Login ─────────────────────────────────────────────────────────────────
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [loginAs, setLoginAs] = useState('student');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerify, setShowVerify] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const handleChange = e => { setError(''); setForm(p => ({ ...p, [e.target.name]: e.target.value })); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const result = await login(form.email, form.password, loginAs);
      if (result?.success) {
        const dest = result.user?.role === 'instructor' || result.user?.role === 'admin'
          ? '/dashboard'
          : redirectTo === '/' ? '/student-dashboard' : redirectTo;
        navigate(dest, { replace: true });
      } else {
        const msg = result?.message || 'Invalid email or password';
        setError(msg);
        if (msg.toLowerCase().includes('verify')) setUnverifiedEmail(form.email);
      }
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const openVerify = () => { setUnverifiedEmail(form.email); setShowVerify(true); setError(''); };

  return (
    <div className="min-h-screen flex" style={{ background: '#03050d', fontFamily: "'JetBrains Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap');
      `}</style>

      <LeftPanel
        badge="Welcome back"
        title={<>Continue your<br /><span style={{ background: 'linear-gradient(120deg,#8b5cf6,#d946ef)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>learning path</span></>}
        subtitle="Access your courses, track progress, and keep building in-demand skills."
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap gap-2">
          <FeaturePill icon={BookOpen}      text="500+ Courses"       delay={0.7} />
          <FeaturePill icon={GraduationCap} text="Expert Instructors" delay={0.8} />
          <FeaturePill icon={Shield}        text="Certificates"       delay={0.9} />
          <FeaturePill icon={Zap}           text="Live Projects"      delay={1.0} />
        </motion.div>

        {/* Testimonial */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5"
        >
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-xs">★</span>)}
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            "TechiGuru's structured curriculum helped me land my first dev role in 6 months — the hands-on projects are exceptional."
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-500/20 border border-violet-400/20 flex items-center justify-center text-violet-300 text-xs font-bold">R</div>
            <div>
              <p className="text-white text-xs font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Rahul Mehta</p>
              <p className="text-slate-600 text-[11px]">Full-Stack Developer @ Infosys</p>
            </div>
          </div>
        </motion.div>
      </LeftPanel>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden" style={{ background: '#06080f' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(139,92,246,0.07), transparent)' }} />

        <AnimatePresence mode="wait">
          {showVerify ? (
            <VerifyAccountPanel key="verify" prefillEmail={unverifiedEmail} onBack={() => setShowVerify(false)} />
          ) : (
            <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-violet-400/10 border border-violet-400/25 flex items-center justify-center">
                  <span className="text-violet-400 font-black text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>T</span>
                </div>
                <span className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Techiguru</span>
              </div>

              <div className="mb-7">
                <h2 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Sign in</h2>
                <p className="text-slate-500 mt-2 text-sm">
                  No account?{' '}
                  <Link to="/signup" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">Create one →</Link>
                </p>
              </div>

              {/* Role selector */}
              <div className="mb-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em] mb-3">Signing in as</p>
                <div className="flex gap-2.5">
                  <RoleTab role="student"    selected={loginAs === 'student'}    onClick={setLoginAs} />
                  <RoleTab role="instructor" selected={loginAs === 'instructor'} onClick={setLoginAs} />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div key="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <AlertBanner type="error" msg={error} />
                    {(error.toLowerCase().includes('verify')) && (
                      <button onClick={openVerify}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 mb-4 -mt-1"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        <KeyRound size={12} /> Verify account now →
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField icon={Mail} label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                <InputField
                  icon={Lock} label="Password"
                  rightLabel={<Link to="/forgot-password" className="text-[10px] text-violet-400/70 hover:text-violet-400 transition-colors" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Forgot?</Link>}
                  type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required
                >
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </InputField>

                <div className="pt-1">
                  <PrimaryButton type="submit" disabled={loading}>
                    {loading ? <><Loader2 size={14} className="animate-spin" />Signing in…</> : <>SIGN IN <ArrowRight size={14} /></>}
                  </PrimaryButton>
                </div>
              </form>

              {/* Verify nudge */}
              <div className="mt-5 p-3.5 rounded-xl border border-amber-500/12 bg-amber-500/[0.04]">
                <p className="text-[11px] text-slate-600 mb-1.5">Account not verified?</p>
                <button onClick={openVerify} className="text-sm font-bold text-amber-400/80 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  style={{ fontFamily: "'Syne', sans-serif" }}>
                  <KeyRound size={13} /> Verify your account →
                </button>
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.05]">
                <Link to="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">← Back to home</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;