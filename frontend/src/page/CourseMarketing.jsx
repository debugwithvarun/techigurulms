import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Users, BookOpen, CheckCircle, PlayCircle,
    MonitorPlay, FileText, Code, Award, ChevronDown, ChevronUp,
    Star, Globe, Zap, ArrowRight, Lock, Loader2, BarChart2, Share2
} from 'lucide-react';

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

// ── Sticky pricing card component ─────────────────────────────────────────────
const PricingCard = ({ course, isEnrolled, enrolling, onEnroll, enrollSuccess }) => {
    const formattedPrice = course.price === 0 ? 'Free' : `₹${Number(course.price).toLocaleString('en-IN')}`;
    const thumbUrl = getImageUrl(course.thumbnail?.url || course.thumbnail);
    const dur = formatDuration(course.totalDuration);

    return (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* Preview image with play overlay */}
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img src={thumbUrl} alt={course.title} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl cursor-pointer">
                        <PlayCircle size={32} className="text-indigo-600 ml-0.5" />
                    </motion.div>
                </div>
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    Preview
                </div>
            </div>

            <div className="p-6 space-y-5">
                {/* Price */}
                <div className="flex items-end gap-3">
                    <span className="text-4xl font-extrabold text-slate-900">{formattedPrice}</span>
                    {course.originalPrice && course.originalPrice > course.price && (
                        <>
                            <span className="text-lg text-slate-400 line-through">₹{Number(course.originalPrice).toLocaleString('en-IN')}</span>
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">
                                {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off
                            </span>
                        </>
                    )}
                </div>

                {/* Success banner */}
                <AnimatePresence>
                    {enrollSuccess && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-green-700 text-sm font-semibold">
                            <CheckCircle size={16} /> You're enrolled! Happy learning 🎉
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CTA */}
                {isEnrolled ? (
                    <Link to={`/course/${course._id}/learn`}
                        className="flex items-center justify-center gap-2.5 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-base transition-all shadow-lg shadow-indigo-600/25 hover:-translate-y-0.5">
                        <PlayCircle size={20} /> Continue Learning <ArrowRight size={16} />
                    </Link>
                ) : (
                    <button onClick={onEnroll} disabled={enrolling}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-2xl text-base transition-all shadow-lg shadow-indigo-600/25 hover:-translate-y-0.5 flex items-center justify-center gap-2.5">
                        {enrolling ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : (course.price === 0 ? 'Enroll for Free' : '🎓 Enroll Now')}
                    </button>
                )}

                {!isEnrolled && <p className="text-center text-xs text-slate-400">30-day money-back guarantee · No questions asked</p>}

                {/* Course includes */}
                <div className="pt-3 border-t border-slate-100">
                    <p className="font-bold text-slate-700 text-sm mb-4">This course includes:</p>
                    <ul className="space-y-3">
                        {[
                            { icon: MonitorPlay, text: `${dur ? dur + ' on-demand video' : 'Video lessons'}` },
                            { icon: FileText, text: 'Downloadable resources & notes' },
                            { icon: Code, text: 'Code files & projects' },
                            { icon: Award, text: 'Certificate of completion' },
                            { icon: Zap, text: 'Full lifetime access' },
                            { icon: Globe, text: 'Access on mobile & desktop' },
                        ].map(({ icon: Icon, text }, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                <Icon size={15} className="text-indigo-500 shrink-0" /> {text}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Share */}
                <button className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium py-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <Share2 size={14} /> Share this course
                </button>
            </div>
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────────────────────────
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
    const [expandedSections, setExpandedSections] = useState(new Set([0]));
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
                } else {
                    setError('Course not found.');
                }
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
        if (!user) {
            navigate(`/login?redirect=/course/${id}`);
            return;
        }
        setEnrolling(true);
        const res = await enrollInCourse(id);
        if (res.success) {
            setIsEnrolled(true);
            setEnrollSuccess(true);
            setTimeout(() => setEnrollSuccess(false), 4000);
        } else {
            alert(res.message || 'Enrollment failed. Please try again.');
        }
        setEnrolling(false);
    };

    const toggleSection = (idx) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            return next;
        });
    };

    // Loading state
    if (loading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
            <Loader2 size={44} className="animate-spin text-indigo-600 mb-4" />
            <p className="text-slate-400 font-medium">Loading course details...</p>
        </div>
    );

    if (error || !course) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 text-center px-4">
            <BookOpen size={52} className="text-slate-200" />
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{error || 'Course unavailable'}</h2>
                <p className="text-slate-500">This course may have been removed or is not yet published.</p>
            </div>
            <Link to="/active-course" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                ← Browse All Courses
            </Link>
        </div>
    );

    const totalLectures = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
    const totalSections = course.sections?.length || 0;
    const instructorName = course.instructor?.name || 'TechiGuru Faculty';
    const instructorAvatar = getImageUrl(course.instructor?.avatar);

    const TABS = ['overview', 'curriculum', 'instructor'];

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ── HERO BANNER ─────────────────────────────────────────────── */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #1e293b 100%)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid lg:grid-cols-3 gap-10 items-start">
                        <div className="lg:col-span-2 space-y-6">

                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Link to="/active-course" className="hover:text-indigo-400 transition-colors">Courses</Link>
                                <span>/</span>
                                <span className="text-indigo-400 font-medium">{course.category}</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                                {course.title}
                            </h1>

                            {/* Subtitle */}
                            {course.subtitle && (
                                <p className="text-lg text-slate-300 leading-relaxed">{course.subtitle}</p>
                            )}

                            {/* Meta pills */}
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { icon: Star, label: `${course.rating?.toFixed(1) || '0.0'} rating`, color: 'text-amber-400' },
                                    { icon: Users, label: `${(course.studentsEnrolled || 0).toLocaleString()} students`, color: 'text-indigo-400' },
                                    { icon: BookOpen, label: `${totalLectures} lessons`, color: 'text-emerald-400' },
                                    { icon: BarChart2, label: course.level || 'All Levels', color: 'text-purple-400' },
                                    ...(course.language ? [{ icon: Globe, label: course.language, color: 'text-blue-400' }] : []),
                                ].map(({ icon: Icon, label, color }, i) => (
                                    <div key={i} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-white">
                                        <Icon size={12} className={color} /> {label}
                                    </div>
                                ))}
                            </div>

                            {/* Instructor */}
                            <div className="flex items-center gap-4 pt-1">
                                <div className="relative">
                                    {instructorAvatar ? (
                                        <img src={instructorAvatar} alt={instructorName} className="w-14 h-14 rounded-full object-cover border-3 border-indigo-500/40 shadow-md" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xl shadow-md">
                                            {instructorName[0]}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                                        <CheckCircle size={10} className="text-white" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Instructor</p>
                                    <p className="font-bold text-white text-base">{instructorName}</p>
                                    <p className="text-xs text-indigo-300">{course.instructor?.title || 'Senior Instructor'}</p>
                                </div>
                            </div>

                            {/* Mobile enrollment CTA */}
                            <div className="lg:hidden pt-2">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                                    <div className="text-3xl font-extrabold text-white mb-3">
                                        {course.price === 0 ? 'Free' : `₹${Number(course.price).toLocaleString('en-IN')}`}
                                    </div>
                                    {isEnrolled ? (
                                        <Link to={`/course/${course._id}/learn`}
                                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl text-sm">
                                            <PlayCircle size={18} /> Continue Learning
                                        </Link>
                                    ) : (
                                        <button onClick={handleEnroll} disabled={enrolling}
                                            className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                                            {enrolling ? <><Loader2 size={16} className="animate-spin" /> Enrolling...</> : 'Enroll Now'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Desktop Pricing Card */}
                        <div className="hidden lg:block sticky top-24">
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
            </div>

            {/* ── CONTENT AREA ─────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">

                    {/* Tab Navigation */}
                    <div className="flex border-b border-slate-200 gap-6">
                        {TABS.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-bold capitalize border-b-2 transition-colors -mb-px ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* ── OVERVIEW TAB ──────────────────────────────────────── */}
                    {activeTab === 'overview' && (
                        <div className="space-y-10">
                            {/* What you'll learn */}
                            {course.learningPoints?.length > 0 && (
                                <section className="bg-indigo-50 border border-indigo-100 rounded-2xl p-7">
                                    <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                                        <Zap size={20} className="text-indigo-600" /> What you'll learn
                                    </h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {course.learningPoints.map((point, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <CheckCircle size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                                                <span className="text-slate-700 text-sm">{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Requirements */}
                            {course.requirements?.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4">Requirements</h2>
                                    <ul className="space-y-2.5">
                                        {course.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Description */}
                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Course Description</h2>
                                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">{course.description}</div>
                            </section>
                        </div>
                    )}

                    {/* ── CURRICULUM TAB ───────────────────────────────────── */}
                    {activeTab === 'curriculum' && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900">Course Curriculum</h2>
                                <span className="text-sm text-slate-500 font-medium">{totalSections} sections · {totalLectures} lessons</span>
                            </div>

                            {/* Quick stats bar */}
                            <div className="flex gap-4 flex-wrap text-xs font-medium text-slate-500 bg-slate-100 rounded-xl px-5 py-3">
                                <span className="flex items-center gap-1.5"><BookOpen size={13} className="text-indigo-500" /> {totalSections} sections</span>
                                <span className="flex items-center gap-1.5"><PlayCircle size={13} className="text-indigo-500" /> {totalLectures} lectures</span>
                                {formatDuration(course.totalDuration) && <span className="flex items-center gap-1.5"><Clock size={13} className="text-indigo-500" /> {formatDuration(course.totalDuration)} total length</span>}
                            </div>

                            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                                {course.sections?.map((section, sIdx) => (
                                    <div key={section._id || sIdx}>
                                        <button onClick={() => toggleSection(sIdx)}
                                            className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-indigo-50/50 transition-colors text-left group">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${expandedSections.has(sIdx) ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700'}`}>
                                                    {expandedSections.has(sIdx) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400 font-medium">Section {sIdx + 1}</p>
                                                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">{section.title}</h3>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-400 font-medium shrink-0 ml-4 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                                                {section.lessons?.length || 0} lessons
                                            </span>
                                        </button>
                                        <AnimatePresence>
                                            {expandedSections.has(sIdx) && (
                                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden divide-y divide-slate-50">
                                                    {section.lessons?.map((lesson, lIdx) => (
                                                        <div key={lesson._id || lIdx} className="flex items-center justify-between px-5 py-3.5 pl-16 hover:bg-slate-50/80 transition-colors group/lesson">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${lesson.isFree ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                                                                    {lesson.isFree ? <PlayCircle size={14} className="text-indigo-600" /> : <Lock size={13} className="text-slate-400" />}
                                                                </div>
                                                                <span className={`text-sm font-medium ${lesson.isFree ? 'text-indigo-700' : 'text-slate-700'}`}>{lesson.title}</span>
                                                                {lesson.isFree && (
                                                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md">Preview</span>
                                                                )}
                                                            </div>
                                                            {lesson.videoDuration > 0 && (
                                                                <span className="text-xs text-slate-400 font-mono shrink-0">{formatDuration(lesson.videoDuration)}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── INSTRUCTOR TAB ───────────────────────────────────── */}
                    {activeTab === 'instructor' && course.instructor && (
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Meet Your Instructor</h2>
                            <div className="bg-white border border-slate-200 rounded-3xl p-8">
                                <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
                                    {instructorAvatar ? (
                                        <img src={instructorAvatar} alt={instructorName} className="w-24 h-24 rounded-2xl object-cover border-4 border-indigo-100 shadow-md flex-shrink-0" />
                                    ) : (
                                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-extrabold text-white text-4xl flex-shrink-0 shadow-md">
                                            {instructorName[0]}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-2xl font-extrabold text-slate-900">{instructorName}</h3>
                                        <p className="text-indigo-600 font-semibold mt-0.5 mb-4">{course.instructor.title || 'Senior Instructor'}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                            {course.instructor.totalStudents > 0 && (
                                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                                                    <Users size={15} className="text-indigo-500" />
                                                    <span className="font-bold">{course.instructor.totalStudents?.toLocaleString()}</span>
                                                    <span className="text-slate-400">Students</span>
                                                </div>
                                            )}
                                            {course.instructor.totalCourses > 0 && (
                                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                                                    <BookOpen size={15} className="text-indigo-500" />
                                                    <span className="font-bold">{course.instructor.totalCourses}</span>
                                                    <span className="text-slate-400">Courses</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                                                <Star size={15} className="text-amber-500" fill="currentColor" />
                                                <span className="font-bold text-amber-700">Top Rated</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {course.instructor.instructorBio || course.instructor.bio || 'A passionate educator with years of industry experience, dedicated to delivering world-class learning experiences that help students achieve their career goals.'}
                                </p>
                                {course.instructor.expertise?.length > 0 && (
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {course.instructor.expertise.map((skill, i) => (
                                            <span key={i} className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* ── MOBILE STICKY BOTTOM BAR ─────────────────────────────────── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.10)]">
                <div className="flex items-center gap-4">
                    <div>
                        <p className="text-2xl font-extrabold text-slate-900">
                            {course.price === 0 ? 'Free' : `₹${Number(course.price).toLocaleString('en-IN')}`}
                        </p>
                    </div>
                    <div className="flex-1">
                        {isEnrolled ? (
                            <Link to={`/course/${course._id}/learn`}
                                className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                                Continue Learning →
                            </Link>
                        ) : (
                            <button onClick={handleEnroll} disabled={enrolling}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60 transition-colors">
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
