import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, LogIn, AlertCircle, GraduationCap, Briefcase 
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import Auth Context

// 1. Define Interfaces
interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const Login: React.FC = () => {
  const { login } = useAuth(); // Get login function from Context
  const navigate = useNavigate();
  
  // 2. Read Role from URL Parameters
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student'; // Default to student
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  // 3. Typed State
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 4. Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error when user types
    if (errors[name] || errors.api) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors.api; // Clear global API errors on input
        return newErrors;
      });
    }
  };

  // 5. Validation Logic
  const validate = (): boolean => {
    let newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 6. Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      // Pass the role to the backend via Context
      const result = await login(formData.email, formData.password, role);
      
      setIsSubmitting(false);

      if (result.success) {
        // --- REDIRECT LOGIC ---
        if (role === 'instructor') {
          navigate('/dashboard'); // Instructors go to dashboard
        } else {
          navigate('/'); // Students go to home page
        }
      } else {
        // Set API Error to display in UI
        setErrors({ api: result.message });
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* LEFT SIDE: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>

        {/* Logo */}
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

        {/* Testimonial */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Welcome back to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Future Learning
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            "The depth of the courses here is unmatched. I keep coming back to upskill whenever a new technology drops."
          </p>
          
          <div className="flex items-center gap-4">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="w-12 h-12 rounded-full border-2 border-purple-500" />
            <div>
              <p className="text-white font-bold">David Chen</p>
              <p className="text-slate-500 text-sm">Senior DevOps Engineer</p>
            </div>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="relative z-10 text-slate-500 text-sm">
          © 2026 TechiGuru Inc.
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-left mb-10">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 lg:hidden">
               <LogIn size={24} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold text-slate-900">Welcome Back</h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit ${
                    role === 'instructor' ? 'bg-slate-900 text-white' : 'bg-purple-100 text-purple-700'
                }`}>
                    {role === 'instructor' ? <Briefcase size={12}/> : <GraduationCap size={12}/>}
                    {displayRole}
                </span>
            </div>
            <p className="text-slate-500">Please enter your details to sign in as a {role}.</p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
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

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center h-5">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className={`w-4 h-4 border-slate-300 rounded focus:ring-purple-500 cursor-pointer ${role === 'instructor' ? 'text-slate-900' : 'text-purple-600'}`}
                  />
                </div>
                <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer select-none">
                  Remember me
                </label>
              </div>
              <a href="#" className={`text-sm font-semibold hover:underline ${role === 'instructor' ? 'text-slate-800 hover:text-slate-900' : 'text-purple-600 hover:text-purple-700'}`}>
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full text-white font-bold py-4 rounded-lg transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                role === 'instructor' ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-200' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
              }`}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  Sign In <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link - Preserves Role */}
          <p className="text-center text-slate-500 mt-8 text-sm">
            Don't have an account? <Link to={`/signup?role=${role}`} className={`font-bold hover:underline ${role === 'instructor' ? 'text-slate-800' : 'text-purple-600'}`}>Sign up</Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
};

export default Login;