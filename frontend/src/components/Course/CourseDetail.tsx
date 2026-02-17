import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, CheckCircle, Lock, ChevronDown, ChevronUp, 
  Star, Users, Clock, Share2, Bookmark, 
  ChevronLeft, Menu, X, Globe, Calendar, Check, 
  MessageCircle, Send, ThumbsUp, MoreHorizontal, Loader, AlertCircle,
  FileText, AlignLeft, MonitorPlay
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useCourse } from '../../context/CourseContext'; 

// --- HELPER COMPONENTS ---

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star 
        key={star}
        size={14} 
        className={`${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} transition-colors`} 
      />
    ))}
  </div>
);

const CourseDetail = () => {
  const { id } = useParams(); 
  const { fetchCourseById } = useCourse(); 

  // State
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // --- DATA FETCHING ---
  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      setError(null);

      if (!id) {
        setError("Invalid URL: No Course ID provided.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCourseById(id);
        
        if (data) {
          setCourse(data);
          // Auto-select first lesson
          if (data.sections && data.sections.length > 0) {
             const firstSection = data.sections[0];
             setExpandedSections([firstSection._id]); 
             if (firstSection.lessons && firstSection.lessons.length > 0) {
                 setActiveLesson(firstSection.lessons[0]); 
             }
          }
        } else {
          setError("Course not found in database.");
        }
      } catch (err) {
        console.error("Error loading course:", err);
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  // Handle Resize for Responsive Sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]);
  };

  const formatDuration = (mins: number) => {
      if (!mins) return '5m';
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // --- RENDER STATES ---

  if (loading) {
      return (
          <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                      <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 bg-violet-500 rounded-full animate-pulse opacity-50"></div>
                      </div>
                  </div>
                  <p className="text-slate-400 font-medium animate-pulse">Loading experience...</p>
              </div>
          </div>
      );
  }

  if (error || !course) {
      return (
          <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center text-slate-400 p-4">
              <div className="bg-[#151F32] p-8 rounded-3xl border border-slate-800 text-center max-w-md w-full shadow-2xl">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Unable to Load Course</h2>
                <p className="mb-6 text-sm">{error || "The requested course could not be found."}</p>
                <Link to="/active-course" className="inline-flex items-center justify-center px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors w-full">
                    Browse Active Courses
                </Link>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 font-sans flex flex-col h-screen overflow-hidden">
      
      {/* HEADER */}
      <header className="h-16 bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/active-course" className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white group">
            <ChevronLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-white font-bold text-sm md:text-base leading-tight line-clamp-1 max-w-[200px] md:max-w-md">
                {course.title}
            </h1>
            {activeLesson && (
                <p className="text-xs text-slate-500 hidden md:block line-clamp-1">Current: {activeLesson.title}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs font-bold bg-[#151F32] px-3 py-1.5 rounded-lg border border-slate-700/50">
                <Clock size={14} className="text-emerald-400" />
                <span className="text-slate-300">Progress: 0%</span>
            </div>
            <button 
              className="p-2 text-slate-400 hover:text-white lg:hidden hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24}/>
            </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT: PLAYER & SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 bg-[#0B1120]">
          
          {/* VIDEO PLAYER CONTAINER */}
          <div className="w-full bg-black aspect-video relative z-10 shadow-2xl border-b border-slate-800">
             {activeLesson?.videoKey ? (
                 <iframe 
                   width="100%" 
                   height="100%" 
                   src={`https://www.youtube.com/embed/${activeLesson.videoKey}?autoplay=0&rel=0&modestbranding=1`} 
                   title="Video Player"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen
                   className="w-full h-full"
                 ></iframe>
             ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F172A]">
                     <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <PlayCircle size={40} className="text-slate-600 ml-1"/>
                     </div>
                     <p className="text-slate-500 font-medium">Select a lesson to start learning</p>
                 </div>
             )}
          </div>

          {/* CONTENT TABS & DETAILS */}
          <div className="max-w-5xl mx-auto p-5 md:p-10 pb-20">
            {/* Tab Navigation */}
            <div className="flex items-center gap-8 border-b border-slate-800 mb-8 overflow-x-auto no-scrollbar">
                {['Overview', 'Q&A', 'Reviews'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`pb-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap px-1 ${
                          activeTab === tab.toLowerCase() 
                          ? 'border-violet-500 text-violet-400' 
                          : 'border-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT */}
            <div className="min-h-[300px]">
                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-10">
                        
                        {/* 1. CURRENT LESSON NOTES (New Feature) */}
                        {activeLesson && (
                            <div className="bg-[#151F32] border border-slate-800 rounded-2xl overflow-hidden">
                                <div className="bg-[#1E293B]/50 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                                    <AlignLeft size={18} className="text-violet-400"/>
                                    <h3 className="font-bold text-slate-200">About this lesson</h3>
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-white mb-3">{activeLesson.title}</h2>
                                    {activeLesson.description ? (
                                        <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{activeLesson.description}</p>
                                    ) : (
                                        <p className="text-slate-500 italic text-sm">No specific notes provided for this lesson.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 2. COURSE DETAILS */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FileText size={18} className="text-blue-400"/> Course Description
                            </h3>
                            <p className="text-slate-400 leading-relaxed text-sm md:text-base">{course.description}</p>
                            
                            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-slate-800">
                                <div className="bg-[#151F32] px-4 py-2 rounded-lg border border-slate-800 flex items-center gap-2 text-sm text-slate-300">
                                    <Star size={16} className="text-amber-400 fill-amber-400"/> {course.rating || 0} Rating
                                </div>
                                <div className="bg-[#151F32] px-4 py-2 rounded-lg border border-slate-800 flex items-center gap-2 text-sm text-slate-300">
                                    <Users size={16} className="text-blue-400"/> {course.studentsEnrolled || 0} Students
                                </div>
                                <div className="bg-[#151F32] px-4 py-2 rounded-lg border border-slate-800 flex items-center gap-2 text-sm text-slate-300">
                                    <Globe size={16} className="text-emerald-400"/> {course.language || 'English'}
                                </div>
                            </div>
                        </div>

                        {/* 3. LEARNING POINTS */}
                        {course.learningPoints && course.learningPoints.length > 0 && (
                            <div className="bg-[#151F32] border border-slate-800 p-8 rounded-2xl">
                                <h3 className="text-lg font-bold text-white mb-6">What you'll learn</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {course.learningPoints.map((point: string, idx: number) => (
                                        <div key={idx} className="flex gap-3 items-start">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                <Check size={12} className="text-emerald-500" />
                                            </div>
                                            <span className="text-slate-300 text-sm leading-relaxed">{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 4. INSTRUCTOR */}
                        {course.instructor && (
                            <div className="flex items-start gap-6 p-6 rounded-2xl border border-slate-800 bg-[#151F32]/50">
                                <img src={course.instructor.avatar || 'https://i.pravatar.cc/150'} alt="Instructor" className="w-16 h-16 rounded-full border-2 border-slate-700 object-cover" />
                                <div>
                                    <h4 className="text-lg font-bold text-white">{course.instructor.name}</h4>
                                    <p className="text-violet-400 text-xs font-bold uppercase tracking-wide mb-2">{course.instructor.title || 'Instructor'}</p>
                                    <p className="text-slate-400 text-sm leading-relaxed">{course.instructor.bio || 'Passionate educator and industry expert.'}</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
                
                {activeTab === 'q&a' && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                        <MessageCircle size={48} className="mb-4 opacity-30"/>
                        <p className="font-medium">Q&A Forum is currently unavailable.</p>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                        <Star size={48} className="mb-4 opacity-30"/>
                        <p className="font-medium">No reviews yet. Be the first to rate!</p>
                    </div>
                )}
            </div>
          </div>
        </main>

        {/* RIGHT: CURRICULUM SIDEBAR (Responsive Drawer) */}
        
        {/* Backdrop for Mobile */}
        <AnimatePresence>
            {isMobile && sidebarOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
                />
            )}
        </AnimatePresence>

        {/* Sidebar Panel */}
        <aside 
            className={`
                fixed lg:relative inset-y-0 right-0 z-50
                w-80 lg:w-96 h-full
                bg-[#151F32] border-l border-slate-800 
                flex flex-col shadow-2xl lg:shadow-none
                transform transition-transform duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}
        >
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0B1120]">
                <div>
                    <h3 className="text-white font-bold text-lg">Course Content</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                        {course.sections?.length || 0} Sections • {course.sections?.reduce((acc: number, sec: any) => acc + sec.lessons.length, 0) || 0} Lessons
                    </p>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <X size={20}/>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                {course.sections && course.sections.map((section: any) => (
                    <div key={section._id} className="border-b border-slate-800/50">
                        <button 
                            onClick={() => toggleSection(section._id)}
                            className="w-full flex items-center justify-between p-4 bg-[#1E293B] hover:bg-slate-800 transition-colors text-left group"
                        >
                            <div className="min-w-0">
                                <h4 className="text-sm font-bold text-slate-200 group-hover:text-violet-400 transition-colors line-clamp-1">{section.title}</h4>
                                <span className="text-[11px] text-slate-500 font-medium">{section.lessons.length} Lessons</span>
                            </div>
                            {expandedSections.includes(section._id) ? <ChevronUp size={16} className="text-slate-500 shrink-0"/> : <ChevronDown size={16} className="text-slate-500 shrink-0"/>}
                        </button>

                        <AnimatePresence>
                            {expandedSections.includes(section._id) && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }} 
                                    animate={{ height: 'auto', opacity: 1 }} 
                                    exit={{ height: 0, opacity: 0 }} 
                                    className="overflow-hidden bg-[#0B1120]"
                                >
                                    {section.lessons.map((lesson: any) => {
                                        const isActive = activeLesson?._id === lesson._id;
                                        return (
                                            <div 
                                                key={lesson._id}
                                                onClick={() => {
                                                    setActiveLesson(lesson);
                                                    if(isMobile) setSidebarOpen(false);
                                                }}
                                                className={`flex items-start gap-3 p-4 cursor-pointer transition-all border-l-[3px] ${
                                                    isActive 
                                                    ? 'bg-violet-500/10 border-violet-500' 
                                                    : 'border-transparent hover:bg-slate-800/50'
                                                }`}
                                            >
                                                <div className="mt-0.5 shrink-0">
                                                    {isActive ? (
                                                        <div className="relative">
                                                             <div className="absolute inset-0 bg-violet-500 blur-[6px] opacity-50 rounded-full"></div>
                                                             <PlayCircle size={16} className="text-violet-400 relative z-10" />
                                                        </div>
                                                    ) : !lesson.isFree ? (
                                                        <Lock size={14} className="text-slate-600 mt-0.5" />
                                                    ) : (
                                                        <MonitorPlay size={16} className="text-slate-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium leading-snug line-clamp-2 ${isActive ? 'text-violet-200' : 'text-slate-400'}`}>
                                                        {lesson.title}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-[10px] text-slate-600 font-bold flex items-center gap-1">
                                                            <Clock size={10} /> {formatDuration(lesson.videoDuration)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </aside>

      </div>
    </div>
  );
};

export default CourseDetail;