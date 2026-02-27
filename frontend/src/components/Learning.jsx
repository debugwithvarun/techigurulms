import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Play, ArrowRight, MonitorPlay, Users, Award, Clock,
  Sparkles, Globe, TrendingUp, BookOpen
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';

const getImageUrl = (url) => {
  if (!url) return null;
  if (typeof url === 'object' && url.url) return getImageUrl(url.url);
  if (url.startsWith('/uploads') || url.startsWith('\\uploads')) {
    return `http://localhost:5000${url.replace(/\\/g, '/')}`;
  }
  return url;
};

// Animated stat counter
const AnimatedStat = ({ value, suffix = '', label, icon: Icon, color }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const numVal = parseInt(String(value).replace(/\D/g, '')) || 0;

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const step = numVal / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, numVal);
      setCount(Math.floor(current));
      if (current >= numVal) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, numVal]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="text-3xl font-extrabold text-slate-900 mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-slate-500 font-medium">{label}</div>
    </motion.div>
  );
};

const LearningSection = () => {
  const navigate = useNavigate();
  const { courses, fetchCourses } = useCourse();
  const [showcaseCourses, setShowcaseCourses] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchCourses('', '', '', '');
      if (data?.courses) {
        setShowcaseCourses(data.courses.slice(0, 3));
      }
    };
    load();
  }, []);

  const stats = [
    { value: '15000', suffix: '+', label: 'Active Students', icon: Users, color: 'bg-indigo-500' },
    { value: '200', suffix: '+', label: 'Expert Courses', icon: BookOpen, color: 'bg-purple-500' },
    { value: '98', suffix: '%', label: 'Satisfaction Rate', icon: Award, color: 'bg-emerald-500' },
    { value: '500', suffix: '+', label: 'Hrs of Content', icon: Clock, color: 'bg-orange-500' },
  ];

  const features = [
    { icon: MonitorPlay, title: 'HD Video Lessons', desc: 'Crystal-clear video content with offline download support' },
    { icon: Globe, title: 'Learn Anywhere', desc: 'Access from any device — desktop, tablet, or mobile' },
    { icon: TrendingUp, title: 'Track Progress', desc: 'Visual progress bars and milestone achievements' },
    { icon: Sparkles, title: 'Expert Mentors', desc: 'Learn from India\'s top industry professionals' },
  ];

  return (
    <section className="overflow-hidden bg-slate-50">

      {/* ── HERO LEARNING SECTION ─────────────────────────────────────── */}
      <div className="py-20 lg:py-28 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-bold px-4 py-2 rounded-full mb-6 border border-indigo-100">
              <Sparkles size={13} /> India's Leading EdTech Platform
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.15] mb-6 tracking-tight">
              Learn From <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Top Experts</span>,<br />
              Anytime & Anywhere
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
              Master in-demand skills with India's most comprehensive learning platform.
              Structured courses, real-world projects, and industry-recognized certificates — all in one place.
            </p>

            {/* Feature list */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {['Govt. Recognized Certificates', 'Live Expert Sessions', 'Industry Projects', 'Lifetime Access'].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  </div>
                  <span className="text-slate-700 font-medium text-sm">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/active-course')}
                className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25 hover:-translate-y-0.5"
              >
                Explore Courses <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-7 py-3.5 rounded-xl text-sm transition-all border border-slate-200 shadow-sm">
                <Play size={15} className="text-indigo-600" fill="currentColor" /> Watch Demo
              </button>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[
                  'https://i.pravatar.cc/150?u=a01',
                  'https://i.pravatar.cc/150?u=a02',
                  'https://i.pravatar.cc/150?u=a03',
                  'https://i.pravatar.cc/150?u=a04',
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">15,000+ students</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                  <span className="text-xs text-slate-500 ml-1 font-medium">4.9 avg rating</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Visual Composition */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Main image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-[85%] lg:w-[480px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
                alt="Student learning online"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 via-transparent to-transparent" />

              {/* Bottom caption */}
              <div className="absolute bottom-5 left-5 right-5">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                      <MonitorPlay size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Now Learning</p>
                      <p className="text-xs text-slate-500">Full Stack Development · 68% complete</p>
                    </div>
                    <div className="ml-auto">
                      <div className="w-10 h-10 rounded-full border-4 border-indigo-100 flex items-center justify-center">
                        <span className="text-xs font-black text-indigo-700">68%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Overlap small image */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="absolute -bottom-8 -left-4 lg:left-0 w-40 lg:w-52 aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop"
                alt="Students collaborating"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Play button */}
            <motion.button
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              whileHover={{ scale: 1.12 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
              className="absolute top-[45%] left-[15%] lg:left-[5%] z-20 w-16 h-16 lg:w-20 lg:h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 border-4 border-white hover:bg-indigo-700 transition-colors"
            >
              <Play size={26} fill="currentColor" className="ml-1" />
            </motion.button>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute top-6 -left-4 lg:-left-10 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3 z-10"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Award size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">500+ Certs Issued</p>
                <p className="text-xs text-slate-400">This month alone</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ─────────────────────────────────────────────────── */}
      <div className="bg-white border-y border-slate-100 py-10 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <AnimatedStat key={i} {...stat} />
          ))}
        </div>
      </div>

      {/* ── FEATURES GRID ─────────────────────────────────────────────── */}
      <div className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">A complete learning ecosystem built for ambitious students</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-2xl border border-slate-100 p-7 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-indigo-600 transition-colors">
                <f.icon size={22} className="text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── COURSE SHOWCASE ─────────────────────────────────────────────── */}
      {showcaseCourses.length > 0 && (
        <div className="bg-slate-900 py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-indigo-400 text-sm font-bold mb-2 uppercase tracking-widest">Popular Now</p>
                <h2 className="text-3xl font-extrabold text-white">Trending Courses</h2>
              </div>
              <button
                onClick={() => navigate('/active-course')}
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-white transition-colors"
              >
                View All <ArrowRight size={15} />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcaseCourses.map((course, i) => {
                const thumbUrl = getImageUrl(course.thumbnail?.url || course.thumbnail);
                return (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1"
                  >
                    <div className="h-44 overflow-hidden bg-slate-800">
                      <img src={thumbUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                    </div>
                    <div className="p-5">
                      <div className="text-xs text-indigo-400 font-bold uppercase tracking-wide mb-2">{course.category}</div>
                      <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">{course.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Users size={11} /> {course.studentsEnrolled || 0}</span>
                        </div>
                        <span className="font-extrabold text-white">{course.price === 0 ? <span className="text-emerald-400">Free</span> : `₹${Number(course.price).toLocaleString('en-IN')}`}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <button onClick={() => navigate('/active-course')} className="text-sm font-semibold text-indigo-400">
                View All Courses →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TRUSTED BY ─────────────────────────────────────────────────── */}
      <div className="bg-white py-14 px-6 lg:px-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
            Our students work at India's top companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {['Infosys', 'TCS', 'Wipro', 'Reliance', 'Amazon', 'Flipkart'].map((company, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-xl lg:text-2xl font-black text-slate-300 hover:text-slate-500 transition-colors cursor-default select-none"
              >
                {company}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningSection;