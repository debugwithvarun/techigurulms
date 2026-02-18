import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Award, ExternalLink, Loader, Layers, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios'; // Adjust this import based on your project structure

// --- TYPES ---
interface CertificateData {
    _id: string;
    title: string;
    description: string;
    genre: string;
    link: string;
    status: string;
    thumbnail: string | null;
    instructor?: { name: string; title: string; avatar?: string };
}
// varun 
// --- HELPER ---
const getImageUrl = (url: string | null) => {
    if (!url) return 'https://via.placeholder.com/640x360?text=No+Cover';
    if (url.startsWith('/uploads') || url.startsWith('\\uploads')) {
        // Change to your actual backend URL if different
        // return `https://techiguru-backend.onrender.com${url.replace(/\\/g, '/')}`; 
        return `https://localhost:5000${url.replace(/\\/g, '/')}`; 

    }
    return url;
};

const CertificatesPage = () => {
    const location = useLocation();
    
    // Dynamically determine the status based on the URL path
    const isInactiveRoute = location.pathname.includes('inactive');
    const pageStatus = isInactiveRoute ? 'Inactive' : 'Active';

    const [certificates, setCertificates] = useState<CertificateData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCertificates = async () => {
            setLoading(true);
            try {
                // Fetch certificates passing the requested status
                const { data } = await api.get(`/certificates?status=${pageStatus}`);
                setCertificates(data);
            } catch (error) {
                console.error("Error fetching certificates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, [pageStatus]); // Re-run if the user switches between Active and Inactive routes

    // Filter by search term
    const filteredCertificates = certificates.filter(cert => 
        cert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        cert.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-purple-200 selection:text-purple-900">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-sm">
                    <div className="flex-1">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-2">
                            <div className={`p-3 rounded-2xl text-white shadow-lg ${isInactiveRoute ? 'bg-slate-400 shadow-slate-200' : 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-200'}`}>
                                <Award size={24} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                {isInactiveRoute ? 'Archived Certificates' : 'Active Certificates'}
                            </h1>
                        </motion.div>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-slate-500 text-sm md:text-base font-medium ml-1">
                            {isInactiveRoute 
                                ? 'Browse through our collection of legacy and archived certification programs.' 
                                : 'Explore our top-tier, currently active external certification programs.'}
                        </motion.p>
                    </div>

                    {/* Search Bar */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full md:w-80 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder={`Search ${pageStatus.toLowerCase()} certificates...`}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-500 text-sm font-medium transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </motion.div>
                </div>

                {/* --- CONTENT SECTION --- */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader className="animate-spin text-purple-600 mb-4" size={48} />
                        <p className="text-slate-500 font-bold tracking-wide animate-pulse">Loading certificates...</p>
                    </div>
                ) : filteredCertificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredCertificates.map((cert, idx) => (
                                <motion.div 
                                    key={cert._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-purple-900/5 hover:-translate-y-2 transition-all duration-300"
                                >
                                    {/* Card Image */}
                                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                                        <img 
                                            src={getImageUrl(cert.thumbnail)} 
                                            alt={cert.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-slate-700 shadow-sm uppercase tracking-wider">
                                            {cert.genre}
                                        </div>
                                        {isInactiveRoute && (
                                            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center">
                                                <span className="bg-slate-800 text-white px-4 py-2 rounded-xl font-bold tracking-widest uppercase text-sm shadow-xl">Archived</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Body */}
                                    <div className="flex flex-col flex-1 p-6 lg:p-8">
                                        <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors">
                                            {cert.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                                            {cert.description}
                                        </p>

                                        {/* Instructor Info */}
                                        {cert.instructor && (
                                            <div className="flex items-center gap-3 mb-6 pt-6 border-t border-slate-50">
                                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs shrink-0">
                                                    {cert.instructor.avatar ? (
                                                        <img src={cert.instructor.avatar} alt={cert.instructor.name} className="w-full h-full rounded-full object-cover"/>
                                                    ) : (
                                                        <User size={14} />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-700">{cert.instructor.name}</span>
                                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{cert.instructor.title || 'Instructor'}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Call to Action */}
                                        <a 
                                            href={cert.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group/btn ${
                                                isInactiveRoute 
                                                    ? 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-slate-200' 
                                                    : 'bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white hover:shadow-lg hover:shadow-purple-200'
                                            }`}
                                        >
                                            View Certification 
                                            <ExternalLink size={16} className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Layers size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No Certificates Found</h3>
                        <p className="text-slate-500 font-medium text-center max-w-md">
                            {searchTerm 
                                ? `We couldn't find any ${pageStatus.toLowerCase()} certificates matching "${searchTerm}".` 
                                : `There are currently no ${pageStatus.toLowerCase()} certificates available.`}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CertificatesPage;