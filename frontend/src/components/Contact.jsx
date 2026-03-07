import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import contactSvg from "../assets/contact.svg";
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
    <section className="py-24 bg-[#FDFEFE] min-h-screen flex items-center">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left Side: Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 flex justify-center"
          >
            <img
              src={contactSvg}
              alt="Contact Illustration"
              className="w-full max-w-[550px] h-auto"
            />
          </motion.div>

          {/* Right Side: Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 w-full"
          >
            <div className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-8">
                Get in touch !
              </h2>

              {/* Success Banner */}
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-4 mb-6"
                  >
                    <CheckCircle size={18} className="mt-0.5 text-green-600 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">Message sent successfully!</p>
                      <p className="text-xs mt-0.5 text-green-700">We've sent a confirmation to your email. Our team will get back to you within 24–48 hours.</p>
                    </div>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-5 py-4 mb-6"
                  >
                    <AlertCircle size={18} className="mt-0.5 text-red-500 shrink-0" />
                    <p className="text-sm font-medium">{errorMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Your Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Name :"
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-gray-400"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Your Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="Email :"
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Your Question:</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="Subject :"
                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Your Comment:</label>
                  <textarea
                    rows="4"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="Message :"
                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all resize-none placeholder:text-gray-400"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-purple-600 text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <><Loader2 size={18} className="animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;