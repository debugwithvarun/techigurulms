import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, BookOpen, Award, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q') || '';
    const [results, setResults] = useState({ courses: [], certificates: [] });
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (!q) return;
        setLoading(true);
        setSearched(false);
        const fetchResults = async () => {
            try {
                // fetch courses
                const coursesRes = await api.get('/courses?approvalStatus=approved').catch(() => ({ data: [] }));
                const coursesData = Array.isArray(coursesRes.data) ? coursesRes.data :
                    (coursesRes.data?.courses || coursesRes.data?.data || []);

                const lq = q.toLowerCase();
                const filteredCourses = coursesData.filter(c =>
                    c.title?.toLowerCase().includes(lq) ||
                    c.description?.toLowerCase().includes(lq) ||
                    c.category?.toLowerCase().includes(lq) ||
                    c.instructor?.name?.toLowerCase().includes(lq)
                );

                setResults({ courses: filteredCourses, certificates: [] });
            } catch {
                setResults({ courses: [], certificates: [] });
            } finally {
                setLoading(false);
                setSearched(true);
            }
        };
        fetchResults();
    }, [q]);

    const totalResults = results.courses.length + results.certificates.length;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <Search size={14} />
                        <span>Search Results</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">
                        {q ? <>Results for "<span className="text-purple-600">{q}</span>"</> : 'Search TechiGuru'}
                    </h1>
                    {searched && <p className="text-sm text-gray-500 mt-1">{totalResults} result{totalResults !== 1 ? 's' : ''} found</p>}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-purple-500" />
                    </div>
                )}

                {/* No results */}
                {!loading && searched && totalResults === 0 && (
                    <div className="text-center py-20">
                        <Search size={48} className="mx-auto text-gray-200 mb-4" />
                        <h2 className="text-lg font-bold text-gray-600 mb-1">No results found</h2>
                        <p className="text-gray-400 text-sm">Try different keywords or browse our <Link to="/active-course" className="text-purple-600 font-semibold hover:underline">courses</Link>.</p>
                    </div>
                )}

                {/* Courses */}
                {!loading && results.courses.length > 0 && (
                    <section className="mb-8">
                        <h2 className="flex items-center gap-2 text-base font-bold text-slate-700 mb-4">
                            <BookOpen size={17} className="text-purple-500" /> Courses ({results.courses.length})
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {results.courses.map((course, i) => {
                                const imgUrl = course.thumbnail?.url || course.thumbnail;
                                const src = imgUrl
                                    ? (imgUrl.startsWith('http') ? imgUrl : `https://api.techiguru.in${imgUrl}`)
                                    : null;
                                return (
                                    <motion.div key={course._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                        <Link to={`/course/${course._id}`}
                                            className="block bg-white rounded-2xl border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all overflow-hidden group">
                                            <div className="h-36 bg-gray-100 overflow-hidden">
                                                {src ? <img src={src} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    : <div className="w-full h-full flex items-center justify-center"><BookOpen size={28} className="text-gray-300" /></div>}
                                            </div>
                                            <div className="p-4">
                                                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{course.category}</span>
                                                <h3 className="font-bold text-gray-800 text-sm mt-2 leading-snug line-clamp-2">{course.title}</h3>
                                                <p className="text-xs text-gray-400 mt-1">{course.instructor?.name}</p>
                                                <div className="flex items-center justify-between mt-3">
                                                    <span className="font-black text-purple-700 text-sm">{course.price === 0 ? 'Free' : `₹${Number(course.price).toLocaleString('en-IN')}`}</span>
                                                    <span className="text-xs text-gray-400">{course.level || 'All Levels'}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Certificates section placeholder */}
                {!loading && results.certificates.length > 0 && (
                    <section>
                        <h2 className="flex items-center gap-2 text-base font-bold text-slate-700 mb-4">
                            <Award size={17} className="text-purple-500" /> Certificates ({results.certificates.length})
                        </h2>
                    </section>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
