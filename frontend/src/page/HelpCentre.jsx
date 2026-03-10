import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, BookOpen, CreditCard, Monitor, Briefcase, Award,
  Video, User, Shield, Phone, Mail, Globe, ChevronDown, ChevronUp,
  Clock, MessageSquare
} from 'lucide-react';

const helpSections = [
  {
    id: 'enrollment',
    icon: BookOpen,
    color: 'bg-purple-600/20 text-purple-400',
    title: '1. Course Enrollment & Access',
    faqs: [
      {
        q: 'How do I enroll in a course?',
        a: `1. Visit the course page on our website.\n2. Click on "Enroll Now".\n3. Complete the registration form.\n4. Make the payment (if applicable).\n5. You will receive login credentials via email/WhatsApp.`,
      },
      {
        q: 'When will I get course access?',
        a: 'Access is usually provided within 24 hours after successful payment confirmation.',
      },
      {
        q: 'I did not receive login details. What should I do?',
        a: 'Check your spam folder first. If not found, contact our support team with your registered email and payment proof.',
      },
    ],
  },
  {
    id: 'payments',
    icon: CreditCard,
    color: 'bg-emerald-600/20 text-emerald-400',
    title: '2. Payments & Billing',
    faqs: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept UPI, Debit/Credit Cards, Net Banking, and other secure payment gateways available on the website.',
      },
      {
        q: 'Is EMI available?',
        a: 'EMI options may be available for selected courses. Please contact support for details.',
      },
      {
        q: 'Can I get a refund?',
        a: 'Refund eligibility depends on our Refund Policy. Please refer to the Refund & Cancellation Policy page for details.',
      },
    ],
  },
  {
    id: 'technical',
    icon: Monitor,
    color: 'bg-blue-600/20 text-blue-400',
    title: '3. Technical Support',
    faqs: [
      {
        q: 'I am unable to access my course.',
        a: `Try the following:\n• Clear browser cache\n• Use updated Chrome browser\n• Check internet connection\n• Login again\n\nIf the issue persists, contact support with screenshots.`,
      },
      {
        q: 'Videos are not playing properly.',
        a: `• Ensure stable internet (minimum 5 Mbps recommended)\n• Try a different browser\n• Disable browser extensions`,
      },
    ],
  },
  {
    id: 'placement',
    icon: Briefcase,
    color: 'bg-orange-600/20 text-orange-400',
    title: '4. Interview Preparation & Job Assistance',
    faqs: [
      {
        q: 'Does Techiguru guarantee job placement?',
        a: 'We provide job assistance, resume support, and interview preparation. However, job placement depends on individual performance and recruiter decisions.',
      },
      {
        q: 'What kind of job support is provided?',
        a: `• Resume building\n• LinkedIn profile optimization\n• Mock interviews\n• Technical interview preparation\n• HR interview guidance\n• Job referrals (based on eligibility)`,
      },
      {
        q: 'When does placement support start?',
        a: 'Placement support usually begins after successful course completion or as defined in your program.',
      },
    ],
  },
  {
    id: 'certificates',
    icon: Award,
    color: 'bg-amber-600/20 text-amber-400',
    title: '5. Certificates',
    faqs: [
      {
        q: 'Will I receive a certificate?',
        a: `Yes, certificates are issued after:\n• Course completion\n• Submission of required assignments (if applicable)\n\nCertificates are sent digitally via email.`,
      },
    ],
  },
  {
    id: 'live-classes',
    icon: Video,
    color: 'bg-pink-600/20 text-pink-400',
    title: '6. Live Classes & Recordings',
    faqs: [
      {
        q: 'What if I miss a live class?',
        a: 'Recorded sessions will be provided (if included in your course plan).',
      },
      {
        q: 'How can I ask doubts?',
        a: `You can:\n• Ask during live sessions\n• Post queries in the student support group\n• Email support team`,
      },
    ],
  },
  {
    id: 'account',
    icon: User,
    color: 'bg-indigo-600/20 text-indigo-400',
    title: '7. Account Management',
    faqs: [
      {
        q: 'How can I update my profile?',
        a: 'Login to your account and update your profile details in the dashboard.',
      },
      {
        q: 'I forgot my password.',
        a: 'Click on "Forgot Password" on the login page and follow the instructions.',
      },
    ],
  },
  {
    id: 'conduct',
    icon: Shield,
    color: 'bg-red-600/20 text-red-400',
    title: '8. Code of Conduct',
    faqs: [
      {
        q: 'What behaviour is expected from students?',
        a: `We expect all students to:\n• Maintain respectful communication\n• Avoid sharing course content externally\n• Not misuse platform access\n• Follow ethical behavior during classes and interviews\n\nViolation may result in suspension of access.`,
      },
    ],
  },
];

