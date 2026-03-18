import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const words = ['Developers', 'Designers', 'Entrepreneurs', 'Engineers'];

const TypewriterText = () => {
  const [idx, setIdx]           = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting]   = useState(false);

  useEffect(() => {
    const word = words[idx];
    let t;
    if (!deleting && displayed.length < word.length)
      t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 70);
    else if (!deleting && displayed.length === word.length)
      t = setTimeout(() => setDeleting(true), 2000);
    else if (deleting && displayed.length > 0)
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    else { setDeleting(false); setIdx(p => (p + 1) % words.length); }
    return () => clearTimeout(t);
  }, [displayed, deleting, idx]);

  return (
    <span className="relative inline-block min-w-[220px] md:min-w-[340px] text-left">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400">
        {displayed}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }} transition={{ duration: 0.7, repeat: Infinity }}
        className="inline-block w-[3px] h-[0.85em] bg-purple-400 ml-1 translate-y-1 rounded-sm"
      />
    </span>
  );
};

const Hero = () => {
  const navigate    = useNavigate();
  const canvasRef   = useRef(null);
  const { scrollY } = useScroll();

  const y1      = useTransform(scrollY, [0, 600], [0, 220]);
  const opacity = useTransform(scrollY, [0, 320], [1, 0]);
  const scale   = useTransform(scrollY, [0, 320], [1, 0.92]);

  // ── Particle canvas ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, t = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    // Particle field
    const PARTICLES = 90;
    const particles = Array.from({ length: PARTICLES }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    (Math.random() - 0.5) * 0.3,
      r:     Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.35 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      t += 0.0015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Animated gradient orbs
      [
        { fx: 0.18, fy: 0.28, r: 0.42, c: 'rgba(99,102,241,0.10)',  d: 0.12 },
        { fx: 0.82, fy: 0.22, r: 0.38, c: 'rgba(139,92,246,0.11)',  d: 0.17 },
        { fx: 0.50, fy: 0.75, r: 0.52, c: 'rgba(236,72,153,0.07)',  d: 0.07 },
        { fx: 0.65, fy: 0.45, r: 0.30, c: 'rgba(168,85,247,0.08)',  d: 0.14 },
      ].forEach(o => {
        const x  = canvas.width  * (o.fx + Math.sin(t * o.d) * 0.04);
        const y  = canvas.height * (o.fy + Math.cos(t * o.d) * 0.04);
        const g  = ctx.createRadialGradient(x, y, 0, x, y, canvas.width * o.r);
        g.addColorStop(0, o.c); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Particles + edges
      particles.forEach(p => {
        p.pulse += 0.012; p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;  if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        const a = p.alpha + Math.sin(p.pulse) * 0.08;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${a})`; ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${(1 - d / 100) * 0.1})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section className="relative min-h-[105vh] flex flex-col items-center justify-start overflow-hidden bg-[#030308] pt-28 md:pt-36 px-6">

      {/* Particle canvas */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full" />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.12]"
          style={{ backgroundImage: 'radial-gradient(rgba(139,92,246,0.8) 0.8px, transparent 0.8px)', backgroundSize: '28px 28px' }} />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,#030308_100%)]" />
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity, scale }} className="relative z-10 max-w-5xl mx-auto text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10
            bg-white/[0.04] border border-purple-500/25 backdrop-blur-md
            shadow-[0_0_24px_rgba(139,92,246,0.12)]"
        >
          <div className="flex -space-x-2">
            {['bg-violet-500', 'bg-purple-500', 'bg-pink-500'].map((c, i) => (
              <div key={i} className={`w-6 h-6 rounded-full border-2 border-[#030308] ${c}`} />
            ))}
          </div>
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.15em]">Trusted by 15k+ Students</span>
          <Zap size={13} className="text-amber-400 fill-amber-400" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[clamp(3rem,10vw,6.5rem)] font-black text-white tracking-tighter leading-[0.9] mb-8"
        >
          FUTURE-PROOF YOUR
          <br />
          <TypewriterText />
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
        >
          The ultimate ecosystem for tech excellence. Learn from industry giants,
          build production-grade apps, and earn verified credentials.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.button
            onClick={() => navigate('/active-course')}
            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(139,92,246,0.45)' }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-3 px-10 py-4 rounded-2xl
              bg-white text-slate-900 font-black text-base transition-all
              shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
          >
            Get Started Now
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            onClick={() => navigate('/active-course')}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            className="flex items-center gap-3 px-10 py-4 rounded-2xl
              bg-transparent border border-white/15 text-white font-bold text-base
              backdrop-blur-md transition-all"
          >
            View Curriculum
          </motion.button>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-center"
        >
          {[['15K+', 'Students'], ['200+', 'Courses'], ['98%', 'Satisfaction'], ['500+', 'Hrs Content']].map(([v, l]) => (
            <div key={l} className="flex flex-col items-center">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">{v}</span>
              <span className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">{l}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-25"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-white">Scroll</span>
        <div className="w-px h-14 bg-gradient-to-b from-purple-400 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;