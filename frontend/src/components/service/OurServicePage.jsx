import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from "../../context/';
import { useAuth } from "../../context/AuthContext";
import {
  Bot, FileText, Languages, Image, MessageSquare, Code2,
  BarChart3, Zap, ArrowRight, CheckCircle2, Star,
  Shield, Layers, RefreshCw, HeadphonesIcon, ChevronRight,
  Sparkles, Play, Terminal, Cpu, Activity, Briefcase,
  Mic, Video
} from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────────────────

const services = [
  {
    id: 1,
    icon: Mic,
    title: 'AI Mock Interview',
    desc: 'Simulate real-world, role-specific interviews with AI-driven questions and receive detailed feedback on responses, tone, and delivery.',
    tag: 'INTERVIEW PREP',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    gradient: 'from-emerald-500 to-teal-500',
    lightBg: 'bg-emerald-50',
    link: 'https://imshopper-aimockinterview.hf.space',
    featured: true,
  },
  {
    id: 2,
    icon: FileText,
    title: 'AI Quiz Generator',
    desc: 'Automatically generate structured quizzes from any topic, including multiple-choice questions, answers, and difficulty levels.',
    tag: 'GENERATOR',
    tagColor: 'bg-purple-50 text-purple-700 border-purple-100',
    gradient: 'from-purple-500 to-indigo-600',
    lightBg: 'bg-purple-50',
    link: 'https://imshopper-ai-quiz-generator.hf.space/',
    featured: false,
  },
  {
    id: 3,
    icon: Briefcase,
    title: 'AI Resume Enhancer',
    desc: 'Optimize resumes using AI by improving formatting, enhancing bullet points, and aligning skills with job descriptions.',
    tag: 'TOOL',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-100',
    gradient: 'from-blue-500 to-cyan-500',
    lightBg: 'bg-blue-50',
    link: 'https://imshopper-ai-resume-enhancer.hf.space/',
    featured: false,
  },
  {
    id: 4,
    icon: Languages,
    title: 'AI Soft Skills Trainer',
    desc: 'Train communication, confidence, and interpersonal abilities through AI-driven simulations with real-time feedback and scoring.',
    tag: 'AI',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    gradient: 'from-emerald-500 to-teal-500',
    lightBg: 'bg-emerald-50',
    link: 'https://imshopper-ai-softskills-trainer.hf.space/',
    featured: false,
  },
  {
    id: 5,
    icon: Image,
    title: 'AI Code Generator',
    desc: 'Generate clean, functional code snippets across multiple languages with AI-assisted logic generation and optimization.',
    tag: 'GENERATOR',
    tagColor: 'bg-pink-50 text-pink-700 border-pink-100',
    gradient: 'from-pink-500 to-rose-500',
    lightBg: 'bg-pink-50',
    link: 'https://imshopper-ai-code-generator.hf.space/',
    featured: false,
  },
  {
    id: 6,
    icon: Bot,
    title: 'AI Job Assistant',
    desc: 'Assist your job search with AI-powered recommendations, application tracking, and personalized career guidance.',
    tag: 'AI',
    tagColor: 'bg-violet-50 text-violet-700 border-violet-100',
    gradient: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50',
    link: 'https://imshopper-ai-jobs-assistant.hf.space/',
    featured: false,
  },
  {
    id: 7,
    icon: Code2,
    title: 'AI Mentor',
    desc: 'Provide guided learning with AI by explaining concepts, reviewing code, and offering step-by-step solutions to technical problems.',
    tag: 'GENERATOR',
    tagColor: 'bg-orange-50 text-orange-700 border-orange-100',
    gradient: 'from-orange-500 to-amber-500',
    lightBg: 'bg-orange-50',
    link: 'https://imshopper-ai-mentors.hf.space/',
    featured: false,
  },
  {
    id: 8,
    icon: BarChart3,
    title: 'AI Document Converter',
    desc: 'Convert documents across formats (PDF, DOCX, TXT) with AI-powered structure preservation and content optimization.',
    tag: 'TOOL',
    tagColor: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    gradient: 'from-cyan-500 to-blue-500',
    lightBg: 'bg-cyan-50',
    link: 'https://imshopper-ai-doc-convertor.hf.space/',
    featured: false,
  },
];

