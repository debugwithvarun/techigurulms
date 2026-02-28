import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Award, ExternalLink, Layers, User, ShieldCheck,
  Sparkles, Filter, Lock, Star, X, LogIn, ArrowRight, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { getImageUrl } from '../config';
import { useAuth } from '../context/AuthContext';

// ── Skeleton ─────────────────────────────────────────────────────────────────
const CertificateSkeleton = () => (
  <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm h-[420px] flex flex-col animate-pulse">
    <div className="h-48 bg-slate-200 w-full relative">
      <div className="absolute top-4 left-4 w-20 h-6 bg-slate-300 rounded-full"></div>
    </div>
    <div className="p-6 flex-1 flex flex-col space-y-4">
      <div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded-md w-full"></div>
      <div className="h-4 bg-slate-200 rounded-md w-2/3"></div>
      <div className="mt-auto flex items-center gap-3 pt-4 border-t border-slate-50">
        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-200 rounded w-1/3"></div>
          <div className="h-2 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  </div>
);

// ── Login Gate Modal ──────────────────────────────────────────────────────────
const LoginGateModal = ({ cert, onClose, onLogin }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    onClick={onClose}>
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
      className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
      onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-2">
        <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
          <Lock size={22} className="text-violet-600" />
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
          <X size={14} className="text-slate-500" />
        </button>
      </div>
      <h3 className="text-2xl font-black text-slate-900 mt-4 mb-2">Login Required</h3>
      <p className="text-slate-500 mb-6 leading-relaxed">
        To access <strong className="text-slate-800">{cert?.title}</strong>, you need to be logged in. 
        Your progress and certificate uploads will be tracked to your account.
      </p>
      <div className="flex flex-col gap-3">
        <button onClick={onLogin}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-2xl transition-colors">
          <LogIn size={18} />Sign In to Continue
        </button>
        <button onClick={onClose} className="w-full py-3 rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold transition-colors">
          Maybe Later
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ── Main Page ────────────────────────────────────────────────────────────────
const CertificatesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isInactiveRoute = location.pathname.includes('inactive');
  const pageStatus = isInactiveRoute ? 'Inactive' : 'Active';

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loginGateCert, setLoginGateCert] = useState(null);
  const [trackingId, setTrackingId] = useState(null);

  const genres = ['All', ...Array.from(new Set(certificates.map(c => c.genre).filter(Boolean)))];

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/certificates?status=${pageStatus}`);
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setTimeout(() => setLoading(false), 400);
      }
    };
    fetchCertificates();
  }, [pageStatus]);

  const handleExternalLinkClick = async (cert) => {
    if (!user) {
      setLoginGateCert(cert);
      return;
    }
    // Track redirect
    try {
      setTrackingId(cert._id);
      await api.post(`/student/cert-redirect/${cert._id}`);
    } catch {
      // silently continue
    } finally {
      setTrackingId(null);
    }
    window.open(cert.link, '_blank', 'noopener,noreferrer');
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || cert.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-violet-200 selection:text-violet-900 relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-violet-50/80 to-transparent -z-10" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-pink-100/30 rounded-full blur-3xl -z-10" />

      {/* Login Gate Modal */}
      <AnimatePresence>
        {loginGateCert && (
          <LoginGateModal
            cert={loginGateCert}
            onClose={() => setLoginGateCert(null)}
            onLogin={() => navigate('/login', { state: { from: location.pathname } })}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 space-y-12">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
          <div className="space-y-4 max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-violet-100 shadow-sm text-xs font-bold text-violet-600 uppercase tracking-wider">
              <Sparkles size={14} />
              {isInactiveRoute ? 'Archive Mode' : 'Verified Certifications'}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              {isInactiveRoute ? 'Legacy & Archived' : 'Professional'}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Certificates</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 font-medium leading-relaxed">
              {isInactiveRoute
                ? 'Access our library of completed cohorts and past certification programs.'
                : 'Elevate your career with our industry-recognized certification programs. Each certificate earns you points.'}
            </motion.p>
            {/* Login prompt for logged-out users */}
            {!user && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-sm">
                <Lock size={15} className="text-amber-500 flex-shrink-0" />
                <span className="text-amber-700 font-medium">
                  <button onClick={() => navigate('/login')} className="font-bold text-amber-600 hover:underline">Sign in</button>
                  {' '}to track your certificates and earn points for completing programs.
                </span>
              </motion.div>
            )}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 bg-white/80 backdrop-blur-md p-2 rounded-3xl border border-white shadow-xl shadow-slate-200/50">
            <div className="relative group flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={20} />
              <input type="text" placeholder="Search certificates..."
                className="w-full h-12 pl-12 pr-4 bg-transparent rounded-2xl outline-none text-slate-700 font-medium placeholder:text-slate-400"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Filter size={18} /></div>
              <select className="h-12 pl-10 pr-8 bg-slate-50 hover:bg-violet-50 text-slate-600 hover:text-violet-700 border-l border-slate-100 rounded-2xl outline-none font-bold text-sm cursor-pointer transition-colors appearance-none min-w-[140px]"
                value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </motion.div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, i) => <CertificateSkeleton key={i} />)
          ) : filteredCertificates.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredCertificates.map((cert, idx) => (
                <motion.div key={cert._id} layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-100/80 shadow-sm hover:shadow-2xl hover:shadow-violet-900/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden">

                  {/* Thumbnail */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                    <img
                      src={getImageUrl(cert.thumbnail) || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop'}
                      alt={cert.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" />
                    {/* Badges */}
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                      <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-slate-800 shadow-lg uppercase tracking-wider">{cert.genre}</span>
                      {isInactiveRoute && <span className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-wider">Archived</span>}
                    </div>
                    {/* Points badge */}
                    {cert.points > 0 && (
                      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-amber-500 text-white px-2.5 py-1.5 rounded-xl text-[11px] font-black shadow-lg">
                        <Star size={10} fill="currentColor" />{cert.points} pts
                      </div>
                    )}
                    {/* Hover CTA */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                      <button
                        onClick={() => handleExternalLinkClick(cert)}
                        disabled={trackingId === cert._id}
                        className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-violet-50 hover:text-violet-700 disabled:opacity-70">
                        {trackingId === cert._id ? 'Opening…' : 'View Program'}
                        {!user ? <Lock size={14} className="text-amber-500" /> : <ExternalLink size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-6 lg:p-8 relative">
                    <div className="absolute -top-6 right-6 w-12 h-12 bg-white rounded-2xl shadow-lg border border-slate-50 flex items-center justify-center z-20 group-hover:scale-110 transition-transform">
                      <Award className="text-violet-600" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-violet-700 transition-colors">{cert.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">{cert.description}</p>
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-700 font-bold text-xs shrink-0 overflow-hidden">
                          {cert.instructor?.avatar ? <img src={getImageUrl(cert.instructor.avatar)} alt="Inst" className="w-full h-full object-cover" /> : <User size={14} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">{cert.instructor?.name || 'Techiguru'}</span>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{cert.instructor?.title || 'Instructor'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {cert.points > 0 && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                            🏅 {cert.points}pts
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                          <ShieldCheck size={12} /><span className="text-[10px] font-bold uppercase">Verified</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button onClick={() => handleExternalLinkClick(cert)}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-violet-100 hover:border-violet-500 hover:bg-violet-50 text-slate-600 hover:text-violet-700 font-bold text-sm transition-all">
                      {!user ? <><Lock size={14} className="text-amber-500" />Login to Access</> : <><Eye size={14} />View Program<ArrowRight size={13} className="ml-auto" /></>}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Layers size={40} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No Certificates Found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                We couldn't find any {pageStatus.toLowerCase()} certificates matching your criteria.
              </p>
              <button onClick={() => { setSearchTerm(''); setSelectedGenre('All'); }}
                className="mt-6 text-violet-600 font-bold hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage;
