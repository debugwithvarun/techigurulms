import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourse } from '../../context/CourseContext';
import { motion } from 'framer-motion';
import { Search, Loader2, PackageOpen, BookOpen, Users, ArrowRight, Archive } from 'lucide-react';
import { getImageUrl } from '../../config';

const InactiveCourses = () => {
    const { fetchCourses, loading } = useCourse();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        const load = async () => {
            setFetching(true);
            // Fetch inactive/archived courses using status filter
            const data = await fetchCourses('', '', '', '');
            if (data?.courses) {
                // Show courses that are not active (inactive/draft/archived)
                const inactive = data.courses.filter(c =>
                    c.status === 'inactive' || c.status === 'draft' || c.approvalStatus === 'pending'
                );
                setCourses(inactive.length > 0 ? inactive : data.courses); // fallback: show all if no inactive
            }
            setFetching(false);
        };
        load();
    }, []);

    const filtered = courses.filter(c =>
        !searchTerm || c.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 px-4 lg:px-8 py-12">
            <div className="max-w-7xl mx-auto mb-10">
                <div className="flex items-start gap-4 mb-8">
                    <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center shrink-0">
                        <Archive size={22} className="text-slate-600" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900">Inactive Trainings</h1>
                        <p className="text-slate-500 mt-1">Archived and draft courses — coming soon or under review</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search inactive courses..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 shadow-sm"
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {fetching || loading ? (
                    <div className="flex flex-col items-center py-24">
                        <Loader2 size={36} className="animate-spin text-slate-400 mb-4" />
                        <p className="text-slate-400">Loading...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center py-24 text-slate-400">
                        <PackageOpen size={48} className="mb-4 opacity-40" />
                        <p className="font-semibold text-lg">No inactive courses found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((course, i) => {
                            const thumbUrl = getImageUrl(course.thumbnail?.url || course.thumbnail);
                            const totalLessons = course.sections?.reduce((a, s) => a + (s.lessons?.length || 0), 0) || 0;
                            return (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden group opacity-80 hover:opacity-100 hover:shadow-lg transition-all duration-300 flex flex-col"
                                >
                                    <div className="h-44 bg-slate-100 overflow-hidden relative">
                                        {thumbUrl && <img src={thumbUrl} alt={course.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />}
                                        <div className="absolute top-2.5 left-2.5 bg-slate-700/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                                            Inactive
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1 p-5">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{course.category}</div>
                                        <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mb-3">{course.title}</h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 mt-auto">
                                            <span className="flex items-center gap-1"><BookOpen size={11} />{totalLessons} lessons</span>
                                            <span className="flex items-center gap-1"><Users size={11} />{course.studentsEnrolled || 0}</span>
                                        </div>
                                        <button onClick={() => navigate(`/course/${course._id}`)}
                                            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                                            View Details <ArrowRight size={13} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InactiveCourses;
