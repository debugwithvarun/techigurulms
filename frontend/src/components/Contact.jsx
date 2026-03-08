import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, CheckCircle, AlertCircle, Loader2,
    MapPin, Phone, Mail, MessageSquare, Clock, ArrowRight
} from 'lucide-react';
import api from '../api/axios';

const inputClass = `w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-slate-800
  placeholder:text-gray-400 text-sm
  focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100
  transition-all duration-200`;

const ContactInfo = ({ icon: Icon, title, value, href }) => (
    <motion.a
        href={href || '#'}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        whileHover={{ x: 4 }}
        className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all group"
    >
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
            <Icon size={18} className="text-purple-600" />
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{title}</p>
            <p className="text-sm font-semibold text-slate-700 leading-snug">{value}</p>
        </div>
    </motion.a>
);

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = e =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

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
        <section className="min-h-screen bg-[#f8f7ff] py-24 font-sans">

            {/* ── Hero Banner ── */}
            <div className="bg-gradient-to-br from-[#1e1148] via-[#2d1b6e] to-[#4c1d95] text-white py-20 px-6 mb-[-60px]">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-purple-200 mb-5"
                    >
                        <MessageSquare size={13} /> Get In Touch
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black tracking-tight mb-4"
                    >
                        We'd Love to Hear{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">From You</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="text-purple-200 text-lg max-w-xl mx-auto"
                    >
                        Questions, suggestions, or partnership ideas — our team responds within 24 hours.
                    </motion.p>
                </div>
            </div>

            {/* ── Main Card ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">

                        {/* Left: Contact Info Panel */}
                        <div className="bg-gradient-to-b from-[#2d1b6e] to-[#4c1d95] p-8 lg:p-10 flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-white mb-1">Contact Information</h2>
                                <p className="text-purple-200 text-sm mb-8">Fill in the form and we'll get back to you shortly.</p>

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
                                    <a href="mailto:info@generativeaix.com" className="flex items-start gap-3.5 group">
                                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                                            <Mail size={16} className="text-purple-200" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Email</p>
                                            <p className="text-white text-sm font-semibold">info@generativeaix.com</p>
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
                            </div>

                            {/* Decorative circles */}
                            <div className="mt-12 relative">
                                <div className="w-28 h-28 rounded-full border border-white/10 absolute -bottom-8 -right-8" />
                                <div className="w-16 h-16 rounded-full border border-white/10 absolute -bottom-2 right-8" />
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="p-8 lg:p-12">
                            <h2 className="text-2xl font-black text-slate-900 mb-1">Send us a Message</h2>
                            <p className="text-slate-400 text-sm mb-8">We'll create a support ticket and send a confirmation to your inbox.</p>

                            {/* Alerts */}
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

                                <motion.button
                                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                                    type="submit" disabled={status === 'loading'}
                                    className="flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                                >
                                    {status === 'loading'
                                        ? <><Loader2 size={17} className="animate-spin" /> Sending your message...</>
                                        : <><Send size={16} /> Send Message <ArrowRight size={15} /></>}
                                </motion.button>
                            </form>
                        </div>
                    </div>
                </motion.div>

                {/* ── FAQ Row ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                    {[
                        { icon: Clock, title: '24–48h Response', desc: 'We reply to all queries within 2 business days.' },
                        { icon: CheckCircle, title: 'Ticket Confirmation', desc: 'You receive an automatic email with your ticket ID.' },
                        { icon: MessageSquare, title: 'Direct Support', desc: 'Our team reads every message and responds personally.' },
                    ].map(({ icon: Icon, title, desc }) => (
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