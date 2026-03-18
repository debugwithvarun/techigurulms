import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
    CheckCircle, Clock, FileText, Award, Ticket, LogOut,
    Send, Upload, X, Loader2, AlertCircle, Menu,
    ExternalLink, ArrowUp, ArrowDown, Minus, Bell,
    BookOpen, TrendingUp, Video, Plus, RefreshCw,
    ChevronRight, Calendar
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.techiguru.in';

const STATUS_TASK = {
    assigned:        { label: 'Assigned',        color: 'bg-gray-100 text-gray-700' },
    in_progress:     { label: 'In Progress',     color: 'bg-blue-100 text-blue-700' },
    submitted:       { label: 'Submitted',       color: 'bg-purple-100 text-purple-700' },
    approved:        { label: 'Approved ✓',      color: 'bg-green-100 text-green-700' },
    revision_needed: { label: 'Needs Revision',  color: 'bg-orange-100 text-orange-700' },
};

const PROGRESS_ICON = { below_avg: ArrowDown, avg: Minus, above_avg: ArrowUp };
const PROGRESS_COLOR = {
    below_avg: 'text-red-600 bg-red-50 border-red-200',
    avg:       'text-amber-600 bg-amber-50 border-amber-200',
    above_avg: 'text-green-600 bg-green-50 border-green-200',
};

