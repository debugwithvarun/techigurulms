import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Star, ArrowRight, Heart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const SkeletonCard = () => (
  <div className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 animate-pulse">
    <div className="h-60 bg-slate-200" />
    <div className="p-6 space-y-3">
      <div className="flex justify-between">
        <div className="h-4 bg-slate-200 rounded w-16" />
        <div className="h-4 bg-slate-200 rounded w-20" />
      </div>
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-full" />
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-slate-200" />
          <div className="h-4 bg-slate-200 rounded w-24" />
        </div>
      </div>
    </div>
  </div>
);

const CourseCard = ({ course }) => {
  const [hovered, setHovered] = useState(false);
  const price    = course.price === 0 ? 'Free' : `₹${course.price?.toLocaleString('en-IN')}`;
  const oldPrice = course.discountPrice ? `₹${course.discountPrice?.toLocaleString('en-IN')}` : null;
  const students = course.studentsEnrolled >= 1000
    ? `${(course.studentsEnrolled / 1000).toFixed(1)}k`
    : String(course.studentsEnrolled || 0);
  const lessons = course.sections?.reduce((a, s) => a + (s.lessons?.length || 0), 0) || 0;

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -10 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_rgba(139,92,246,0.1)] transition-all duration-300 group flex flex-col h-full"
    >
      <div className="relative h-60 overflow-hidden">
        <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-purple-600 uppercase tracking-wide">
          {course.category}
        </span>
        <button className="absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-colors">
          <Heart size={17} />
        </button>
        <img
          src={course.thumbnail?.url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop'}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1">
            <Star size={15} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-slate-800">{course.rating?.toFixed(1) || '4.8'}</span>
            <span className="text-xs text-slate-400">({course.numReviews || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            {oldPrice && <span className="text-xs text-slate-400 line-through">{oldPrice}</span>}
            <span className="text-lg font-black text-purple-600">{price}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-purple-600 transition-colors cursor-pointer">
          {course.title}
        </h3>

        <div className="flex items-center gap-4 text-slate-500 text-sm mb-6 border-b border-slate-50 pb-5">
          <div className="flex items-center gap-1.5"><BookOpen size={15} /><span>{lessons} Lessons</span></div>
          <div className="flex items-center gap-1.5"><Users size={15} /><span>{students} students</span></div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm border border-purple-100">
              {(course.instructor?.name || 'T')[0].toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-slate-700">{course.instructor?.name || 'TechiGuru'}</span>
          </div>
          <Link to="/active-course"
            className="w-10 h-10 rounded-full bg-slate-50 text-slate-900 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-sm">
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const CourseSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res  = await api.get('/courses?approvalStatus=approved&limit=3');
        const data = res.data?.courses || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setCourses(data.slice(0, 3));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <section className="py-24 bg-[#F8F9FA] relative overflow-hidden">
      {/* Purple glow orb */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-20 relative z-10">

        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-purple-600 font-bold tracking-wider text-sm uppercase mb-2 block">Top Class Courses</span>
            <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Explore Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Best Courses</span>
            </motion.h2>
            <p className="text-slate-500 text-lg">Discover a world of knowledge with our online education platform.</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/active-course"
              className="hidden md:flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full font-bold text-slate-700 hover:border-purple-500 hover:text-purple-600 transition-all shadow-sm">
              View All Courses <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No courses published yet. Check back soon!</p>
          </div>
        ) : (
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          >
            {courses.map(c => <CourseCard key={c._id} course={c} />)}
          </motion.div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Link to="/active-course" className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-purple-200">
            View All Courses <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CourseSection;