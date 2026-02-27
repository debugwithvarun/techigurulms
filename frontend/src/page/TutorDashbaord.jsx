import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader, Menu, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useCourse } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// ── Dashboard Modules ──────────────────────────────────────────────────────────
import Sidebar from '../components/dashboard/Sidebar';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import CourseList from '../components/dashboard/CourseList';
import CourseBuilder from '../components/dashboard/CourseBuilder';
import ProfileSection from '../components/dashboard/ProfileSection';
import StudentTracker from '../components/dashboard/StudentTracker';
import { CertificateList, CertificateBuilder } from '../components/dashboard/Certificates';

// ── Component ──────────────────────────────────────────────────────────────────

const TutorDashboard = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const {
        myCourses, fetchMyCourses, createCourse, updateCourse,
        deleteCourse, loading: courseLoading
    } = useCourse();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [editingCourse, setEditingCourse] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Certificates state
    const [certificates, setCertificates] = useState([]);
    const [editingCertificate, setEditingCertificate] = useState(null);
    const [loadingCerts, setLoadingCerts] = useState(false);

    // ── Auth Guard ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!authLoading) {
            if (!user) navigate('/login');
            else if (user.role !== 'instructor' && user.role !== 'admin') navigate('/');
        }
    }, [user, authLoading, navigate]);

    // ── Fetch Data ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (user?.role === 'instructor' || user?.role === 'admin') {
            fetchMyCourses();
            fetchCertificates();
        }
    }, [user]);

    const fetchCertificates = async () => {
        setLoadingCerts(true);
        try {
            const { data } = await api.get('/certificates/mycertificates');
            setCertificates(data.map(c => ({ ...c, id: c._id })));
        } catch (err) {
            console.error('Error fetching certificates', err);
        } finally {
            setLoadingCerts(false);
        }
    };

    // ── Course CRUD ────────────────────────────────────────────────────────────
    const handleEditCourse = (course) => {
        const mappedTopics = course.sections?.map(sec => ({
            id: sec._id || Date.now(),
            title: sec.title,
            videos: sec.lessons?.map(les => ({
                id: les._id || Date.now(),
                title: les.title,
                videoKey: les.videoKey || '',
                duration: les.videoDuration?.toString() || '',
                isFree: les.isFree || false,
                description: les.description || '',
                resources: les.resources || [],
                codeSnippets: les.codeSnippets || [],
                quizzes: les.quizzes || [],
                subParts: (les.subParts || []).map(sp => ({
                    id: sp._id || Date.now(),
                    title: sp.title || '',
                    videoKey: sp.videoKey || '',
                    duration: sp.duration || '',
                    description: sp.description || '',
                    isFree: sp.isFree || false,
                    resources: sp.resources || [],
                    codeSnippets: sp.codeSnippets || [],
                    quizzes: sp.quizzes || [],
                    subParts: (sp.subParts || []).map(ss => ({
                        id: ss._id || Date.now(),
                        title: ss.title || '',
                        videoKey: ss.videoKey || '',
                        duration: ss.duration || '',
                        description: ss.description || '',
                        isFree: ss.isFree || false,
                        resources: ss.resources || [],
                        codeSnippets: ss.codeSnippets || [],
                        quizzes: ss.quizzes || [],
                    }))
                }))
            })) || []
        })) || [];

        const mappedSyllabus = course.syllabus?.map(topic => ({
            id: topic._id || Date.now(),
            title: topic.title || '',
            description: topic.description || '',
            duration: topic.duration || '',
            subTopics: (topic.subTopics || []).map(st => ({
                id: st._id || Date.now(),
                title: st.title || '',
                description: st.description || '',
                duration: st.duration || '',
                subTopics: (st.subTopics || []).map(ss => ({
                    id: ss._id || Date.now(),
                    title: ss.title || '',
                    description: ss.description || '',
                    duration: ss.duration || '',
                }))
            }))
        })) || [];

        setEditingCourse({
            ...course,
            id: course._id,
            topics: mappedTopics,
            syllabus: mappedSyllabus,
            thumbnail: course.thumbnail?.url || course.thumbnail,
        });
        setActiveTab('add_course');
    };

    const handleSaveCourse = async (data) => {
        setIsSaving(true);

        const payload = {
            title: data.title,
            description: data.description,
            price: Number(data.price),
            category: data.category,
            status: data.status,
            thumbnail: data.thumbnail,
            level: data.level,
            learningPoints: data.learningPoints,
            requirements: data.requirements,
            sections: data.topics.map(topic => ({
                title: topic.title,
                lessons: topic.videos.map(video => ({
                    title: video.title,
                    type: 'video',
                    videoKey: video.videoKey,
                    videoDuration: parseInt(video.duration) || 0,
                    description: video.description,
                    isFree: video.isFree,
                    resources: video.resources,
                    codeSnippets: video.codeSnippets,
                    quizzes: video.quizzes,
                    subParts: (video.subParts || []).map(sp => ({
                        title: sp.title,
                        videoKey: sp.videoKey,
                        duration: sp.duration,
                        description: sp.description,
                        isFree: sp.isFree,
                        resources: sp.resources,
                        codeSnippets: sp.codeSnippets,
                        quizzes: sp.quizzes,
                        subParts: (sp.subParts || []).map(ss => ({
                            title: ss.title,
                            videoKey: ss.videoKey,
                            duration: ss.duration,
                            description: ss.description,
                            isFree: ss.isFree,
                            resources: ss.resources,
                            codeSnippets: ss.codeSnippets,
                            quizzes: ss.quizzes,
                        }))
                    }))
                }))
            })),
            syllabus: (data.syllabus || []).map(topic => ({
                title: topic.title,
                description: topic.description,
                duration: topic.duration,
                subTopics: topic.subTopics.map(st => ({
                    title: st.title,
                    description: st.description,
                    duration: st.duration,
                    subTopics: st.subTopics.map(ss => ({
                        title: ss.title,
                        description: ss.description,
                        duration: ss.duration,
                    }))
                }))
            }))
        };

        let result;
        if (editingCourse?.id) {
            result = await updateCourse(editingCourse.id, payload);
        } else {
            result = await createCourse(payload);
        }

        setIsSaving(false);
        if (result.success) {
            setEditingCourse(null);
            setActiveTab('active_courses');
        } else {
            alert(result.message);
        }
    };

    const handleDeleteCourse = async (id) => {
        if (confirm('Are you sure you want to delete this course? This cannot be undone.')) {
            await deleteCourse(id);
        }
    };

    // ── Certificate CRUD ───────────────────────────────────────────────────────
    const handleEditCertificate = (cert) => {
        setEditingCertificate(cert);
        setActiveTab('add_certificate');
    };

    const handleDeleteCertificate = async (id) => {
        if (confirm('Delete this certificate?')) {
            try {
                await api.delete(`/certificates/${id}`);
                setCertificates(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete certificate');
            }
        }
    };

    const handleSaveCertificate = async (data) => {
        setIsSaving(true);
        try {
            const payload = {
                title: data.title,
                description: data.description,
                genre: data.genre,
                link: data.link,
                status: data.status,
                thumbnail: data.thumbnail,
            };
            if (data.id) {
                await api.put(`/certificates/${data.id}`, payload);
            } else {
                await api.post('/certificates', payload);
            }
            await fetchCertificates();
            setEditingCertificate(null);
            setActiveTab('certificates');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save certificate');
        } finally {
            setIsSaving(false);
        }
    };

    // ── Tab Change ─────────────────────────────────────────────────────────────
    const handleTabChange = (tab) => {
        if (tab !== 'add_course') setEditingCourse(null);
        if (tab !== 'add_certificate') setEditingCertificate(null);
        setActiveTab(tab);
    };

    // ── Guards ─────────────────────────────────────────────────────────────────
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-3">
                    <Loader className="animate-spin text-violet-600" size={36} />
                    <p className="text-slate-500 text-sm font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user || (user.role !== 'instructor' && user.role !== 'admin')) return null;

    const sidebarActiveTab = activeTab === 'add_certificate' ? 'certificates' : activeTab;

    return (
        <div className="flex min-h-screen selection:bg-violet-200 selection:text-violet-900" style={{ background: '#f7f8fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            {/* ── Sidebar ─────────────────────────────────────────────────────── */}
            <Sidebar
                activeTab={sidebarActiveTab}
                setActiveTab={handleTabChange}
                onLogout={() => { logout(); navigate('/login'); }}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                user={user}
            />

            {/* ── Main Content ──────────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col lg:pl-[220px] min-h-screen">
                {/* Mobile Topbar */}
                <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-1 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                            <Menu size={22} />
                        </button>
                        <span className="font-bold text-slate-900 text-base">TechiGuru</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full" />
                        </button>
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                            {user?.name?.[0]?.toUpperCase() || 'T'}
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" style={{ background: '#f7f8fa' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="pb-16"
                        >
                            {activeTab === 'overview' && (
                                <DashboardOverview
                                    courses={myCourses}
                                    certificatesCount={certificates.length}
                                    onNavigate={handleTabChange}
                                />
                            )}
                            {activeTab === 'active_courses' && (
                                <CourseList
                                    courses={myCourses}
                                    onEdit={handleEditCourse}
                                    onDelete={handleDeleteCourse}
                                    onCreateClick={() => { setEditingCourse(null); setActiveTab('add_course'); }}
                                    isLoading={courseLoading}
                                />
                            )}
                            {activeTab === 'add_course' && (
                                <CourseBuilder
                                    initialData={editingCourse}
                                    onSave={handleSaveCourse}
                                    onCancel={() => setActiveTab('active_courses')}
                                    isSaving={isSaving}
                                />
                            )}
                            {activeTab === 'certificates' && (
                                <CertificateList
                                    certificates={certificates}
                                    onEdit={handleEditCertificate}
                                    onDelete={handleDeleteCertificate}
                                    onCreateClick={() => { setEditingCertificate(null); setActiveTab('add_certificate'); }}
                                    isLoading={loadingCerts}
                                />
                            )}
                            {activeTab === 'add_certificate' && (
                                <CertificateBuilder
                                    initialData={editingCertificate}
                                    onSave={handleSaveCertificate}
                                    onCancel={() => setActiveTab('certificates')}
                                    isSaving={isSaving}
                                />
                            )}
                            {activeTab === 'profile' && (
                                <ProfileSection user={user} />
                            )}
                            {activeTab === 'students' && (
                                <StudentTracker courses={myCourses} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TutorDashboard;
