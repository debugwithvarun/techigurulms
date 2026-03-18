import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, CheckCircle, AlertCircle, Loader2,
    MapPin, Phone, Mail, MessageSquare, Clock, ArrowRight,
    Briefcase, Upload, User, GraduationCap, FileText, X, Lock
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const inputClass = `w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-slate-800
  placeholder:text-gray-400 text-sm
  focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100
  transition-all duration-200`;

// ── Contact Form ───────────────────────────────────────────────────────────────
const ContactForm = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');
        try {
            await api.post('/contact', form);
            setStatus('success');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="p-8 lg:p-12">
            <h2 className="text-2xl font-black text-slate-900 mb-1">Send us a Message</h2>
            <p className="text-slate-400 text-sm mb-8">We'll create a support ticket and send a confirmation to your inbox.</p>

            <AnimatePresence>
                {status === 'success' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 rounded-2xl px-5 py-4 mb-6">
                        <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-sm">Message sent! 🎉</p>
                            <p className="text-xs mt-0.5 text-green-700">We've emailed a ticket confirmation. Expect a reply within 24–48 hours.</p>
                        </div>
                    </motion.div>
                )}
                {status === 'error' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-2xl px-5 py-4 mb-6">
                        <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">{errorMsg}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange}
                            required placeholder="Your name" className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange}
                            required placeholder="you@example.com" className={inputClass} />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject / Topic</label>
                    <input type="text" name="subject" value={form.subject} onChange={handleChange}
                        required placeholder="What's your query about?" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
                    <textarea rows={5} name="message" value={form.message} onChange={handleChange}
                        required placeholder="Describe your query in detail..." className={`${inputClass} resize-none`} />
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    type="submit" disabled={status === 'loading'}
                    className="flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm">
                    {status === 'loading'
                        ? <><Loader2 size={17} className="animate-spin" /> Sending your message...</>
                        : <><Send size={16} /> Send Message <ArrowRight size={15} /></>}
                </motion.button>
            </form>
        </div>
    );
};

// ── Year options ───────────────────────────────────────────────────────────────
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'];
const ROLES = [
    'Full Stack Developer (MERN)',
    'Frontend Developer',
    'Backend Developer',
    'Data Science / AI/ML',
    'DevOps / Cloud',
    'UI/UX Designer',
    'Digital Marketing',
    'Business Development',
    'HR & Operations',
    'Content Writing',
];

