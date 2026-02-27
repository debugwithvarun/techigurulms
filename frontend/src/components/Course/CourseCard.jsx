import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Users, BookOpen, Clock, PlayCircle, ArrowRight, ImageOff } from 'lucide-react';
import { getImageUrl } from '../../config';

const CourseThumbnail = ({ src, alt, category }) => {
    const [imgError, setImgError] = useState(false);
    const imageUrl = getImageUrl(src);

    return (
        <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
            <motion.div className="w-full h-full" whileHover={{ scale: 1.06 }} transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}>
                {imgError || !imageUrl ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                        <ImageOff size={32} className="mb-2 opacity-50" />
                        <span className="text-xs font-medium text-slate-400">No image</span>
                    </div>
                ) : (
                    <img src={imageUrl} alt={alt} className="w-full h-full object-cover" loading="lazy" onError={() => setImgError(true)} />
                )}
            </motion.div>

            {/* Category badge */}
            {category && (
                <div className="absolute top-3 left-3">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-800 shadow-sm backdrop-blur-md">
                        {category}
                    </span>
                </div>
            )}

            {/* Hover play overlay */}
            <div className="absolute inset-0 bg-indigo-900/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                    <PlayCircle size={28} fill="currentColor" />
                </div>
            </div>
        </div>
    );
};

const CourseCard = ({ course, isInactive = false, isEnrolled = false, animationDelay = 0 }) => {
    const navigate = useNavigate();
    const courseId = course._id || course.id;

    const totalLessons = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)
        || course.lessons
        || 0;
    const formattedPrice = course.price === 0 || course.price === 'Free' ? 'Free' : `₹${Number(course.price).toLocaleString('en-IN')}`;

    const handleClick = () => {
        if (isEnrolled) {
            navigate(`/course/${courseId}/learn`);
        } else {
            navigate(`/course/${courseId}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: animationDelay, ease: 'easeOut' }}
            whileHover={{ y: -4 }}
            onClick={handleClick}
            className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-slate-200/60 hover:border-indigo-200 transition-all duration-300"
            role="article"
            aria-label={`${course.title} course`}
        >
            <CourseThumbnail src={course.thumbnail?.url || course.thumbnail} alt={course.title} category={course.category} />

            <div className="flex flex-col flex-1 p-5">
                {/* Top row */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-xs font-bold text-amber-600">
                        <Star size={11} className="fill-amber-500 text-amber-500" />
                        <span>{course.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                        isEnrolled ? 'bg-indigo-50 text-indigo-700' :
                        isInactive ? 'bg-slate-100 text-slate-500' :
                        course.price === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                    }`}>
                        {isEnrolled ? '✓ Enrolled' : isInactive ? 'Archived' : formattedPrice}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 leading-snug mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                </h3>

                {/* Level */}
                {course.level && (
                    <p className="text-xs text-slate-400 font-medium mb-3">{course.level}</p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-3 border-t border-slate-100 mt-auto">
                    <span className="flex items-center gap-1"><BookOpen size={12} className="text-indigo-400" />{totalLessons} lessons</span>
                    <span className="flex items-center gap-1"><Users size={12} className="text-indigo-400" />{(course.studentsEnrolled || course.students || 0).toLocaleString()}</span>
                </div>

                {/* CTA */}
                <div className="mt-4">
                    <button className={`w-full py-2.5 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        isEnrolled ? 'bg-indigo-600 group-hover:bg-indigo-700' :
                        isInactive ? 'bg-slate-700 group-hover:bg-slate-800' :
                        'bg-slate-900 group-hover:bg-indigo-600'
                    }`}>
                        {isEnrolled ? 'Continue Learning' : isInactive ? 'View Details' : 'View Course'}
                        <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default memo(CourseCard);
