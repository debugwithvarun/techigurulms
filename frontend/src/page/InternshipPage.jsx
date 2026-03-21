import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, CheckCircle, AlertCircle, Loader2, Briefcase,
  GraduationCap, Award, Clock, Users, Star, ArrowRight,
  Code, Globe, Zap, BookOpen, FileText, Upload, X, Lock, Mail, User, Phone,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ── Shared input style ───────────────────────────────────────────────────────────
const inputClass = `w-full px-4 py-3.5 rounded-xl
  bg-white/[0.03] border border-white/[0.1] text-white
  placeholder:text-slate-600 text-sm
  focus:outline-none focus:border-violet-400/50 focus:bg-white/[0.06]
  focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)]
  transition-all duration-200`;

// ── Constants ────────────────────────────────────────────────────────────────────
const ROLES = [
  'Full Stack Developer (MERN)', 'Frontend Developer', 'Backend Developer',
  'Data Science / AI‑ML', 'DevOps / Cloud', 'UI/UX Designer',
  'Digital Marketing', 'Business Development', 'HR & Operations', 'Content Writing',
];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'];

const PERKS = [
  { icon: Award,         title: 'Industry Certificate', sub: 'Recognized by 500+ companies' },
  { icon: GraduationCap, title: 'Expert Mentorship',    sub: 'Dedicated senior assigned' },
  { icon: Briefcase,     title: 'Real Projects',        sub: 'Ship products you can showcase' },
  { icon: Clock,         title: '2–6 Month Duration',   sub: 'Hybrid / remote friendly' },
  { icon: CheckCircle,   title: 'Letter of Recommendation', sub: 'Personalized & detailed' },
  { icon: Star,          title: 'Pre-Placement Offer',  sub: 'Top performers considered' },
];

const OPEN_ROLES = [
  { icon: Code,     title: 'Full Stack',    stack: 'React · Node · MongoDB', color: '#6366f1' },
  { icon: Globe,    title: 'Frontend',      stack: 'React · TypeScript',     color: '#8b5cf6' },
  { icon: Zap,      title: 'Backend',       stack: 'Node · Express',         color: '#a855f7' },
  { icon: BookOpen, title: 'Data Science',  stack: 'Python · TensorFlow',    color: '#d946ef' },
  { icon: Users,    title: 'UI/UX Design',  stack: 'Figma · Research',       color: '#7c3aed' },
  { icon: Globe,    title: 'Marketing',     stack: 'SEO · Content',          color: '#6d28d9' },
];

