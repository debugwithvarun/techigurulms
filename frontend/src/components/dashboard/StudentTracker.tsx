import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Award, TrendingUp, Search, ChevronDown, ChevronUp, CheckCircle, Clock } from 'lucide-react';
import api from '../../api/axios';

interface StudentTrackerProps {
    courses: any[];
}

const ProgressBar = ({ value }: { value: number }) => (
    <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                    width: `${value}%`,
                    background: value === 100 ? '#10b981' : value > 50 ? '#a435f0' : '#6366f1'
                }}
            />
        </div>
        <span className="text-xs font-bold text-gray-700 w-10 text-right">{value}%</span>
    </div>
);

const StudentTracker: React.FC<StudentTrackerProps> = ({ courses }) => {
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [courseDetail, setCourseDetail] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

    useEffect(() => {
        if (courses.length > 0 && !selectedCourse) {
            setSelectedCourse(courses[0]);
        }
    }, [courses]);

    useEffect(() => {
        if (!selectedCourse?._id) return;
        setLoading(true);
        api.get(`/courses/${selectedCourse._id}`)
            .then(res => setCourseDetail(res.data))
            .catch(() => setCourseDetail(null))
            .finally(() => setLoading(false));
    }, [selectedCourse]);

    const enrollments: any[] = courseDetail?.enrollments || [];
    const filtered = enrollments.filter((e: any) =>
        e.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.student?.email?.toLowerCase().includes(search.toLowerCase())
    );

    const stats = {
        total: enrollments.length,
        completed: enrollments.filter((e: any) => e.completed).length,
        certified: enrollments.filter((e: any) => e.certificateIssued).length,
        avgProgress: enrollments.length > 0
            ? Math.round(enrollments.reduce((s: number, e: any) => s + (e.progress || 0), 0) / enrollments.length)
            : 0,
    };

    return (
        <div className="space-y-5 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Tracker</h1>
                <p className="text-sm text-gray-500 mt-0.5">Monitor enrollment and progress across your courses</p>
            </div>

            {/* Course Selector */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Select Course</p>
                <div className="flex flex-wrap gap-2">
                    {courses.map(course => (
                        <button
                            key={course._id}
                            onClick={() => setSelectedCourse(course)}
                            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${selectedCourse?._id === course._id
                                ? 'text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            style={selectedCourse?._id === course._id ? { background: 'linear-gradient(135deg, #a435f0, #7c3aed)' } : {}}
                        >
                            <BookOpen size={13} />
                            <span className="max-w-[200px] truncate">{course.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Enrolled', value: stats.total, icon: Users, color: '#3b82f6', bg: 'bg-blue-50' },
                    { label: 'Avg Progress', value: `${stats.avgProgress}%`, icon: TrendingUp, color: '#a435f0', bg: 'bg-purple-50' },
                    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: '#10b981', bg: 'bg-green-50' },
                    { label: 'Certified', value: stats.certified, icon: Award, color: '#f59e0b', bg: 'bg-amber-50' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} mb-3`}>
                            <s.icon size={18} style={{ color: s.color }} />
                        </div>
                        <p className="text-2xl font-black text-gray-900">{s.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Student Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="relative flex-1 max-w-xs">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <span className="text-xs text-gray-400 ml-auto">{filtered.length} student{filtered.length !== 1 ? 's' : ''}</span>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
                        Loading student data...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                        <Users size={32} className="mx-auto mb-3 opacity-20" />
                        <p className="font-medium text-sm">No students enrolled yet</p>
                        <p className="text-xs mt-1">Share your course to start getting students!</p>
                    </div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <div className="col-span-4">Student</div>
                            <div className="col-span-4">Progress</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Certificate</div>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {filtered.map((enrollment: any) => (
                                <motion.div
                                    key={enrollment._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50/60 transition-colors"
                                >
                                    <div
                                        className="grid grid-cols-12 gap-3 px-5 py-4 items-center cursor-pointer"
                                        onClick={() => setExpandedStudent(expandedStudent === enrollment._id ? null : enrollment._id)}
                                    >
                                        {/* Student */}
                                        <div className="col-span-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                {enrollment.student?.name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{enrollment.student?.name || 'Unknown'}</p>
                                                <p className="text-xs text-gray-400 truncate">{enrollment.student?.email}</p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="col-span-4">
                                            <ProgressBar value={enrollment.progress || 0} />
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2">
                                            {enrollment.completed ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                                                    <CheckCircle size={11} /> Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                                                    <Clock size={11} /> In Progress
                                                </span>
                                            )}
                                        </div>

                                        {/* Certificate */}
                                        <div className="col-span-2">
                                            {enrollment.certificateIssued ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">
                                                    <Award size={11} /> Issued
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400">Not yet</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded detail */}
                                    {expandedStudent === enrollment._id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="px-5 pb-4 border-t border-gray-50 bg-gray-50/50"
                                        >
                                            <div className="grid grid-cols-3 gap-4 mt-3 text-xs">
                                                <div>
                                                    <span className="text-gray-400 uppercase tracking-wider font-semibold">Enrolled On</span>
                                                    <p className="font-semibold text-gray-700 mt-0.5">
                                                        {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                    </p>
                                                </div>
                                                {enrollment.completedAt && (
                                                    <div>
                                                        <span className="text-gray-400 uppercase tracking-wider font-semibold">Completed On</span>
                                                        <p className="font-semibold text-gray-700 mt-0.5">
                                                            {new Date(enrollment.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-gray-400 uppercase tracking-wider font-semibold">Progress</span>
                                                    <p className="font-semibold text-gray-700 mt-0.5">{enrollment.progress || 0}% complete</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentTracker;
