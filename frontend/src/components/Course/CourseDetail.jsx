import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    PlayCircle, Lock, ChevronDown, ChevronUp,
    Clock, ChevronLeft, Menu, X,
    FileText, Code, HelpCircle,
    Download, Copy, CheckCircle2, XCircle,
    CheckSquare, MonitorPlay, MessageCircle, AlertCircle,
    BookOpen, Award, BarChart2, CheckCircle, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../config';
import api from '../../api/axios';

// ─── Utilities ────────────────────────────────────────────────────────────────

const formatDuration = (seconds) => {
    if (!seconds) return null;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
};

// ─── Business Logic Hook ───────────────────────────────────────────────────────

const useCoursePlayer = () => {
    const { id } = useParams();
    const { fetchCourseById, checkEnrollment } = useCourse();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [expandedSections, setExpandedSections] = useState(new Set());
    const [expandedLessons, setExpandedLessons] = useState(new Set());

    // Flatten all lessons for next/prev navigation
    const allLessons = React.useMemo(() => {
        if (!course) return [];
        return course.sections?.flatMap(s => s.lessons || []) || [];
    }, [course]);

    const activeIndex = activeLesson ? allLessons.findIndex(l => l._id === activeLesson._id) : -1;
    const canGoNext = activeIndex < allLessons.length - 1;
    const canGoPrev = activeIndex > 0;

    const totalLessons = allLessons.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;

    useEffect(() => {
        let alive = true;
        const load = async () => {
            setLoading(true);
            try {
                if (!id) throw new Error('No Course ID');
                const data = await fetchCourseById(id);
                if (!alive) return;

                if (data) {
                    // Verify user is enrolled
                    if (user) {
                        const enrollRes = await checkEnrollment(id);
                        if (!enrollRes?.enrolled) {
                            navigate(`/course/${id}`, { replace: true });
                            return;
                        }
                    } else {
                        navigate(`/login?redirect=/course/${id}/learn`);
                        return;
                    }

                    setCourse(data);
                    if (data.sections?.length > 0) {
                        const firstSection = data.sections[0];
                        setExpandedSections(new Set([firstSection._id]));
                        if (firstSection.lessons?.length > 0) {
                            setActiveLesson(firstSection.lessons[0]);
                        }
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

    const toggleSection = useCallback((sectionId) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
            return next;
        });
    }, []);

    const toggleLesson = useCallback((lessonId) => {
        setExpandedLessons(prev => {
            const next = new Set(prev);
            next.has(lessonId) ? next.delete(lessonId) : next.add(lessonId);
            return next;
        });
    }, []);

    const selectLesson = useCallback((lesson) => {
        setActiveLesson(lesson);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const markComplete = useCallback((lessonId) => {
        setCompletedLessons(prev => new Set([...prev, lessonId]));
        // Update backend progress
        if (id) {
            const completed = completedLessons.size + 1;
            const percent = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
            api.put(`/courses/${id}/progress`, { progress: percent }).catch(() => {});
        }
    }, [id, completedLessons, totalLessons]);

    const goNext = useCallback(() => {
        if (canGoNext) {
            const next = allLessons[activeIndex + 1];
            setActiveLesson(next);
            // Expand the section containing the next lesson
            const sectionForNext = course?.sections?.find(s => s.lessons?.some(l => l._id === next._id));
            if (sectionForNext) setExpandedSections(prev => new Set([...prev, sectionForNext._id]));
        }
    }, [canGoNext, activeIndex, allLessons, course]);

    const goPrev = useCallback(() => {
        if (canGoPrev) setActiveLesson(allLessons[activeIndex - 1]);
    }, [canGoPrev, activeIndex, allLessons]);

    return {
        course, loading, error, activeLesson, completedLessons,
        expandedSections, toggleSection,
        expandedLessons, toggleLesson,
        selectLesson, progressPercentage, markComplete,
        allLessons, activeIndex, canGoNext, canGoPrev, goNext, goPrev, totalLessons
    };
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const ResourceBlock = ({ resources }) => (
    <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-700/60 bg-slate-800/40 flex items-center gap-2.5">
            <FileText size={18} className="text-blue-400" />
            <h3 className="font-bold text-slate-200 text-sm">Downloadable Resources</h3>
            <span className="ml-auto text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-full">{resources.length} files</span>
        </div>
        <div className="divide-y divide-slate-700/40">
            {resources.map((res, idx) => (
                <a key={idx} href={res.url?.startsWith('http') ? res.url : `https://${res.url}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center justify-between p-4 hover:bg-slate-700/20 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                            <Download size={16} className="text-blue-400 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{res.title}</p>
                            <p className="text-xs text-slate-500">Click to open</p>
                        </div>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">↗</span>
                </a>
            ))}
        </div>
    </div>
);

const CodeBlock = ({ snippets }) => (
    <div className="space-y-5 mb-6">
        {snippets.map((snippet, idx) => (
            <div key={idx} className="bg-[#0d1117] border border-slate-700/60 rounded-2xl overflow-hidden">
                <div className="px-4 py-2.5 bg-[#161b22] border-b border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/70" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                            <div className="w-3 h-3 rounded-full bg-green-500/70" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">{snippet.language}</span>
                    </div>
                    <button
                        onClick={() => navigator.clipboard.writeText(snippet.code)}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors bg-slate-700/50 hover:bg-slate-600/50 px-3 py-1 rounded-lg">
                        <Copy size={11} /> Copy
                    </button>
                </div>
                <div className="p-5 overflow-x-auto">
                    <pre className="text-sm font-mono text-slate-300 leading-relaxed whitespace-pre">
                        <code>{snippet.code}</code>
                    </pre>
                </div>
            </div>
        ))}
    </div>
);

const QuizModule = ({ quizzes }) => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState({});

    return (
        <div className="bg-[#1e293b] border border-amber-500/20 rounded-2xl overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-slate-700/60 bg-amber-500/5 flex items-center gap-2.5">
                <HelpCircle size={18} className="text-amber-400" />
                <h3 className="font-bold text-slate-200 text-sm">Knowledge Check</h3>
                <span className="ml-auto text-xs text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-full">{quizzes.length} questions</span>
            </div>
            <div className="p-6 space-y-8">
                {quizzes.map((quiz, qIdx) => {
                    const selected = answers[qIdx];
                    const isSub = submitted[qIdx];
                    const isCorrect = isSub && quiz.options[selected]?.isCorrect;
                    return (
                        <div key={qIdx} className="space-y-4">
                            <div className="flex gap-3">
                                <span className="text-sm font-black text-amber-400 bg-amber-400/10 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">{qIdx + 1}</span>
                                <h4 className="text-base font-semibold text-white leading-snug">{quiz.question}</h4>
                            </div>
                            <div className="space-y-2.5 pl-10">
                                {quiz.options.map((opt, oIdx) => {
                                    let cls = "border-slate-700/60 text-slate-400 hover:border-slate-500 hover:bg-slate-700/30";
                                    if (isSub && opt.isCorrect) cls = "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
                                    else if (isSub && selected === oIdx && !opt.isCorrect) cls = "border-rose-500/50 bg-rose-500/10 text-rose-400";
                                    else if (!isSub && selected === oIdx) cls = "border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]";
                                    return (
                                        <button key={oIdx} onClick={() => !isSub && setAnswers(p => ({ ...p, [qIdx]: oIdx }))}
                                            disabled={isSub}
                                            className={`w-full text-left p-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${cls}`}>
                                            <span>{opt.text}</span>
                                            {isSub && opt.isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                                            {isSub && selected === oIdx && !opt.isCorrect && <XCircle size={16} className="text-rose-400" />}
                                        </button>
                                    );
                                })}
                            </div>
                            {!isSub && (
                                <div className="pl-10">
                                    <button onClick={() => setSubmitted(p => ({ ...p, [qIdx]: true }))}
                                        disabled={selected === undefined}
                                        className="px-5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                        Submit Answer
                                    </button>
                                </div>
                            )}
                            {isSub && (
                                <div className="pl-10">
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        {isCorrect ? <><CheckCircle size={15} /> Correct! Well done</> : <><XCircle size={15} /> Incorrect — See correct answer above</>}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Lesson row in the sidebar
const LessonRow = memo(({ lesson, index, isActive, isCompleted, onSelect }) => {
    const dur = lesson.videoDuration ? formatDuration(lesson.videoDuration) : null;
    return (
        <button
            onClick={onSelect}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-l-[3px] group ${isActive
                ? 'bg-indigo-900/30 border-indigo-500'
                : 'border-transparent hover:bg-slate-800/40 hover:border-slate-600'}`}
        >
            {/* Status icon */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black transition-colors ${isActive ? 'bg-indigo-600 text-white' : isCompleted ? 'bg-emerald-600/20 text-emerald-400' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300'}`}>
                {isCompleted ? <CheckCircle size={14} /> : isActive ? <PlayCircle size={14} fill="white" /> : index}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug line-clamp-2 font-medium transition-colors ${isActive ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {lesson.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    {dur && <span className="text-[10px] text-slate-600 font-mono flex items-center gap-1"><Clock size={9} />{dur}</span>}
                    {lesson.resources?.length > 0 && <FileText size={10} className="text-blue-500/60" />}
                    {lesson.codeSnippets?.length > 0 && <Code size={10} className="text-emerald-500/60" />}
                    {lesson.quizzes?.length > 0 && <HelpCircle size={10} className="text-amber-500/60" />}
                </div>
            </div>
            {!lesson.isFree && !isActive && !isCompleted && <Lock size={12} className="text-slate-600 shrink-0" />}
        </button>
    );
});

// Loading skeleton
const CourseSkeleton = () => (
    <div className="min-h-screen bg-[#060815] text-slate-300">
        <div className="h-16 bg-[#0a0d1e] border-b border-white/5" />
        <div className="max-w-[1600px] mx-auto p-6 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
                <div className="w-full aspect-video bg-slate-900 rounded-2xl animate-pulse" />
                <div className="h-8 w-2/3 bg-slate-900 rounded-xl animate-pulse" />
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-4 bg-slate-900 rounded animate-pulse" style={{ width: `${90 - i * 15}%` }} />
                    ))}
                </div>
            </div>
            <div className="h-[600px] bg-slate-900 rounded-2xl animate-pulse" />
        </div>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const CourseDetail = () => {
    const {
        course, loading, error, activeLesson, completedLessons,
        expandedSections, toggleSection,
        expandedLessons, toggleLesson,
        selectLesson, progressPercentage, markComplete,
        allLessons, activeIndex, canGoNext, canGoPrev, goNext, goPrev, totalLessons
    } = useCoursePlayer();

    const [activeTab, setActiveTab] = useState('overview');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);

    const handleMarkComplete = () => {
        if (activeLesson) markComplete(activeLesson._id);
    };

    if (loading) return <CourseSkeleton />;
    if (error || !course) return (
        <div className="min-h-screen bg-[#060815] flex flex-col items-center justify-center gap-5 text-slate-400">
            <AlertCircle size={52} className="text-rose-500/50" />
            <div className="text-center">
                <p className="text-lg font-semibold text-slate-200 mb-2">{error || 'Course not found'}</p>
                <p className="text-sm text-slate-500">The course may have been removed or is unavailable.</p>
            </div>
            <Link to="/active-course" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-sm">
                ← Back to Courses
            </Link>
        </div>
    );

    const instructorName = course.instructor?.name || 'TechiGuru';
    const instructorAvatar = getImageUrl(course.instructor?.avatar);

    return (
        <div className="min-h-screen bg-[#060815] text-slate-300 font-sans selection:bg-indigo-500/30">

            {/* ── NAVBAR ─────────────────────────────────────────────── */}
            <nav className="sticky top-0 z-40 h-16 bg-[#0a0d1e]/95 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-4 lg:px-6 gap-4 shadow-xl shadow-black/20">
                <Link to="/active-course" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-white group shrink-0">
                    <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
                </Link>

                <div className="h-5 w-px bg-white/10 hidden sm:block shrink-0" />

                <div className="flex-1 min-w-0">
                    <h1 className="text-slate-100 font-bold text-sm sm:text-base line-clamp-1">{course.title}</h1>
                    {course.instructor && (
                        <p className="text-xs text-slate-500 hidden sm:block">{instructorName}</p>
                    )}
                </div>

                {/* Progress bar */}
                <div className="hidden md:flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-bold text-indigo-400">{progressPercentage}%</span>
                        <span>complete</span>
                    </div>
                    <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Instructor avatar */}
                {instructorAvatar && (
                    <div className="hidden lg:flex items-center gap-2 bg-white/5 rounded-xl px-3 py-1.5 border border-white/10 shrink-0">
                        <img src={instructorAvatar} alt={instructorName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs font-medium text-slate-300">{instructorName}</span>
                    </div>
                )}

                <button className="lg:hidden p-2 text-slate-300 hover:text-white bg-white/5 rounded-xl border border-white/10" onClick={() => setMobileMenuOpen(true)}>
                    <Menu size={20} />
                </button>
            </nav>

            {/* ── MAIN LAYOUT ─────────────────────────────────────────── */}
            <div className="max-w-[1700px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

                {/* ── LEFT: VIDEO + CONTENT ─────────────────────────── */}
                <div className="flex flex-col gap-6">

                    {/* VIDEO PLAYER */}
                    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/[0.06] relative">
                        <AnimatePresence mode="wait">
                            {activeLesson?.videoKey ? (
                                <motion.div key={activeLesson._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full">
                                    <iframe
                                        key={activeLesson.videoKey}
                                        width="100%" height="100%"
                                        src={`https://www.youtube.com/embed/${activeLesson.videoKey}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&color=white`}
                                        title={activeLesson.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                </motion.div>
                            ) : (
                                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0d1e]">
                                    <div className="w-24 h-24 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-5">
                                        <PlayCircle size={44} className="text-indigo-500/50 ml-1" />
                                    </div>
                                    <p className="text-slate-400 font-semibold tracking-wide">Select a lesson to begin</p>
                                    <p className="text-slate-600 text-sm mt-1.5">{totalLessons} lessons available</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* LESSON TITLE + CONTROLS */}
                    {activeLesson && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="min-w-0">
                                <h2 className="text-xl lg:text-2xl font-bold text-white leading-tight line-clamp-2">{activeLesson.title}</h2>
                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
                                    {activeLesson.videoDuration > 0 && (
                                        <span className="flex items-center gap-1.5"><Clock size={12} className="text-indigo-400" />{formatDuration(activeLesson.videoDuration)}</span>
                                    )}
                                    <span className="flex items-center gap-1.5"><BookOpen size={12} />Lesson {activeIndex + 1} of {totalLessons}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button onClick={goPrev} disabled={!canGoPrev}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 text-xs font-bold rounded-xl transition-all border border-slate-700">
                                    ← Prev
                                </button>
                                {completedLessons.has(activeLesson._id) ? (
                                    <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600/20 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-600/30">
                                        <CheckCircle size={13} /> Completed
                                    </span>
                                ) : (
                                    <button onClick={handleMarkComplete}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20">
                                        Mark Complete
                                    </button>
                                )}
                                <button onClick={goNext} disabled={!canGoNext}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/20">
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TABS */}
                    <div className="border-b border-white/[0.06] flex gap-8">
                        {['overview', 'qa', 'notes'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-bold capitalize border-b-2 transition-all -mb-px ${activeTab === tab ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                                {tab === 'qa' ? 'Q&A' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* TAB PANELS */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                                className="space-y-8 pb-16">

                                {/* Lesson description */}
                                {activeLesson?.description && (
                                    <div className="text-slate-400 leading-relaxed text-[15px] whitespace-pre-wrap">{activeLesson.description}</div>
                                )}

                                {/* Resources */}
                                {activeLesson?.resources?.length > 0 && <ResourceBlock resources={activeLesson.resources} />}

                                {/* Code */}
                                {activeLesson?.codeSnippets?.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Code size={18} className="text-emerald-400" />Code Examples</h3>
                                        <CodeBlock snippets={activeLesson.codeSnippets} />
                                    </div>
                                )}

                                {/* Quiz */}
                                {activeLesson?.quizzes?.length > 0 && <QuizModule quizzes={activeLesson.quizzes} />}

                                {/* Course overview fallback */}
                                <div className="bg-slate-900/40 border border-white/[0.06] rounded-2xl p-6">
                                    <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2"><BookOpen size={16} className="text-indigo-400" />About this Course</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">{course.description}</p>
                                    <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {[
                                            { icon: BarChart2, label: 'Level', value: course.level || 'All Levels', color: 'text-purple-400' },
                                            { icon: Clock, label: 'Duration', value: formatDuration(course.totalDuration) || 'N/A', color: 'text-blue-400' },
                                            { icon: BookOpen, label: 'Lessons', value: totalLessons, color: 'text-indigo-400' },
                                            { icon: Award, label: 'Certificate', value: 'Included', color: 'text-amber-400' },
                                        ].map(({ icon: Icon, label, value, color }, i) => (
                                            <div key={i} className="bg-slate-800/50 rounded-xl p-3 text-center">
                                                <Icon size={16} className={`${color} mx-auto mb-2`} />
                                                <p className="text-white font-bold text-sm">{value}</p>
                                                <p className="text-slate-500 text-xs mt-0.5">{label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {(activeTab === 'qa' || activeTab === 'notes') && (
                            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-24 text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                                <MessageCircle size={40} className="mb-4 opacity-20" />
                                <p className="font-semibold text-sm">{activeTab === 'qa' ? 'Q&A coming soon' : 'Notes feature coming soon'}</p>
                                <p className="text-xs mt-1 opacity-70">This feature is under development</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── RIGHT: SIDEBAR ───────────────────────────────── */}
                <div className="hidden lg:block">
                    <div className="sticky top-24 bg-[#0a0d1e] border border-white/[0.07] rounded-2xl overflow-hidden max-h-[calc(100vh-8rem)] flex flex-col shadow-2xl shadow-black/30">
                        {/* Header */}
                        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-[#0a0d1e]">
                            <div>
                                <h3 className="font-bold text-white text-sm">Course Content</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{completedLessons.size}/{totalLessons} completed</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                                    {progressPercentage}%
                                </span>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="h-1 bg-slate-800 shrink-0">
                            <motion.div className="h-full bg-gradient-to-r from-indigo-600 to-purple-500" animate={{ width: `${progressPercentage}%` }} transition={{ duration: 0.5 }} />
                        </div>

                        {/* Sections */}
                        <div className="flex-1 overflow-y-auto">
                            {course.sections?.map((section, sIdx) => (
                                <div key={section._id} className="border-b border-white/[0.04]">
                                    <button onClick={() => toggleSection(section._id)}
                                        className="w-full flex items-center justify-between px-4 py-4 bg-[#0a0d1e] hover:bg-white/[0.03] transition-colors text-left group">
                                        <div className="min-w-0 pr-3">
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Section {sIdx + 1}</p>
                                            <h4 className="text-sm font-bold text-slate-300 group-hover:text-white line-clamp-2 transition-colors">{section.title}</h4>
                                            <p className="text-[11px] text-slate-600 mt-1">{section.lessons?.length || 0} lessons</p>
                                        </div>
                                        <motion.div animate={{ rotate: expandedSections.has(section._id) ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                            <ChevronDown size={16} className="text-slate-500 shrink-0" />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence>
                                        {expandedSections.has(section._id) && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }} className="overflow-hidden">
                                                {section.lessons?.map((lesson, lIdx) => (
                                                    <LessonRow
                                                        key={lesson._id}
                                                        lesson={lesson}
                                                        index={lIdx + 1}
                                                        isActive={activeLesson?._id === lesson._id}
                                                        isCompleted={completedLessons.has(lesson._id)}
                                                        onSelect={() => selectLesson(lesson)}
                                                    />
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MOBILE DRAWER ────────────────────────────────────────── */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-[85vw] max-w-sm bg-[#0a0d1e] border-l border-slate-800 z-50 lg:hidden flex flex-col shadow-2xl">
                            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-white text-sm">Course Content</h3>
                                    <p className="text-xs text-slate-500">{completedLessons.size}/{totalLessons} completed · {progressPercentage}%</p>
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {course.sections?.map((section, sIdx) => (
                                    <div key={section._id} className="border-b border-slate-900">
                                        <div className="px-4 py-3 bg-slate-900/50">
                                            <p className="text-xs text-slate-500 font-bold uppercase">Section {sIdx + 1}</p>
                                            <h4 className="text-sm font-bold text-slate-300 line-clamp-1">{section.title}</h4>
                                        </div>
                                        {section.lessons?.map((lesson, lIdx) => (
                                            <LessonRow key={lesson._id} lesson={lesson} index={lIdx + 1}
                                                isActive={activeLesson?._id === lesson._id}
                                                isCompleted={completedLessons.has(lesson._id)}
                                                onSelect={() => { selectLesson(lesson); setMobileMenuOpen(false); }} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseDetail;
