import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown, ChevronUp, Mail, Phone, Globe } from 'lucide-react';

const terms = [
  {
    id: 'intro',
    title: '1. Introduction',
    content: `Welcome to Techiguru. These Terms & Conditions govern your use of our website and services, including online courses, interview preparation programs, and job assistance services.

By accessing or using our website and services, you agree to comply with and be bound by these Terms & Conditions. If you do not agree, please do not use our website.`,
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    content: `By using this website, you confirm that:
• You are at least 18 years old, or
• You are using the website under the supervision of a parent/guardian
• All information provided by you is accurate and complete`,
  },
  {
    id: 'services',
    title: '3. Services Offered',
    content: `Techiguru provides:
• Online training programs
• Skill development courses
• Interview preparation support
• Resume building guidance
• Career mentorship
• Job assistance services

We reserve the right to modify, update, or discontinue any service at any time without prior notice.`,
  },
  {
    id: 'account',
    title: '4. User Account & Registration',
    content: `To access certain services, you may need to register and create an account.

You agree to:
• Provide accurate and current information
• Maintain confidentiality of your login credentials
• Accept responsibility for all activities under your account

Techiguru reserves the right to suspend or terminate accounts that provide false information or misuse the platform.`,
  },
  {
    id: 'payments',
    title: '5. Payments & Fees',
    content: `Course fees must be paid as per the selected program.
• All payments are non-transferable.
• Techiguru reserves the right to revise pricing at any time.
• Access to paid courses will be granted only after successful payment confirmation.
(Refund policies, if applicable, should be governed separately under the Refund Policy page.)`,
  },
  {
    id: 'placement',
    title: '6. Job Assistance & Placement Policy',
    content: `Techiguru provides job assistance and interview preparation services.

However:
• We do not guarantee 100% job placement
• Placement opportunities depend on individual performance, skills, market demand, and recruiter decisions
• Final hiring decisions are made solely by hiring companies`,
  },
  {
    id: 'ip',
    title: '7. Intellectual Property Rights',
    content: `All content on the website including:
• Course materials
• Videos
• PDFs
• Logos
• Designs
• Graphics
• Text

is the intellectual property of Techiguru and is protected by copyright laws.

Users may not copy, reproduce, distribute, resell, or record and share course content without written permission.`,
  },
  {
    id: 'conduct',
    title: '8. User Conduct',
    content: `By using our platform, you agree not to:
• Share course access with unauthorized users
• Post harmful, abusive, or unlawful content
• Attempt to hack, disrupt, or damage the website
• Violate any applicable laws

Violation may result in immediate termination without refund.`,
  },
  {
    id: 'liability',
    title: '9. Limitation of Liability',
    content: `Techiguru shall not be liable for:
• Any direct or indirect losses
• Career or employment outcomes
• Technical issues beyond our control
• Third-party actions or decisions

All services are provided on an "as-is" basis without warranties of any kind.`,
  },
  {
    id: 'third-party',
    title: '10. Third-Party Links',
    content: `Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party sites.`,
  },
  {
    id: 'termination',
    title: '11. Termination',
    content: `Techiguru reserves the right to suspend or terminate access to the website or services if:
• Terms are violated
• Fraudulent activities are detected
• Misuse of platform occurs`,
  },
  {
    id: 'changes',
    title: '12. Changes to Terms',
    content: `We may update these Terms & Conditions at any time. Updated terms will be posted on this page with a revised effective date.

Continued use of the website constitutes acceptance of the updated terms.`,
  },
  {
    id: 'law',
    title: '13. Governing Law',
    content: `These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India.

Any disputes shall be subject to the jurisdiction of the appropriate courts in India.`,
  },
  {
    id: 'contact',
    title: '14. Contact Information',
    content: `If you have any questions regarding these Terms & Conditions, please contact:
• Company Name: Techiguru
• Website: https://techiguru.in
• Email: info@techhubtechnology.com
• Phone: +91 9368465315`,
  },
];

const AccordionItem = ({ item, isOpen, onToggle }) => (
  <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-indigo-500/50 shadow-lg shadow-indigo-900/10' : 'border-slate-700/50'}`}>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
    >
      <span className={`font-semibold text-sm md:text-base transition-colors ${isOpen ? 'text-indigo-300' : 'text-slate-200'}`}>
        {item.title}
      </span>
      {isOpen
        ? <ChevronUp size={18} className="text-indigo-400 shrink-0 ml-3" />
        : <ChevronDown size={18} className="text-slate-500 shrink-0 ml-3" />}
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed whitespace-pre-line border-t border-slate-700/50 pt-4">
            {item.content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const TermsConditions = () => {
  const [openId, setOpenId] = useState('intro');
  const toggle = (id) => setOpenId(prev => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-[#0A0A14]">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-purple-900/15 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6">
              <FileText size={13} /> Legal
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-6">
              Terms &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Conditions
              </span>
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              <span>Effective Date: 03/01/2026</span>
              <span>·</span>
              <span>Website: techiguru.in</span>
              <span>·</span>
              <span>Company: Techiguru</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          {terms.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </motion.div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-12 bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-8"
        >
          <h2 className="text-white font-bold text-lg mb-5">Questions About Our Terms?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Globe, label: 'Website', value: 'https://techiguru.in', href: 'https://techiguru.in' },
              { icon: Mail,  label: 'Email',   value: 'info@techhubtechnology.com', href: 'mailto:info@techhubtechnology.com' },
              { icon: Phone, label: 'Phone',   value: '+91 9368465315', href: 'tel:+919368465315' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-white/10 transition-colors group"
              >
                <div className="w-9 h-9 bg-indigo-600/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-indigo-600/40 transition-colors">
                  <Icon size={16} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs">{label}</p>
                  <p className="text-slate-200 text-sm font-medium break-all">{value}</p>
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default TermsConditions;
