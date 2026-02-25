/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Search, ShoppingCart, ChevronDown, ChevronRight, 
  LogIn, Menu, X, Globe, BookOpen, Smartphone, PlayCircle, PauseCircle,
  LayoutDashboard, LogOut, User, Award, GraduationCap, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext'; 

const Navbar = () => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); 
  
  // New states for Auth dropdowns
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [signupDropdownOpen, setSignupDropdownOpen] = useState(false);

  const hideNavbarPaths = ['/login', '/signup'];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
      logout();
      setProfileOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/login');
  };

  if (hideNavbarPaths.includes(location.pathname)) return null;

  // --- NAVIGATION DATA ---
  const navLinks = [
    { name: 'Home', path: '/', hasDropdown: false },
    { 
      name: 'Courses', 
      hasDropdown: true, 
      dropdownItems: [
        { title: 'Full Stack Dev', path: '/active-course', icon: <Globe size={16}/> }, 
        { title: 'AI & Machine Learning', path: '/active-course', icon: <BookOpen size={16}/> }, 
        { title: 'Mobile Development', path: '/active-course', icon: <Smartphone size={16}/> }
      ] 
    },
    { 
      name: 'Training', 
      hasDropdown: true, 
      dropdownItems: [
        { title: 'Active Courses', path: '/active-course', icon: <PlayCircle size={16}/> }, 
        { title: 'Archived Courses', path: '/inactive-course', icon: <PauseCircle size={16}/> }
      ] 
    },
    { 
      name: 'Certificates', 
      hasDropdown: true, 
      dropdownItems: [
        { title: 'Active Certificates', path: '/active-certificates', icon: <Award size={16}/> }, 
        { title: 'Archived Certificates', path: '/inactive-certificates', icon: <PauseCircle size={16}/> }
      ] 
    },
    // 🔥 Dashboard will ONLY render if the logged-in user's role is strictly 'instructor'
    ...(user?.role === 'instructor' ? [{ name: 'Dashboard', path: '/dashboard', hasDropdown: false }] : [])
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-lg border-b border-gray-200 py-3 shadow-sm' 
            : 'bg-white border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200 transition-transform group-hover:scale-105">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              TechiGuru
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative h-full flex items-center"
                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {!link.hasDropdown ? (
                  <Link
                    to={link.path}
                    className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <button className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors focus:outline-none">
                    {link.name} 
                    <ChevronDown 
                      size={14} 
                      className={`transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}

                {/* Dropdown */}
                <AnimatePresence>
                  {activeDropdown === link.name && link.dropdownItems && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full -left-4 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="p-2">
                        {link.dropdownItems.map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-colors group"
                          >
                            <span className="text-purple-400 group-hover:text-purple-600">
                              {item.icon}
                            </span>
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4">
            
            {/* Search Bar */}
            <div className="flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="hidden md:block bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-purple-200 outline-none mr-2 text-slate-700"
                    placeholder="Search courses..."
                    autoFocus
                  />
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-slate-600 hover:bg-purple-50 hover:text-purple-600 rounded-full transition-colors"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Auth State */}
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200 relative">
                
                {/* Profile Dropdown Trigger */}
                <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 hover:bg-gray-50 rounded-full pr-3 pl-1 py-1 transition-colors border border-transparent hover:border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold border border-purple-200">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 hidden md:block max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown size={14} className="text-slate-400 hidden md:block"/>
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                    {profileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1"
                        >
                            <div className="px-4 py-3 border-b border-gray-50">
                                <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            </div>
                            
                            {/* 🔥 Securing the Dashboard link in the Profile menu too */}
                            {user?.role === 'instructor' && (
                              <>
                                <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                                    <LayoutDashboard size={16}/> Instructor Dashboard
                                </Link>
                              <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                                  <User size={16}/> My Profile
                              </Link>
                              </>
                            )}
                            

                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1">
                                <LogOut size={16}/> Sign Out
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-4 pl-4 border-l border-gray-200">
                
                {/* LOGIN DROPDOWN */}
                <div 
                  className="relative"
                  onMouseEnter={() => setLoginDropdownOpen(true)}
                  onMouseLeave={() => setLoginDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors py-2">
                    Log in <ChevronDown size={14} className={`transition-transform ${loginDropdownOpen ? 'rotate-180' : ''}`}/>
                  </button>
                  <AnimatePresence>
                    {loginDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full -left-4 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2"
                      >
                        <Link to="/login?role=student" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                          <GraduationCap size={16} className="text-purple-500"/> As Student
                        </Link>
                        <Link to="/login?role=instructor" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                          <Briefcase size={16} className="text-purple-500"/> As Instructor
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* SIGNUP DROPDOWN */}
                <div 
                  className="relative"
                  onMouseEnter={() => setSignupDropdownOpen(true)}
                  onMouseLeave={() => setSignupDropdownOpen(false)}
                >
                  <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                    Sign Up <ChevronDown size={14} className={`transition-transform ${signupDropdownOpen ? 'rotate-180' : ''}`}/>
                  </button>
                  <AnimatePresence>
                    {signupDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2"
                      >
                        <Link to="/signup?role=student" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                          <GraduationCap size={16} className="text-purple-500"/> As Student
                        </Link>
                        {/* <Link to="/signup?role=instructor" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                          <Briefcase size={16} className="text-purple-500"/> As Instructor
                        </Link> */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[101] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-[102] lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <span className="text-lg font-bold text-slate-800">Menu</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-6 space-y-2">
                {navLinks.map((link) => (
                  <div key={link.name} className="border-b border-gray-50 last:border-0 pb-2">
                    {!link.hasDropdown ? (
                      <Link 
                        to={link.path} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-3 text-base font-medium text-slate-600 hover:text-purple-600"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <MobileDropdown link={link} closeMenu={() => setIsMobileMenuOpen(false)} />
                    )}
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50 mt-auto space-y-4">
                {!user ? (
                  <>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Log In</p>
                      <Link to="/login?role=student" className="flex items-center gap-3 w-full py-3 px-4 rounded-lg border border-gray-200 font-semibold text-slate-600 hover:bg-white transition-colors">
                        <GraduationCap size={18} className="text-purple-500"/> As Student
                      </Link>
                      <Link to="/login?role=instructor" className="flex items-center gap-3 w-full py-3 px-4 rounded-lg border border-gray-200 font-semibold text-slate-600 hover:bg-white transition-colors">
                        <Briefcase size={18} className="text-purple-500"/> As Instructor
                      </Link>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sign Up</p>
                      <Link to="/signup?role=student" className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 transition-colors">
                        <GraduationCap size={18}/> Student Sign Up
                      </Link>
                      {/* <Link to="/signup?role=instructor" className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-slate-900 text-white font-semibold shadow-md hover:bg-slate-800 transition-colors">
                        <Briefcase size={18}/> Instructor Sign Up
                      </Link> */}
                    </div>
                  </>
                ) : (
                   <button onClick={handleLogout} className="w-full py-3 rounded-lg border border-red-100 text-red-600 font-semibold bg-red-50 flex items-center justify-center gap-2">
                      <LogOut size={18}/> Sign Out
                   </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Helper Component for Mobile Accordion
const MobileDropdown = ({ link, closeMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between py-3 text-base font-medium text-slate-600"
      >
        {link.name}
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-purple-600' : 'text-gray-400'}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pl-4 pb-2 space-y-3">
              {link.dropdownItems.map((item, idx) => (
                <Link 
                  key={idx} 
                  to={item.path} 
                  onClick={closeMenu}
                  className="flex items-center gap-3 py-2 text-sm text-slate-500 hover:text-purple-600"
                >
                  <span className="text-purple-400">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;