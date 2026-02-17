import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Sparkles, Loader, AlertCircle } from 'lucide-react';
import CourseCard from './CourseCard'; 
import { useCourse } from '../../context/CourseContext'; // Integration

const ActiveCourses = () => {
  // 1. Access Global Course State
  const { courses, fetchCourses, loading, error } = useCourse();
  
  // 2. Local State for Search
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Initial Fetch on Mount
  useEffect(() => {
    fetchCourses(); 
  }, []);

  // 4. Handle Search (Trigger fetch on Enter key)
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchCourses(searchTerm);
    }
  };

  // 5. Handle Clear Search
  const handleClear = () => {
      setSearchTerm('');
      fetchCourses('');
  };
console.log('ActiveCourses Rendered with:', { courses, loading, error });
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider">Live & Trending</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              Explore Active Courses
            </h1>
            <p className="text-slate-500 mt-3 max-w-xl text-lg">
              Dive into our most popular, up-to-date content. No enrollment fees, just pure learning.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Find a topic... (Press Enter)" 
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 bg-white shadow-sm transition-all" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 shadow-sm transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Featured Banner */}
        <div className="mb-12 p-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl">
            <div className="bg-white rounded-xl p-4 flex items-center justify-center gap-3 text-sm font-bold text-slate-700">
              <Sparkles size={18} className="text-amber-500" fill="currentColor"/> 
              All courses are unlocked for a limited time! Happy Learning.
            </div>
        </div>

        {/* --- CONTENT STATES --- */}

        {/* 1. Loading State */}
        {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Loader className="animate-spin mb-4 text-purple-600" size={40} />
                <p>Loading courses...</p>
            </div>
        )}

        {/* 2. Error State */}
        {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center text-red-600 flex flex-col items-center">
                <AlertCircle size={32} className="mb-2" />
                <p>{error}</p>
                <button onClick={() => fetchCourses()} className="mt-4 text-sm font-bold underline hover:text-red-800">Try Again</button>
            </div>
        )}

        {/* 3. Empty State */}
        {!loading && !error && courses.length === 0 && (
            <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-lg">No active courses found matching "{searchTerm}".</p>
                <button onClick={handleClear} className="mt-2 text-purple-600 font-bold hover:underline">Clear Search</button>
            </div>
        )}

        {/* 4. Success Grid */}
        {!loading && !error && courses.length > 0 && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {courses.map((course: any) => {
                // DATA MAPPING: Backend (MongoDB) -> Frontend (Card Props)
                // Calculate total lessons from sections
                const totalLessons = course.sections?.reduce((acc: number, section: any) => acc + section.lessons.length, 0) || 0;
                
                return (
                    <motion.div 
                      key={course._id} // Use MongoDB _id
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                      }}
                    >
                      <CourseCard course={{
                          id: course._id,
                          title: course.title,
                          category: course.category,
                          students: course.studentsEnrolled || 0,
                          rating: course.rating || 0,
                          price: course.price === 0 ? 'Free' : `$${course.price}`,
                          lessons: totalLessons,
                          // Parse virtual duration (seconds) -> string (e.g. "2h 30m") or simplified
                          duration: '10h 30m', 
                          thumbnail: course.thumbnail?.url || 'https://via.placeholder.com/600x400?text=No+Image'
                      }} />
                    </motion.div>
                );
              })}
            </motion.div>
        )}

      </div>
    </div>
  );
};

export default ActiveCourses;