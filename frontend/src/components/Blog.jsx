import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User, Tag } from 'lucide-react';

// Author initials avatars — no external placeholder images
const AuthorAvatar = ({ initials, color }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 ${color}`}>
    {initials}
  </div>
);

const blogs = [
  {
    category: 'Career Tips',
    date: 'Jan 15, 2026',
    readTime: '5 Min Read',
    title: 'How to Land Your First Tech Job: A Complete Guide',
    desc: 'Practical strategies for freshers looking to break into the IT industry — from resume building to cracking technical interviews.',
    img: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80',
    author: 'Techiguru Team',
    authorInitials: 'TG',
    authorColor: 'bg-purple-600',
  },
  {
    category: 'Full Stack',
    date: 'Feb 10, 2026',
    readTime: '8 Min Read',
    title: 'MERN Stack vs MEAN Stack: Which Should You Learn in 2026?',
    desc: 'A detailed comparison of the two most popular full-stack frameworks to help you make the right career choice.',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80',
    author: 'Varun Chauhan',
    authorInitials: 'VC',
    authorColor: 'bg-indigo-600',
  },
  {
    category: 'Interview Prep',
    date: 'Mar 01, 2026',
    readTime: '6 Min Read',
    title: 'Top 50 DSA Questions Asked in Product-Based Companies',
    desc: 'Curated list of the most frequently asked Data Structures & Algorithms interview questions at top tech companies.',
    img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80',
    author: 'Uday Bhatnagar',
    authorInitials: 'UB',
    authorColor: 'bg-emerald-600',
  },
];

const Blog = () => {
  return (
    <section className="py-24 bg-[#FDFEFE] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-50 rounded-full blur-3xl opacity-60" />
         <div className="absolute bottom-20 left-0 w-[300px] h-[300px] bg-blue-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-purple-600 font-bold tracking-wider text-sm uppercase mb-2 block"
            >
              Our Blog & News
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-black text-slate-900 mb-4"
            >
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Articles</span>
            </motion.h2>
            <p className="text-slate-500 text-lg">
              Insights, thoughts, and trends from the world of education.
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-slate-700 font-bold hover:border-purple-600 hover:text-purple-600 transition-colors bg-white shadow-sm"
          >
            View All Posts <ArrowRight size={16} />
          </motion.button>
        </div>

        {/* Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(124,58,237,0.1)] transition-all duration-500 flex flex-col h-full"
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={blog.img}
                  alt={blog.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {/* Floating Tag */}
                <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                  <Tag size={12} className="text-purple-600" />
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">{blog.category}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 flex flex-col flex-grow">
                {/* Meta Data */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mb-4">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                    <Calendar size={14} className="text-purple-500" /> {blog.date}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                    <Clock size={14} className="text-purple-500" /> {blog.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-purple-600 transition-colors cursor-pointer">
                  {blog.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                  {blog.desc}
                </p>

                {/* Footer: Author & Link */}
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AuthorAvatar initials={blog.authorInitials} color={blog.authorColor} />
                    <span className="text-sm font-bold text-slate-700">{blog.author}</span>
                  </div>
                  
                  <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 transform group-hover:-rotate-45">
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Button */}
        <div className="mt-12 text-center md:hidden">
            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-purple-600 text-white font-bold shadow-lg shadow-purple-200">
               View All Posts <ArrowRight size={16} />
            </button>
        </div>

      </div>
    </section>
  );
};

export default Blog;