const processSteps = [
  { num: '01', title: 'Assessment',      desc: 'We evaluate your current knowledge level and academic goals.',      icon: MessageSquare },
  { num: '02', title: 'Planning',        desc: 'AI generates a personalized learning path and syllabus.',           icon: Layers },
  { num: '03', title: 'Creation',        desc: 'Our tools build your study materials, essays, and codes.',          icon: Code2 },
  { num: '04', title: 'Implementation', desc: 'Engage with interactive tutors and complete assignments.',           icon: Zap },
  { num: '05', title: 'Mastery',         desc: 'Achieve your goals, improve grades, and track success.',            icon: HeadphonesIcon },
];

const whyUs = [
  'Personalized Learning Paths',
  '24/7 Academic Support',
  'Subject-Specific AI Models',
  'Student Data Privacy (FERPA)',
  'Constantly Updated Curriculum',
  'Interactive Study Tools',
];

const highlights = [
  { title: 'Adaptive AI Tools',       desc: 'Generators and analyzers that adjust to your academic level.' },
  { title: 'University Integrations', desc: 'Seamlessly connect with Canvas, Blackboard, and Google Classroom.' },
  { title: 'Real-Time Feedback',      desc: 'Instant corrections on code, essays, and data analysis.' },
];

const tags = ['ALL', 'GENERATOR', 'TOOL', 'AI', 'INTERVIEW PREP'];

// ─── CARD COMPONENT ────────────────────────────────────────────────────────────

