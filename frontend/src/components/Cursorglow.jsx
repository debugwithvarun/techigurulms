import { useEffect, useRef } from 'react';

// ── Global Cursor Glow System ───────────────────────────────────────────────────
// Drop <CursorGlow /> once in Home.jsx — it injects a single canvas that covers
// the entire page and renders: magnetic dot + lagging ring + gravitational trails.
// All other sections just benefit automatically.

const CursorGlow = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth;
    let H = document.documentElement.scrollHeight;
    canvas.width  = W;
    canvas.height = H;

    const mouse   = { x: -999, y: -999, px: -999, py: -999 };
    const dot     = { x: -999, y: -999 };   // magnetic dot (near-instant)
    const ring    = { x: -999, y: -999 };   // lagging ring
    const trails  = [];
    let   raf;
    let   lastTrail = 0;

    const resize = () => {
      W = window.innerWidth;
      H = document.documentElement.scrollHeight;
      canvas.width  = W;
      canvas.height = H;
    };

    const onMove = (e) => {
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x  = e.clientX;
      mouse.y  = e.clientY + window.scrollY;
    };

    const onScroll = () => {
      // Recompute canvas height on scroll (content may expand)
      const newH = document.documentElement.scrollHeight;
      if (newH !== H) { H = newH; canvas.height = H; }
    };

    const addTrail = () => {
      const now = Date.now();
      if (now - lastTrail < 35) return;
      lastTrail = now;
      const speed = Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py);
      if (speed < 2) return;
      trails.push({
        x:     mouse.x,
        y:     mouse.y,
        vx:    (Math.random() - 0.5) * 1.2,
        vy:    (Math.random() - 0.5) * 1.2,
        r:     Math.random() * 3 + 1.5,
        life:  1,
        decay: 0.022 + Math.random() * 0.018,
      });
      if (trails.length > 45) trails.shift();
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);

      // ── Dot follows mouse almost instantly
      dot.x += (mouse.x - dot.x) * 0.55;
      dot.y += (mouse.y - dot.y) * 0.55;

      // ── Ring lags behind with spring
      ring.x += (mouse.x - ring.x) * 0.1;
      ring.y += (mouse.y - ring.y) * 0.1;

      addTrail();

      // ── Draw trails
      for (let i = trails.length - 1; i >= 0; i--) {
        const t = trails[i];
        t.x   += t.vx; t.y += t.vy;
        t.vx  *= 0.95; t.vy *= 0.95;
        t.life -= t.decay;
        if (t.life <= 0) { trails.splice(i, 1); continue; }

        // Trail dot
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r * t.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${t.life * 0.5})`;
        ctx.fill();

        // Soft glow halo
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r * 5 * t.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,85,247,${t.life * 0.04})`;
        ctx.fill();
      }

      // ── Outer ring (lagging)
      if (ring.x > 0) {
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, 20, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(139,92,246,0.35)';
        ctx.lineWidth   = 1;
        ctx.stroke();

        // Second ring — slightly larger, dimmer
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, 32, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(168,85,247,0.12)';
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      }

      // ── Inner dot
      if (dot.x > 0) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(192,132,252,0.9)';
        ctx.fill();

        // Dot glow
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139,92,246,0.12)';
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };

    loop();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll',    onScroll, { passive: true });
    window.addEventListener('resize',    resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll',    onScroll);
      window.removeEventListener('resize',    resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        zIndex:        9999,
        mixBlendMode:  'screen',
      }}
    />
  );
};

export default CursorGlow;