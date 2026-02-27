import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Star, ArrowRight, Heart, ShoppingCart } from 'lucide-react';

// Enhanced Data with more details for the UI
const coursesData = [
  { 
    id: 1,
    category: "Development",
    title: "The Ultimate Full Stack Bundle", 
    price: "Free", 
    oldPrice: "₹14,999",
    rating: 4.8,
    reviews: 120,
    lessons: 45, 
    students: "10.5k", 
    author: "Calvin Carlo", 
    authorImg: "https://i.pravatar.cc/150?u=1",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    id: 2,
    category: "Mobile App",
    title: "Flutter & React Native Masterclass", 
    price: "₹3,999", 
    oldPrice: "₹6,999",
    rating: 4.9,
    reviews: 85,
    lessons: 32, 
    students: "4.2k", 
    author: "Sarah Smith", 
    authorImg: "https://i.pravatar.cc/150?u=2",
    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    id: 3,
    category: "Language",
    title: "Spoken English & Public Speaking", 
    price: "₹2,499", 
    oldPrice: "₹4,999",
    rating: 4.7,
    reviews: 210,
    lessons: 18, 
    students: "8.9k", 
    author: "John Doe", 
    authorImg: "https://i.pravatar.cc/150?u=3",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop" 
  }
];

// --- Sub-Component: Course Card ---
const CourseCard = ({ course }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_rgba(8,112,184,0.07)] transition-all duration-300 group flex flex-col h-full"
    >
      {/* Image Header */}
      <div className="relative h-60 overflow-hidden">
        <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-purple-600 uppercase tracking-wide">
          {course.category}
        </span>
        
        <button className="absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-colors">
          <Heart size={18} />
        </button>

        <img 
          src={course.img} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Rating & Price Row */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-slate-800">{course.rating}</span>
            <span className="text-xs text-slate-400">({course.reviews})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 line-through font-medium">{course.oldPrice}</span>
            <span className="text-lg font-black text-purple-600">{course.price}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-purple-600 transition-colors cursor-pointer">
          {course.title}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-slate-500 text-sm mb-6 border-b border-gray-50 pb-6">
          <div className="flex items-center gap-1.5">
            <BookOpen size={16} />
            <span>{course.lessons} Lessons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} />
            <span>{course.students}</span>
          </div>
        </div>

        {/* Footer: Author & Action */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={course.authorImg} alt={course.author} className="w-9 h-9 rounded-full border border-gray-100" />
            <span className="text-sm font-semibold text-slate-700">{course.author}</span>
          </div>
          
          <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-900 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-sm">
             <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Section Component ---
const CourseSection = () => {
  return (
    <section className="py-24 bg-[#F8F9FA] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-20 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-purple-600 font-bold tracking-wider text-sm uppercase mb-2 block">Top Class Courses</span>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-black text-slate-900 mb-4"
            >
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Best Courses</span>
            </motion.h2>
            <p className="text-slate-500 text-lg">
              Discover a world of knowledge and opportunities with our online education platform.
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full font-bold text-slate-700 hover:border-purple-600 hover:text-purple-600 transition-all shadow-sm"
          >
            View All Courses <ArrowRight size={18} />
          </motion.button>
        </div>

        {/* Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {coursesData.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </motion.div>

        {/* Mobile View All Button */}
        <div className="mt-12 text-center md:hidden">
           <button className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-purple-200">
             View All Courses <ArrowRight size={18} />
           </button>
        </div>

      </div>
    </section>
  );
};

export default CourseSection;