// ── Task Submission Modal ──────────────────────────────────────────────────────
const SubmitTaskModal = ({ task, onClose, onSubmitted }) => {
    const [url, setUrl]   = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await api.put(`/internship/tasks/${task._id}/submit`, { submissionUrl: url, submissionNote: note });
            onSubmitted();
            onClose();
        } catch (err) { setError(err.response?.data?.message || 'Submission failed'); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="font-black text-gray-900 text-base">Submit Task</h3>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"><X size={16} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Task</p>
                        <p className="font-semibold text-gray-800 text-sm">{task.title}</p>
                    </div>
                    {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Submission Link (GitHub, Drive, etc.)</label>
                        <input value={url} onChange={e => setUrl(e.target.value)}
                            placeholder="https://github.com/yourwork..."
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notes for HR</label>
                        <textarea rows={3} value={note} onChange={e => setNote(e.target.value)}
                            placeholder="What did you build? Any challenges faced?"
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500 resize-none" />
                    </div>
                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={loading}
                            className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Submit
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// ── Raise Ticket Modal ─────────────────────────────────────────────────────────
const TicketModal = ({ onClose, onRaised }) => {
    const [form, setForm] = useState({ subject: '', description: '', priority: 'medium' });
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await api.post('/internship/tickets', form);
            onRaised();
            onClose();
        } catch (err) { setError(err.response?.data?.message || 'Failed to raise ticket'); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="font-black text-gray-900">Raise a Ticket</h3>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"><X size={16} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject *</label>
                        <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required
                            placeholder="Brief description of the issue"
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description *</label>
                        <textarea rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required
                            placeholder="Describe the issue in detail..."
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500 resize-none" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</label>
                        <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-purple-500">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={loading}
                            className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Ticket size={14} />} Raise Ticket
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// ── Main Intern Dashboard ──────────────────────────────────────────────────────
const InternDashboard = () => {
    const { user, logout } = useAuth();
    const navigate         = useNavigate();

    const [application, setApplication] = useState(null);
    const [tasks, setTasks]     = useState([]);
    const [tickets, setTickets] = useState([]);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedTask, setSelectedTask]   = useState(null);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [sidebarOpen, setSidebarOpen]     = useState(false);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        loadAll();
    }, [user]);

    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            const [appsRes, tasksRes, ticketsRes] = await Promise.all([
                api.get('/internship/my'),
                api.get('/internship/tasks/my'),
                api.get('/internship/tickets/my'),
            ]);
            const apps = appsRes.data || [];
            const activeApp = apps.find(a => ['enrolled', 'selected', 'offer_sent', 'completed', 'certificate_issued'].includes(a.status));
            setApplication(activeApp || apps[0] || null);

            if (activeApp) {
                const progRes = await api.get(`/internship/progress/${activeApp._id}`).catch(() => ({ data: [] }));
                setProgress(progRes.data || []);
            }

            setTasks(tasksRes.data || []);
            setTickets(ticketsRes.data || []);
        } catch (err) { console.error(err); }
        setLoading(false);
    }, []);

    const TABS = [
        { id: 'overview',  label: 'Overview',   icon: BarChart3Icon },
        { id: 'tasks',     label: 'My Tasks',   icon: FileText,    badge: tasks.filter(t => t.status === 'assigned' || t.status === 'revision_needed').length },
        { id: 'progress',  label: 'My Progress', icon: TrendingUp },
        { id: 'tickets',   label: 'Tickets',    icon: Ticket,      badge: tickets.filter(t => t.status === 'open').length },
        { id: 'documents', label: 'Documents',  icon: Award },
    ];

    function BarChart3Icon(props) { return <TrendingUp {...props} /> }

    const sidebarContent = (
        <div className="flex flex-col h-full" style={{ background: 'linear-gradient(180deg, #1e1148 0%, #2d1b6e 100%)' }}>
            <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-purple-400 to-indigo-500">
                    <BookOpen size={17} className="text-white" />
                </div>
                <div>
                    <p className="text-white font-black text-sm">Intern Portal</p>
                    <p className="text-purple-300 text-[11px]">TechiGuru</p>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-purple-300"><X size={18} /></button>
            </div>
            <div className="px-4 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-purple-500 to-indigo-600 text-base">{user?.name?.[0]?.toUpperCase()}</div>
                    <div className="min-w-0">
                        <p className="text-white text-sm font-bold truncate">{user?.name}</p>
                        <p className="text-purple-300 text-xs">{application?.role || 'Intern'}</p>
                    </div>
                </div>
                {application && (
                    <div className="mt-3 px-3 py-2 bg-white/10 rounded-xl">
                        <p className="text-purple-200 text-[10px] font-bold uppercase tracking-wider">Status</p>
                        <p className="text-white text-xs font-semibold mt-0.5 capitalize">{application.status.replace('_', ' ')}</p>
                    </div>
                )}
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
                {TABS.map(tab => {
                    const active = activeTab === tab.id;
                    return (
                        <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                            style={{ background: active ? 'rgba(255,255,255,0.15)' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                            <tab.icon size={17} className="shrink-0" />
                            <span>{tab.label}</span>
                            {tab.badge > 0 && <span className="ml-auto w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-[10px] font-bold">{tab.badge}</span>}
                        </button>
                    );
                })}
            </nav>
            <div className="px-3 py-4 border-t border-white/10">
                <button onClick={() => { logout(); navigate('/'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-purple-300 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <LogOut size={16} /> Sign Out
                </button>
            </div>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f7ff]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">Loading Intern Dashboard...</p>
            </div>
        </div>
    );

    if (!application) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f7ff]">
            <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={28} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">No Active Internship</h3>
                <p className="text-gray-500 text-sm mb-6">You don't have an active internship. Apply from the Contact page.</p>
                <button onClick={() => navigate('/contact')} className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl">Apply for Internship</button>
            </div>
        </div>
    );

    const completedTasks = tasks.filter(t => t.status === 'approved').length;
    const totalTasks     = tasks.length;

    const latestProgress = progress[progress.length - 1];

    return (
        <div className="flex min-h-screen bg-[#f8f7ff] font-sans">
            <div className="hidden lg:block w-[240px] min-h-screen fixed left-0 top-0 z-40">{sidebarContent}</div>
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
                        <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 26 }}
                            className="fixed inset-y-0 left-0 w-[240px] z-50 lg:hidden">{sidebarContent}</motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="flex-1 lg:pl-[240px] flex flex-col">
                {/* Mobile topbar */}
                <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600"><Menu size={22} /></button>
                    <span className="font-bold text-gray-900">Intern Portal</span>
                    <button onClick={() => setShowTicketModal(true)} className="p-2 text-purple-600"><Plus size={20} /></button>
                </div>

                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900">
                                {activeTab === 'overview' ? `Welcome, ${user?.name?.split(' ')[0]}! 👋` : TABS.find(t => t.id === activeTab)?.label}
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">{application.role} Internship</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowTicketModal(true)}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 shadow-sm">
                                <Ticket size={15} /> Raise Ticket
                            </button>
                        </div>
                    </div>

                    {/* ── OVERVIEW ── */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Hero card */}
                            <div className="relative bg-gradient-to-br from-[#2d1b6e] to-[#4c1d95] rounded-3xl p-7 overflow-hidden text-white">
                                <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)', transform: 'translate(20%, -20%)' }} />
                                <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-1">Your Internship</p>
                                <h2 className="text-2xl font-black mb-2">{application.role}</h2>
                                <p className="text-purple-200 text-sm">Status: <span className="text-white font-bold capitalize">{application.status.replace('_', ' ')}</span></p>
                                {application.internshipStartDate && (
                                    <p className="text-purple-200 text-sm mt-1">Started: {new Date(application.internshipStartDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                                )}
                                {application.subHR && (
                                    <p className="text-purple-200 text-sm mt-1">HR Coordinator: <span className="text-white font-semibold">{application.subHR.name}</span></p>
                                )}
                            </div>

                            {/* Quick stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Tasks',     value: totalTasks,     icon: FileText,  color: '#7c3aed', bg: 'bg-purple-50', tab: 'tasks' },
                                    { label: 'Completed',       value: completedTasks, icon: CheckCircle, color: '#10b981', bg: 'bg-green-50', tab: 'tasks' },
                                    { label: 'Open Tickets',    value: tickets.filter(t => t.status === 'open').length, icon: Ticket, color: '#f59e0b', bg: 'bg-amber-50', tab: 'tickets' },
                                    { label: 'Progress Reports', value: progress.length, icon: TrendingUp, color: '#3b82f6', bg: 'bg-blue-50', tab: 'progress' },
                                ].map(({ label, value, icon: Icon, color, bg, tab }) => (
                                    <motion.div key={label} whileHover={{ y: -2 }} onClick={() => setActiveTab(tab)}
                                        className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm cursor-pointer hover:shadow-md transition-all">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} mb-3`}>
                                            <Icon size={18} style={{ color }} />
                                        </div>
                                        <p className="text-2xl font-black text-gray-900">{value}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Latest performance */}
                            {latestProgress && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><TrendingUp size={16} className="text-purple-600" /> Latest Performance</h3>
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-bold ${PROGRESS_COLOR[latestProgress.rating]}`}>
                                        {React.createElement(PROGRESS_ICON[latestProgress.rating], { size: 16 })}
                                        {latestProgress.rating.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                        <span className="text-xs font-medium opacity-70">· Week {latestProgress.week}</span>
                                    </div>
                                    {latestProgress.remarks && <p className="text-sm text-gray-500 mt-2">{latestProgress.remarks}</p>}
                                </div>
                            )}

                            {/* Pending tasks */}
                            {tasks.filter(t => t.status === 'assigned' || t.status === 'revision_needed').length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900 text-sm">Pending Tasks</h3>
                                        <button onClick={() => setActiveTab('tasks')} className="text-xs font-semibold text-purple-600 hover:underline">View All</button>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {tasks.filter(t => t.status === 'assigned' || t.status === 'revision_needed').slice(0, 3).map(task => (
                                            <div key={task._id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50">
                                                <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                                    <FileText size={14} className="text-purple-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800 text-sm truncate">{task.title}</p>
                                                    {task.dueDate && <p className="text-xs text-gray-400">{new Date(task.dueDate).toLocaleDateString('en-IN')}</p>}
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_TASK[task.status]?.color}`}>{STATUS_TASK[task.status]?.label}</span>
                                                <button onClick={() => setSelectedTask(task)} className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg hover:bg-purple-100">Submit</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── TASKS ── */}
                    {activeTab === 'tasks' && (
                        <div className="space-y-3">
                            {tasks.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center shadow-sm">
                                    <FileText size={36} className="mx-auto mb-3 text-gray-300" />
                                    <p className="font-semibold text-gray-600">No tasks assigned yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Your HR coordinator will assign tasks soon</p>
                                </div>
                            ) : tasks.map(task => (
                                <motion.div key={task._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0 mr-3">
                                            <h4 className="font-bold text-gray-900">{task.title}</h4>
                                            {task.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>}
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${STATUS_TASK[task.status]?.color}`}>
                                            {STATUS_TASK[task.status]?.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${task.priority === 'high' ? 'bg-orange-100 text-orange-700' : task.priority === 'medium' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{task.priority}</span>
                                            {task.dueDate && (
                                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                                    <Calendar size={11} />{new Date(task.dueDate).toLocaleDateString('en-IN')}
                                                </span>
                                            )}
                                        </div>
                                        {(task.status === 'assigned' || task.status === 'revision_needed' || task.status === 'in_progress') && (
                                            <button onClick={() => setSelectedTask(task)}
                                                className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700">
                                                Submit Work
                                            </button>
                                        )}
                                        {task.submissionUrl && (
                                            <a href={task.submissionUrl} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline">
                                                <ExternalLink size={12} /> View Submission
                                            </a>
                                        )}
                                    </div>
                                    {task.feedbackNote && (
                                        <div className="mt-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2.5">
                                            <p className="text-xs font-bold text-orange-600 mb-0.5">HR Feedback</p>
                                            <p className="text-xs text-orange-700">{task.feedbackNote}</p>
                                        </div>
                                    )}
                                    {task.assignedBy && <p className="text-[10px] text-gray-400 mt-2">Assigned by {task.assignedBy.name}</p>}
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* ── PROGRESS ── */}
                    {activeTab === 'progress' && (
                        <div className="space-y-4">
                            {progress.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center shadow-sm">
                                    <TrendingUp size={36} className="mx-auto mb-3 text-gray-300" />
                                    <p className="font-semibold text-gray-600">No progress reports yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Your HR will mark your weekly performance here</p>
                                </div>
                            ) : progress.map((p, i) => {
                                const RatingIcon = PROGRESS_ICON[p.rating];
                                return (
                                    <div key={p._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center font-bold text-purple-700 text-sm">{i + 1}</div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Week {p.week}</p>
                                                    <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString('en-IN')}</p>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold ${PROGRESS_COLOR[p.rating]}`}>
                                                <RatingIcon size={14} />
                                                {p.rating.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                            </span>
                                        </div>
                                        {p.remarks && <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3">{p.remarks}</p>}
                                        {p.markedBy && <p className="text-xs text-gray-400 mt-2">Marked by {p.markedBy.name}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── TICKETS ── */}
                    {activeTab === 'tickets' && (
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <button onClick={() => setShowTicketModal(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700">
                                    <Plus size={15} /> New Ticket
                                </button>
                            </div>
                            {tickets.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center shadow-sm">
                                    <Ticket size={36} className="mx-auto mb-3 text-gray-300" />
                                    <p className="font-semibold text-gray-600">No tickets raised</p>
                                    <p className="text-sm text-gray-400 mt-1">Have an issue? Raise a ticket and your HR will help.</p>
                                </div>
                            ) : tickets.map(t => (
                                <div key={t._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-bold text-gray-900">{t.subject}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{new Date(t.createdAt).toLocaleDateString('en-IN')}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ml-2
                                            ${t.status === 'open' ? 'bg-amber-100 text-amber-700'
                                            : t.status === 'resolved' ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'}`}>{t.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-3">{t.description}</p>
                                    {t.resolution && (
                                        <div className="mt-3 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
                                            <p className="text-xs font-bold text-green-600 mb-0.5">Resolution</p>
                                            <p className="text-xs text-green-700">{t.resolution}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── DOCUMENTS ── */}
                    {activeTab === 'documents' && (
                        <div className="space-y-4">
                            {/* Offer Letter */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                                        <FileText size={22} className="text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">Offer Letter</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {application.offerLetterUrl ? 'Your offer letter is ready' : 'Waiting for HR to send offer letter'}
                                        </p>
                                    </div>
                                    {application.offerLetterUrl ? (
                                        <a href={application.offerLetterUrl.startsWith('http') ? application.offerLetterUrl : `${BACKEND_URL}${application.offerLetterUrl}`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700">
                                            <ExternalLink size={14} /> View
                                        </a>
                                    ) : (
                                        <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-xl">Pending</span>
                                    )}
                                </div>
                            </div>

                            {/* Certificate */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                                        <Award size={22} className="text-yellow-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">Completion Certificate</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {application.certificateApproved
                                                ? `Approved on ${new Date(application.certificateApprovedAt).toLocaleDateString('en-IN')}`
                                                : 'Available after internship completion & Head HR approval'}
                                        </p>
                                    </div>
                                    {application.certificateApproved && application.certificateUrl ? (
                                        <a href={application.certificateUrl.startsWith('http') ? application.certificateUrl : `${BACKEND_URL}${application.certificateUrl}`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 text-white text-sm font-bold rounded-xl hover:bg-yellow-600">
                                            <Award size={14} /> Download
                                        </a>
                                    ) : (
                                        <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl">
                                            {application.status === 'completed' ? 'Awaiting Approval' : 'Not yet available'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {selectedTask && (
                    <SubmitTaskModal task={selectedTask} onClose={() => setSelectedTask(null)} onSubmitted={loadAll} />
                )}
                {showTicketModal && (
                    <TicketModal onClose={() => setShowTicketModal(false)} onRaised={loadAll} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default InternDashboard;