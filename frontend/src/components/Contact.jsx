import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, CheckCircle, AlertCircle, Loader2,
  MapPin, Phone, Mail, MessageSquare, Clock, ArrowRight,
} from 'lucide-react';
import api from '../api/axios';

// ── Input styles ────────────────────────────────────────────────────────────────
const inputClass = `w-full px-4 py-3.5 rounded-xl
  bg-white/[0.03] border border-white/[0.1] text-white
  placeholder:text-slate-600 text-sm
  focus:outline-none focus:border-violet-400/50 focus:bg-white/[0.06]
  focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)]
  transition-all duration-200`;

const CONTACT_INFO = [
  { icon: Phone,  label: 'Phone',   value: '+91 9368465315',       href: 'tel:+919368465315' },
  { icon: Mail,   label: 'Email',   value: 'techiguru.in@gmail.com', href: 'mailto:techiguru.in@gmail.com' },
  { icon: MapPin, label: 'Address', value: 'Ghaziabad, 201009\nUttar Pradesh, India', href: null },
  { icon: Clock,  label: 'Hours',   value: 'Mon – Sat\n10 AM – 6 PM IST', href: null },
];

const FAQ = [
  { q: 'How quickly will you respond?', a: 'We aim to reply within 24–48 business hours. Complex queries may take slightly longer.' },
  { q: 'Can I request a demo or call?', a: 'Yes! Mention it in your message and our team will schedule one convenient for you.' },
  { q: 'Do you offer partnership opportunities?', a: 'Absolutely. Reach out with your proposal and our business team will connect with you.' },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading'); setErrorMsg('');
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
    <div className="min-h-screen font-sans" style={{ background: '#05070f' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-24 px-6">
        {/* blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/8 rounded-full blur-2xl pointer-events-none" />
        {/* grid */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-violet-400/[0.08] border border-violet-400/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-violet-400 mb-7">
            <MessageSquare size={12} /> Contact Us
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white leading-[1.06] tracking-tight mb-5"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Let's Start a{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(120deg,#a78bfa,#f0abfc)' }}>
              Conversation
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="text-slate-400 text-lg max-w-xl mx-auto">
            Questions, feedback, or partnership ideas — our team responds within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* ── Main Grid ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">

          {/* Left: Contact Info */}
          <div className="space-y-5">
            {/* Info card */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/[0.08] p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#0d0f1e 0%,#111328 100%)' }}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
              <h2 className="text-lg font-black text-white mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>Reach Us Directly</h2>
              <div className="space-y-5">
                {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 group">
                    <div className="w-9 h-9 rounded-xl bg-violet-400/[0.08] border border-violet-400/15 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-violet-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-slate-300 text-sm font-medium hover:text-violet-300 transition-colors" style={{ whiteSpace: 'pre-line' }}>{value}</a>
                      ) : (
                        <p className="text-slate-300 text-sm font-medium" style={{ whiteSpace: 'pre-line' }}>{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl border border-white/[0.08] overflow-hidden"
              style={{ background: '#0d0f1e' }}>
              <div className="px-6 py-4 border-b border-white/[0.05]">
                <h3 className="text-sm font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Quick FAQs</h3>
              </div>
              {FAQ.map((f, i) => (
                <div key={i} className="border-b border-white/[0.04] last:border-0">
                  <button className="w-full px-6 py-4 text-left flex items-center justify-between gap-3"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="text-slate-300 text-sm font-semibold">{f.q}</span>
                    <span className={`text-violet-400 text-lg transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <p className="px-6 pb-4 text-slate-500 text-sm leading-relaxed">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl border border-white/[0.08] p-8 lg:p-10 relative overflow-hidden"
            style={{ background: '#0d0f1e' }}>
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Send a Message</h2>
            <p className="text-slate-500 text-sm mb-8">We'll create a support ticket and confirm via email.</p>

            {/* Success */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-start gap-3 bg-green-500/[0.08] border border-green-500/20 text-green-400 rounded-xl px-5 py-4 mb-6">
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Message sent! 🎉</p>
                    <p className="text-xs mt-0.5 text-green-500/80">Ticket confirmation sent to your inbox. We'll reply in 24–48h.</p>
                  </div>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-start gap-3 bg-red-500/[0.08] border border-red-500/20 text-red-400 rounded-xl px-5 py-4 mb-6">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p className="text-sm">{errorMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className={inputClass} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subject *</label>
                <input name="subject" value={form.subject} onChange={handleChange} required placeholder="What's your query about?" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Message *</label>
                <textarea rows={5} name="message" value={form.message} onChange={handleChange} required
                  placeholder="Describe your query in detail..." className={`${inputClass} resize-none`} />
              </div>

              <button type="submit" disabled={status === 'loading'}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm transition-all
                  bg-gradient-to-r from-violet-600 to-purple-600 text-white
                  hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_32px_rgba(139,92,246,0.3)]
                  disabled:opacity-40 disabled:cursor-not-allowed">
                {status === 'loading'
                  ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                  : <><Send size={15} /> Send Message <ArrowRight size={14} /></>}
              </button>
            </form>

            {/* Response time badges */}
            <div className="mt-8 pt-6 border-t border-white/[0.05] flex flex-wrap gap-4">
              {[['⚡', '24–48h reply'],['🎫','Ticket ID emailed'],['👥','Personal response']].map(([e, t]) => (
                <div key={t} className="flex items-center gap-2 text-slate-600 text-xs">
                  <span>{e}</span><span>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;