import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera, Save, Edit2, Mail, Loader, User, BookOpen,
    Link as LinkIcon, Linkedin, Twitter, Youtube, Globe,
    Lock, Eye, EyeOff, CheckCircle, Award, BarChart2,
    X, Plus, AlertTriangle, ShieldCheck
} from 'lucide-react';
import api from '../../api/axios';
import { getImageUrl } from '../../config';

// ── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
    { id: 'profile', label: 'Profile' },
    { id: 'courses', label: 'My Courses' },
    { id: 'security', label: 'Security' },
];

// ── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={20} className="text-white" />
        </div>
        <div>
            <p className="text-2xl font-black text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
        </div>
    </div>
);

// ── Section Heading ────────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 mt-2">{children}</h3>
);

// ── Input Field ─────────────────────────────────────────────────────────────
const Field = ({ label, children, span = false }) => (
    <div className={span ? 'sm:col-span-2' : ''}>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
        {children}
    </div>
);

const inputCls = (editing) =>
    `w-full p-3 rounded-xl border text-sm transition-all ${editing
        ? 'bg-white border-violet-300 text-slate-800 focus:ring-2 focus:ring-violet-100 outline-none'
        : 'bg-slate-50 border-transparent text-slate-600'}`;

// ── Main Component ──────────────────────────────────────────────────────────
const ProfileSection = ({ user }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [enrollments, setEnrollments] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState({
        name: user?.name || '',
        title: user?.title || '',
        bio: user?.bio || '',
        instructorBio: user?.instructorBio || '',
        expertise: user?.expertise || [],
        avatar: user?.avatar || '',
        socialLinks: {
            website: user?.socialLinks?.website || '',
            linkedin: user?.socialLinks?.linkedin || '',
            twitter: user?.socialLinks?.twitter || '',
            youtube: user?.socialLinks?.youtube || '',
        }
    });
    const [expertiseInput, setExpertiseInput] = useState('');

    // Password change
    const [passwords, setPasswords] = useState({ current: '', newP: '', confirm: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [pwdLoading, setPwdLoading] = useState(false);
    const [pwdError, setPwdError] = useState('');
    const [pwdSuccess, setPwdSuccess] = useState(false);

    // Load enrollments
    useEffect(() => {
        if (activeTab === 'courses') {
            setLoadingCourses(true);
            api.get('/auth/my-enrollments')
                .then(r => setEnrollments(r.data))
                .catch(() => {})
                .finally(() => setLoadingCourses(false));
        }
    }, [activeTab]);

    const avatarUrl = getImageUrl(profile.avatar) || null;
    const initial = profile.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

    // ── Avatar upload ─────────────────────────────────────────────────────
    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        setAvatarUploading(true);
        try {
            const { data } = await api.post('/auth/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile(p => ({ ...p, avatar: data.avatar }));
        } catch {
            alert('Avatar upload failed. Please try a smaller image.');
        } finally {
            setAvatarUploading(false);
        }
    };

    // ── Save profile ──────────────────────────────────────────────────────
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.put('/auth/profile', {
                name: profile.name,
                title: profile.title,
                bio: profile.bio,
                instructorBio: profile.instructorBio,
                expertise: profile.expertise,
                avatar: profile.avatar,
                socialLinks: profile.socialLinks,
            });
            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch {
            alert('Error saving profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // ── Password change ───────────────────────────────────────────────────
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPwdError('');
        if (passwords.newP.length < 6) { setPwdError('New password must be at least 6 characters'); return; }
        if (passwords.newP !== passwords.confirm) { setPwdError('Passwords do not match'); return; }
        setPwdLoading(true);
        try {
            await api.put('/auth/profile', { password: passwords.newP });
            setPwdSuccess(true);
            setPasswords({ current: '', newP: '', confirm: '' });
            setTimeout(() => setPwdSuccess(false), 4000);
        } catch {
            setPwdError('Failed to change password. Please try again.');
        } finally {
            setPwdLoading(false);
        }
    };

    const addExpertise = () => {
        if (expertiseInput.trim() && !profile.expertise.includes(expertiseInput.trim())) {
            setProfile(p => ({ ...p, expertise: [...p.expertise, expertiseInput.trim()] }));
            setExpertiseInput('');
        }
    };

    const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* ── Hero Banner ──────────────────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-8 shadow-2xl shadow-violet-200">
                <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-black/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-white">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-2xl border-2 border-white/30 overflow-hidden bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl">
                            {avatarUploading ? (
                                <Loader size={28} className="animate-spin text-white" />
                            ) : avatarUrl ? (
                                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-black">{initial}</span>
                            )}
                        </div>
                        {isEditing && (
                            <>
                                <button onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-white text-violet-700 rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                                    <Camera size={14} />
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                            </>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                            <h2 className="text-2xl font-black tracking-tight">{profile.name || 'Your Name'}</h2>
                            {isInstructor && (
                                <span className="flex items-center gap-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                                    <ShieldCheck size={10} /> Instructor
                                </span>
                            )}
                        </div>
                        <p className="text-violet-200 text-sm">{profile.title || 'Add a title'}</p>
                        <div className="flex items-center gap-2 mt-1.5 justify-center sm:justify-start">
                            <Mail size={12} className="text-violet-300" />
                            <span className="text-violet-200 text-xs">{user?.email}</span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        {saveSuccess && (
                            <span className="flex items-center gap-1.5 text-emerald-300 text-sm font-semibold">
                                <CheckCircle size={15} /> Saved!
                            </span>
                        )}
                        {isEditing && (
                            <button onClick={() => { setIsEditing(false); }} disabled={isSaving}
                                className="px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all text-sm">
                                Cancel
                            </button>
                        )}
                        <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={isSaving}
                            className="px-5 py-2.5 bg-white text-violet-700 rounded-xl font-bold hover:bg-violet-50 transition-all shadow-lg flex items-center gap-2 text-sm">
                            {isSaving ? <Loader size={15} className="animate-spin" /> : isEditing ? <><Save size={15} />Save</> : <><Edit2 size={15} />Edit Profile</>}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* ── Stats ────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard icon={BookOpen} label="Enrolled Courses" value={enrollments.length || user?.enrolledCourses?.length || 0} color="bg-indigo-500" />
                <StatCard icon={Award} label="Certificates" value={user?.earnedCertificates?.length || 0} color="bg-amber-500" />
                <StatCard icon={BarChart2} label="Points" value={user?.profilePoints || 0} color="bg-violet-500" />
                {isInstructor
                    ? <StatCard icon={User} label="Total Students" value={user?.totalStudents || 0} color="bg-emerald-500" />
                    : <StatCard icon={CheckCircle} label="Completed" value={user?.completedCourses?.length || 0} color="bg-emerald-500" />
                }
            </div>

            {/* ── Tabs ─────────────────────────────────────────────────────── */}
            <div className="border-b border-slate-100 flex gap-6">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 text-sm font-bold transition-all border-b-2 -mb-px ${activeTab === tab.id ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">

                {/* ── PROFILE TAB ─────────────────────────────────────────── */}
                {activeTab === 'profile' && (
                    <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm space-y-7">

                        <SectionTitle>Basic Information</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field label="Full Name">
                                <input type="text" disabled={!isEditing} value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                                    className={inputCls(isEditing)} placeholder="Your full name" />
                            </Field>
                            <Field label="Title / Role">
                                <input type="text" disabled={!isEditing} value={profile.title} onChange={e => setProfile(p => ({ ...p, title: e.target.value }))}
                                    className={inputCls(isEditing)} placeholder="e.g. Full-Stack Developer" />
                            </Field>
                            <Field label="Email Address" span>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-slate-500 text-sm border border-transparent">
                                    <Mail size={15} className="text-slate-400 shrink-0" /> {user?.email}
                                    <span className="ml-auto text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">Uneditable</span>
                                </div>
                            </Field>
                            <Field label="Short Bio" span>
                                <textarea disabled={!isEditing} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                                    className={`${inputCls(isEditing)} h-24 resize-none`} placeholder="Tell us a bit about yourself..." />
                            </Field>
                        </div>

                        {isInstructor && (
                            <>
                                <div className="border-t border-slate-50 pt-6">
                                    <SectionTitle>Instructor Details</SectionTitle>
                                    <div className="space-y-5">
                                        <Field label="Full Instructor Bio" span>
                                            <textarea disabled={!isEditing} value={profile.instructorBio} onChange={e => setProfile(p => ({ ...p, instructorBio: e.target.value }))}
                                                className={`${inputCls(isEditing)} h-32 resize-none`} placeholder="Detailed bio shown on course pages..." />
                                        </Field>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Expertise Tags</label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {profile.expertise.map((tag, i) => (
                                                    <div key={i} className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full">
                                                        {tag}
                                                        {isEditing && <button onClick={() => setProfile(p => ({ ...p, expertise: p.expertise.filter((_, j) => j !== i) }))}><X size={11} /></button>}
                                                    </div>
                                                ))}
                                            </div>
                                            {isEditing && (
                                                <div className="flex gap-2">
                                                    <input value={expertiseInput} onChange={e => setExpertiseInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                                                        placeholder="Add expertise (press Enter)..."
                                                        className="flex-1 p-2.5 bg-white border border-violet-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-100" />
                                                    <button onClick={addExpertise}
                                                        className="p-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"><Plus size={16} /></button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="border-t border-slate-50 pt-6">
                            <SectionTitle>Social Links</SectionTitle>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { key: 'website', icon: Globe, placeholder: 'https://yourwebsite.com' },
                                    { key: 'linkedin', icon: Linkedin, placeholder: 'https://linkedin.com/in/...' },
                                    { key: 'twitter', icon: Twitter, placeholder: 'https://twitter.com/...' },
                                    { key: 'youtube', icon: Youtube, placeholder: 'https://youtube.com/@...' },
                                ].map(({ key, icon: Icon, placeholder }) => (
                                    <div key={key} className="relative">
                                        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="url" disabled={!isEditing}
                                            value={profile.socialLinks[key]}
                                            onChange={e => setProfile(p => ({ ...p, socialLinks: { ...p.socialLinks, [key]: e.target.value } }))}
                                            placeholder={isEditing ? placeholder : placeholder.split('/')[2]}
                                            className={`${inputCls(isEditing)} pl-10`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                                <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-colors text-sm">Cancel</button>
                                <button onClick={handleSave} disabled={isSaving}
                                    className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-violet-200 transition-all flex items-center gap-2 text-sm disabled:opacity-70">
                                    {isSaving ? <Loader size={15} className="animate-spin" /> : <Save size={15} />} Save Changes
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ── COURSES TAB ─────────────────────────────────────────── */}
                {activeTab === 'courses' && (
                    <motion.div key="courses" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-50">
                            <h3 className="font-black text-slate-800">Enrolled Courses</h3>
                            <p className="text-slate-400 text-sm mt-0.5">Your learning journey at a glance</p>
                        </div>
                        {loadingCourses ? (
                            <div className="flex items-center justify-center py-16"><Loader size={32} className="animate-spin text-violet-400" /></div>
                        ) : enrollments.length === 0 ? (
                            <div className="flex flex-col items-center py-16 text-slate-400">
                                <BookOpen size={40} className="mb-3 opacity-20" />
                                <p className="font-semibold">No courses enrolled yet</p>
                                <a href="/active-course" className="mt-3 text-violet-600 text-sm font-bold hover:underline">Browse courses →</a>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {enrollments.map(course => {
                                    const thumb = getImageUrl(course.thumbnail?.url || course.thumbnail);
                                    const progress = course.progress || 0;
                                    return (
                                        <div key={course._id} className="flex items-center gap-4 p-5 hover:bg-slate-50/60 transition-colors">
                                            <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                                {thumb ? <img src={thumb} alt={course.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-indigo-100 flex items-center justify-center"><BookOpen size={18} className="text-indigo-400" /></div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-800 text-sm line-clamp-1">{course.title}</p>
                                                <p className="text-slate-400 text-xs mt-0.5">{course.totalLessons} lessons · {course.category}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-slate-500 shrink-0">{progress}%</span>
                                                </div>
                                            </div>
                                            <a href={`/course/${course._id}/learn`}
                                                className="shrink-0 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-100 transition-colors">
                                                {progress > 0 ? 'Continue' : 'Start'}
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ── SECURITY TAB ────────────────────────────────────────── */}
                {activeTab === 'security' && (
                    <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm">
                        <SectionTitle>Change Password</SectionTitle>

                        {pwdSuccess && (
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-semibold mb-5">
                                <CheckCircle size={16} /> Password changed successfully!
                            </div>
                        )}
                        {pwdError && (
                            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl px-4 py-3 text-sm font-semibold mb-5">
                                <AlertTriangle size={16} /> {pwdError}
                            </div>
                        )}

                        <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                            {[
                                { key: 'newP', label: 'New Password', placeholder: 'Min. 6 characters' },
                                { key: 'confirm', label: 'Confirm New Password', placeholder: 'Repeat new password' },
                            ].map(({ key, label, placeholder }) => (
                                <div key={key} className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                                    <div className="relative">
                                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type={showPwd ? 'text' : 'password'} value={passwords[key]}
                                            onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))} required placeholder={placeholder}
                                            className="w-full h-11 pl-10 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-violet-400 focus:bg-white transition-all" />
                                        {key === 'confirm' && (
                                            <button type="button" onClick={() => setShowPwd(p => !p)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button type="submit" disabled={pwdLoading}
                                className="mt-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-violet-200 transition-all flex items-center gap-2 disabled:opacity-70">
                                {pwdLoading ? <><Loader size={14} className="animate-spin" />Updating...</> : <><Lock size={14} />Update Password</>}
                            </button>
                        </form>

                        <div className="mt-10 pt-6 border-t border-slate-50">
                            <SectionTitle>Account Information</SectionTitle>
                            <div className="space-y-3 text-sm text-slate-600 max-w-md">
                                <div className="flex justify-between py-2 border-b border-slate-50">
                                    <span className="text-slate-400 font-medium">Account Role</span>
                                    <span className="font-bold capitalize text-slate-800">{user?.role}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-50">
                                    <span className="text-slate-400 font-medium">Member Since</span>
                                    <span className="font-bold text-slate-800">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-slate-400 font-medium">Last Login</span>
                                    <span className="font-bold text-slate-800">{user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-IN') : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileSection;
