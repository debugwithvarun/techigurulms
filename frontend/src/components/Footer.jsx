import React from 'react';
import { 
  MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, 
  Send, ArrowRight, Globe 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-slate-300 relative overflow-hidden font-sans">
      
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600"></div>

      {/* Decorative Background Glow */}
      <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-900/50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                   <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">TechiGuru</span>
            </div>
            
            <p className="text-slate-400 leading-relaxed text-sm pr-4">
              Empowering learners worldwide with cutting-edge technical skills. Join our community and shape your future today.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 text-sm group cursor-pointer">
                <MapPin size={18} className="text-purple-500 mt-0.5 group-hover:text-white transition-colors" /> 
                <span className="group-hover:text-white transition-colors">C/54 Northwest Freeway, Suite 485, Houston, USA</span>
              </div>
              <div className="flex items-center gap-3 text-sm group cursor-pointer">
                <Phone size={18} className="text-purple-500 group-hover:text-white transition-colors" /> 
                <span className="group-hover:text-white transition-colors">+1 (525) 344-6885</span>
              </div>
              <div className="flex items-center gap-3 text-sm group cursor-pointer">
                <Mail size={18} className="text-purple-500 group-hover:text-white transition-colors" /> 
                <span className="group-hover:text-white transition-colors">support@techiguru.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Our Courses', 'Instructors', 'Success Stories', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-400 hover:text-purple-400 hover:pl-2 transition-all duration-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 hover:opacity-100 transition-opacity"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Resources</h3>
            <ul className="space-y-3">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'Career Path', 'Blog & News'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-400 hover:text-purple-400 hover:pl-2 transition-all duration-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 hover:opacity-100 transition-opacity"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & App */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-sm text-slate-400 mb-4">Subscribe to get the latest updates and offers.</p>
            
            <div className="relative mb-8">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-500"
              />
              <button className="absolute right-1.5 top-1.5 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md transition-colors">
                <Send size={16} />
              </button>
            </div>

            <h4 className="text-white font-semibold text-sm mb-4">Get the Mobile App</h4>
            <div className="flex gap-3">
               <button className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-4 py-2 transition-all group w-full">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-6 w-auto opacity-80 group-hover:opacity-100" />
               </button>
               <button className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-4 py-2 transition-all group w-full">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-6 w-auto opacity-80 group-hover:opacity-100" />
               </button>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} TechiGuru. All rights reserved.
          </p>

          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
              <a 
                key={idx} 
                href="#" 
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white transition-all duration-300 hover:-translate-y-1"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;