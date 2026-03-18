import React from 'react';
import { motion } from 'framer-motion';
import varun   from '../assets/varun.png';
import pawan   from '../assets/pawan.png';
import uday    from '../assets/uday.png';
import anajali from '../assets/anajali.png';

const instructors = [
  { name: 'Pawan Sharma',   role: 'Data Scientist',       img: pawan,   tag: 'Gen AI',     accent: '#0ea5e9', light: '#f0f9ff' },
  { name: 'Anjali Sharma',  role: 'HR & Operations',      img: anajali, tag: 'Management', accent: '#ec4899', light: '#fdf2f8' },
  { name: 'Varun Chauhan',  role: 'MERN Stack & DSA',     img: varun,   tag: 'Full Stack',  accent: '#7c3aed', light: '#f5f3ff' },
  { name: 'Uday Bhatnagar', role: 'MERN Stack',           img: uday,    tag: 'Full Stack',  accent: '#7c3aed', light: '#f5f3ff' },
];

const Instructors = () => (
  <section className="relative py-24 bg-white overflow-hidden">
    {/* Subtle top-right glow */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

    <div className="max-w-[1400px] mx-auto px-6 lg:px-20 text-center relative z-10">
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <span className="text-purple-600 font-bold tracking-wider text-sm uppercase mb-2 block">Expert Instructors</span>
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">
          Learn from{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">the Best</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto mb-16">
          Our instructors are industry professionals with real-world experience, dedicated to helping you build job-ready skills.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
        {instructors.map((inst, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.09 }}
            whileHover={{ y: -8 }}
            className="group cursor-pointer flex flex-col items-center"
          >
            {/* Avatar with layered ring effect */}
            <div className="relative mb-6">
              {/* Animated glow behind avatar */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `radial-gradient(circle, ${inst.accent}55, transparent 70%)`, transform: 'scale(1.3)' }}
              />
              {/* Spinning gradient ring on hover */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-purple-400/60
                transition-all duration-300"
                style={{ boxShadow: `0 0 0 0 transparent` }}
              />
              <div className="w-36 h-36 rounded-full p-1 relative z-10"
                style={{ background: `conic-gradient(${inst.accent}00, ${inst.accent}00)` }}
              >
                <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                  style={{ boxShadow: `0 8px 24px ${inst.accent}30` }}
                >
                  <img src={inst.img} alt={inst.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
              </div>
              {/* Tag badge */}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm whitespace-nowrap"
                style={{ background: inst.light, color: inst.accent, border: `1px solid ${inst.accent}35` }}
              >
                {inst.tag}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-700 transition-colors">{inst.name}</h3>
            <p className="text-slate-500 text-sm mt-0.5">{inst.role}</p>

            {/* Underline accent */}
            <div className="mt-3 w-0 group-hover:w-12 h-0.5 rounded-full transition-all duration-300"
              style={{ background: inst.accent }} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Instructors;