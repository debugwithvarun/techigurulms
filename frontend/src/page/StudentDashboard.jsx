/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, BookOpen, Star, Upload, CheckCircle, Clock,
  ChevronRight, Play, User, LogOut, Camera,
  FileText, ExternalLink, Shield, Zap, X,
  AlertCircle, RefreshCw, BarChart2, Layers,
  Sparkles, GraduationCap, Bell, Flame, Menu,
  Trophy, Mic, Crown, Medal,
  Settings, Link2, Lock, Globe, Linkedin, Twitter, Youtube,
  Eye, EyeOff, ChevronDown, Trash2, UserCog,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { getImageUrl } from '../config';

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM — Luxury Navy / Champagne Gold
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  navy:      '#06091a',
  navyMid:   '#0b0f2a',
  surface:   'rgba(255,255,255,0.038)',
  border:    'rgba(255,255,255,0.07)',
  gold:      '#c9a84c',
  goldLight: '#e8c97a',
  goldMuted: 'rgba(201,168,76,0.13)',
  goldBorder:'rgba(201,168,76,0.22)',
  text: { primary:'#f0ece0', secondary:'#8892aa', muted:'#4a5270' },
  emerald: { muted:'rgba(16,185,129,0.13)', border:'rgba(16,185,129,0.25)', fg:'#34d399' },
  amber:   { muted:'rgba(245,158,11,0.12)',  border:'rgba(245,158,11,0.22)',  fg:'#fbbf24' },
  red:     { muted:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.22)',   fg:'#f87171' },
  blue:    { muted:'rgba(79,143,234,0.12)',  border:'rgba(79,143,234,0.22)',  fg:'#60a5fa' },
};

const sp = (s=300,d=28) => ({ type:'spring', stiffness:s, damping:d });

// ─────────────────────────────────────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────────────────────────────────────
const GoldLine = () => (
  <div className="flex items-center gap-3 my-5">
    <div className="flex-1 h-px" style={{ background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent)' }}/>
    <div className="w-1 h-1 rounded-full" style={{ background:T.gold }}/>
    <div className="flex-1 h-px" style={{ background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent)' }}/>
  </div>
);

const ProgressArc = ({ progress, size=64 }) => {
  const sw=5, r=(size-sw*2)/2, circ=2*Math.PI*r;
  const offset = circ - (Math.min(progress,100)/100)*circ;
  const c=size/2;
  return (
    <svg width={size} height={size}>
      <defs>
        <linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={T.goldLight}/>
          <stop offset="100%" stopColor={T.gold}/>
        </linearGradient>
      </defs>
      <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw}/>
      <circle cx={c} cy={c} r={r} fill="none" stroke="url(#ag)" strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transform:'rotate(-90deg)', transformOrigin:'50% 50%', transition:'stroke-dashoffset 1.3s cubic-bezier(.4,0,.2,1)' }}/>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        fill={T.goldLight} fontSize={size*0.2} fontWeight="700" fontFamily="'DM Mono',monospace">
        {progress}%
      </text>
    </svg>
  );
};

const StatusPill = ({ status }) => {
  const m = {
    pending:  { bg:T.amber.muted,   border:T.amber.border,   color:T.amber.fg,   dot:'#f59e0b', label:'Pending' },
    approved: { bg:T.emerald.muted, border:T.emerald.border, color:T.emerald.fg, dot:'#10b981', label:'Approved' },
    rejected: { bg:T.red.muted,     border:T.red.border,     color:T.red.fg,     dot:'#ef4444', label:'Rejected' },
  }[status] ?? { bg:'rgba(255,255,255,0.04)', border:T.border, color:T.text.secondary, dot:T.text.muted, label:status };
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
      style={{ background:m.bg, border:`1px solid ${m.border}`, color:m.color }}>
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:m.dot }}/>
      {m.label}
    </span>
  );
};

const Toast = ({ toast }) => (
  <AnimatePresence>
    {toast && (
      <motion.div key="t"
        initial={{ opacity:0, y:-20, scale:0.94 }} animate={{ opacity:1, y:0, scale:1 }}
        exit={{ opacity:0, y:-14 }} transition={sp(420,30)}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold"
        style={{
          background: toast.type==='error' ? 'rgba(28,6,6,0.96)' : 'rgba(4,18,12,0.96)',
          border:`1px solid ${toast.type==='error' ? T.red.border : T.emerald.border}`,
          color: toast.type==='error' ? T.red.fg : T.emerald.fg,
          boxShadow:'0 20px 60px rgba(0,0,0,0.6)',
          backdropFilter:'blur(20px)',
        }}>
        {toast.type==='error' ? <AlertCircle size={14}/> : <CheckCircle size={14}/>}
        {toast.msg}
      </motion.div>
    )}
  </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD MODAL
// ─────────────────────────────────────────────────────────────────────────────
const UploadModal = ({ cert, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (f.size > 10*1024*1024) { setError('File must be under 10 MB'); return; }
    setFile(f); setError('');
    if (f.type.startsWith('image/')) {
      const r = new FileReader();
      r.onload = e => setPreview(e.target.result);
      r.readAsDataURL(f);
    } else setPreview(null);
  }, []);

  const handleSubmit = async () => {
    if (!file) { setError('Please select a file'); return; }
    setUploading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('certificate', file);
      const { data } = await api.post(`/student/upload-cert/${cert.certId._id}`, fd, {
        headers: { 'Content-Type':'multipart/form-data' },
      });
      onSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally { setUploading(false); }
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(2,4,15,0.88)', backdropFilter:'blur(24px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.9, y:32 }} animate={{ scale:1, y:0 }}
        exit={{ scale:0.92, y:20, opacity:0 }} transition={sp(340,28)}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background:'rgba(8,10,28,0.98)', border:`1px solid ${T.goldBorder}`, boxShadow:`0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.07) inset` }}
        onClick={e => e.stopPropagation()}>

        <div className="h-0.5 w-full" style={{ background:`linear-gradient(90deg,transparent,${T.gold},transparent)` }}/>

        <div className="px-8 py-6 border-b" style={{ borderColor:'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold" style={{ color:T.text.primary, fontFamily:"'Playfair Display',serif" }}>Upload Certificate</h3>
              <p className="text-xs mt-0.5" style={{ color:T.text.secondary }}>Submit for review · Earn points</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:'rgba(255,255,255,0.05)', border:`1px solid ${T.border}` }}>
              <X size={13} style={{ color:T.text.secondary }}/>
            </button>
          </div>
        </div>

        <div className="p-8 space-y-5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background:T.goldMuted, border:`1px solid ${T.goldBorder}` }}>
            <Award size={15} style={{ color:T.gold }}/>
            <span className="text-sm font-medium truncate" style={{ color:T.goldLight }}>{cert.certId?.title}</span>
          </div>

          <div
            onClick={() => inputRef.current?.click()}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200"
            style={{ borderColor: dragging ? T.gold : 'rgba(255,255,255,0.1)', background: dragging ? T.goldMuted : 'rgba(255,255,255,0.02)' }}>
            <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => handleFile(e.target.files[0])}/>
            {preview
              ? <img src={preview} alt="Preview" className="w-full h-36 object-cover rounded-xl"/>
              : <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background:T.goldMuted, border:`1px solid ${T.goldBorder}` }}>
                    <Upload size={20} style={{ color:T.gold }}/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color:T.text.primary }}>Drop your certificate here</p>
                    <p className="text-xs mt-1" style={{ color:T.text.muted }}>JPG, PNG or PDF · Max 10 MB</p>
                  </div>
                </div>}
            {file && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background:T.emerald.muted, border:`1px solid ${T.emerald.border}`, color:T.emerald.fg }}>
                <CheckCircle size={11}/>{file.name}
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-medium"
              style={{ background:T.red.muted, border:`1px solid ${T.red.border}`, color:T.red.fg }}>
              <AlertCircle size={13}/>{error}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors"
              style={{ border:`1px solid ${T.border}`, color:T.text.secondary }}>Cancel</button>
            <button onClick={handleSubmit} disabled={uploading || !file}
              className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background:`linear-gradient(135deg,${T.gold},#a8731a)`, color:'#06091a', boxShadow: file && !uploading ? `0 0 28px rgba(201,168,76,0.35)` : 'none' }}>
              {uploading ? <><RefreshCw size={13} className="animate-spin"/>Uploading…</> : <><Upload size={13}/>Submit</>}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR NAV ITEM
