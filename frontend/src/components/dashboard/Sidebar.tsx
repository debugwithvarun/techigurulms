import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, PlusCircle, Settings, LogOut, Award, X, GraduationCap
} from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
    isOpen: boolean;
    onClose: () => void;
    user?: any;
}

const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'active_courses', label: 'My Courses', icon: BookOpen },
    { id: 'add_course', label: 'Create Course', icon: PlusCircle },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'profile', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, isOpen, onClose, user }) => {
    const isActive = (id: string) =>
        activeTab === id || (id === 'certificates' && (activeTab === 'certificates' || activeTab === 'add_certificate'));

    const sidebarContent = (
        <div className="flex flex-col min-h-screen select-none" style={{ background: '#1c1d1f', borderRight: '1px solid #2d2f31' }}>

            {/* ── Brand ───────────────────────────────── */}
            <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: '#2d2f31' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#a435f0' }}>
                    <GraduationCap size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                    <p className="text-[15px] font-bold text-white leading-none">TechiGuru</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#9ca3af' }}>Instructor Studio</p>
                </div>
                <button onClick={onClose} className="lg:hidden ml-auto p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors flex-shrink-0">
                    <X size={17} />
                </button>
            </div>

            {/* ── Instructor info ───────────────────── */}
            <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: '#2d2f31' }}>
                <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-sm" style={{ background: '#a435f0' }}>
                    {user?.name?.[0]?.toUpperCase() || 'I'}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate leading-tight">{user?.name || 'Instructor'}</p>
                    <p className="text-xs truncate leading-tight" style={{ color: '#9ca3af' }}>{user?.email || ''}</p>
                </div>
            </div>

            {/* ── Navigation ────────────────────────── */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {menuItems.map(item => {
                    const active = isActive(item.id);
                    return (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); onClose(); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
                            style={{
                                background: active ? 'rgba(164,53,240,0.15)' : 'transparent',
                                color: active ? '#c084fc' : '#9ca3af',
                                borderLeft: active ? '3px solid #a435f0' : '3px solid transparent',
                            }}
                            onMouseEnter={e => {
                                if (!active) {
                                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                                    (e.currentTarget as HTMLElement).style.color = '#e5e7eb';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!active) {
                                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                                    (e.currentTarget as HTMLElement).style.color = '#9ca3af';
                                }
                            }}
                        >
                            <item.icon size={17} className="flex-shrink-0" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* ── Footer ────────────────────────────── */}
            <div className="px-3 py-4 border-t" style={{ borderColor: '#2d2f31' }}>
                <Link
                    to="/"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1"
                    style={{ color: '#9ca3af' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#e5e7eb'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9ca3af'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                    <GraduationCap size={16} className="flex-shrink-0" />
                    View Website
                </Link>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
                    style={{ color: '#9ca3af' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fca5a5'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9ca3af'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                    <LogOut size={16} className="flex-shrink-0" />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop */}
            <div className="hidden lg:block w-[220px] min-h-screen fixed left-0 top-0 z-50">
                {sidebarContent}
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                            className="fixed inset-y-0 left-0 w-[220px] z-50 lg:hidden"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
