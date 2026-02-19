import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, 
  ChevronDown, AlertCircle 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Integration

// 1. Define Interfaces
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  confirmPassword: string;
  role: string; // Kept for backend, but hardcoded to 'student'
  agreeToTerms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const Signup: React.FC = () => {
  const { register } = useAuth(); // Hook
  const navigate = useNavigate();

  // 2. Typed State (Role strictly defaults to 'student')
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: '',
    role: 'student', // <--- Hardcoded to student
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 3. Typed Event Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error when user types
    if (errors[name] || errors.api) {
      setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          delete newErrors.api;
          return newErrors;
      });
    }
  };

  // 4. Validation Logic
  const validate = (): boolean => {
    let newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.gender) newErrors.gender = 'Please select a gender';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 5. Submit Handler (Integrated)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      // Call Backend via Context (Will register as 'student')
      const result = await register(
          formData.fullName, 
          formData.email, 
          formData.password, 
          formData.role 
      );

      setIsSubmitting(false);

      if (result.success) {
        navigate('/'); // <--- Redirects to Home Page now
      } else {
        setErrors({ api: result.message });
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* LEFT SIDE: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>

          <Link to="/">
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">TechiGuru</span>
        </div>
          </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Start your journey to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Tech Excellence
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            "TechiGuru transformed my career. The structured learning path and expert mentorship helped me land my dream job at Google."
          </p>
          
          <div className="flex items-center gap-4">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-12 h-12 rounded-full border-2 border-purple-500" />
            <div>
              <p className="text-white font-bold">Sarah Jenkins</p>
              <p className="text-slate-500 text-sm">Full Stack Developer</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          © 2026 TechiGuru Inc.
        </div>
      </div>

      {/* RIGHT SIDE: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="text-left mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500">Enter your details below to get started as a Student.</p>
          </div>

          {/* API Error Alert */}
          {errors.api && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3"
            >
              <AlertCircle size={20} className="text-red-500 mt-0.5 shrink-0"/>
              <p className="text-sm text-red-600 font-medium">{errors.api}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none transition-all ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'}`}
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none transition-all ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none transition-all ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'}`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Gender (Now Full Width) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
              <div className="relative">
                  <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full pl-4 pr-10 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none appearance-none transition-all text-slate-700 cursor-pointer ${errors.gender ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'}`}
                  >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            {/* Passwords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none transition-all ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'}`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-lg focus:ring-2 outline-none transition-all ${errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'}`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <div className="relative flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-5 h-5 border-slate-300 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
              </div>
              <label htmlFor="agreeToTerms" className="text-sm text-slate-600">
                I agree to the <a href="#" className="text-purple-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-purple-600 font-semibold hover:underline">Privacy Policy</a>
                {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-all transform hover:-translate-y-1 shadow-lg shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Creating Account...</span>
              ) : (
                <>
                  Create Account <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-slate-500 mt-8 text-sm">
            Already have an account? <Link to="/login?role=student" className="text-purple-600 font-bold hover:underline">Log in</Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
};

export default Signup;