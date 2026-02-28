import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Users, BookOpen, CheckCircle, PlayCircle,
    MonitorPlay, FileText, Code, Award, ChevronDown,
    Star, Globe, Zap, ArrowRight, Lock, Loader2, BarChart2, Share2, LayoutList
} from 'lucide-react';

// ── UTILITIES ─────────────────────────────────────────────────────────────
const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop';
    if (typeof url === 'object' && url.url) return getImageUrl(url.url);
    if (url.startsWith('/uploads') || url.startsWith('\\uploads')) {
        return `http://localhost:5000${url.replace(/\\/g, '/')}`;
    }
    return url;
};

const formatDuration = (seconds) => {
    if (!seconds) return null;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
};

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────

// 1. Sticky Pricing Card
const PricingCard = ({ course, isEnrolled, enrolling, onEnroll, enrollSuccess }) => {
    const formattedPrice = course.price === 0 ? 'Free' : `₹${Number(course.price).toLocaleString('en-IN')}`;
    const thumbUrl = getImageUrl(course.thumbnail?.url || course.thumbnail);
    const dur = formatDuration(course.totalDuration);

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200/60 overflow-hidden sticky top-24">
            <div className="relative aspect-video bg-slate-900 group cursor-pointer overflow-hidden">
                <img src={thumbUrl} alt={course.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:bg-white/30 transition-all">
                        <PlayCircle size={32} className="text-white ml-1 drop-shadow-md" />
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-6">
                <div className="flex items-end gap-3">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{formattedPrice}</span>
                    {course.originalPrice && course.originalPrice > course.price && (
                        <div className="flex flex-col mb-1">
                            <span className="text-sm font-bold text-emerald-600">
                                {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off
                            </span>
                            <span className="text-sm text-slate-400 line-through">₹{Number(course.originalPrice).toLocaleString('en-IN')}</span>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {enrollSuccess && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                            <CheckCircle size={16} /> You're enrolled! Happy learning 🎉
                        </motion.div>
                    )}
                </AnimatePresence>

                {isEnrolled ? (
                    <Link to={`/course/${course._id}/learn`} className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20">
                        <PlayCircle size={20} /> Continue Learning
                    </Link>
                ) : (
                    <button onClick={onEnroll} disabled={enrolling} className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2">
                        {enrolling ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : (course.price === 0 ? 'Enroll for Free' : 'Enroll Now')}
                    </button>
                )}

                <div className="pt-6 border-t border-slate-100">
                    <p className="font-semibold text-slate-800 text-sm mb-4">This course includes:</p>
                    <ul className="space-y-3.5">
                        {[
                            { icon: MonitorPlay, text: `${dur ? dur + ' on-demand video' : 'Video lessons'}` },
                            { icon: FileText, text: 'Downloadable resources' },
                            { icon: Code, text: 'Hands-on coding exercises' },
                            { icon: Award, text: 'Certificate of completion' },
                            { icon: Zap, text: 'Full lifetime access' }
                        ].map(({ icon: Icon, text }, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                <Icon size={16} className="text-indigo-500/80 shrink-0" /> {text}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// 2. Interactive Glowing Tree Node
const GlowingTreeNode = ({ title, meta, children, defaultOpen = false, isLast = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="relative group/node flex">
            {/* The Vertical Glowing Line Container */}
            <div className="relative flex flex-col items-center w-12 shrink-0">
                {/* Connecting Line */}
                {!isLast && (
                    <div className="absolute top-8 bottom-0 w-0.5 bg-slate-200 group-hover/node:bg-indigo-400 group-hover/node:shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all duration-300 z-0" 
                         style={{ bottom: '-2rem' }} />
                )}
                {/* Active Dot */}
                <div className={`mt-5 w-4 h-4 rounded-full border-2 z-10 transition-all duration-300 ${isOpen ? 'bg-indigo-600 border-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.5)]' : 'bg-white border-slate-300 group-hover/node:border-indigo-400 group-hover/node:bg-indigo-50'}`} />
            </div>

            {/* Content Area */}
            <div className="flex-1 pb-8">
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="w-full text-left py-4 px-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group-hover/node:translate-x-1 duration-300 flex items-center justify-between"
                >
                    <div>
                        <h3 className={`font-bold transition-colors ${isOpen ? 'text-indigo-600' : 'text-slate-800 group-hover/node:text-indigo-600'}`}>
                            {title}
                        </h3>
                        {meta && <p className="text-xs font-medium text-slate-400 mt-1">{meta}</p>}
                    </div>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                </button>

                {/* Expanded Children */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, y: -10 }} 
                            animate={{ opacity: 1, height: 'auto', y: 0 }} 
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 pl-2">
                                {children}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────
const CourseMarketing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { fetchCourseById, checkEnrollment, enrollInCourse } = useCourse();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [enrollSuccess, setEnrollSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        let alive = true;
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchCourseById(id);
                if (!alive) return;
                if (data) {
                    setCourse(data);
                    if (user) {
                        const res = await checkEnrollment(id);
                        if (alive && res?.enrolled) setIsEnrolled(true);
                    }
                } else setError('Course not found.');
            } catch {
                if (alive) setError('Failed to load course.');
            } finally {
                if (alive) setLoading(false);
            }
        };
        load();
        return () => { alive = false; };
    }, [id, user]);

    const handleEnroll = async () => {
        if (!user) return navigate(`/login?redirect=/course/${id}`);
        setEnrolling(true);
        const res = await enrollInCourse(id);
        if (res.success) {
            setIsEnrolled(true);
            setEnrollSuccess(true);
            setTimeout(() => setEnrollSuccess(false), 4000);
        } else {
            alert(res.message || 'Enrollment failed.');
        }
        setEnrolling(false);
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 size={40} className="animate-spin text-indigo-600 mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Constructing learning environment...</p>
        </div>
    );

    if (error || !course) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
            <LayoutList size={48} className="text-slate-300" />
            <h2 className="text-2xl font-bold text-slate-800">{error || 'Course unavailable'}</h2>
            <Link to="/active-course" className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-md">Browse Courses</Link>
        </div>
    );

    const TABS = ['overview', 'curriculum'];
    if (course.syllabus?.length > 0) TABS.push('syllabus');
    TABS.push('instructor');

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24 lg:pb-12">
            
            {/* ── HERO BANNER ─────────────────────────────────────────────── */}
            <div className="bg-[#0B0F19] relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                    <div className="grid lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 space-y-6">
                            
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                <Link to="/active-course" className="hover:text-indigo-400 transition-colors">Courses</Link>
                                <span>›</span>
                                <span className="text-indigo-400">{course.category}</span>
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
                                {course.title}
                            </h1>
                            
                            {course.subtitle && (
                                <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                    {course.subtitle}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2">
                                    <Star size={16} className="text-amber-400" fill="currentColor" />
                                    <span className="text-white font-medium">{course.rating?.toFixed(1) || '4.8'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-300">
                                    <Users size={16} className="text-indigo-400" />
                                    <span>{(course.studentsEnrolled || 1240).toLocaleString()} enrolled</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-300">
                                    <BarChart2 size={16} className="text-emerald-400" />
                                    <span>{course.level || 'Intermediate'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT GRID ──────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Column: Content */}
                    <div className="lg:col-span-8 space-y-10">
                        
                        {/* Tab Navigation */}
                        <div className="flex gap-8 border-b border-slate-200 overflow-x-auto hide-scrollbar">
                            {TABS.map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-sm font-bold uppercase tracking-wide whitespace-nowrap border-b-2 transition-all duration-300 ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Overview Content */}
                        {activeTab === 'overview' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                {course.learningPoints?.length > 0 && (
                                    <section>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-6">What you'll learn</h2>
                                        <div className="grid sm:grid-cols-2 gap-4 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
                                            {course.learningPoints.map((point, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <div className="mt-1 bg-indigo-100 p-1 rounded-full shrink-0">
                                                        <CheckCircle size={14} className="text-indigo-600" />
                                                    </div>
                                                    <span className="text-slate-700 text-sm leading-relaxed">{point}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                                <section>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Course Description</h2>
                                    <div className="prose prose-slate max-w-none text-slate-600 text-base leading-loose whitespace-pre-wrap">
                                        {course.description}
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {/* Curriculum / Interactive Tree */}
                        {activeTab === 'curriculum' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="flex items-end justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-slate-900">Curriculum Structure</h2>
                                    <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                        {course.sections?.length || 0} Modules
                                    </span>
                                </div>

                                <div className="pt-2">
                                    {course.sections?.map((section, sIdx) => (
                                        <GlowingTreeNode 
                                            key={section._id || sIdx} 
                                            title={`Module ${sIdx + 1}: ${section.title}`} 
                                            meta={`${section.lessons?.length || 0} lessons`}
                                            defaultOpen={sIdx === 0}
                                            isLast={sIdx === course.sections.length - 1}
                                        >
                                            <div className="space-y-2 bg-slate-50 border border-slate-100 rounded-xl p-2">
                                                {section.lessons?.map((lesson, lIdx) => (
                                                    <div key={lesson._id || lIdx} className="group/lesson flex items-center justify-between p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200 cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${lesson.isFree ? 'bg-indigo-100 group-hover/lesson:bg-indigo-600' : 'bg-slate-200'}`}>
                                                                {lesson.isFree ? <PlayCircle size={14} className="text-indigo-600 group-hover/lesson:text-white" /> : <Lock size={14} className="text-slate-400" />}
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700 group-hover/lesson:text-indigo-600 transition-colors">
                                                                {lesson.title}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {lesson.isFree && <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Preview</span>}
                                                            {lesson.videoDuration > 0 && <span className="text-xs text-slate-400 font-mono">{formatDuration(lesson.videoDuration)}</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlowingTreeNode>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Syllabus / Deep Tree */}
                        {activeTab === 'syllabus' && course.syllabus?.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-8">Detailed Syllabus</h2>
                                <div className="pt-2">
                                    {course.syllabus.map((topic, tIdx) => (
                                        <GlowingTreeNode 
                                            key={topic._id || tIdx} 
                                            title={topic.title} 
                                            meta={topic.description}
                                            defaultOpen={tIdx === 0}
                                            isLast={tIdx === course.syllabus.length - 1}
                                        >
                                            {topic.subTopics?.length > 0 ? (
                                                <div className="space-y-4 pl-4 border-l border-slate-200 ml-4 py-2">
                                                    {topic.subTopics.map((sub, sIdx) => (
                                                        <div key={sub._id || sIdx} className="relative">
                                                            <div className="absolute -left-[21px] top-2 w-2 h-2 rounded-full bg-slate-300" />
                                                            <h4 className="font-semibold text-slate-800 text-sm">{sub.title}</h4>
                                                            {sub.description && <p className="text-sm text-slate-500 mt-1">{sub.description}</p>}
                                                            
                                                            {/* Sub-sub topics */}
                                                            {sub.subTopics?.length > 0 && (
                                                                <ul className="mt-3 space-y-2 pl-4 border-l border-indigo-100">
                                                                    {sub.subTopics.map((ss, ssIdx) => (
                                                                        <li key={ss._id || ssIdx} className="text-sm text-slate-600 flex items-start gap-2">
                                                                            <span className="text-indigo-400 mt-0.5">▹</span>
                                                                            <span><strong className="font-medium text-slate-700">{ss.title}</strong> {ss.description && `- ${ss.description}`}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 text-sm text-slate-500 italic">No nested sub-topics provided.</div>
                                            )}
                                        </GlowingTreeNode>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Instructor Profile */}
                        {activeTab === 'instructor' && course.instructor && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <h2 className="text-2xl font-bold text-slate-900 mb-8">Meet your instructor</h2>
                                <div className="bg-white border border-slate-200 rounded-3xl p-8 lg:p-10 shadow-sm">
                                    <div className="flex flex-col sm:flex-row items-start gap-8">
                                        <img 
                                            src={getImageUrl(course.instructor.avatar)} 
                                            alt={course.instructor.name || 'Instructor'} 
                                            className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                                            onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Instructor&background=random&size=128' }}
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-3xl font-extrabold text-slate-900">{course.instructor.name || 'TechiGuru Faculty'}</h3>
                                            <p className="text-indigo-600 font-semibold text-lg mt-1 mb-4">{course.instructor.title || 'Senior Software Engineer & Educator'}</p>
                                            
                                            <div className="flex flex-wrap gap-6 text-sm mb-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-indigo-50 rounded-lg"><Users size={16} className="text-indigo-600" /></div>
                                                    <div><span className="block font-bold text-slate-900">{(course.instructor.totalStudents || 4500).toLocaleString()}</span><span className="text-slate-500 text-xs uppercase tracking-wider">Students</span></div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-indigo-50 rounded-lg"><BookOpen size={16} className="text-indigo-600" /></div>
                                                    <div><span className="block font-bold text-slate-900">{course.instructor.totalCourses || 12}</span><span className="text-slate-500 text-xs uppercase tracking-wider">Courses</span></div>
                                                </div>
                                            </div>

                                            <p className="text-slate-600 leading-relaxed text-base">
                                                {course.instructor.bio || 'Dedicated to building scalable software and teaching the next generation of developers through hands-on, project-based learning.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column: Sticky Pricing Card */}
                    <div className="hidden lg:block lg:col-span-4">
                        <PricingCard 
                            course={course} 
                            isEnrolled={isEnrolled} 
                            enrolling={enrolling} 
                            onEnroll={handleEnroll} 
                            enrollSuccess={enrollSuccess} 
                        />
                    </div>
                </div>
            </div>

            {/* ── MOBILE STICKY CTA ────────────────────────────────────────── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 z-50">
                <div className="flex items-center gap-4 max-w-7xl mx-auto">
                    <div className="flex-1">
                        <p className="text-xs text-slate-500 font-medium">Total Price</p>
                        <p className="text-xl font-extrabold text-slate-900">
                            {course.price === 0 ? 'Free' : `₹${Number(course.price).toLocaleString('en-IN')}`}
                        </p>
                    </div>
                    <div className="flex-[2]">
                        {isEnrolled ? (
                            <Link to={`/course/${course._id}/learn`} className="block w-full text-center bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/20">
                                Continue
                            </Link>
                        ) : (
                            <button onClick={handleEnroll} disabled={enrolling} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold disabled:opacity-60 shadow-lg shadow-slate-900/20">
                                {enrolling ? 'Enrolling...' : 'Enroll Now'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseMarketing;