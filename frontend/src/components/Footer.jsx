import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Youtube,
  Clock
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Investors', href: '/contact' },
    { label: 'Teams', href: '/about' },
    { label: 'Our Partners', href: '/contact' },
    { label: 'Our Story', href: '/about' },
    { label: 'Testimonials', href: '/about' },
  ];

  const resourceLinks = [
    { label: 'Technical Q&A', href: '/help-centre' },
    { label: 'Blogs', href: '/blog' },
    { label: 'Sitemap', href: '/' },
    { label: 'Help Center', href: '/help-centre' },
    { label: 'Terms Of Service', href: '/terms-conditions' },
    { label: 'Career Path', href: '/active-course' },
    { label: 'Privacy & Policy', href: '/privacy-policy' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/techiguruIN/', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/techiguruIN/', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-[#0F172A] text-slate-300 relative overflow-hidden font-sans">

      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600" />

      {/* Decorative Background Glow */}
      <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] bg-indigo-900/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* ── Column 1: Brand & Contact ───────────────────────── */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/50 shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">TechiGuru</span>
            </div>

            <p className="text-slate-400 leading-relaxed text-sm pr-4">
              Empowering learners across India with cutting-edge technical skills, 
              expert mentorship, and industry-recognized certifications. 
              Your career transformation starts here.
            </p>

            {/* Contact Info */}
            <div className="space-y-3.5 pt-1">
              <div className="flex items-start gap-3 text-sm group">
                <MapPin size={17} className="text-purple-500 mt-0.5 shrink-0" />
                <span className="text-slate-400 leading-snug">Ghaziabad, 201009<br />Uttar Pradesh, India</span>
              </div>
              <a href="tel:+919368465315" className="flex items-center gap-3 text-sm group hover:text-white transition-colors">
                <Phone size={17} className="text-purple-500 shrink-0 group-hover:text-purple-400 transition-colors" />
                <span>+91 9368465315</span>
              </a>
              <a href="mailto:info@techhubtechnology.com" className="flex items-center gap-3 text-sm group hover:text-white transition-colors">
                <Mail size={17} className="text-purple-500 shrink-0 group-hover:text-purple-400 transition-colors" />
                <span className="break-all">info@generativeaix.com</span>
              </a>
              {/* <div className="flex items-start gap-3 text-sm">
                <Clock size={17} className="text-purple-500 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-snug">Mon – Sat&nbsp;&nbsp;|&nbsp;&nbsp;10:00 AM – 6:00 PM (IST)</span>
              </div> */}
            </div>

            {/* Social Links */}
            <div className="flex gap-2.5 pt-1">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-purple-600 border border-slate-700 hover:border-purple-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 2: Company ──────────────────────────────── */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm text-slate-400 hover:text-purple-400 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Resources ────────────────────────────── */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2.5">
              {resourceLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm text-slate-400 hover:text-purple-400 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: About / Quick Info ───────────────────── */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 uppercase tracking-wider">Why TechiGuru?</h3>
            <ul className="space-y-3">
              {[
                { num: '15,000+', text: 'Active Students Enrolled' },
                { num: '200+',   text: 'Expert Courses Available' },
                { num: '98%',    text: 'Student Satisfaction Rate' },
                { num: '500+',   text: 'Certificates Issued' },
                { num: '100%',   text: 'Skill-Based Curriculum' },
              ].map(({ num, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="text-purple-400 font-black text-sm shrink-0 min-w-[52px]">{num}</span>
                  <span className="text-slate-400 text-sm leading-snug">{text}</span>
                </li>
              ))}
            </ul>

            {/* <div className="mt-8 p-4 rounded-xl bg-purple-600/10 border border-purple-600/20">
              <p className="text-purple-300 text-xs font-semibold mb-1">📍 Reach Us At</p>
              <a href="https://techiguru.in" target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:text-white transition-colors font-medium">
                https://techiguru.in
              </a>
            </div> */}
          </div>

        </div>

        {/* ── Divider ────────────────────────────────────────────── */}
        <div className="border-t border-slate-800/80 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-slate-500 text-sm">
              © {currentYear} <span className="text-slate-400 font-semibold">TechiGuru</span> | Techiguru Technology Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
              <Link to="/privacy-policy"   className="text-xs text-slate-500 hover:text-purple-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms-conditions" className="text-xs text-slate-500 hover:text-purple-400 transition-colors">Terms of Service</Link>
              <Link to="/help-centre"      className="text-xs text-slate-500 hover:text-purple-400 transition-colors">Help Centre</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;