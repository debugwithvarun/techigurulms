import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Target, Users, Award, Globe, Zap,
  BookOpen, Heart, TrendingUp, CheckCircle, Mail, ArrowRight, Star
} from 'lucide-react';

const STATS = [
  { value: '50K+', label: 'Active Learners', icon: Users },
  { value: '200+', label: 'Expert Courses', icon: BookOpen },
  { value: '95%', label: 'Completion Rate', icon: TrendingUp },
  { value: '40+', label: 'Countries Reached', icon: Globe },
];

const VALUES = [
  { icon: Target, title: 'Mission-Driven', color: '#a435f0', bg: '#f5f0ff', desc: 'Empowering every learner with world-class education, accessible from anywhere.' },
  { icon: Zap, title: 'Innovation First', color: '#6366f1', bg: '#eef2ff', desc: 'We constantly evolve our platform to stay ahead of educational technology trends.' },
  { icon: Heart, title: 'Learner-Centric', color: '#ec4899', bg: '#fdf2f8', desc: 'Every decision starts with one question: how does this serve our learners better?' },
  { icon: Award, title: 'Quality Assured', color: '#f59e0b', bg: '#fffbeb', desc: 'Rigorous instructor vetting and curriculum standards ensure you always learn the best.' },
];

const TEAM = [
  { name: 'Varun Chauhan', role: 'Founder & CEO', img: 'https://i.pravatar.cc/150?u=varun', bio: 'Passionate educator with 10+ years in tech training.' },
  { name: 'Priya Sharma', role: 'Head of Curriculum', img: 'https://i.pravatar.cc/150?u=priya', bio: 'Former professor turned edtech innovator.' },
  { name: 'Rahul Mehta', role: 'Lead Instructor', img: 'https://i.pravatar.cc/150?u=rahul', bio: 'Full-stack developer with 8+ years at top startups.' },
  { name: 'Anjali Singh', role: 'UX Director', img: 'https://i.pravatar.cc/150?u=anjali', bio: 'Designing learning experiences students love.' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.45 },
});

const AboutPage = () => (
  <div className="bg-white">
    {/* ── Hero ───────────────────────────────────────────────── */}
    <section className="relative overflow-hidden py-24 lg:py-32" style={{ background: 'linear-gradient(135deg, #1c1d1f 0%, #2d2f31 100%)' }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-8 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: '#a435f0' }} />
        <div className="absolute bottom-8 left-1/4 w-64 h-64 rounded-full blur-3xl" style={{ background: '#6366f1' }} />
      </div>
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div {...fadeUp()}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-purple-300 text-sm font-semibold mb-6 border border-white/10">
            <GraduationCap size={15} /> About TechiGuru
          </span>
        </motion.div>
        <motion.h1 {...fadeUp(0.05)} className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
          We Educate the <span style={{ color: '#a435f0' }}>Next Generation</span><br /> of Tech Professionals
        </motion.h1>
        <motion.p {...fadeUp(0.1)} className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          TechiGuru is a professional LMS platform built for ambitious learners. We partner with industry experts to deliver the highest-quality technology education — structured, practical, and career-ready.
        </motion.p>
        <motion.div {...fadeUp(0.15)} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/active-course" className="px-8 py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: '#a435f0' }}>
            Browse Courses
          </Link>
          <Link to="/contact" className="px-8 py-3.5 rounded-xl font-semibold text-sm border border-white/20 text-white hover:bg-white/10 transition-colors">
            Contact Us
          </Link>
        </motion.div>
      </div>
    </section>

    {/* ── Stats ─────────────────────────────────────────────── */}
    <section className="py-16 bg-gray-50 border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div key={i} {...fadeUp(i * 0.07)} className="text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-purple-50">
                <s.icon size={22} className="text-purple-600" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">{s.value}</div>
              <div className="text-sm text-gray-500 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Story ─────────────────────────────────────────────── */}
    <section className="py-20 max-w-5xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div {...fadeUp()}>
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-3 block">Our Story</span>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight">Built by Educators,<br /> Powered by Technology</h2>
          <p className="text-gray-500 leading-relaxed mb-4">
            TechiGuru started in 2022 with a simple belief: <strong>professional skills shouldn't be locked behind expensive degrees.</strong> After spending years in the tech industry, our founders saw firsthand how the right training could transform careers.
          </p>
          <p className="text-gray-500 leading-relaxed mb-6">
            From a small studio in Delhi to a platform reaching thousands of learners across 40+ countries, we've grown because we obsess over one thing — <strong>your success as a learner.</strong>
          </p>
          <div className="space-y-3">
            {['Instructor-led, project-based learning', 'Industry-recognized certifications', 'Lifetime access to course materials', 'Active community of learners'].map((p, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-700"><CheckCircle size={16} className="text-green-500 shrink-0" /> {p}</div>
            ))}
          </div>
        </motion.div>
        <motion.div {...fadeUp(0.1)} className="relative">
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Team working" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Star size={18} className="text-white" />
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">4.9★</div>
                <div className="text-xs text-gray-500">Average Rating</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ── Values ────────────────────────────────────────────── */}
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-3 block">Our Values</span>
          <h2 className="text-3xl font-black text-gray-900">What Drives Us Every Day</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v, i) => (
            <motion.div key={i} {...fadeUp(i * 0.07)} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: v.bg }}>
                <v.icon size={20} style={{ color: v.color }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm">{v.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Team ──────────────────────────────────────────────── */}
    <section className="py-20 max-w-5xl mx-auto px-6">
      <motion.div {...fadeUp()} className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-3 block">Meet the Team</span>
        <h2 className="text-3xl font-black text-gray-900">The People Behind TechiGuru</h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">Educators, technologists, and designers united by a passion for transformative learning.</p>
      </motion.div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAM.map((m, i) => (
          <motion.div key={i} {...fadeUp(i * 0.07)} className="text-center group">
            <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-3 border-2 border-gray-100 group-hover:border-purple-300 transition-colors">
              <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">{m.name}</h4>
            <p className="text-xs font-semibold text-purple-600 mb-1">{m.role}</p>
            <p className="text-xs text-gray-400">{m.bio}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* ── CTA ───────────────────────────────────────────────── */}
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #a435f0, #7c3aed)' }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.h2 {...fadeUp()} className="text-4xl font-black text-white mb-4">Ready to Start Learning?</motion.h2>
        <motion.p {...fadeUp(0.05)} className="text-purple-200 mb-8">Join 50,000+ learners who are transforming their careers with TechiGuru.</motion.p>
        <motion.div {...fadeUp(0.1)} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/active-course" className="px-8 py-3.5 rounded-xl bg-white text-purple-700 font-bold text-sm hover:shadow-lg transition-shadow flex items-center gap-2 justify-center">
            <BookOpen size={16} /> Explore Courses
          </Link>
          <Link to="/contact" className="px-8 py-3.5 rounded-xl border-2 border-white/40 text-white font-bold text-sm hover:bg-white/10 transition-colors flex items-center gap-2 justify-center">
            <Mail size={16} /> Get in Touch <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  </div>
);

export default AboutPage;