const ServiceCard = ({ service, index, onExplore }) => {
  const Icon = service.icon;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut', delay: index * 0.1 },
        },
      }}
      className="group relative bg-white rounded-[2rem] p-6 md:p-8 border border-slate-200/60 hover:border-[#8B3DFF]/30 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(139,61,255,0.15)] transition-all duration-500 flex flex-col h-full overflow-hidden cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500`} />
      <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${service.gradient} blur-[50px] rounded-full opacity-0 group-hover:opacity-20 transition-all duration-700`} />

      {service.featured && (
        <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/25">
          <Star size={10} fill="currentColor" /> POPULAR
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-8">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} blur-md opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500`} />
            <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out shadow-sm`}>
              <Icon size={24} className="text-white" strokeWidth={2} />
            </div>
          </div>
          {!service.featured && (
            <span className={`text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full border ${service.tagColor} shadow-sm`}>
              {service.tag}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#8B3DFF] transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed flex-grow mb-8">
          {service.desc}
        </p>

        {/* ── Explore Tool — auth-aware click ── */}
        <div
          onClick={() => onExplore(service)}
          className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto group-hover:border-purple-100 transition-colors duration-300"
        >
          <span className="text-sm font-bold text-slate-600 group-hover:text-[#8B3DFF] transition-colors duration-300">
            Explore Tool
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#8B3DFF] transition-colors duration-300">
            <ArrowRight
              size={14}
              className="text-slate-400 group-hover:text-white transition-all duration-300 -translate-x-0.5 group-hover:translate-x-0"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const OurServicesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTag, setActiveTag] = useState('ALL');
  const filtered =
    activeTag === 'ALL' ? services : services.filter((s) => s.tag === activeTag);

  // Smooth scroll to services grid
  const handleViewService = () => {
    document.getElementById('our-tools')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auth-aware card explore handler
  const handleExplore = (service) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (service.link && service.link !== '#') {
      window.open(service.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-[#FDF8FD] min-h-screen font-sans">

      {/* ── HERO BANNER ───────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-visible bg-[#090514] pt-32 pb-48 px-6 z-10">

        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-600/30 rounded-full blur-[150px]"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-500/30 rounded-full blur-[120px]"
          />
          <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-[#00FFD1]/10 rounded-full blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-20 flex flex-col items-center text-center">

          {/* Top label */}
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFD1] to-[#8B3DFF] font-black tracking-[0.2em] uppercase text-sm mb-6 block"
          >
            Our Services
          </motion.span>

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
            className="relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
            <div className="relative inline-flex items-center gap-2 bg-[#1A102A]/80 border border-emerald-500/30 text-white/90 text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full mb-8 backdrop-blur-xl">
              <Sparkles size={14} className="text-[#00FFD1]" /> AI Mock Interviews are Live
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="text-5xl md:text-7xl lg:text-[5rem] font-extrabold text-white leading-[1.1] tracking-tight mb-8"
          >
            Ace Your Next Interview with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFD1] via-[#8B3DFF] to-[#FF3D9A] animate-gradient-x">
              Generative AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
          >
            Practice real-world interview scenarios, get instant behavioral feedback, and land your
            dream role—all powered by an advanced AI interviewer.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="flex items-center justify-center gap-5 flex-wrap"
          >
            <button
              onClick={handleViewService}
              className="flex items-center gap-2 bg-white text-[#0A0118] font-extrabold px-8 py-4 rounded-xl shadow-[0_0_40px_rgba(0,255,209,0.4)] hover:shadow-[0_0_60px_rgba(139,61,255,0.4)] hover:-translate-y-1 transition-all duration-300 text-sm"
            >
              View Service <ArrowRight size={16} />
            </button>
            <button className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl backdrop-blur-md transition-all duration-300 text-sm">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Play size={10} fill="white" />
              </div>
              Watch Demo
            </button>
          </motion.div>

          {/* Floating Glass Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: [0, -15, 0] }}
            transition={{
              opacity: { duration: 1, delay: 0.5 },
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 },
            }}
            className="mt-20 w-full max-w-4xl relative z-30"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFD1]/20 via-[#8B3DFF]/20 to-[#FF3D9A]/20 blur-2xl rounded-3xl" />
            <div className="relative bg-[#110A1F]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">

              {/* Window bar */}
              <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="mx-auto flex items-center gap-2 px-3 py-1 rounded-md bg-black/20 border border-white/5 text-[10px] text-slate-400 font-mono">
                  <Cpu size={12} className="text-[#00FFD1]" /> ai-mock-interview.ts
                </div>
              </div>

              <div className="flex h-64 md:h-80">
                {/* Sidebar */}
                <div className="hidden md:flex flex-col w-48 border-r border-white/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white/90 bg-white/10 px-3 py-2 rounded-lg text-xs font-medium">
                    <Video size={14} className="text-[#00FFD1]" /> Practice Sessions
                  </div>
                  <div className="flex items-center gap-2 text-white/40 hover:text-white/80 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                    <Mic size={14} /> Speech Analysis
                  </div>
                  <div className="flex items-center gap-2 text-white/40 hover:text-white/80 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                    <Activity size={14} /> Feedback Report
                  </div>
                </div>

                {/* Code panel */}
                <div className="flex-1 p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <Terminal size={14} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Analyzing Interview Response...</div>
                      <div className="text-[10px] text-slate-400">Processing tone, keywords & confidence level</div>
                    </div>
                  </div>
                  <div className="flex-1 bg-black/40 rounded-xl border border-white/5 p-4 font-mono text-xs text-left overflow-hidden flex flex-col gap-2">
                    <div className="text-slate-500">// Initialize AI Interviewer</div>
                    <div className="text-emerald-400">
                      const <span className="text-white">session</span> ={' '}
                      <span className="text-purple-400">new</span>{' '}
                      <span className="text-amber-300">MockInterviewer</span>(&#123;
                    </div>
                    <div className="text-white pl-4">
                      role: <span className="text-blue-300">'Software Engineer'</span>,
                    </div>
                    <div className="text-white pl-4">
                      focus: <span className="text-orange-300">'Behavioral & Technical'</span>,
                    </div>
                    <div className="text-white">&#125;);</div>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-auto overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        className="h-full bg-gradient-to-r from-[#00FFD1] to-[#8B3DFF]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 translate-y-[1px]">
          <svg
            viewBox="0 0 1440 120"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-[60px] md:h-[120px]"
            preserveAspectRatio="none"
          >
            <path d="M0,120 C360,0 1080,0 1440,120 L1440,120 L0,120 Z" fill="#FDF8FD" />
          </svg>
        </div>
      </section>

      {/* ── SERVICES GRID ─────────────────────────────────────────────────── */}
      <section id="our-tools" className="py-24 px-6 max-w-[1400px] mx-auto mt-10 md:mt-24 relative z-30">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1.5 px-4 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
          >
            Our Tools
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Discover Our AI-Powered Suite
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto"
          >
            Tools and generators designed to transform your academic operations and unlock your full potential.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-3 mb-16 flex-wrap">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 border ${
                activeTag === tag
                  ? 'bg-[#8B3DFF] text-white border-[#8B3DFF] shadow-lg shadow-purple-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-[#8B3DFF] hover:text-[#8B3DFF]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((service, i) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={i}
                onExplore={handleExplore}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block py-1.5 px-4 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest mb-5"
              >
                Why Choose Us
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight"
              >
                Why Choose <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  Techiguru?
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-slate-500 text-base leading-relaxed mb-10 max-w-md"
              >
                We combine cutting-edge AI technology with deep academic needs to deliver tools that
                not only meet your current study requirements but also scale with your higher
                education goals.
              </motion.p>

              <motion.ul
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, staggerChildren: 0.08 }}
                className="space-y-4"
              >
                {whyUs.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    className="flex items-center gap-3 text-slate-700 font-bold text-sm"
                  >
                    <CheckCircle2 size={20} className="text-[#8B3DFF] flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Right: Highlights Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#FDF8FD] rounded-[2.5rem] border border-slate-200/50 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-8 lg:p-12"
            >
              <div className="flex items-center gap-3 mb-10">
                <div className="w-1.5 h-8 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full" />
                <h3 className="text-2xl font-bold text-slate-900">Platform Highlights</h3>
              </div>

              <div className="space-y-6">
                {highlights.map((h, i) => (
                  <div
                    key={i}
                    className="group flex gap-5 p-4 rounded-3xl hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer border border-transparent hover:border-purple-100"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-200">
                      {i === 0 ? (
                        <Shield size={20} className="text-white" />
                      ) : i === 1 ? (
                        <Layers size={20} className="text-white" />
                      ) : (
                        <RefreshCw size={20} className="text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-[#8B3DFF] transition-colors">
                        {h.title}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200/60 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-3xl font-black text-slate-900">50k+</p>
                  <p className="text-xs text-slate-500 font-bold tracking-wide uppercase mt-1">Students</p>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div className="text-center">
                  <p className="text-3xl font-black text-slate-900">99.9%</p>
                  <p className="text-xs text-slate-500 font-bold tracking-wide uppercase mt-1">Accuracy</p>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div className="text-center">
                  <p className="text-3xl font-black text-slate-900">50+</p>
                  <p className="text-xs text-slate-500 font-bold tracking-wide uppercase mt-1">Models</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── DEVELOPMENT PROCESS ───────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-[1400px] mx-auto bg-[#FDF8FD]">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1.5 px-4 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Your Path to Success
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg max-w-xl mx-auto"
          >
            A proven methodology that ensures you get the most out of our AI tools for your
            academic journey.
          </motion.p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-purple-200 to-transparent z-0" />

          <motion.div
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10"
          >
            {processSteps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                  }}
                  className="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(139,61,255,0.1)] hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center cursor-pointer"
                >
                  <div className="relative w-16 h-16 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200 group-hover:shadow-purple-400 group-hover:scale-110 transition-all duration-300">
                      <span className="text-white font-black text-xl">{step.num}</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <StepIcon size={14} className="text-[#8B3DFF]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-[#8B3DFF] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto relative bg-[#090514] rounded-[3rem] overflow-hidden shadow-2xl shadow-purple-900/20"
        >
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[80px]" />

          <div className="relative z-10 px-10 py-20 text-center">
            <span className="inline-flex items-center gap-2 bg-white/10 text-white/80 border border-white/10 text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full mb-6 backdrop-blur-md">
              <Sparkles size={14} className="text-[#00FFD1]" /> Back to School Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Ready to Transform <br className="hidden md:block" /> Your Academic Performance?
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join 50,000+ students already leveraging our AI tools. Start your free trial today —
              no credit card required.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button className="flex items-center gap-2 bg-white text-[#0A0118] font-bold px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(139,61,255,0.3)] hover:scale-105 transition-all duration-300 text-sm">
                Enroll Now <ChevronRight size={16} />
              </button>
              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl backdrop-blur-md transition-all duration-300 text-sm">
                View Campus Plans
              </button>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default OurServicesPage;