// ─────────────────────────────────────────────────────────────────────────────
const NavItem = ({ tab, active, onClick, collapsed }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200"
      style={{
        color: active ? '#06091a' : hov ? T.text.primary : T.text.secondary,
        background: active ? `linear-gradient(135deg,${T.gold},#b8882e)` : hov ? 'rgba(255,255,255,0.05)' : 'transparent',
        boxShadow: active ? `0 4px 20px rgba(201,168,76,0.28)` : 'none',
      }}>
      <tab.icon size={16} strokeWidth={active ? 2.5 : 2} style={{ flexShrink:0 }}/>
      {!collapsed && (
        <>
          <span className="flex-1 text-left whitespace-nowrap">{tab.label}</span>
          {tab.count > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: active ? 'rgba(6,9,26,0.25)' : 'rgba(255,255,255,0.08)', color: active ? '#06091a' : T.text.secondary }}>
              {tab.count}
            </span>
          )}
        </>
      )}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, accent, delay }) => (
  <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ ...sp(260,24), delay }}
    className="relative rounded-3xl p-5 overflow-hidden"
    style={{ background:T.surface, border:`1px solid ${T.border}` }}>
    <div className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none"
      style={{ background:`radial-gradient(circle,${accent}22 0%,transparent 70%)`, transform:'translate(30%,-30%)' }}/>
    <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
      style={{ background:`${accent}18`, border:`1px solid ${accent}33` }}>
      <Icon size={18} style={{ color:accent }} strokeWidth={2.2}/>
    </div>
    <div className="text-2xl font-black tracking-tight mb-0.5"
      style={{ color:T.text.primary, fontFamily:"'DM Mono',monospace" }}>
      {typeof value==='number' ? value.toLocaleString() : value}
    </div>
    <div className="text-xs font-medium" style={{ color:T.text.secondary }}>{label}</div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// COURSE CARD — horizontal
// ─────────────────────────────────────────────────────────────────────────────
const CourseCard = ({ course, index, onContinue }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
      transition={{ ...sp(240,26), delay: index*0.07 }}
      className="group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200"
      style={{ background: hov ? 'rgba(201,168,76,0.04)' : T.surface, border:`1px solid ${hov ? T.goldBorder : T.border}` }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onContinue}>

      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 relative" style={{ background:'rgba(11,15,42,0.8)' }}>
        {course.thumbnail
          ? <img src={getImageUrl(course.thumbnail?.url || course.thumbnail)} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
          : <div className="w-full h-full flex items-center justify-center" style={{ background:T.goldMuted }}>
              <BookOpen size={20} style={{ color:T.gold }}/>
            </div>}
        {course.completed && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background:'rgba(16,185,129,0.75)', backdropFilter:'blur(4px)' }}>
            <CheckCircle size={20} className="text-white"/>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate mb-2" style={{ color:T.text.primary }}>{course.title}</p>
        {course.category && <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color:T.text.muted }}>{course.category}</p>}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.05)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background:`linear-gradient(90deg,${T.gold},${T.goldLight})` }}
              initial={{ width:0 }} animate={{ width:`${course.progress}%` }}
              transition={{ duration:1.2, delay: index*0.07+0.3 }}/>
          </div>
          <span className="text-[11px] font-bold flex-shrink-0" style={{ color:T.gold, fontFamily:"'DM Mono',monospace" }}>{course.progress}%</span>
        </div>
      </div>

      <button className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
        style={{ background: hov ? T.gold : T.goldMuted, border:`1px solid ${T.goldBorder}`, boxShadow: hov ? `0 0 16px rgba(201,168,76,0.4)` : 'none' }}>
        <Play size={13} fill={hov ? '#06091a' : T.gold} style={{ color: hov ? '#06091a' : T.gold }}/>
      </button>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CERT CARD
// ─────────────────────────────────────────────────────────────────────────────
const CertCard = ({ cert, index }) => (
  <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ ...sp(240,24), delay: index*0.07 }}
    className="relative rounded-3xl p-5 overflow-hidden"
    style={{ background:'linear-gradient(135deg,rgba(201,168,76,0.07),rgba(11,15,42,0.6))', border:`1px solid ${T.goldBorder}` }}>
    <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
      style={{ background:'radial-gradient(circle,rgba(201,168,76,0.2) 0%,transparent 70%)', transform:'translate(30%,-30%)' }}/>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background:`linear-gradient(135deg,${T.gold},#8a5a0a)`, boxShadow:`0 8px 24px rgba(201,168,76,0.3)` }}>
        <Award size={20} className="text-white"/>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm truncate mb-1" style={{ color:T.text.primary }}>{cert.course?.title || 'Course Certificate'}</h4>
        <p className="text-xs mb-2" style={{ color:T.text.secondary }}>
          {new Date(cert.issuedAt).toLocaleDateString('en-IN',{ day:'numeric', month:'short', year:'numeric' })}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-lg" style={{ background:'rgba(255,255,255,0.05)', color:T.text.secondary }}>{cert.certificateId}</span>
          <span className="text-[10px] flex items-center gap-1 font-semibold px-2 py-0.5 rounded-lg"
            style={{ background:T.emerald.muted, color:T.emerald.fg, border:`1px solid ${T.emerald.border}` }}>
            <Shield size={9}/>Verified
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, sub, cta, onClick }) => (
  <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
    className="py-16 flex flex-col items-center text-center rounded-3xl"
    style={{ background:'rgba(255,255,255,0.015)', border:'1px dashed rgba(255,255,255,0.07)' }}>
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
      style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${T.border}` }}>
      <Icon size={26} style={{ color:T.text.muted }}/>
    </div>
    <p className="font-bold text-sm mb-1" style={{ color:T.text.primary }}>{title}</p>
    <p className="text-xs mb-6 max-w-xs" style={{ color:T.text.secondary }}>{sub}</p>
    {cta && (
      <button onClick={onClick} className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
        style={{ background:`linear-gradient(135deg,${T.gold},#a8731a)`, color:'#06091a', boxShadow:`0 4px 20px rgba(201,168,76,0.3)` }}>
        {cta}
      </button>
    )}
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS PANEL
// ─────────────────────────────────────────────────────────────────────────────
const EXPERIENCE_OPTIONS = [
  'Fresher (0 yrs)', '< 1 Year', '1–2 Years', '2–3 Years',
  '3–5 Years', '5–7 Years', '7–10 Years', '10+ Years',
];
const EDUCATION_OPTIONS = [
  'High School', 'Diploma', 'Bachelor\'s Degree', 'Master\'s Degree',
  'MBA', 'PhD', 'Bootcamp / Certification', 'Self-Taught', 'Other',
];

