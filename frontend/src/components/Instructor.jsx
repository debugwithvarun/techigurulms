import React from 'react';
import { motion } from 'framer-motion';
import varun from '../assets/varun.png';
import pawan from '../assets/pawan.png';
import uday from '../assets/uday.png';
import anajali from '../assets/anajali.png';

const instructors = [

  {
    name: 'Pawan Sharma',
    role: 'Android Development',
    img: pawan,
    tag: 'Mobile',
    color: '#0ea5e9',
    bg: '#f0f9ff',
  },
  {
    name: 'Anjali Sharma',
    role: 'HR & Operations',
    img: anajali,
    tag: 'Management',
    color: '#ec4899',
    bg: '#fdf2f8',
  },
  {
    name: 'Varun Chauhan',
    role: 'MERN Stack & DSA',
    img: varun,
    tag: 'Full Stack',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    name: 'Uday Bhatnagar',
    role: 'MERN Stack',
    img: uday,
    tag: 'Full Stack',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },

];

const Instructors = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20 text-center">
        <span className="text-purple-600 font-bold tracking-wider text-sm uppercase mb-2 block">
          Expert Instructors
        </span>
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">
          Learn from <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">the Best</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto mb-14">
          Our instructors are industry professionals with real-world experience, dedicated to helping you build job-ready skills.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {instructors.map((inst, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
            >
              <div className="relative mb-5 inline-block">
                {/* Glow ring on hover */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                  style={{ background: inst.color, filter: 'blur(16px)', transform: 'scale(0.85)' }}
                />
                <div
                  className="w-36 h-36 rounded-full border-4 border-transparent group-hover:border-purple-400 transition-all duration-300 p-1 relative z-10"
                  style={{ boxShadow: 'none' }}
                >
                  <img
                    src={inst.img}
                    alt={inst.name}
                    className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                {/* Tag Badge */}
                <span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm z-20"
                  style={{ background: inst.bg, color: inst.color, border: `1px solid ${inst.color}30` }}
                >
                  {inst.tag}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mt-2">{inst.name}</h3>
              <p className="text-slate-500 text-sm mt-0.5">{inst.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instructors;