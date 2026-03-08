import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, Users, Star, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

const openings = [
    { title: 'Senior MERN Stack Developer', type: 'Full-time', location: 'Ghaziabad / Remote', dept: 'Engineering' },
    { title: 'React Native Developer', type: 'Full-time', location: 'Ghaziabad / Remote', dept: 'Mobile' },
    { title: 'Content Instructor – Data Science', type: 'Contract', location: 'Remote', dept: 'Education' },
    { title: 'Digital Marketing Executive', type: 'Full-time', location: 'Ghaziabad', dept: 'Marketing' },
    { title: 'UI/UX Designer', type: 'Full-time', location: 'Ghaziabad / Remote', dept: 'Design' },
];

const perks = [
    { icon: Star, title: 'Learning Budget', desc: 'Annual ₹15,000 budget for courses or books' },
    { icon: Clock, title: 'Flexible Hours', desc: 'Work when you are most productive' },
    { icon: Users, title: 'Great Team', desc: 'Collaborate with passionate educators & engineers' },
    { icon: Coffee, title: 'Work from Anywhere', desc: 'Remote-friendly for most roles' },
];

const CareersPage = () => (
    <div className="min-h-screen bg-gray-50 font-sans">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#1e1148] via-[#2d1b6e] to-[#4c1d95] text-white py-24 px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-purple-200 mb-5">
                    <Briefcase size={13} /> Careers at TechiGuru
                </span>
                <h1 className="text-4xl md:text-5xl font-black mb-4">Build the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">EdTech</span></h1>
                <p className="text-purple-200 text-lg max-w-xl mx-auto">Join a passionate team helping thousands of learners across India transform their careers through technology education.</p>
            </motion.div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
            {/* Perks */}
            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Why Work With Us?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {perks.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3"><Icon size={18} className="text-purple-600" /></div>
                            <p className="font-bold text-slate-800 text-sm mb-1">{title}</p>
                            <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Openings */}
            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8">Open Positions</h2>
                <div className="space-y-3">
                    {openings.map((job, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                            className="flex items-center justify-between flex-wrap gap-4 bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all px-6 py-4 group">
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{job.title}</p>
                                <div className="flex flex-wrap gap-3 mt-1.5">
                                    <span className="flex items-center gap-1 text-xs text-gray-400"><Briefcase size={11} /> {job.dept}</span>
                                    <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={11} /> {job.location}</span>
                                    <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} /> {job.type}</span>
                                </div>
                            </div>
                            <Link to="/contact" className="flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:gap-2.5 transition-all">
                                Apply Now <ArrowRight size={13} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
                <p className="text-center text-sm text-gray-400 mt-6">Don't see a fit? <Link to="/contact" className="text-purple-600 font-semibold hover:underline">Send us your CV anyway →</Link></p>
            </section>
        </div>
    </div>
);

export default CareersPage;