// ── Internship Form ────────────────────────────────────────────────────────────
const InternshipForm = () => {
    const { user } = useAuth();
    const navigate  = useNavigate();

    const [form, setForm] = useState({
        fullName:   user?.name  || '',
        email:      user?.email || '',
        phone:      '',
        college:    '',
        branch:     '',
        year:       '',
        role:       '',
        experience: '',
        skills:     '',
        whyUs:      '',
    });
    const [resume, setResume]         = useState(null);
    const [resumePreview, setResumePreview] = useState('');
    const [status, setStatus]         = useState(null);  // null | loading | success | error
    const [errorMsg, setErrorMsg]     = useState('');
    const [dragOver, setDragOver]     = useState(false);

    if (!user) {
        return (
            <div className="p-8 lg:p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5">
                    <Lock size={28} className="text-purple-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Login Required</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-xs">You need to be logged in to apply for an internship at TechiGuru.</p>
                <button onClick={() => navigate('/login')}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-purple-200">
                    Sign In to Apply
                </button>
            </div>
        );
    }

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFile = (file) => {
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) { setErrorMsg('File must be under 10 MB'); return; }
        const allowed = /pdf|doc|docx/i;
        if (!allowed.test(file.name.split('.').pop())) {
            setErrorMsg('Only PDF, DOC, DOCX files allowed'); return;
        }
        setResume(file);
        setResumePreview(file.name);
        setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resume) { setErrorMsg('Please upload your resume'); return; }
        setStatus('loading'); setErrorMsg('');

        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        fd.append('resume', resume);

        try {
            await api.post('/internship/apply', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.response?.data?.message || 'Submission failed. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className="p-8 lg:p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                    <div className="w-20 h-20 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center mx-auto mb-5">
                        <CheckCircle size={36} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Application Submitted! 🎉</h3>
                    <p className="text-slate-500 text-sm mb-2 max-w-xs mx-auto">Your internship application has been received. We'll review it and get back to you within <strong>3–5 business days</strong>.</p>
                    <p className="text-xs text-slate-400">A confirmation email has been sent to <strong>{form.email}</strong></p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="p-8 lg:p-12">
            <h2 className="text-2xl font-black text-slate-900 mb-1">Apply for Internship</h2>
            <p className="text-slate-400 text-sm mb-8">Fill in the details below. Our HR team will review your application within 3–5 business days.</p>

            {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />{errorMsg}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Personal Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
                        <input name="fullName" value={form.fullName} onChange={handleChange} required
                            placeholder="Your full name" className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email *</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required
                            placeholder="you@example.com" className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone *</label>
                        <input name="phone" value={form.phone} onChange={handleChange} required
                            placeholder="+91 9876543210" className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">College / University *</label>
                        <input name="college" value={form.college} onChange={handleChange} required
                            placeholder="Institute name" className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Branch / Course *</label>
                        <input name="branch" value={form.branch} onChange={handleChange} required
                            placeholder="e.g. B.Tech CSE" className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Year of Study *</label>
                        <select name="year" value={form.year} onChange={handleChange} required className={inputClass}>
                            <option value="">Select year</option>
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Applying for Role *</label>
                    <select name="role" value={form.role} onChange={handleChange} required className={inputClass}>
                        <option value="">Select internship role</option>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                {/* Skills & Experience */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Skills</label>
                    <input name="skills" value={form.skills} onChange={handleChange}
                        placeholder="e.g. React, Node.js, Python, SQL..." className={inputClass} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brief Background / Experience</label>
                    <textarea rows={3} name="experience" value={form.experience} onChange={handleChange}
                        placeholder="Projects, internships, certifications, or any relevant experience..."
                        className={`${inputClass} resize-none`} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Why TechiGuru?</label>
                    <textarea rows={3} name="whyUs" value={form.whyUs} onChange={handleChange}
                        placeholder="Tell us why you want to intern with us..."
                        className={`${inputClass} resize-none`} />
                </div>

                {/* Resume Upload */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resume / CV *</label>
                    <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                        onClick={() => document.getElementById('resume-input').click()}
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 
                            ${dragOver ? 'border-purple-500 bg-purple-50' : resumePreview ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-purple-400 hover:bg-purple-50/40'}`}
                    >
                        <input id="resume-input" type="file" className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={e => handleFile(e.target.files[0])} />

                        {resumePreview ? (
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <FileText size={18} className="text-green-600" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-slate-800 text-sm truncate max-w-[200px]">{resumePreview}</p>
                                    <p className="text-xs text-green-600">Ready to upload ✓</p>
                                </div>
                                <button type="button" onClick={e => { e.stopPropagation(); setResume(null); setResumePreview(''); }}
                                    className="ml-auto w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100">
                                    <X size={13} className="text-gray-500" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-1">
                                    <Upload size={20} className="text-purple-600" />
                                </div>
                                <p className="font-semibold text-slate-700 text-sm">Drop your resume here or click to browse</p>
                                <p className="text-xs text-slate-400">PDF, DOC, DOCX · Max 10 MB</p>
                            </div>
                        )}
                    </div>
                </div>

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    type="submit" disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm">
                    {status === 'loading'
                        ? <><Loader2 size={17} className="animate-spin" /> Submitting Application...</>
                        : <><Send size={16} /> Submit Application <ArrowRight size={15} /></>}
                </motion.button>
            </form>
        </div>
    );
};

// ── Main Contact Page ──────────────────────────────────────────────────────────
const Contact = () => {
    const [activeTab, setActiveTab] = useState('contact');

    return (
        <section className="min-h-screen bg-[#f8f7ff] py-24 pt-0 font-sans">

            {/* Hero Banner */}
            <div className="bg-gradient-to-br from-[#1e1148] via-[#2d1b6e] to-[#4c1d95] text-white py-20 px-6 mb-[-60px]">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-purple-200 mb-5">
                        <MessageSquare size={13} /> Connect With Us
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        {activeTab === 'contact' ? (
                            <>We'd Love to Hear{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">From You</span></>
                        ) : (
                            <>Start Your Internship{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">Journey</span></>
                        )}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="text-purple-200 text-lg max-w-xl mx-auto">
                        {activeTab === 'contact'
                            ? 'Questions, suggestions, or partnership ideas — our team responds within 24 hours.'
                            : 'Apply for an internship at TechiGuru and kickstart your tech career with real-world experience.'}
                    </motion.p>
                </div>
            </div>

            {/* Main Card */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">

                    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">

                        {/* Left Info Panel */}
                        <div className="bg-gradient-to-b from-[#2d1b6e] to-[#4c1d95] p-8 lg:p-10 flex flex-col justify-between">
                            <div>
                                {/* Tab Switcher */}
                                <div className="flex gap-2 mb-8 p-1 bg-white/10 rounded-xl">
                                    <button onClick={() => setActiveTab('contact')}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all
                                            ${activeTab === 'contact' ? 'bg-white text-purple-700 shadow-sm' : 'text-purple-200 hover:text-white'}`}>
                                        <MessageSquare size={13} /> Query
                                    </button>
                                    <button onClick={() => setActiveTab('internship')}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all
                                            ${activeTab === 'internship' ? 'bg-white text-purple-700 shadow-sm' : 'text-purple-200 hover:text-white'}`}>
                                        <Briefcase size={13} /> Internship
                                    </button>
                                </div>

                                <h2 className="text-2xl font-black text-white mb-1">Contact Information</h2>
                                <p className="text-purple-200 text-sm mb-8">
                                    {activeTab === 'contact'
                                        ? 'Fill in the form and we\'ll get back to you shortly.'
                                        : 'Apply now and our HR team will review within 3–5 days.'}
                                </p>

                                <div className="space-y-3">
                                    <a href="tel:+919368465315" className="flex items-start gap-3.5 group">
                                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                                            <Phone size={16} className="text-purple-200" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Phone</p>
                                            <p className="text-white text-sm font-semibold">+91 9368465315</p>
                                        </div>
                                    </a>
                                    <a href="mailto:techiguru.in@gmail.com" className="flex items-start gap-3.5 group">
                                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                                            <Mail size={16} className="text-purple-200" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Email</p>
                                            <p className="text-white text-sm font-semibold">techiguru.in@gmail.com</p>
                                        </div>
                                    </a>
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                            <MapPin size={16} className="text-purple-200" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Location</p>
                                            <p className="text-white text-sm font-semibold">Ghaziabad, 201009<br />Uttar Pradesh, India</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                            <Clock size={16} className="text-purple-200" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Business Hours</p>
                                            <p className="text-white text-sm font-semibold">Mon – Sat · 10 AM – 6 PM IST</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Internship perks */}
                                {activeTab === 'internship' && (
                                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-3">
                                        <p className="text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-3">Why Intern With Us?</p>
                                        {[
                                            { icon: GraduationCap, text: 'Industry-recognized certificate' },
                                            { icon: Briefcase,     text: 'Real-world project experience' },
                                            { icon: User,          text: 'Dedicated HR mentor assigned' },
                                            { icon: CheckCircle,   text: 'Letter of Recommendation' },
                                        ].map(({ icon: Icon, text }) => (
                                            <div key={text} className="flex items-center gap-2.5">
                                                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                                    <Icon size={12} className="text-purple-300" />
                                                </div>
                                                <span className="text-purple-100 text-xs">{text}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>

                            {/* Decorative circles */}
                            <div className="mt-12 relative">
                                <div className="w-28 h-28 rounded-full border border-white/10 absolute -bottom-8 -right-8" />
                                <div className="w-16 h-16 rounded-full border border-white/10 absolute -bottom-2 right-8" />
                            </div>
                        </div>

                        {/* Right: Dynamic Form */}
                        <AnimatePresence mode="wait">
                            {activeTab === 'contact' ? (
                                <motion.div key="contact"
                                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                                    <ContactForm />
                                </motion.div>
                            ) : (
                                <motion.div key="internship"
                                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                                    className="overflow-y-auto max-h-[800px]">
                                    <InternshipForm />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* FAQ Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(activeTab === 'contact' ? [
                        { icon: Clock, title: '24–48h Response', desc: 'We reply to all queries within 2 business days.' },
                        { icon: CheckCircle, title: 'Ticket Confirmation', desc: 'You receive an automatic email with your ticket ID.' },
                        { icon: MessageSquare, title: 'Direct Support', desc: 'Our team reads every message and responds personally.' },
                    ] : [
                        { icon: Clock, title: '3–5 Day Review', desc: 'Our HR team reviews every application carefully.' },
                        { icon: GraduationCap, title: 'Certificate Included', desc: 'Get an industry-recognized completion certificate.' },
                        { icon: Briefcase, title: 'Real Projects', desc: 'Work on live projects with dedicated mentorship.' },
                    ]).map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                                <Icon size={18} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{title}</p>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;