const card = {
  hidden:  { opacity: 0, y: 18 },
  visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

// ── Application Form ─────────────────────────────────────────────────────────────
const ApplyForm = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '', email: user?.email || '', phone: '',
    college: '', branch: '', year: '', role: '', experience: '', skills: '', whyUs: '',
  });
  const [resume, setResume]     = useState(null);
  const [preview, setPreview]   = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus]     = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 bg-violet-400/[0.08] border border-violet-400/20 rounded-2xl flex items-center justify-center mb-5">
        <Lock size={24} className="text-violet-400" />
      </div>
      <h3 className="text-xl font-black text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Login Required</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-xs">You need to be logged in to submit an application.</p>
      <button onClick={() => navigate('/login')}
        className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl text-sm hover:from-violet-500 hover:to-purple-500 transition-all">
        Sign In to Apply →
      </button>
    </div>
  );

  if (status === 'success') return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-green-400/10 border border-green-400/25 flex items-center justify-center mb-5">
        <CheckCircle size={32} className="text-green-400" />
      </div>
      <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Application Submitted! 🎉</h3>
      <p className="text-slate-400 text-sm max-w-xs mx-auto">Our HR team will review it within 3–5 business days. Confirmation sent to <strong className="text-white">{form.email}</strong>.</p>
    </motion.div>
  );

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile   = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setErrorMsg('File must be under 10 MB'); return; }
    if (!/pdf|doc|docx/i.test(file.name.split('.').pop())) { setErrorMsg('Only PDF, DOC, DOCX'); return; }
    setResume(file); setPreview(file.name); setErrorMsg('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) { setErrorMsg('Please upload your resume'); return; }
    setStatus('loading'); setErrorMsg('');
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('resume', resume);
    try {
      await api.post('/internship/apply', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStatus('success');
    } catch (err) {
      setStatus('error'); setErrorMsg(err.response?.data?.message || 'Submission failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-red-500/[0.08] border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />{errorMsg}
        </motion.div>
      )}

      {/* Personal info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: User,  name: 'fullName', label: 'Full Name *',   placeholder: 'Your full name' },
          { icon: Mail,  name: 'email',    label: 'Email *',        placeholder: 'you@example.com', type: 'email' },
          { icon: Phone, name: 'phone',    label: 'Phone *',        placeholder: '+91 9876543210' },
          { icon: null,  name: 'college',  label: 'College / Uni *', placeholder: 'Institute name' },
          { icon: null,  name: 'branch',   label: 'Branch *',       placeholder: 'e.g. B.Tech CSE' },
        ].map(({ name, label, placeholder, type = 'text' }) => (
          <div key={name} className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
            <input type={type} name={name} value={form[name]} onChange={handleChange} required placeholder={placeholder} className={inputClass} />
          </div>
        ))}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Year of Study *</label>
          <select name="year" value={form.year} onChange={handleChange} required className={inputClass}>
            <option value="">Select year</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Role */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Applying for Role *</label>
        <select name="role" value={form.role} onChange={handleChange} required className={inputClass}>
          <option value="">Select internship role</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Skills & motivation */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Key Skills</label>
        <input name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. React, Node.js, Python, SQL..." className={inputClass} />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Brief Background / Experience</label>
        <textarea rows={3} name="experience" value={form.experience} onChange={handleChange}
          placeholder="Projects, internships, certifications..." className={`${inputClass} resize-none`} />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Why Techiguru?</label>
        <textarea rows={3} name="whyUs" value={form.whyUs} onChange={handleChange}
          placeholder="Tell us why you want to intern with us..." className={`${inputClass} resize-none`} />
      </div>

      {/* Resume upload */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resume / CV *</label>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => document.getElementById('resume-input').click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
            ${dragOver ? 'border-violet-400/60 bg-violet-400/[0.06]' : preview ? 'border-green-400/40 bg-green-400/[0.04]' : 'border-white/[0.08] hover:border-violet-400/30 hover:bg-violet-400/[0.03]'}`}>
          <input id="resume-input" type="file" className="hidden" accept=".pdf,.doc,.docx"
            onChange={e => handleFile(e.target.files[0])} />
          {preview ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-green-400/10 rounded-xl flex items-center justify-center">
                <FileText size={18} className="text-green-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-sm truncate max-w-[200px]">{preview}</p>
                <p className="text-xs text-green-400">Ready to upload ✓</p>
              </div>
              <button type="button" onClick={e => { e.stopPropagation(); setResume(null); setPreview(''); }}
                className="ml-auto w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-red-400/10">
                <X size={12} className="text-slate-400" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-violet-400/[0.08] border border-violet-400/15 rounded-2xl flex items-center justify-center mb-1">
                <Upload size={20} className="text-violet-400" />
              </div>
              <p className="font-semibold text-slate-300 text-sm">Drop your resume here or click to browse</p>
              <p className="text-xs text-slate-600">PDF, DOC, DOCX · Max 10 MB</p>
            </div>
          )}
        </div>
      </div>

      <button type="submit" disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm transition-all
          bg-gradient-to-r from-violet-600 to-purple-600 text-white
          hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_32px_rgba(139,92,246,0.3)]
          disabled:opacity-40 disabled:cursor-not-allowed">
        {status === 'loading'
          ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
          : <><Send size={15} /> Submit Application <ArrowRight size={14} /></>}
      </button>
    </form>
  );
};

// ── Main InternshipPage ──────────────────────────────────────────────────────────
const InternshipPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen font-sans" style={{ background: '#05070f' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-28 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/8 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage:'linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)', backgroundSize:'56px 56px' }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}
            className="inline-flex items-center gap-2 bg-green-400/[0.08] border border-green-400/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-green-400 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Now Hiring · 2024 Cohort Open
          </motion.div>
          <motion.h1 initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
            className="text-5xl md:text-6xl font-black text-white leading-[1.06] tracking-tight mb-5"
            style={{ fontFamily:"'Syne', sans-serif" }}>
            Launch Your Tech Career<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage:'linear-gradient(120deg,#a78bfa,#f0abfc)' }}>
              with Techiguru Internship
            </span>
          </motion.h1>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Gain hands-on experience on real products, be mentored by senior engineers, and earn
            a certificate that hiring managers recognise.
          </motion.p>
          <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_32px_rgba(139,92,246,0.35)] transition-all text-sm">
              <Briefcase size={17} /> Apply Now <ArrowRight size={16} />
            </button>
            <a href="#roles" className="flex items-center gap-2 px-8 py-4 border border-white/15 text-white font-bold rounded-2xl hover:bg-white/[0.05] transition-all text-sm">
              Explore Roles
            </a>
          </motion.div>
          {/* Stats */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[['500+','Alumni'],['50+','Projects'],['95%','Placement']].map(([v,l]) => (
              <div key={l} className="text-center">
                <p className="text-3xl font-black text-white" style={{ fontFamily:"'Syne', sans-serif" }}>{v}</p>
                <p className="text-slate-500 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Perks ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">What you gain</p>
          <h2 className="text-3xl font-black text-white" style={{ fontFamily:"'Syne', sans-serif" }}>Everything to Build Your Career</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PERKS.map(({ icon:Icon, title, sub }, i) => (
            <motion.div key={title} custom={i} initial="hidden" whileInView="visible" viewport={{ once:true }} variants={card}
              className="flex items-start gap-4 p-6 rounded-2xl border border-white/[0.06] hover:border-violet-400/20 transition-all"
              style={{ background:'#0d0f1e' }}>
              <div className="w-11 h-11 bg-violet-400/[0.08] border border-violet-400/15 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={20} className="text-violet-400" />
              </div>
              <div>
                <p className="font-bold text-white text-sm" style={{ fontFamily:"'Syne', sans-serif" }}>{title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Open Roles ───────────────────────────────────────────────────── */}
      <section id="roles" className="py-20 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">Open positions</p>
            <h2 className="text-3xl font-black text-white" style={{ fontFamily:"'Syne', sans-serif" }}>Internship Roles</h2>
            <p className="text-slate-500 mt-3 max-w-md mx-auto text-sm">Remote-friendly · 2–6 months · Stipend / unpaid</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {OPEN_ROLES.map(({ icon:Icon, title, stack, color }, i) => (
              <motion.div key={title} custom={i} initial="hidden" whileInView="visible" viewport={{ once:true }} variants={card}
                className="group p-6 rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer"
                style={{ background:'#0d0f1e' }}
                onClick={() => setShowForm(true)}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border"
                  style={{ background:`${color}15`, borderColor:`${color}30` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="font-black text-white text-base mb-1" style={{ fontFamily:"'Syne', sans-serif" }}>{title}</h3>
                <p className="text-xs text-slate-500 mb-5">{stack}</p>
                <p className="flex items-center gap-1.5 text-xs font-bold transition-colors" style={{ color }}>
                  Apply for this role <ArrowRight size={12} />
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 py-8 overflow-y-auto"
            style={{ background:'rgba(5,7,15,0.85)', backdropFilter:'blur(8px)' }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale:0.94, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.94, opacity:0 }}
              className="w-full max-w-2xl rounded-3xl border border-white/[0.08] overflow-hidden"
              style={{ background:'#0d0f1e' }}
              onClick={e => e.stopPropagation()}>
              {/* Modal header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.07]"
                style={{ background:'linear-gradient(135deg,#161828,#1a1c35)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-violet-400/[0.1] border border-violet-400/20 rounded-xl flex items-center justify-center">
                    <Briefcase size={16} className="text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base" style={{ fontFamily:"'Syne', sans-serif" }}>Apply for Internship</h3>
                    <p className="text-slate-500 text-xs">Fill out the form — HR reviews within 3–5 days</p>
                  </div>
                </div>
                <button onClick={() => setShowForm(false)}
                  className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all">
                  <X size={15} />
                </button>
              </div>
              <div className="p-8 max-h-[80vh] overflow-y-auto">
                <ApplyForm />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
          className="max-w-3xl mx-auto text-center rounded-3xl p-14 relative overflow-hidden border border-violet-400/10"
          style={{ background:'linear-gradient(135deg,#0f0824,#180e36)' }}>
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage:'linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)', backgroundSize:'42px 42px' }} />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10" style={{ fontFamily:"'Syne', sans-serif" }}>Ready to Begin?</h2>
          <p className="text-slate-400 mb-8 relative z-10 max-w-md mx-auto">Applications reviewed within 3–5 business days. Submit yours today.</p>
          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-2xl hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_32px_rgba(139,92,246,0.3)] transition-all relative z-10">
            <Briefcase size={17} /> Submit Application <ArrowRight size={16} />
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default InternshipPage;
