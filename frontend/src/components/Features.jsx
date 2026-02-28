import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Award, Laptop, Sparkles, ArrowRight, Zap, Shield, Target, Star, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: "Stress-Free Learning",
    desc: "Experience a calm, distraction-free environment that's been scientifically structured for maximum knowledge retention.",
    icon: ThumbsUp,
    gradient: "from-sky-500 to-blue-600",
    glow: "shadow-blue-500/20",
    tag: "Most Popular",
  },
  {
    title: "Industry Certificates",
    desc: "Earn government-recognized certificates that carry real weight. Each cert comes with verifiable credentials and points.",
    icon: Award,
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
    tag: "Earn Points",
  },
  {
    title: "Expert Mentorship",
    desc: "Get 1-on-1 guidance from seasoned professionals who've navigated real industry challenges and career transitions.",
    icon: Laptop,
    gradient: "from-orange-500 to-red-500",
    glow: "shadow-orange-500/20",
    tag: "Live Sessions",
  },
  {
    title: "Skill-Based Curriculum",
    desc: "Every module is laser-focused on job-ready skills. No fluff — just targeted learning that gets you hired faster.",
    icon: Sparkles,
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
    tag: "In-Demand",
  }
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-28 lg:py-36 bg-[#06060f] overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.035) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      {/* Glow blobs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-700/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 relative z-10">

        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold uppercase tracking-widest mb-5">
            <Star size={12} fill="currentColor" /> Why TechiGuru
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">Level Up</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg leading-relaxed">
            We don't just provide courses — we build careers. From certificates with real points to 1-on-1 mentorship, every feature is designed to accelerate your success.
          </motion.p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group relative bg-white/[0.03] border border-white/8 hover:border-white/15 rounded-3xl p-7 flex flex-col transition-all duration-300 cursor-default shadow-xl ${f.glow} hover:shadow-2xl`}>
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none`} />

              {/* Tag */}
              <div className="flex items-center justify-between mb-6">
                <div className={`w-13 h-13 w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg shadow-black/30 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r ${f.gradient} text-white`}>
                  {f.tag}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">{f.desc}</p>

              <div className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-white/40 group-hover:text-purple-400 transition-colors">
                Learn more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => navigate('/active-course')}
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-xl shadow-violet-900/30 transition-all hover:scale-105">
            <Trophy size={18} />Start Learning Today
          </button>
          <button onClick={() => navigate('/active-certificates')}
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white font-semibold transition-all">
            <Award size={18} />Browse Certificates
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default Features;