import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const posts = [
    { title: 'Getting Started with MERN Stack Development', category: 'Web Dev', mins: 8, author: 'Varun Chauhan', excerpt: 'Learn how to build full-stack web applications using MongoDB, Express, React, and Node.js from the ground up.' },
    { title: 'Android Development in 2025 – What You Need to Know', category: 'Mobile', mins: 6, author: 'Pawan Sharma', excerpt: 'A comprehensive overview of modern Android development trends, tools, and best practices to follow this year.' },
    { title: 'Why Data Structures & Algorithms Still Matter', category: 'DSA', mins: 5, author: 'Varun Chauhan', excerpt: 'Breaking down why DSA knowledge remains essential for cracking interviews at top tech companies in India.' },
    { title: 'Top 5 Skills Every Tech Professional Needs in 2025', category: 'Career', mins: 4, author: 'TechiGuru Team', excerpt: 'From cloud computing to AI literacy, here are the must-have skills to stay competitive in the evolving job market.' },
    { title: 'How to Choose the Right Coding Bootcamp', category: 'Learning', mins: 7, author: 'TechiGuru Team', excerpt: 'A practical guide to evaluating and choosing the right intensive coding program to accelerate your tech career.' },
    { title: "Understanding REST APIs – A Beginner's Guide", category: 'Backend', mins: 10, author: 'Uday', excerpt: 'Demystifying RESTful APIs, HTTP methods, status codes, and how to integrate APIs into your web projects.' },
];

const colors = { 'Web Dev': 'bg-blue-50 text-blue-700', Mobile: 'bg-green-50 text-green-700', DSA: 'bg-purple-50 text-purple-700', Career: 'bg-orange-50 text-orange-700', Learning: 'bg-pink-50 text-pink-700', Backend: 'bg-cyan-50 text-cyan-700' };

const BlogPage = () => (
    <div className="min-h-screen bg-gray-50 font-sans">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#1e1148] via-[#2d1b6e] to-[#4c1d95] text-white py-24 px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-purple-200 mb-5">
                    <BookOpen size={13} /> TechiGuru Blog
                </span>
                <h1 className="text-4xl md:text-5xl font-black mb-4">Insights for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">Tech Learners</span></h1>
                <p className="text-purple-200 text-lg max-w-xl mx-auto">Tutorials, career advice, and industry insights from our team of expert instructors.</p>
            </motion.div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, i) => (
                    <motion.article key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                        className="bg-white rounded-2xl border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all overflow-hidden group">
                        {/* Cover placeholder */}
                        <div className="h-36 bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 flex items-center justify-center">
                            <BookOpen size={32} className="text-purple-300" />
                        </div>
                        <div className="p-5">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors[post.category] || 'bg-gray-100 text-gray-600'}`}>{post.category}</span>
                            <h2 className="font-black text-slate-800 text-sm mt-3 mb-2 leading-snug">{post.title}</h2>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1"><User size={11} /> {post.author}</span>
                                    <span className="flex items-center gap-1"><Clock size={11} /> {post.mins} min read</span>
                                </div>
                                <Link to="/contact" className="flex items-center gap-1 text-purple-600 font-bold group-hover:gap-1.5 transition-all">Read <ArrowRight size={12} /></Link>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-10">More articles coming soon. <Link to="/contact" className="text-purple-600 font-semibold hover:underline">Subscribe for updates →</Link></p>
        </div>
    </div>
);

export default BlogPage;
