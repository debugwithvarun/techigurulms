import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, CheckCircle, GraduationCap, Users, Award, Clock,
  Code, ArrowRight, Star, BookOpen, Globe, Zap
} from 'lucide-react';

const ROLES = [
  { icon: Code,       title: 'Full Stack Developer',       stack: 'React · Node.js · MongoDB',       color: '#6366f1' },
  { icon: Globe,      title: 'Frontend Developer',         stack: 'React · Tailwind · TypeScript',    color: '#8b5cf6' },
  { icon: Zap,        title: 'Backend Developer',          stack: 'Node.js · Express · MongoDB',      color: '#a855f7' },
  { icon: BookOpen,   title: 'Data Science / AI‑ML',       stack: 'Python · TensorFlow · Pandas',     color: '#d946ef' },
  { icon: Briefcase,  title: 'UI/UX Designer',             stack: 'Figma · Prototyping · Research',   color: '#7c3aed' },
  { icon: Users,      title: 'Digital Marketing',          stack: 'SEO · Content · Social Media',    color: '#6d28d9' },
];

const PERKS = [
  { icon: Award,         text: 'Industry Certificate',          sub: 'Recognized by 500+ companies' },
  { icon: GraduationCap, text: 'Expert Mentorship',             sub: 'Dedicated senior assigned' },
  { icon: Briefcase,     text: 'Real-World Projects',           sub: 'Live products you can showcase' },
  { icon: Clock,         text: 'Flexible 2–6 Month Duration',   sub: 'Hybrid / remote friendly' },
  { icon: CheckCircle,   text: 'Letter of Recommendation',      sub: 'Personalized and detailed' },
  { icon: Star,          text: 'Pre-Placement Offer',           sub: 'Top performers considered' },
];

const card = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45 } }),
};

const InternshipPage = () => {
  const navigate = useNavigate();
  const apply = () => navigate('/contact', { state: { tab: 'internship' } });

  return (
    <div className="min-h-screen bg-[#f8f7ff] font-sans">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-28 px-6 text-white"
        style={{ background: 'linear-gradient(135deg, #1e1148 0%, #2d1b6e 40%, #4c1d95 100%)' }}
      >
        {/* decorative blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        {/* grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'56px 56px' }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-purple-200 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Now Hiring · 2024 Cohort Open
          </motion.div>

          <motion.h1 initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
            className="text-5xl md:text-6xl font-black tracking-tight leading-[1.08] mb-6">
            Launch Your Tech Career<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage:'linear-gradient(120deg,#c4b5fd,#f0abfc)' }}>
              with Techiguru Internship
            </span>
          </motion.h1>

          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}
            className="text-purple-200 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Gain hands-on experience on real products, be mentored by senior engineers, and earn
            a certificate that hiring managers recognise — all in an inclusive, remote-friendly environment.
          </motion.p>

          <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={apply}
              className="flex items-center gap-2.5 px-8 py-4 bg-white text-purple-700 font-bold rounded-2xl shadow-lg hover:bg-purple-50 transition-all text-sm hover:scale-[1.02]">
              <Briefcase size={17} /> Apply Now <ArrowRight size={16} />
            </button>
            <a href="#roles"
              className="flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-sm">
              Explore Roles
            </a>
          </motion.div>

          {/* Stats strip */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[['500+','Alumni'],['50+','Projects'],['95%','Placement']].map(([v,l]) => (
              <div key={l} className="text-center">
                <p className="text-3xl font-black text-white">{v}</p>
                <p className="text-purple-300 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Perks ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3">What you gain</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">Everything to Build Your Career</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PERKS.map(({ icon: Icon, text, sub }, i) => (
            <motion.div key={text} custom={i} initial="hidden" whileInView="visible" viewport={{ once:true }} variants={card}
              className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center shrink-0 border border-purple-100">
                <Icon size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{text}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Open Roles ───────────────────────────────────────────────────────── */}
      <section id="roles" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3">Open positions</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Internship Roles</h2>
            <p className="text-slate-400 mt-3 max-w-md mx-auto text-sm">All roles are unpaid / stipend-based, remote-friendly, and 2–6 months long.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ROLES.map(({ icon: Icon, title, stack, color }, i) => (
              <motion.div key={title} custom={i} initial="hidden" whileInView="visible" viewport={{ once:true }} variants={card}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all cursor-pointer"
                onClick={apply}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border"
                  style={{ background: `${color}15`, borderColor: `${color}30` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="font-black text-slate-800 text-base mb-1.5">{title}</h3>
                <p className="text-xs text-slate-400 mb-4">{stack}</p>
                <button className="flex items-center gap-1.5 text-xs font-bold transition-colors"
                  style={{ color }}>
                  Apply for this role <ArrowRight size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
          className="max-w-3xl mx-auto text-center rounded-3xl p-14 relative overflow-hidden"
          style={{ background:'linear-gradient(135deg,#2d1b6e,#4c1d95)' }}>
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'42px 42px' }} />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
            Ready to Begin?
          </h2>
          <p className="text-purple-200 mb-8 relative z-10 max-w-md mx-auto">
            Applications are reviewed within 3–5 business days. Submit yours today and take the first step.
          </p>
          <button onClick={apply}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-purple-700 font-bold rounded-2xl shadow-lg hover:bg-purple-50 transition-all hover:scale-[1.02] relative z-10">
            <Briefcase size={17} /> Submit Application <ArrowRight size={16} />
          </button>
        </motion.div>
      </section>

    </div>
  );
};

export default InternshipPage;
