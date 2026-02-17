import React from 'react';
import { motion } from 'framer-motion';
import contactSvg from "../assets/contact.svg";
import { Send } from 'lucide-react';

const Contact = () => {
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

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Your Name:</label>
                    <input 
                      type="text" 
                      placeholder="Name :" 
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-gray-400"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Your Email:</label>
                    <input 
                      type="email" 
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
                    placeholder="Subject :" 
                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Your Comment:</label>
                  <textarea 
                    rows="4" 
                    placeholder="Message :" 
                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all resize-none placeholder:text-gray-400"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="bg-purple-600 text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all"
                >
                  Send Message
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