const FaqItem = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-lg overflow-hidden transition-all ${open ? 'border-purple-500/40' : 'border-slate-700/40'}`}>
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-start justify-between px-5 py-3.5 text-left hover:bg-white/[0.02] transition-colors gap-3">
        <span className={`text-sm font-medium transition-colors ${open ? 'text-purple-300' : 'text-slate-200'}`}>{faq.q}</span>
        {open ? <ChevronUp size={16} className="text-purple-400 shrink-0 mt-0.5" /> : <ChevronDown size={16} className="text-slate-500 shrink-0 mt-0.5" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="px-5 pb-4 pt-3 text-sm text-slate-400 leading-relaxed whitespace-pre-line border-t border-slate-700/40">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HelpCentre = () => {
  const [activeSection, setActiveSection] = useState('enrollment');

  return (
    <div className="min-h-screen bg-[#0A0A14]">
      {/* Hero */}
      <section className="relative py-20 lg:py-24 overflow-hidden text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-900/20 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest mb-6">
              <HelpCircle size={13} /> Support
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-4">
              Help{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                Centre
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Welcome! 👋 We're here to support you throughout your learning journey — from enrollment to job assistance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Nav */}
          <div className="lg:w-60 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-1">
              {helpSections.map(({ id, icon: Icon, title, color }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                    activeSection === id
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                    <Icon size={14} />
                  </div>
                  <span className="leading-tight text-xs">{title.replace(/^\d+\.\s/, '')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="flex-1 min-w-0">
            {helpSections.map(({ id, icon: Icon, title, faqs, color }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`mb-10 p-2 scroll-mt-24 ${activeSection === id ? 'ring-1 ring-purple-500/80 rounded-2xl' : ''}`}
                id={id}
              >
                <div className="flex items-center gap-3 mb-4 px-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={18} />
                  </div>
                  <h2 className="text-white font-bold text-lg">{title}</h2>
                </div>
                <div className="space-y-2.5">
                  {faqs.map((faq, i) => <FaqItem key={i} faq={faq} />)}
                </div>
              </motion.div>
            ))}

            {/* Contact Support Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mt-4 bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/20 rounded-2xl p-8"
            >
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center shrink-0">
                  <MessageSquare size={18} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">9. Contact Support</h2>
                  <p className="text-slate-400 text-sm mt-1">If your question is not answered above, reach us directly:</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {[
                  { icon: Mail,  label: 'Email',   value: 'info@techhubtechnology.com', href: 'mailto:info@techhubtechnology.com' },
                  { icon: Phone, label: 'Phone',   value: '+91 9368465315', href: 'tel:+919368465315' },
                  { icon: Globe, label: 'Website', value: 'https://techiguru.in', href: 'https://techiguru.in' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-3 p-4 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-white/10 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-purple-600/40 transition-colors">
                      <Icon size={15} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">{label}</p>
                      <p className="text-slate-200 text-sm font-medium break-all">{value}</p>
                    </div>
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400 border-t border-white/10 pt-4">
                <Clock size={14} className="text-purple-400 shrink-0" />
                <span>Support Hours: <span className="text-slate-200 font-medium">Monday – Saturday | 10:00 AM – 6:00 PM (IST)</span></span>
              </div>
            </motion.div>

            {/* Raise a Ticket */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mt-6 border border-slate-700/60 rounded-2xl p-8"
            >
              <h2 className="text-white font-bold text-lg mb-3">10. Raise a Support Ticket</h2>
              <p className="text-slate-400 text-sm mb-4">To get faster assistance, please include:</p>
              <ul className="space-y-1.5 text-sm text-slate-400">
                {[
                  'Full Name',
                  'Registered Email',
                  'Course Name',
                  'Payment Reference (if billing issue)',
                  'Screenshot (if technical issue)',
                  'Clear description of your problem',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-slate-500 text-sm mt-4 italic">Our team usually responds within 24–48 working hours.</p>
              <a
                href="mailto:info@techhubtechnology.com"
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors"
              >
                <Mail size={15} /> Send a Ticket
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCentre;