const FieldInput = ({ label, placeholder, value, onChange, type='text', icon, textarea }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:6 }}>{label}</label>}
    <div style={{ position:'relative' }}>
      {icon && <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', pointerEvents:'none' }}>{icon}</span>}
      {textarea
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4}
            style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #e5e7eb', fontSize:14, color:'#111827', background:'#fff', resize:'vertical', outline:'none', boxSizing:'border-box', fontFamily:'inherit' }}/>
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder}
            style={{ width:'100%', padding:'10px 14px', paddingLeft: icon ? 36 : 14, borderRadius:10, border:'1.5px solid #e5e7eb', fontSize:14, color:'#111827', background:'#fff', outline:'none', boxSizing:'border-box' }}/>}
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:6 }}>{label}</label>}
    <div style={{ position:'relative' }}>
      <select value={value} onChange={onChange}
        style={{ width:'100%', padding:'10px 14px', paddingRight:36, borderRadius:10, border:'1.5px solid #e5e7eb', fontSize:14, color: value ? '#111827' : '#9ca3af', background:'#fff', appearance:'none', outline:'none', cursor:'pointer', boxSizing:'border-box' }}>
        <option value=''>Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={16} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', pointerEvents:'none' }}/>
    </div>
  </div>
);

const SaveBtn = ({ onClick, saving, label='Save Changes' }) => (
  <button onClick={onClick} disabled={saving}
    style={{ padding:'12px 28px', borderRadius:10, background:'#1d4ed8', color:'#fff', fontWeight:700, fontSize:14, border:'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, display:'flex', alignItems:'center', gap:8 }}>
    {saving ? <><RefreshCw size={13} style={{ animation:'spin 1s linear infinite' }}/> Saving…</> : label}
  </button>
);

const SettingsPanel = ({ user, data, showToast, fileInputRef, handleAvatarUpload }) => {
  const { updateProfile } = useAuth();
  const settingsAvatarRef = useRef();

  const [sTab, setSTab] = useState('personal');
  const [saving, setSaving] = useState(false);

  // Personal tab
  const [name,       setName]       = useState(data?.user?.name       || user?.name       || '');
  const [titleVal,   setTitleVal]   = useState(data?.user?.title      || user?.title      || '');
  const [experience, setExperience] = useState('');
  const [education,  setEducation]  = useState('');
  const [website,    setWebsite]    = useState(data?.user?.socialLinks?.website || '');

  // Profile tab
  const [bio, setBio] = useState(data?.user?.bio || user?.bio || '');

  // Social links tab
  const [linkedin, setLinkedin] = useState(data?.user?.socialLinks?.linkedin || '');
  const [twitter,  setTwitter]  = useState(data?.user?.socialLinks?.twitter  || '');
  const [youtube,  setYoutube]  = useState(data?.user?.socialLinks?.youtube  || '');

  // Account tab
  const [currPwd,  setCurrPwd]  = useState('');
  const [newPwd,   setNewPwd]   = useState('');
  const [confPwd,  setConfPwd]  = useState('');
  const [showCurr, setShowCurr] = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [pwdErr,   setPwdErr]   = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);

  const STABS = [
    { id:'personal', label:'Personal',       icon: User },
    { id:'profile',  label:'Profile',        icon: UserCog },
    { id:'social',   label:'Social Links',   icon: Globe },
    { id:'account',  label:'Account Setting',icon: Settings },
  ];

  const handleSavePersonal = async () => {
    setSaving(true);
    const res = await updateProfile({ name, title: titleVal, socialLinks: { website } });
    setSaving(false);
    if (res.success) showToast('Profile updated successfully!');
    else showToast(res.message || 'Update failed', 'error');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const res = await updateProfile({ bio });
    setSaving(false);
    if (res.success) showToast('Profile bio updated!');
    else showToast(res.message || 'Update failed', 'error');
  };

  const handleSaveSocial = async () => {
    setSaving(true);
    const res = await updateProfile({ socialLinks: { linkedin, twitter, youtube, website } });
    setSaving(false);
    if (res.success) showToast('Social links updated!');
    else showToast(res.message || 'Update failed', 'error');
  };

  const handleSavePassword = async () => {
    setPwdErr('');
    if (!currPwd || !newPwd || !confPwd) { setPwdErr('All fields are required.'); return; }
    if (newPwd.length < 6) { setPwdErr('New password must be at least 6 characters.'); return; }
    if (newPwd !== confPwd) { setPwdErr('New passwords do not match.'); return; }
    setPwdSaving(true);
    const res = await updateProfile({ password: newPwd });
    setPwdSaving(false);
    if (res.success) {
      showToast('Password changed successfully!');
      setCurrPwd(''); setNewPwd(''); setConfPwd('');
    } else showToast(res.message || 'Password update failed', 'error');
  };

  const handleAvatarClick = () => settingsAvatarRef.current?.click();

  // card style (white, light-border)
  const cardStyle = { background:'#fff', borderRadius:16, border:'1.5px solid #e5e7eb', padding:'28px 32px', boxShadow:'0 1px 8px rgba(0,0,0,0.06)' };

  const avatarSrc = data?.user?.avatar || user?.avatar
    ? getImageUrl(data?.user?.avatar || user?.avatar)
    : null;

  return (
    <motion.div key="settings" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={sp(260,24)}
      style={{ fontFamily:"'DM Sans',sans-serif" }}>

      {/* Sub-tab bar */}
      <div style={{ display:'flex', gap:0, marginBottom:28, borderBottom:'2px solid #e5e7eb' }}>
        {STABS.map(t => {
          const active = sTab === t.id;
          return (
            <button key={t.id} onClick={() => setSTab(t.id)}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 20px', border:'none', background:'none',
                fontWeight: active ? 700 : 500, fontSize:14,
                color: active ? '#1d4ed8' : '#6b7280',
                borderBottom: active ? '2.5px solid #1d4ed8' : '2.5px solid transparent',
                marginBottom:-2, cursor:'pointer', transition:'all 0.15s' }}>
              <t.icon size={15}/>{t.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">

        {/* ── PERSONAL ── */}
        {sTab === 'personal' && (
          <motion.div key="personal" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
            <div style={cardStyle}>
              <h3 style={{ fontSize:18, fontWeight:700, color:'#111827', marginBottom:20, marginTop:0 }}>Basic Information</h3>

              <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:28, alignItems:'start' }}>
                {/* Avatar upload */}
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:8 }}>Profile Picture</label>
                  <div onClick={handleAvatarClick}
                    style={{ border:'2px dashed #d1d5db', borderRadius:12, padding:'20px 16px', textAlign:'center', cursor:'pointer', background:'#f9fafb', transition:'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='#1d4ed8'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='#d1d5db'}>
                    {avatarSrc
                      ? <img src={avatarSrc} alt="avatar" style={{ width:80, height:80, borderRadius:'50%', objectFit:'cover', margin:'0 auto 8px' }}/>
                      : <div style={{ width:56, height:56, borderRadius:'50%', background:'#e5e7eb', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 8px' }}>
                          <Upload size={22} style={{ color:'#9ca3af' }}/>
                        </div>}
                    <input ref={settingsAvatarRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarUpload}/>
                    <p style={{ fontSize:13, color:'#1d4ed8', fontWeight:600, margin:'0 0 4px' }}>
                      <span style={{ fontWeight:700 }}>Browse photo</span> or drop here
                    </p>
                    <p style={{ fontSize:11, color:'#9ca3af', margin:0 }}>A photo larger than 400 pixels work best. Max photo size 5 MB.</p>
                  </div>
                </div>

                {/* Right fields */}
                <div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <FieldInput label="Full name" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)}/>
                    <FieldInput label="Title/headline" placeholder="e.g. Frontend Developer" value={titleVal} onChange={e => setTitleVal(e.target.value)}/>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <SelectField label="Experience" value={experience} onChange={e => setExperience(e.target.value)} options={EXPERIENCE_OPTIONS}/>
                    <SelectField label="Educations" value={education} onChange={e => setEducation(e.target.value)} options={EDUCATION_OPTIONS}/>
                  </div>
                  <FieldInput label="Personal Website" placeholder="Website url..." value={website} onChange={e => setWebsite(e.target.value)}
                    icon={<Link2 size={15}/>}/>
                </div>
              </div>

              <div style={{ marginTop:8 }}>
                <SaveBtn onClick={handleSavePersonal} saving={saving}/>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── PROFILE ── */}
        {sTab === 'profile' && (
          <motion.div key="profile" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
            <div style={cardStyle}>
              <h3 style={{ fontSize:18, fontWeight:700, color:'#111827', marginBottom:20, marginTop:0 }}>About You</h3>
              <FieldInput label="Bio" placeholder="Write a short bio about yourself..." value={bio} onChange={e => setBio(e.target.value)} textarea/>
              <SaveBtn onClick={handleSaveProfile} saving={saving}/>
            </div>
          </motion.div>
        )}

        {/* ── SOCIAL LINKS ── */}
        {sTab === 'social' && (
          <motion.div key="social" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
            <div style={cardStyle}>
              <h3 style={{ fontSize:18, fontWeight:700, color:'#111827', marginBottom:20, marginTop:0 }}>Social Links</h3>
              <FieldInput label="LinkedIn" placeholder="https://linkedin.com/in/..." value={linkedin} onChange={e => setLinkedin(e.target.value)} icon={<Linkedin size={15}/>}/>
              <FieldInput label="Twitter / X" placeholder="https://twitter.com/..." value={twitter} onChange={e => setTwitter(e.target.value)} icon={<Twitter size={15}/>}/>
              <FieldInput label="YouTube" placeholder="https://youtube.com/..." value={youtube} onChange={e => setYoutube(e.target.value)} icon={<Youtube size={15}/>}/>
              <FieldInput label="Personal Website" placeholder="https://yourwebsite.com" value={website} onChange={e => setWebsite(e.target.value)} icon={<Globe size={15}/>}/>
              <SaveBtn onClick={handleSaveSocial} saving={saving}/>
            </div>
          </motion.div>
        )}

        {/* ── ACCOUNT SETTING ── */}
        {sTab === 'account' && (
          <motion.div key="account" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Change Password */}
            <div style={cardStyle}>
              <h3 style={{ fontSize:18, fontWeight:700, color:'#111827', marginBottom:4, marginTop:0 }}>Change Password</h3>
              <p style={{ fontSize:13, color:'#6b7280', marginBottom:20, marginTop:0 }}>Update your account password.</p>

              {/* Current Password */}
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:6 }}>Current Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}/>
                  <input type={showCurr ? 'text' : 'password'} value={currPwd} onChange={e => setCurrPwd(e.target.value)} placeholder="Enter current password"
                    style={{ width:'100%', padding:'10px 40px 10px 36px', borderRadius:10, border:'1.5px solid #e5e7eb', fontSize:14, color:'#111827', background:'#fff', outline:'none', boxSizing:'border-box' }}/>
                  <button onClick={() => setShowCurr(p => !p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9ca3af', display:'flex' }}>
                    {showCurr ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:6 }}>New Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}/>
                  <input type={showNew ? 'text' : 'password'} value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Enter new password (min 6 chars)"
                    style={{ width:'100%', padding:'10px 40px 10px 36px', borderRadius:10, border:'1.5px solid #e5e7eb', fontSize:14, color:'#111827', background:'#fff', outline:'none', boxSizing:'border-box' }}/>
                  <button onClick={() => setShowNew(p => !p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9ca3af', display:'flex' }}>
                    {showNew ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:6 }}>Confirm New Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}/>
                  <input type="password" value={confPwd} onChange={e => setConfPwd(e.target.value)} placeholder="Re-enter new password"
                    style={{ width:'100%', padding:'10px 14px 10px 36px', borderRadius:10, border:`1.5px solid ${confPwd && confPwd !== newPwd ? '#ef4444' : '#e5e7eb'}`, fontSize:14, color:'#111827', background:'#fff', outline:'none', boxSizing:'border-box' }}/>
                </div>
              </div>

              {pwdErr && (
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:10, background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', fontSize:13, marginBottom:16 }}>
                  <AlertCircle size={14}/>{pwdErr}
                </div>
              )}

              <SaveBtn onClick={handleSavePassword} saving={pwdSaving} label="Update Password"/>
            </div>

            {/* Danger Zone */}
            <div style={{ ...cardStyle, border:'1.5px solid #fca5a5' }}>
              <h3 style={{ fontSize:18, fontWeight:700, color:'#991b1b', marginBottom:4, marginTop:0 }}>Danger Zone</h3>
              <p style={{ fontSize:13, color:'#6b7280', marginBottom:20, marginTop:0 }}>Irreversible and destructive actions.</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 18px', borderRadius:12, background:'#fff5f5', border:'1px solid #fca5a5' }}>
                <div>
                  <p style={{ fontWeight:700, fontSize:14, color:'#111827', margin:'0 0 2px' }}>Delete Account</p>
                  <p style={{ fontSize:12, color:'#6b7280', margin:0 }}>Once you delete your account, there is no going back.</p>
                </div>
                <button
                  onClick={() => showToast('Please contact support to delete your account.', 'error')}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:9, background:'#fff', border:'1.5px solid #ef4444', color:'#ef4444', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                  <Trash2 size={13}/> Delete Account
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(true);
  
  // Read initial tab from URL query params
  const queryTab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab]     = useState(queryTab || 'overview');
  const [uploadTarget, setUploadTarget] = useState(null);
  const [uploadedCerts, setUploadedCerts] = useState([]);
  const [toast, setToast]             = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [lbLoading, setLbLoading]     = useState(false);
  const [ssoLoading, setSsoLoading]   = useState(false);
  const fileInputRef = useRef();

  const showToast = useCallback((msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3800);
  }, []);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchDashboard();
  }, [user]);

  // Fetch leaderboard when tab is selected
  useEffect(() => {
    if (activeTab === 'leaderboard') fetchLeaderboard();
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    setLbLoading(true);
    try {
      const { data: lb } = await api.get('/student/leaderboard');
      setLeaderboard(lb || []);
    } catch { /* silent */ }
    finally { setLbLoading(false); }
  };

  const handleLaunchInterview = async () => {
    setSsoLoading(true);
    try {
      const { data: ssoData } = await api.get('/auth/sso-token');
      window.open(`https://imshopper-aimockinterview.hf.space?sso=${ssoData.ssoToken}`, '_blank', 'noopener,noreferrer');
    } catch {
      window.open('https://imshopper-aimockinterview.hf.space', '_blank', 'noopener,noreferrer');
    } finally {
      setSsoLoading(false);
    }
  };

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const { data: d } = await api.get('/student/dashboard');
      setData(d);
      setUploadedCerts(d.uploadedCerts || []);
    } catch { showToast('Failed to load dashboard', 'error'); }
    finally { setLoading(false); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('avatar', file);
    try {
      const { data: res } = await api.post('/auth/avatar', fd, { headers:{ 'Content-Type':'multipart/form-data' } });
      // res.avatar is the relative path e.g. /uploads/avatars/avatar-xxx.jpg
      await updateProfile({ avatar: res.avatar });
      showToast('Profile photo updated!');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Avatar update failed', 'error');
    }
  };

  const handleUploadSuccess = (result) => {
    setUploadedCerts(prev => [result.studentCert, ...prev]);
    setUploadTarget(null);
    showToast('Certificate submitted! Awaiting review.');
    fetchDashboard();
  };

  if (!user) return null;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:T.navy }}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2" style={{ borderColor:`${T.gold}22` }}/>
          <motion.div className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{ borderTopColor:T.gold }}
            animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}/>
        </div>
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color:T.text.muted }}>Loading</span>
      </div>
    </div>
  );

  const d              = data || {};
  const enrolledCourses= d.enrolledCourses || [];
  const earnedCerts    = d.earnedCertificates || [];
  const redirectedCerts= d.redirectedCertificates || [];
  const profilePoints  = d.user?.profilePoints || 0;
  const badges         = d.user?.badges || [];
  const completedCount = enrolledCourses.filter(c => c.completed).length;
  const inProgress     = enrolledCourses.filter(c => !c.completed).length;

  const TABS = [
    { id:'overview',     label:'Overview',     icon:BarChart2, count:0 },
    { id:'courses',      label:'My Courses',   icon:BookOpen,  count:enrolledCourses.length },
    { id:'certificates', label:'Certificates', icon:Award,     count:earnedCerts.length },
    { id:'cert-upload',  label:'Cert Upload',  icon:Upload,    count:redirectedCerts.length },
    { id:'leaderboard',  label:'Leaderboard',  icon:Trophy,    count:0 },
    { id:'settings',     label:'Settings',     icon:Settings,  count:0 },
  ];

  const fadeUp = { initial:{ opacity:0, y:16 }, animate:{ opacity:1, y:0 }, transition:sp(260,24) };

  return (
    <div className="min-h-screen flex" style={{ background:T.navy, fontFamily:"'DM Sans',sans-serif", color:T.text.primary }}>

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-[900px] h-[900px] rounded-full"
          style={{ background:'radial-gradient(circle,rgba(201,168,76,0.04) 0%,transparent 65%)', transform:'translate(-30%,-30%)' }}/>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full"
          style={{ background:'radial-gradient(circle,rgba(79,70,229,0.05) 0%,transparent 65%)', transform:'translate(20%,20%)' }}/>
        <div className="absolute inset-0" style={{
          backgroundImage:'radial-gradient(circle at 1px 1px,rgba(201,168,76,0.035) 1px,transparent 0)',
          backgroundSize:'36px 36px',
        }}/>
      </div>

      <Toast toast={toast}/>
      <AnimatePresence>
        {uploadTarget && <UploadModal cert={uploadTarget} onClose={() => setUploadTarget(null)} onSuccess={handleUploadSuccess}/>}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════
          SIDEBAR
      ════════════════════════════════════════════════════════════ */}
      <motion.aside animate={{ width: sidebarCollapsed ? 72 : 260 }} transition={sp(320,30)}
        className="flex-shrink-0 flex flex-col h-screen sticky top-0 overflow-hidden z-30"
        style={{ background:'rgba(7,9,24,0.96)', borderRight:`1px solid ${T.border}`, backdropFilter:'blur(20px)' }}>

        {/* Gold accent top */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background:`linear-gradient(90deg,transparent,${T.gold},transparent)` }}/>

        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom:`1px solid ${T.border}` }}>
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background:`linear-gradient(135deg,${T.gold},#a8731a)`, boxShadow:`0 0 20px rgba(201,168,76,0.3)` }}>
            <GraduationCap size={17} style={{ color:'#06091a' }}/>
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-8 }} className="flex-1 min-w-0">
                <div className="font-black text-sm tracking-wide" style={{ color:T.text.primary, fontFamily:"'Playfair Display',serif" }}>LearnHub</div>
                <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color:T.gold }}>Premium</div>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setSidebarCollapsed(p => !p)}
            className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${T.border}` }}>
            <Menu size={12} style={{ color:T.text.secondary }}/>
          </button>
        </div>

        {/* Profile */}
        <div className="px-4 py-4" style={{ borderBottom:`1px solid ${T.border}` }}>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-2xl overflow-hidden" style={{ border:`2px solid ${T.goldBorder}` }}>
                {(d.user?.avatar || user.avatar)
                  ? <img src={getImageUrl(d.user?.avatar || user.avatar)} alt="avatar" className="w-full h-full object-cover"/>
                  : <div className="w-full h-full flex items-center justify-center" style={{ background:T.goldMuted }}>
                      <User size={18} style={{ color:T.gold }}/>
                    </div>}
              </div>
              <button onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg flex items-center justify-center"
                style={{ background:`linear-gradient(135deg,${T.gold},#a8731a)` }}>
                <Camera size={9} style={{ color:'#06091a' }}/>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload}/>
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }} className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate" style={{ color:T.text.primary }}>{d.user?.name || user.name}</p>
                  <p className="text-[11px] truncate" style={{ color:T.text.muted }}>{d.user?.email || user.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-2xl"
                style={{ background:T.goldMuted, border:`1px solid ${T.goldBorder}` }}>
                <Star size={12} fill={T.gold} style={{ color:T.gold }}/>
                <span className="text-base font-black" style={{ color:T.goldLight, fontFamily:"'DM Mono',monospace" }}>{profilePoints.toLocaleString()}</span>
                <span className="text-[10px]" style={{ color:T.text.secondary }}>points</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {TABS.map(tab => (
            <NavItem key={tab.id} tab={tab} active={activeTab===tab.id} onClick={() => setActiveTab(tab.id)} collapsed={sidebarCollapsed}/>
          ))}
        </nav>

        {/* Badges */}
        <AnimatePresence>
          {!sidebarCollapsed && badges.length > 0 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="px-4 pt-3 pb-3" style={{ borderTop:`1px solid ${T.border}` }}>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color:T.text.muted }}>Badges</p>
              <div className="flex flex-wrap gap-1.5">
                {badges.map((b,i) => (
                  <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                    style={{ background:T.amber.muted, color:T.amber.fg, border:`1px solid ${T.amber.border}` }}>
                    🏅 {b}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer actions */}
        <div className="px-3 pb-5 pt-3 space-y-1" style={{ borderTop:`1px solid ${T.border}` }}>
          <NavItem tab={{ id:'browse', label:'Browse Courses', icon:BookOpen, count:0 }} active={false} onClick={() => navigate('/')} collapsed={sidebarCollapsed}/>
          <NavItem tab={{ id:'logout', label:'Sign Out', icon:LogOut, count:0 }} active={false} onClick={() => { logout(); navigate('/'); }} collapsed={sidebarCollapsed}/>
        </div>
      </motion.aside>

      {/* ════════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 sticky top-0 z-20"
          style={{ background:'rgba(6,9,26,0.82)', backdropFilter:'blur(20px)', borderBottom:`1px solid ${T.border}` }}>
          <div>
            <h1 className="text-lg font-black" style={{ color:T.text.primary, fontFamily:"'Playfair Display',serif" }}>
              {TABS.find(t => t.id===activeTab)?.label}
            </h1>
            <p className="text-xs mt-0.5" style={{ color:T.text.muted }}>
              {new Date().toLocaleDateString('en-IN',{ weekday:'long', day:'numeric', month:'long' })}
            </p>
          </div>
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:T.surface, border:`1px solid ${T.border}` }}>
            <Bell size={14} style={{ color:T.text.secondary }}/>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background:T.gold }}/>
          </button>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ────────────────────────────────────────── */}
            {activeTab==='overview' && (
              <motion.div key="ov" {...fadeUp} className="space-y-6">
                {/* Welcome */}
                <div className="relative rounded-3xl p-7 overflow-hidden"
                  style={{ background:'linear-gradient(135deg,rgba(201,168,76,0.1),rgba(11,15,42,0.8))', border:`1px solid ${T.goldBorder}` }}>
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                    style={{ background:'radial-gradient(circle,rgba(201,168,76,0.14) 0%,transparent 65%)', transform:'translate(20%,-20%)' }}/>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:T.gold }}>Welcome back</p>
                  <h2 className="text-2xl font-black mb-1" style={{ color:T.text.primary, fontFamily:"'Playfair Display',serif" }}>
                    {(d.user?.name||user.name)?.split(' ')[0]} 👋
                  </h2>
                  <p className="text-sm" style={{ color:T.text.secondary }}>
                    You have <span style={{ color:T.goldLight, fontWeight:700 }}>{inProgress}</span> course{inProgress!==1?'s':''} in progress.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Layers}      label="Enrolled"     value={enrolledCourses.length} accent="#4f8fea" delay={0}/>
                  <StatCard icon={CheckCircle} label="Completed"    value={completedCount}          accent="#10b981" delay={0.06}/>
                  <StatCard icon={Award}       label="Certificates" value={earnedCerts.length}       accent={T.gold}  delay={0.12}/>
                  <StatCard icon={Zap}         label="Points"       value={profilePoints}            accent="#c084fc" delay={0.18}/>
                </div>

                {/* Two-col layout */}
                <div className="grid lg:grid-cols-5 gap-6">
                  {/* Courses — 3 col */}
                  <div className="lg:col-span-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm flex items-center gap-2" style={{ color:T.text.primary }}>
                        <Flame size={14} style={{ color:'#fb923c' }}/>Continue Learning
                      </h3>
                      {enrolledCourses.length > 4 && (
                        <button onClick={() => setActiveTab('courses')} className="text-xs font-semibold flex items-center gap-1 transition-colors"
                          style={{ color:T.gold }}>View all <ChevronRight size={12}/></button>
                      )}
                    </div>
                    {enrolledCourses.length===0
                      ? <EmptyState icon={BookOpen} title="No courses yet" sub="Start your journey today." cta="Browse" onClick={() => navigate('/active-course')}/>
                      : enrolledCourses.slice(0,4).map((c,i) => <CourseCard key={c._id} course={c} index={i} onContinue={() => navigate(`/course/${c._id}/learn`)}/>)}

                    {/* AI Interview Quick Launch Card */}
                    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
                      className="relative rounded-3xl p-5 overflow-hidden mt-2"
                      style={{ background:'linear-gradient(135deg,rgba(79,124,255,0.12),rgba(124,92,255,0.1))', border:'1px solid rgba(79,124,255,0.25)' }}>
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                        style={{ background:'radial-gradient(circle,rgba(79,124,255,0.18) 0%,transparent 70%)', transform:'translate(20%,-20%)' }}/>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ background:'linear-gradient(135deg,#4f7cff,#7c5cff)', boxShadow:'0 8px 24px rgba(79,124,255,0.35)' }}>
                          <Mic size={20} className="text-white"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm mb-0.5" style={{ color:T.text.primary }}>AI Mock Interview</p>
                          <p className="text-xs" style={{ color:T.text.secondary }}>Practice &amp; earn points. Rank on the leaderboard.</p>
                        </div>
                        <button onClick={handleLaunchInterview} disabled={ssoLoading}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                          style={{ background:'linear-gradient(135deg,#4f7cff,#7c5cff)', color:'#fff', boxShadow:'0 4px 16px rgba(79,124,255,0.3)' }}>
                          {ssoLoading ? <RefreshCw size={11} className="animate-spin"/> : <Play size={11} fill="#fff"/>}
                          {ssoLoading ? 'Loading...' : 'Start'}
                        </button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right col — 2 col */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-sm flex items-center gap-2" style={{ color:T.text.primary }}>
                      <Sparkles size={14} style={{ color:T.gold }}/>Certificates
                    </h3>
                    {earnedCerts.length===0
                      ? <EmptyState icon={Award} title="No certificates" sub="Complete a course."/>
                      : earnedCerts.slice(0,3).map((cert,i) => <CertCard key={cert.certificateId||i} cert={cert} index={i}/>)}

                    {/* Progress summary */}
                    {enrolledCourses.length > 0 && (
                      <div className="rounded-3xl p-5" style={{ background:T.surface, border:`1px solid ${T.border}` }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color:T.text.muted }}>Completion Rate</p>
                        <div className="flex items-center gap-4">
                          <ProgressArc progress={Math.round((completedCount/enrolledCourses.length)*100)} size={72}/>
                          <div className="flex-1 space-y-2.5">
                            {[
                              { label:'Completed', val:`${completedCount}/${enrolledCourses.length}`, color:T.goldLight },
                              { label:'In Progress', val:inProgress, color:T.blue.fg },
                              { label:'Certificates', val:earnedCerts.length, color:T.gold },
                            ].map(row => (
                              <div key={row.label} className="flex justify-between text-xs">
                                <span style={{ color:T.text.secondary }}>{row.label}</span>
                                <span style={{ color:row.color, fontFamily:"'DM Mono',monospace", fontWeight:700 }}>{row.val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── ALL COURSES ─────────────────────────────────────── */}
            {activeTab==='courses' && (
              <motion.div key="courses" {...fadeUp} className="space-y-3">
                {enrolledCourses.length===0
                  ? <EmptyState icon={BookOpen} title="No enrolled courses" sub="Explore our library." cta="Find Courses" onClick={() => navigate('/active-course')}/>
                  : enrolledCourses.map((c,i) => <CourseCard key={c._id} course={c} index={i} onContinue={() => navigate(`/course/${c._id}/learn`)}/>)}
              </motion.div>
            )}

            {/* ── CERTIFICATES ────────────────────────────────────── */}
            {activeTab==='certificates' && (
              <motion.div key="certs" {...fadeUp} className="space-y-6">
                {earnedCerts.length===0
                  ? <EmptyState icon={Award} title="No certificates yet" sub="Complete a course to earn one."/>
                  : <div className="grid sm:grid-cols-2 gap-4">{earnedCerts.map((cert,i) => <CertCard key={cert.certificateId||i} cert={cert} index={i}/>)}</div>}

                {uploadedCerts.length > 0 && (
                  <>
                    <GoldLine/>
                    <h3 className="font-bold text-sm flex items-center gap-2" style={{ color:T.text.primary }}>
                      <Upload size={13} style={{ color:T.gold }}/>Submitted Certificates
                    </h3>
                    <div className="space-y-3">
                      {uploadedCerts.map((cert,i) => (
                        <motion.div key={cert._id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}
                          className="flex items-center gap-4 p-4 rounded-2xl" style={{ background:T.surface, border:`1px solid ${T.border}` }}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:'rgba(255,255,255,0.04)' }}>
                            <FileText size={16} style={{ color:T.text.muted }}/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate" style={{ color:T.text.primary }}>{cert.certificateProgram?.title || 'Certificate'}</p>
                            <p className="text-xs" style={{ color:T.text.muted }}>{new Date(cert.createdAt).toLocaleDateString()}</p>
                          </div>
                          <StatusPill status={cert.status}/>
                          {cert.status==='approved' && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-xl"
                              style={{ background:T.emerald.muted, color:T.emerald.fg, border:`1px solid ${T.emerald.border}` }}>
                              +{cert.pointsAwarded}pts
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ── CERT UPLOAD ──────────────────────────────────────── */}
            {activeTab==='cert-upload' && (
              <motion.div key="upload" {...fadeUp} className="space-y-6">
                <div className="flex gap-4 p-5 rounded-2xl" style={{ background:T.goldMuted, border:`1px solid ${T.goldBorder}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:`${T.gold}22` }}>
                    <Zap size={17} style={{ color:T.gold }}/>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color:T.text.primary }}>How it works</h4>
                    <p className="text-xs leading-relaxed" style={{ color:T.text.secondary }}>
                      Visit a certificate program's external link, complete it, then upload your certificate. Each approved upload earns you points to unlock paid courses.
                    </p>
                  </div>
                </div>

                {redirectedCerts.length===0
                  ? <EmptyState icon={ExternalLink} title="No programs visited yet" sub="Visit the Certificates page and click any program link." cta="Browse Programs" onClick={() => navigate('/active-certificates')}/>
                  : (
                    <div className="grid sm:grid-cols-2 gap-5">
                      {redirectedCerts.map((redir, i) => {
                        const uploaded = uploadedCerts.find(u =>
                          (u.certificateProgram?._id || u.certificateProgram) === (redir.certId?._id || redir.certId));
                        return (
                          <motion.div key={redir.certId?._id || i}
                            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ ...sp(240,24), delay:i*0.07 }}
                            className="rounded-2xl overflow-hidden flex flex-col"
                            style={{ background:T.surface, border:`1px solid ${T.border}` }}>
                            {redir.certId?.thumbnail && (
                              <div className="h-28 bg-slate-900 overflow-hidden">
                                <img src={getImageUrl(redir.certId.thumbnail)} alt="" className="w-full h-full object-cover opacity-40"/>
                              </div>
                            )}
                            <div className="p-5 flex flex-col flex-1">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <h4 className="font-bold text-sm leading-snug" style={{ color:T.text.primary }}>{redir.certId?.title || 'Certificate Program'}</h4>
                                {redir.certId?.points && (
                                  <span className="text-[11px] font-bold px-2 py-1 rounded-lg flex-shrink-0"
                                    style={{ background:T.goldMuted, color:T.goldLight, border:`1px solid ${T.goldBorder}` }}>
                                    {redir.certId.points} pts
                                  </span>
                                )}
                              </div>
                              <p className="text-xs mb-4 flex items-center gap-1.5" style={{ color:T.text.muted }}>
                                <Clock size={10}/>Visited {new Date(redir.redirectedAt).toLocaleDateString('en-IN')}
                              </p>
                              <div className="mt-auto">
                                {uploaded ? (
                                  <div className="flex items-center justify-between">
                                    <StatusPill status={uploaded.status}/>
                                    {uploaded.status==='approved' && <span className="text-xs font-bold" style={{ color:T.emerald.fg }}>+{uploaded.pointsAwarded} pts!</span>}
                                  </div>
                                ) : (
                                  <button onClick={() => setUploadTarget(redir)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
                                    style={{ background:`linear-gradient(135deg,${T.gold},#a8731a)`, color:'#06091a', boxShadow:`0 4px 16px rgba(201,168,76,0.28)` }}>
                                    <Upload size={13}/>Upload Certificate
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
              </motion.div>
            )}

            {/* ── LEADERBOARD ───────────────────────────────────────── */}
            {activeTab==='leaderboard' && (
              <motion.div key="lb" {...fadeUp} className="space-y-5">

                {/* Header Banner */}
                <div className="relative rounded-3xl p-7 overflow-hidden"
                  style={{ background:'linear-gradient(135deg,rgba(201,168,76,0.12),rgba(11,15,42,0.8))', border:`1px solid ${T.goldBorder}` }}>
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                    style={{ background:'radial-gradient(circle,rgba(201,168,76,0.16) 0%,transparent 65%)', transform:'translate(20%,-20%)' }}/>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:T.gold }}>Global Rankings</p>
                      <h2 className="text-2xl font-black mb-1" style={{ color:T.text.primary, fontFamily:"'Playfair Display',serif" }}>AI Interview Leaderboard</h2>
                      <p className="text-sm" style={{ color:T.text.secondary }}>Earn <span style={{ color:T.goldLight, fontWeight:700 }}>points</span> by acing your mock interviews. Climb the ranks!</p>
                    </div>
                    <button onClick={handleLaunchInterview} disabled={ssoLoading}
                      className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50"
                      style={{ background:`linear-gradient(135deg,${T.gold},#a8731a)`, color:'#06091a', boxShadow:`0 8px 28px rgba(201,168,76,0.35)` }}>
                      {ssoLoading ? <RefreshCw size={14} className="animate-spin"/> : <Mic size={14}/>}
                      {ssoLoading ? 'Loading...' : 'Start Interview'}
                    </button>
                  </div>
                </div>

                {/* Podium — Top 3 */}
                {!lbLoading && leaderboard.length >= 3 && (
                  <div className="grid grid-cols-3 gap-3">
                    {[leaderboard[1], leaderboard[0], leaderboard[2]].map((s, pos) => {
                      const realRank = pos===1 ? 1 : pos===0 ? 2 : 3;
                      const podiumColors = {
                        1: { bg:'linear-gradient(135deg,rgba(201,168,76,0.18),rgba(11,15,42,0.8))', border:T.goldBorder, color:T.gold, icon:'🥇', size:'text-3xl' },
                        2: { bg:'linear-gradient(135deg,rgba(148,163,184,0.12),rgba(11,15,42,0.8))', border:'rgba(148,163,184,0.25)', color:'#94a3b8', icon:'🥈', size:'text-2xl' },
                        3: { bg:'linear-gradient(135deg,rgba(180,113,60,0.12),rgba(11,15,42,0.8))', border:'rgba(180,113,60,0.25)', color:'#cd7f32', icon:'🥉', size:'text-2xl' },
                      }[realRank];
                      if (!s) return <div key={pos}/>;
                      return (
                        <motion.div key={s._id || pos}
                          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: pos*0.08 }}
                          className={`relative rounded-3xl p-5 text-center overflow-hidden ${realRank===1 ? 'row-start-1' : ''}`}
                          style={{ background:podiumColors.bg, border:`1px solid ${podiumColors.border}`, marginTop: realRank===1 ? 0 : '1rem' }}>
                          <div className="text-3xl mb-2">{podiumColors.icon}</div>
                          <div className="w-12 h-12 rounded-2xl mx-auto mb-2 flex items-center justify-center text-lg font-black"
                            style={{ background:`${podiumColors.color}22`, border:`1px solid ${podiumColors.color}44`, color:podiumColors.color }}>
                            {s.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <p className="font-bold text-xs truncate" style={{ color:T.text.primary }}>{s.name}</p>
                          <p className="text-xs font-black mt-1" style={{ color:podiumColors.color, fontFamily:"'DM Mono',monospace" }}>{(s.profilePoints||0).toLocaleString()} pts</p>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Full Rankings Table */}
                <div className="rounded-3xl overflow-hidden" style={{ border:`1px solid ${T.border}` }}>
                  {/* Header */}
                  <div className="grid grid-cols-12 px-5 py-3 text-[10px] font-bold uppercase tracking-widest"
                    style={{ background:'rgba(255,255,255,0.03)', borderBottom:`1px solid ${T.border}`, color:T.text.muted }}>
                    <span className="col-span-1">#</span>
                    <span className="col-span-5">Student</span>
                    <span className="col-span-3 text-right">Interviews</span>
                    <span className="col-span-3 text-right">Points</span>
                  </div>

                  {lbLoading ? (
                    <div className="py-12 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative w-8 h-8">
                          <div className="absolute inset-0 rounded-full border-2" style={{ borderColor:`${T.gold}22` }}/>
                          <motion.div className="absolute inset-0 rounded-full border-2 border-transparent"
                            style={{ borderTopColor:T.gold }}
                            animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}/>
                        </div>
                        <span className="text-xs" style={{ color:T.text.muted }}>Loading rankings...</span>
                      </div>
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <EmptyState icon={Trophy} title="No rankings yet" sub="Complete an AI interview to appear on the leaderboard."
                      cta="Start Interview" onClick={handleLaunchInterview}/>
                  ) : leaderboard.map((s, i) => {
                    const isMe = s._id?.toString() === (user?._id || user?.id)?.toString();
                    const rankColors = { 0:`#e8c97a`, 1:`#94a3b8`, 2:`#cd7f32` };
                    const rankColor = rankColors[i] || T.text.muted;
                    return (
                      <motion.div key={s._id || i}
                        initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.04 }}
                        className="grid grid-cols-12 items-center px-5 py-4 transition-colors"
                        style={{
                          borderBottom: i < leaderboard.length-1 ? `1px solid ${T.border}` : 'none',
                          background: isMe ? `rgba(201,168,76,0.06)` : 'transparent',
                        }}>
                        {/* Rank */}
                        <div className="col-span-1">
                          {i < 3
                            ? <span className="text-base">{['🥇','🥈','🥉'][i]}</span>
                            : <span className="text-sm font-black" style={{ color:T.text.muted, fontFamily:"'DM Mono',monospace" }}>{i+1}</span>}
                        </div>
                        {/* Name & badges */}
                        <div className="col-span-5 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                            style={{ background:isMe?`${T.gold}25`:`rgba(255,255,255,0.05)`, border:`1px solid ${isMe?T.goldBorder:T.border}`, color:isMe?T.gold:T.text.secondary }}>
                            {s.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color:isMe?T.goldLight:T.text.primary }}>
                              {s.name}{isMe && <span className="ml-1.5 text-[9px] font-black px-1.5 py-0.5 rounded" style={{ background:`${T.gold}25`, color:T.gold }}>YOU</span>}
                            </p>
                            {s.badges?.slice(0,2).map(b => (
                              <span key={b} className="text-[9px] font-semibold mr-1" style={{ color:T.text.muted }}>🏅{b}</span>
                            ))}
                          </div>
                        </div>
                        {/* Interview count */}
                        <div className="col-span-3 text-right">
                          <span className="text-xs font-semibold" style={{ color:T.text.secondary }}>
                            {s.interviewCount || 0} <span style={{ color:T.text.muted }}>interviews</span>
                          </span>
                        </div>
                        {/* Points */}
                        <div className="col-span-3 text-right">
                          <span className="text-sm font-black" style={{ color:rankColor, fontFamily:"'DM Mono',monospace" }}>
                            {(s.profilePoints||0).toLocaleString()}
                          </span>
                          <span className="text-[10px] ml-0.5" style={{ color:T.text.muted }}>pts</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

              </motion.div>
            )}

            {/* ── SETTINGS ─────────────────────────────────────────── */}
            {activeTab==='settings' && (
              <SettingsPanel
                user={user}
                data={d}
                showToast={showToast}
                fileInputRef={fileInputRef}
                handleAvatarUpload={handleAvatarUpload}
              />
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;