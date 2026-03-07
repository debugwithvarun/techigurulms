import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, ChevronUp, Mail, Phone, Globe, AlertCircle, Info } from 'lucide-react';

const sections = [
  {
    id: 'disclaimer',
    title: 'DISCLAIMER',
    content: `The information provided on Techiguru is for general informational and educational purposes only. All content is published in good faith to provide information about our online learning programs, interview preparation, skill development courses, and job placement assistance.

While we strive to keep the information accurate and up to date, Techiguru makes no warranties or guarantees, express or implied, regarding the completeness, accuracy, reliability, or availability of the website or its content.

Any action you take upon the information on this website is strictly at your own risk. Techiguru shall not be held liable for any loss or damage, direct or indirect, arising from the use of this website.

Designs, images, content, course curriculum, fees, job assistance programs, interview preparation modules, and certifications shown on the website are indicative and subject to change without prior notice.`,
  },
  {
    id: 'job-placement',
    title: 'JOB PLACEMENT DISCLAIMER',
    content: `Techiguru provides job assistance and interview preparation support, including resume building, mock interviews, career guidance, and placement opportunities.

However:
• Techiguru does not guarantee 100% job placement
• Job opportunities depend on individual skills, performance, experience, market demand, and employer requirements
• Final hiring decisions rest solely with the recruiting companies`,
  },
  {
    id: 'info-collected',
    title: '1. Information We Collect',
    content: `We may collect the following information:
• Name
• Email address
• Phone / WhatsApp number
• Location
• Educational background
• Resume / CV
• Payment details (for paid courses)
• Any other information voluntarily provided through forms or inquiries

The purpose of collecting personal information will be clearly stated at the time of collection.`,
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    content: `We use your information to:
• Provide and manage online courses
• Deliver interview preparation and career guidance
• Offer job assistance and placement support
• Respond to inquiries and support requests
• Improve our website and services
• Send updates, notifications, marketing, and promotional communication`,
  },
  {
    id: 'data-security',
    title: '3. Data Security',
    content: `Techiguru follows appropriate technical and organizational measures to protect personal data.

We do not sell, trade, or rent user data to third parties. Information may be shared only:
• With hiring partners (with user consent)
• With payment gateways for transactions
• When legally required by authorities`,
  },
  {
    id: 'log-files',
    title: '4. Log Files',
    content: `Techiguru uses log files that collect information such as IP address, browser type, ISP, date/time stamp, and referring pages. This data is used for analytics and service improvement only.`,
  },
  {
    id: 'cookies',
    title: '5. Cookies',
    content: `We may use cookies to improve user experience. You can disable cookies through your browser settings if you prefer.`,
  },
  {
    id: 'external-links',
    title: '6. External Links Disclaimer',
    content: `Techiguru may contain links to third-party websites. We do not control or take responsibility for the content, accuracy, or policies of external websites.

Any interaction or transaction with third-party websites is solely between you and that third party.`,
  },
  {
    id: 'professional',
    title: '7. Professional Disclaimer',
    content: `All content related to careers, interviews, and jobs is provided for educational purposes only. Techiguru does not provide legal, financial, or employment guarantees.

Users should seek professional advice before making career or financial decisions.`,
  },
  {
    id: 'testimonials',
    title: '8. Testimonials Disclaimer',
    content: `Testimonials on the website represent individual experiences. Results may vary and are not guaranteed for every user.`,
  },
  {
    id: 'communications',
    title: '9. Email, SMS, Call & WhatsApp Policy',
    content: `By submitting your contact details on Techiguru, you consent to receive communication via email, phone calls, SMS, or WhatsApp related to courses, offers, updates, and placement assistance — even if your number is registered under DND.`,
  },
  {
    id: 'children',
    title: "10. Children's Information",
    content: `Techiguru does not knowingly collect personal data from children under the age of 13. If such data is found, it will be promptly removed.`,
  },
  {
    id: 'consent',
    title: '11. Consent',
    content: `By using our website, you consent to this Privacy Policy and agree to its terms.`,
  },
  {
    id: 'policy-updates',
    title: '12. Policy Updates',
    content: `Techiguru reserves the right to update this policy at any time. Changes will be reflected on this page with an updated effective date.`,
  },
  {
    id: 'contact-info',
    title: '13. Contact Information',
    content: `For any questions regarding this Privacy Policy or Disclaimer:
• Website: https://techiguru.in
• Email: info@techhubtechnology.com
• Phone: +91 9368465315`,
  },
];

const AccordionItem = ({ item, isOpen, onToggle }) => (
  <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-purple-500/50 shadow-lg shadow-purple-900/10' : 'border-slate-700/50'}`}>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
    >
      <span className={`font-semibold text-sm md:text-base transition-colors ${isOpen ? 'text-purple-300' : 'text-slate-200'}`}>
        {item.title}
      </span>
      {isOpen ? (
        <ChevronUp size={18} className="text-purple-400 shrink-0 ml-3" />
      ) : (
        <ChevronDown size={18} className="text-slate-500 shrink-0 ml-3" />
      )}
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

const PrivacyPolicy = () => {
  const [openId, setOpenId] = useState('disclaimer');

  const toggle = (id) => setOpenId(prev => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-[#0A0A14]">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-indigo-900/20 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest mb-6">
              <Shield size={13} /> Legal
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-6">
              Privacy Policy &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                Disclaimer
              </span>
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Info size={14} className="text-purple-500" /> Effective: 03/01/2026</span>
              <span className="flex items-center gap-1.5"><Globe size={14} className="text-purple-500" /> Website: techiguru.in</span>
              <span className="flex items-center gap-1.5"><AlertCircle size={14} className="text-purple-500" /> Company: Techiguru</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-6 text-slate-300 text-sm leading-relaxed"
        >
          <p className="font-semibold text-purple-300 mb-2">Privacy Policy — Overview</p>
          At Techiguru, protecting the privacy of our users is our top priority. This Privacy Policy outlines the types of information collected and recorded by Techiguru and how we use it. This policy applies only to online activities conducted through our website and is valid for visitors regarding information shared on <a href="https://techiguru.in" className="text-purple-400 hover:underline">techiguru.in</a>. It does not apply to offline or third-party data collection.
        </motion.div>
      </section>

      {/* Accordion Sections */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="space-y-3 mt-6"
        >
          {sections.map((item) => (
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
          className="mt-12 bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/20 rounded-2xl p-8"
        >
          <h2 className="text-white font-bold text-lg mb-5">Contact Us About Privacy</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Globe, label: 'Website', value: 'https://techiguru.in', href: 'https://techiguru.in' },
              { icon: Mail,  label: 'Email',   value: 'info@techhubtechnology.com', href: 'mailto:info@techhubtechnology.com' },
              { icon: Phone, label: 'Phone',   value: '+91 9368465315', href: 'tel:+919368465315' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-white/10 transition-colors group"
              >
                <div className="w-9 h-9 bg-purple-600/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-purple-600/40 transition-colors">
                  <Icon size={16} className="text-purple-400" />
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

export default PrivacyPolicy;
