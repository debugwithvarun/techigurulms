import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Archive, History, Loader, AlertCircle } from 'lucide-react';
import CourseCard from './CourseCard'; 
import api from '../../api/axios'; // Import API helper

const InactiveCourses = () => {
  // Local state to keep archived courses separate from the main "Active" context
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Inactive Courses
  const fetchArchivedCourses = async (keyword = '') => {
    setLoading(true);
    try {
      // API call with status=Inactive filter
      const { data } = await api.get(`/courses?status=Inactive&keyword=${keyword}`);
      setCourses(data.courses);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load archived courses');
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchArchivedCourses();
  }, []);

  // Handle Search
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchArchivedCourses(searchTerm);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2 block flex items-center gap-2">
              <Archive size={16} className="text-purple-600"/> Legacy & Archives
            </span>
            <h1 className="text-4xl font-black text-slate-900">
              Course Library Archive
            </h1>
            <p className="text-slate-500 mt-3 max-w-xl text-lg">
              Access our older content and previous workshops. These courses are no longer updated but remain open for reference.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search archive... (Press Enter)" 
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 bg-white shadow-sm transition-all" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-10 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4 text-blue-900">
          <div className="p-3 bg-white rounded-full shadow-sm text-blue-600">
             <History size={24} />
          </div>
          <div>
             <h4 className="font-bold text-lg">Did you know?</h4>
             <p className="text-blue-700/80">These courses are free to watch! While they may use older software versions, the core concepts remain valuable.</p>
          </div>
        </div>

        {/* --- CONTENT STATES --- */}

        {/* 1. Loading */}
        {loading && (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-slate-400" size={40} />
            </div>
        )}

        {/* 2. Error */}
        {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 mb-8">
                <AlertCircle size={20} />
                <p>{error}</p>
            </div>
        )}

        {/* 3. Empty State */}
        {!loading && !error && courses.length === 0 && (
            <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-slate-100 border-dashed">
                <Archive size={48} className="mx-auto mb-4 opacity-20"/>
                <p>No archived courses found.</p>
                {searchTerm && <button onClick={() => { setSearchTerm(''); fetchArchivedCourses(''); }} className="text-purple-600 font-bold hover:underline mt-2">Clear Search</button>}
            </div>
        )}

        {/* 4. Grid Layout */}
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
              {courses.map((course) => (
                <motion.div 
                  key={course._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                >
                  <CourseCard 
                    course={{
                        id: course._id,
                        title: course.title,
                        category: course.category,
                        students: course.studentsEnrolled || 0,
                        rating: course.rating || 0,
                        // Ensure inactive courses show as Free or discounted
                        price: 'Free', 
                        lessons: course.sections?.reduce((acc: number, sec: any) => acc + sec.lessons.length, 0) || 0,
                        duration: '10h 00m', // You can map this from virtual field if available
                        thumbnail: course.thumbnail?.url || 'https://via.placeholder.com/600x400?text=Archive'
                    }} 
                    isInactive={true} 
                  />
                </motion.div>
              ))}
            </motion.div>
        )}

      </div>
    </div>
  );
};

export default InactiveCourses;