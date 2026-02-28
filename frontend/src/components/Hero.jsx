import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Award, BookOpen, Star, ChevronDown, MousePointer2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Typewriter words ────────────────────────────────────────────────────────
const words = ['Developers', 'Designers', 'Entrepreneurs', 'Engineers'];

const TypewriterText = () => {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 70);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    } else {
      setDeleting(false);
      setIdx((prev) => (prev + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx]);

  return (
    <span className="relative inline-block min-w-[280px] text-left">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
        {displayed}
      </span>
      <motion.span 
        animate={{ opacity: [1, 0] }} 
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-[3px] h-[0.9em] bg-purple-500 ml-1 translate-y-1"
      />
    </span>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Parallax Scroll logic
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]); // Slowest (Background)
  const y2 = useTransform(scrollY, [0, 500], [0, -150]); // Fastest (Foreground)
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

  const smoothY2 = useSpring(y2, { stiffness: 100, damping: 20 });

  // Canvas Background Animation (Memoized for performance)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      t += 0.002;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const orbs = [
        { x: 0.2, y: 0.3, r: 0.4, c: 'rgba(99,102,241,0.12)', drift: 0.1 },
        { x: 0.8, y: 0.2, r: 0.35, c: 'rgba(168,85,247,0.12)', drift: 0.15 },
        { x: 0.5, y: 0.7, r: 0.5, c: 'rgba(236,72,153,0.08)', drift: 0.05 },
      ];

      orbs.forEach(orb => {
        const x = canvas.width * (orb.x + Math.sin(t * orb.drift) * 0.05);
        const y = canvas.height * (orb.y + Math.cos(t * orb.drift) * 0.05);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, canvas.width * orb.r);
        gradient.addColorStop(0, orb.c);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[120vh] flex flex-col items-center justify-start overflow-hidden bg-[#030308] pt-32 px-6">
      
      {/* Layer 1: Animated Background */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute inset-0 opacity-[0.15]" 
          style={{ backgroundImage: `radial-gradient(#4f46e5 0.5px, transparent 0.5px)`, backgroundSize: '32px 32px' }} />
      </motion.div>

      {/* Layer 2: Main Content */}
      <motion.div style={{ opacity, scale }} className="relative z-10 max-w-5xl mx-auto text-center">
        
        {/* Elite Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-[#030308] bg-purple-500" />)}
          </div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest ml-2">Trusted by 15k+ Students</span>
          <Zap size={14} className="text-amber-400 fill-amber-400" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
          FUTURE-PROOF YOUR <br />
          <TypewriterText />
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          The ultimate ecosystem for tech excellence. Learn from industry giants, 
          build production-grade apps, and earn verified credentials.
        </motion.p>

        {/* Action Group */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-5 bg-white text-black font-black rounded-2xl flex items-center gap-3 transition-all">
            Get Started Now <ArrowRight size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            className="px-10 py-5 bg-transparent border border-white/20 text-white font-bold rounded-2xl backdrop-blur-md transition-all">
            View Curriculum
          </motion.button>
        </div>
      </motion.div>

      {/* Layer 3: The Parallax Visual (Moves opposite to scroll) */}


      {/* Scroll Hint */}
      <motion.div 
        animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Scroll to Explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </motion.div>

    </section>
  );
};

export default Hero;