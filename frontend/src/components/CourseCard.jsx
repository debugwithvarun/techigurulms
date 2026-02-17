import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, ArrowRight } from 'lucide-react';

const CourseCard = ({ course }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-md overflow-hidden 
                 shadow-[0_10px_30px_rgba(0,0,0,0.05)] 
                 border border-gray-100 
                 transition-all duration-300 
                 hover:shadow-xl h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={course.img} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          alt={course.title} 
        />

        {/* Tags */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase">
            Free
          </span>
          <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase">
            Event
          </span>
        </div>

        {/* Price */}
        <div className="absolute -bottom-5 right-4">
          <div className="bg-purple-600 text-white w-12 h-12 rounded-full 
                          flex items-center justify-center text-sm font-bold 
                          border-4 border-white shadow-md">
            {course.price}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 pt-8 flex flex-col flex-grow">
        {/* Meta */}
        <div className="flex gap-4 text-gray-400 text-xs font-semibold mb-3">
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            {course.lessons} Lessons
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            {course.students} Students
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-extrabold text-slate-900 mb-3 hover:text-purple-600 transition cursor-pointer">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-6">
          The phrasal sequence of the is now so many campaign
        </p>

        <div className="mt-auto">
          <div className="h-px bg-gray-100 mb-4"></div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="https://i.pravatar.cc/150?u=calvin" 
                className="w-8 h-8 rounded-full border" 
                alt="instructor"
              />
              <span className="text-sm font-bold text-slate-800">
                {course.author}
              </span>
            </div>

            <button className="flex items-center gap-1 text-purple-600 text-xs font-bold hover:gap-2 transition-all">
              Explore <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
