

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Sparkles, Upload, FileText, LogOut,
  Brain, Loader2, Target, Briefcase, X,
  CheckCircle2, AlertTriangle, Lightbulb,
  TrendingUp, Award, MessageCircle,
  Search, Plus, Pencil, CalendarDays,
  Trash2, ArrowUpRight, Zap, Eye, EyeOff,
  Volume2, VolumeX, LayoutGrid, List,
  ChevronLeft, ChevronRight, Cpu, Activity,
  Layers, Send, ShieldCheck
} from "lucide-react";

const API = "http://localhost:5000/api";

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const NAV = [
  ["◈", "Overview", "overview"],
  ["▤", "Applications", "applications"],
  ["↑", "Upload resume", "upload"],
  ["▧", "My resumes", "resumes"],
  ["⟷", "Version history", "versions"],
  ["✧", "Resume AI", "resume-analysis"],
  ["◎", "Resume chat", "resume-chat"],
  ["⌕", "Job matcher", "job-matcher"]
];

const HERO_WORDS = [
  "reimagined.",
  "accelerated.",
  "next move.",
  "best offer."
];

const APPLICATION_STATUSES = [
  "Saved",
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn"
];

const CHAT_SUGGESTIONS = [
  "What are my strongest technical skills?",
  "Which accomplishments have the strongest measurable impact?",
  "What gaps or missing keywords should I address?",
  "Summarize my experience level and core domain strengths."
];

const ANALYSIS_STAGES = [
  "Extracting semantic resume structure...",
  "Benchmarking ATS keyword compatibility...",
  "Evaluating measurable career impact...",
  "Synthesizing intelligence report..."
];

const CARD =
  "spot glass-card bg-[#0d0d11]/85 border border-white/10 rounded-2xl";

/* ------------------------------------------------------------------ */
/*  OPTIONAL SUBTLE WEB AUDIO MICRO-FX (MUTED BY DEFAULT)              */
/* ------------------------------------------------------------------ */

function useSoundFX(enabled) {
  const ctxRef = useRef(null);

  const play = useCallback(
    (kind = "click") => {
      if (!enabled) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!ctxRef.current) ctxRef.current = new AudioCtx();
        const ctx = ctxRef.current;
        if (ctx.state === "suspended") ctx.resume();

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (kind === "success") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(780, now + 0.14);
          gain.gain.setValueAtTime(0.035, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.19);
        } else if (kind === "scan") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(460, now + 0.22);
          gain.gain.setValueAtTime(0.025, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.26);
        } else {
          osc.type = "sine";
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(260, now + 0.05);
          gain.gain.setValueAtTime(0.02, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
          osc.start(now);
          osc.stop(now + 0.06);
        }
      } catch {
        // Ignore audio errors when browser restricts AudioContext
      }
    },
    [enabled]
  );

  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return play;
}

/* ------------------------------------------------------------------ */
/*  3D INTERACTIVE NEURAL UNIVERSE & PERSPECTIVE GRID CANVAS           */
/* ------------------------------------------------------------------ */

function NeuralUniverseCanvas({ intensity = 1, showCore = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = canvas.getContext("2d");
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf;
    let t = 0;

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const pCount = isMobile ? 28 : Math.round(54 * intensity);
    const particles = Array.from({ length: pCount }, (_, i) => ({
      x: (Math.random() - 0.5) * 1400,
      y: (Math.random() - 0.5) * 900,
      z: Math.random() * 900 + 120,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.42,
      vz: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 1.8 + 0.8,
      phase: i * 0.55
    }));

    // 3D floating octahedron vertices
    const octVerts = [
      [0, 1, 0],
      [1, 0, 0],
      [0, 0, 1],
      [-1, 0, 0],
      [0, 0, -1],
      [0, -1, 0]
    ];
    const octEdges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [5, 1], [5, 2], [5, 3], [5, 4],
      [1, 2], [2, 3], [3, 4], [4, 1]
    ];

    const shapes = isMobile
      ? []
      : [
          { cx: -340, cy: -150, cz: 460, size: 54, rx: 0.4, ry: 0.7, speed: 0.006 },
          { cx: 380, cy: 140, cz: 540, size: 68, rx: 1.1, ry: 0.3, speed: -0.005 },
          { cx: 120, cy: -220, cz: 680, size: 42, rx: 0.8, ry: 1.2, speed: 0.007 }
        ];

    const onMove = (e) => {
      mouse.tx = (e.clientX / w - 0.5) * 2;
      mouse.ty = (e.clientY / h - 0.5) * 2;
    };

    const project = (x, y, z) => {
      const fov = 560;
      const scale = fov / Math.max(80, z);
      return {
        sx: w / 2 + (x - mouse.x * 55) * scale,
        sy: h / 2 + (y - mouse.y * 35) * scale,
        scale
      };
    };

    const drawGrid = () => {
      const horizonY = h * 0.62 - mouse.y * 22;
      ctx.save();
      ctx.beginPath();
      const cols = 14;
      for (let i = -cols; i <= cols; i++) {
        const xBottom = w / 2 + i * (w / 7) - mouse.x * 80;
        const xTop = w / 2 + i * 24 - mouse.x * 16;
        ctx.moveTo(xTop, horizonY);
        ctx.lineTo(xBottom, h);
      }
      for (let r = 1; r <= 7; r++) {
        const p = Math.pow(r / 7, 2.1);
        const y = horizonY + (h - horizonY) * p;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      const grad = ctx.createLinearGradient(0, horizonY, 0, h);
      grad.addColorStop(0, "rgba(239,68,68,0)");
      grad.addColorStop(0.5, "rgba(239,68,68,0.06)");
      grad.addColorStop(1, "rgba(239,68,68,0.12)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    const drawWave = () => {
      ctx.save();
      ctx.beginPath();
      const baseY = h * 0.78;
      for (let x = 0; x <= w; x += 28) {
        const y =
          baseY +
          Math.sin(x * 0.004 + t * 1.1) * 26 +
          Math.cos(x * 0.009 - t * 0.7) * 14;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(239,68,68,0.12)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      t += 0.016;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      ctx.clearRect(0, 0, w, h);

      if (!isMobile) {
        drawGrid();
        drawWave();
      }

      // 3D floating geometric wireframes
      shapes.forEach((s) => {
        s.rx += s.speed;
        s.ry += s.speed * 1.3;
        const cosX = Math.cos(s.rx);
        const sinX = Math.sin(s.rx);
        const cosY = Math.cos(s.ry);
        const sinY = Math.sin(s.ry);

        const projected = octVerts.map(([vx, vy, vz]) => {
          const y1 = vy * cosX - vz * sinX;
          const z1 = vy * sinX + vz * cosX;
          const x2 = vx * cosY + z1 * sinY;
          const z2 = -vx * sinY + z1 * cosY;
          return project(
            s.cx + x2 * s.size,
            s.cy + Math.sin(t + s.cx) * 16 + y1 * s.size,
            s.cz + z2 * s.size
          );
        });

        ctx.beginPath();
        octEdges.forEach(([a, b]) => {
          ctx.moveTo(projected[a].sx, projected[a].sy);
          ctx.lineTo(projected[b].sx, projected[b].sy);
        });
        ctx.strokeStyle = "rgba(248, 113, 113, 0.14)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 3D neural particles
      const screenPts = [];
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < -760 || p.x > 760) p.vx *= -1;
        if (p.y < -480 || p.y > 480) p.vy *= -1;
        if (p.z < 120 || p.z > 1050) p.vz *= -1;

        const pt = project(p.x, p.y, p.z);
        screenPts.push({ ...pt, p });

        const alpha = Math.max(0.12, Math.min(0.85, (1 - p.z / 1100) * (0.65 + Math.sin(t * 2 + p.phase) * 0.25)));
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, Math.max(0.8, p.r * pt.scale), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248,113,113,${alpha})`;
        ctx.fill();
      }

      if (!isMobile) {
        for (let i = 0; i < screenPts.length; i++) {
          for (let j = i + 1; j < screenPts.length; j++) {
            const a = screenPts[i];
            const b = screenPts[j];
            const dist = Math.hypot(a.sx - b.sx, a.sy - b.sy);
            if (dist < 135) {
              ctx.strokeStyle = `rgba(239,68,68,${0.13 * (1 - dist / 135)})`;
              ctx.lineWidth = 0.9;
              ctx.beginPath();
              ctx.moveTo(a.sx, a.sy);
              ctx.lineTo(b.sx, b.sy);
              ctx.stroke();
            }
          }
        }
      }

      if (showCore) {
        const cx = w * 0.28;
        const cy = h * 0.42;
        for (let ring = 0; ring < 3; ring++) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(t * (ring % 2 === 0 ? 0.35 : -0.28) + ring);
          ctx.scale(1, 0.45 + ring * 0.16);
          ctx.beginPath();
          ctx.arc(0, 0, 125 + ring * 48, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(239,68,68,${0.22 - ring * 0.05})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [intensity, showCore]);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none z-0 opacity-85"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  CUSTOM CYBER CURSOR + AMBIENT AURA (DESKTOP ONLY)                  */
/* ------------------------------------------------------------------ */

function CyberCursor() {
  const auraRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const aura = auraRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!aura || !ring || !dot) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let rx = tx;
    let ry = ty;
    let hovered = false;
    let raf;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      const interactive = e.target.closest?.("button, a, input, select, textarea, label");
      hovered = Boolean(interactive);
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const tick = () => {
      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09;
      rx += (tx - rx) * 0.22;
      ry += (ty - ry) * 0.22;

      aura.style.transform = `translate3d(${cx - 260}px, ${cy - 260}px, 0)`;
      dot.style.transform = `translate3d(${tx - 3}px, ${ty - 3}px, 0)`;
      ring.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0) scale(${hovered ? 1.45 : 1})`;
      ring.style.borderColor = hovered ? "rgba(251,146,60,0.8)" : "rgba(239,68,68,0.45)";

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={auraRef}
        className="cursor-aura fixed top-0 left-0 w-[520px] h-[520px] rounded-full pointer-events-none z-0"
      />
      <div
        ref={ringRef}
        className="hidden md:block fixed top-0 left-0 w-9 h-9 rounded-full border pointer-events-none z-[180] opacity-0 transition-opacity duration-200"
        style={{ boxShadow: "0 0 18px rgba(239,68,68,0.22)" }}
      />
      <div
        ref={dotRef}
        className="hidden md:block fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-red-400 pointer-events-none z-[181] opacity-0"
        style={{ boxShadow: "0 0 10px #ef4444" }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  MOTION & INTERACTIVE UI PRIMITIVES                                 */
/* ------------------------------------------------------------------ */

function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  as: Tag = "div",
  ...rest
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.04, rootMargin: "0px 0px -15px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${direction} ${shown ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function CountUp({ value = 0, duration = 1200 }) {
  const [n, setN] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    let raf;
    let start;
    const a = from.current;
    const b = Number(value) || 0;

    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.round(a + (b - a) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else from.current = b;
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{n}</>;
}

function Magnetic({ children, strength = 0.25, className = "" }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * strength;
    const dy = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`magnetic inline-block ${className}`}
    >
      {children}
    </div>
  );
}

function TiltCard({ children, className = "", max = 7 }) {
  const ref = useRef(null);

  const move = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
    el.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) translateY(-4px) scale(1.01)`;
  };

  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`tilt glare-card ${className}`}
    >
      {children}
    </div>
  );
}

function Typewriter({ words }) {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    let t;

    if (!deleting && txt === word) {
      t = setTimeout(() => setDeleting(true), 1700);
    } else if (deleting && txt === "") {
      setDeleting(false);
      setI((n) => n + 1);
    } else {
      t = setTimeout(
        () =>
          setTxt(
            deleting ? word.slice(0, txt.length - 1) : word.slice(0, txt.length + 1)
          ),
        deleting ? 38 : 80
      );
    }

    return () => clearTimeout(t);
  }, [txt, deleting, i, words]);

  return (
    <span className="grad-text">
      {txt}
      <span className="caret" />
    </span>
  );
}

function AIOrb({ size = 84, active = false }) {
  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full border border-red-500/35"
        style={{
          animation: `orbit-spin ${active ? "3s" : "9s"} linear infinite`
        }}
      >
        <span className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_12px_#ef4444]" />
      </div>
      <div
        className="absolute inset-2 rounded-full border border-orange-400/25 border-dashed"
        style={{
          animation: `orbit-spin ${active ? "4s" : "14s"} linear infinite reverse`
        }}
      />
      <div
        className="rounded-full bg-gradient-to-br from-red-400 via-red-600 to-black flex items-center justify-center shadow-[0_0_45px_rgba(239,68,68,0.5)] pulse-ring"
        style={{ width: size * 0.56, height: size * 0.56 }}
      >
        <Brain
          size={Math.round(size * 0.28)}
          className={`text-white ${active ? "animate-pulse" : ""}`}
        />
      </div>
    </div>
  );
}

function ScoreRing({ score = 0, size = 150, color = "#ef4444", label }) {
  const [go, setGo] = useState(false);
  const gradId = useId().replace(/:/g, "");

  useEffect(() => {
    setGo(false);
    const t = setTimeout(() => setGo(true), 110);
    return () => clearTimeout(t);
  }, [score]);

  const stroke = 9;
  const r = size / 2 - stroke - 6;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, Number(score) || 0));

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{ animation: "orbit-spin 22s linear infinite" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="3 7"
        />
      </svg>

      <svg
        width={size}
        height={size}
        style={{
          transform: "rotate(-90deg)",
          filter: `drop-shadow(0 0 14px ${color}60)`
        }}
      >
        <defs>
          <linearGradient id={`ring-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="55%" stopColor={color} />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,.07)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#ring-${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={go ? c * (1 - pct / 100) : c}
          style={{ transition: "stroke-dashoffset 1.65s cubic-bezier(.16,1,.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold leading-none tracking-tight"
          style={{ fontSize: size / 3.5, color }}
        >
          <CountUp value={pct} duration={1500} />
        </span>
        {label && (
          <span className="text-[10px] tracking-[.2em] text-gray-500 mt-1.5 font-semibold">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

function ScanningHUD({ title, stages = ANALYSIS_STAGES }) {
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStageIdx((prev) => (prev + 1) % stages.length);
    }, 1150);
    return () => clearInterval(id);
  }, [stages]);

  return (
    <div className="scan-overlay rounded-2xl border border-red-500/35 bg-[#120b0d]/90 p-7 flex flex-col sm:flex-row items-center gap-6">
      <div className="scan-beam" />
      <AIOrb size={78} active />
      <div className="flex-1 text-center sm:text-left">
        <p className="text-xs font-bold tracking-[0.22em] text-red-400">
          NEURAL ENGINE ACTIVE
        </p>
        <h4 className="text-xl font-bold mt-1">{title}</h4>
        <p key={stageIdx} className="text-sm text-gray-300 mt-2 form-pop">
          {stages[stageIdx]}
        </p>
        <div className="w-full h-1.5 rounded-full bg-white/10 mt-4 overflow-hidden relative">
          <div
            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-red-500 to-orange-400"
            style={{ animation: "bar-load 1.2s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SMALL UI PIECES & REAL-DATA SVG CHARTS                             */
/* ------------------------------------------------------------------ */

function SkillBadge({ children, type = "default", i = 0 }) {
  const styles = {
    success:
      "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20",
    danger:
      "bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20",
    default:
      "bg-[#1e1e24] border-white/10 text-gray-300 hover:border-red-500/45 hover:text-white"
  };

  return (
    <span
      className={`badge-pop inline-flex items-center border rounded-lg px-3 py-1.5 text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 ${styles[type]}`}
      style={{ animationDelay: `${Math.min(i, 20) * 35}ms` }}
    >
      {children}
    </span>
  );
}

function ResultSection({ title, icon: Icon, items, type = "default" }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <Reveal className="mt-7">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center">
          <Icon size={17} className="text-red-400 float-icon" />
        </div>
        <h4 className="font-semibold text-lg">{title}</h4>
      </div>

      {type === "list" ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="item-slide bg-[#17171c] border border-white/5 hover:border-red-500/35 rounded-xl p-4 text-gray-300 text-sm leading-relaxed"
              style={{ animationDelay: `${Math.min(index, 12) * 60}ms` }}
            >
              <span className="text-red-400 font-bold mr-2.5">
                {String(index + 1).padStart(2, "0")}.
              </span>
              {item}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <SkillBadge key={index} type={type} i={index}>
              {item}
            </SkillBadge>
          ))}
        </div>
      )}
    </Reveal>
  );
}

function PipelineChart({ applications }) {
  const counts = APPLICATION_STATUSES.map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));

  return (
    <div className={`${CARD} p-6 h-full flex flex-col justify-between`}>
      <div className="flex items-center justify-between gap-2 mb-5">
        <div>
          <p className="text-xs tracking-[0.2em] text-red-400 font-semibold">
            PIPELINE TELEMETRY
          </p>
          <h4 className="font-semibold text-lg mt-1">
            Application Funnel Distribution
          </h4>
        </div>
        <Activity size={18} className="text-red-400" />
      </div>

      {applications.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">
          Add applications to visualize your live pipeline distribution.
        </p>
      ) : (
        <div className="space-y-3">
          {counts.map(({ status, count }) => {
            const pct = Math.round((count / max) * 100);
            const highlight =
              status === "Offer"
                ? "from-emerald-400 to-emerald-600"
                : status === "Interview"
                  ? "from-amber-400 to-orange-500"
                  : status === "Rejected"
                    ? "from-red-700 to-red-900"
                    : "from-red-500 to-orange-500";
            return (
              <div key={status} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300">{status}</span>
                  <span className="text-gray-400 font-semibold">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${highlight} transition-all duration-1000`}
                    style={{ width: `${count > 0 ? Math.max(pct, 6) : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ResumeTrajectoryChart({ resumes }) {
  const scored = resumes
    .filter((r) => typeof r.analysis?.ats_score === "number")
    .slice(0, 7);

  return (
    <div className={`${CARD} p-6 h-full flex flex-col justify-between`}>
      <div className="flex items-center justify-between gap-2 mb-5">
        <div>
          <p className="text-xs tracking-[0.2em] text-red-400 font-semibold">
            ATS BENCHMARKS
          </p>
          <h4 className="font-semibold text-lg mt-1">
            Resume Score Breakdown
          </h4>
        </div>
        <TrendingUp size={18} className="text-red-400" />
      </div>

      {scored.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">
          Run AI Analysis on a resume to chart its ATS score here.
        </p>
      ) : (
        <div className="flex items-end gap-3 h-44 pt-4">
          {scored.map((r) => {
            const score = r.analysis.ats_score;
            return (
              <div
                key={r._id}
                className="flex-1 flex flex-col items-center justify-end h-full group"
              >
                <span className="text-xs font-bold text-red-300 mb-1.5">
                  {score}
                </span>
                <div className="w-full max-w-[44px] h-28 rounded-t-xl bg-white/5 flex items-end overflow-hidden border border-white/10">
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-red-700 via-red-500 to-orange-400 transition-all duration-1000 group-hover:brightness-125"
                    style={{ height: `${Math.max(8, Math.min(100, score))}%` }}
                  />
                </div>
                <span
                  className="text-[10px] text-gray-500 mt-2 truncate max-w-[66px]"
                  title={r.originalName}
                >
                  v{r.version || 1} · {r.originalName.replace(/\.pdf$/i, "")}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TYPEWRITER CHAT REPLY FOR NEWLY RECEIVED MESSAGES                  */
/* ------------------------------------------------------------------ */

function TypewriterMessage({ text, animate }) {
  const [shown, setShown] = useState(animate ? "" : text);

  useEffect(() => {
    if (!animate) {
      setShown(text);
      return;
    }
    let idx = 0;
    const step = Math.max(2, Math.ceil(text.length / 80));
    const timer = setInterval(() => {
      idx += step;
      if (idx >= text.length) {
        setShown(text);
        clearInterval(timer);
      } else {
        setShown(text.slice(0, idx));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [text, animate]);

  return (
    <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
      {shown}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  GLOBAL DESIGN & MOTION SYSTEM CSS                                  */
/* ------------------------------------------------------------------ */

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

@property --ang { syntax:'<angle>'; initial-value:0deg; inherits:false; }

.career-shell, .auth-experience { font-family:'Inter',sans-serif; }
.career-shell h1,.career-shell h2,.career-shell h3,.career-shell h4,
.auth-experience h1,.auth-experience h2,.auth-experience h3 { font-family:'Space Grotesk',sans-serif; letter-spacing:-.03em; }

.cursor-aura {
  background: radial-gradient(circle, rgba(239,68,68,.12) 0%, rgba(251,146,60,.04) 36%, transparent 70%);
  filter: blur(30px);
  will-change: transform;
}

.grad-text {
  background: linear-gradient(100deg, #fecaca, #ef4444, #fb923c, #ef4444, #fecaca);
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient-shift 5.5s linear infinite;
}
.caret {
  display: inline-block; width: 3px; height: .85em; margin-left: 6px; vertical-align: -.05em;
  background: #ef4444; box-shadow: 0 0 16px #ef4444, 0 0 32px rgba(239,68,68,.6);
  animation: blink 1s steps(1) infinite;
}
@keyframes gradient-shift { to { background-position: 250% 0; } }
@keyframes blink { 50% { opacity: 0; } }

.reveal {
  opacity: 0;
  filter: blur(6px);
  transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1), filter .8s cubic-bezier(.16,1,.3,1);
  will-change: transform, opacity, filter;
}
.reveal-up { transform: translateY(32px) scale(.98); }
.reveal-left { transform: translateX(-36px); }
.reveal-right { transform: translateX(36px); }
.reveal.is-in { opacity: 1; filter: blur(0); transform: none; }

.glass-card { backdrop-filter: blur(20px); }
.tilt { transition: transform .3s cubic-bezier(.16,1,.3,1), border-color .3s ease, box-shadow .35s ease; transform-style: preserve-3d; }
.magnetic { transition: transform .35s cubic-bezier(.16,1,.3,1); will-change: transform; }

.glare-card { position: relative; overflow: hidden; }
.glare-card::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0;
  transition: opacity .35s ease;
  background: radial-gradient(280px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,.08), transparent 55%);
}
.glare-card:hover::after { opacity: 1; }

.spot { position: relative; transition: border-color .3s ease, box-shadow .35s ease, transform .3s cubic-bezier(.16,1,.3,1); }
.spot::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0;
  transition: opacity .35s;
  background: radial-gradient(440px circle at var(--mx, 50%) var(--my, 50%), rgba(239,68,68,.15), transparent 48%);
}
.spot:hover::before { opacity: 1; }
.spot:hover { border-color: rgba(248,70,70,.38) !important; box-shadow: 0 24px 60px rgba(0,0,0,.55), 0 0 32px rgba(220,38,38,.1); }

.aura { position: relative; }
.aura::after {
  content: ''; position: absolute; inset: -1px; border-radius: inherit; padding: 1px; pointer-events: none;
  background: conic-gradient(from var(--ang), transparent 0 65%, rgba(239,68,68,.95) 84%, rgba(251,146,60,.8) 92%, transparent 100%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  animation: ang-spin 5.5s linear infinite;
}
@keyframes ang-spin { to { --ang: 360deg; } }

.career-shell button, .auth-experience button {
  position: relative; overflow: hidden;
  transition: transform .22s cubic-bezier(.16,1,.3,1), background-color .22s ease, border-color .22s ease, box-shadow .25s ease;
}
.career-shell button:hover:not(:disabled), .auth-experience button:hover:not(:disabled) { transform: translateY(-2px); }
.career-shell button:active:not(:disabled), .auth-experience button:active:not(:disabled) { transform: translateY(0) scale(.965); }

.career-shell button.bg-red-600 {
  background: linear-gradient(125deg, #ef4444, #dc2626 55%, #b91c1c);
  box-shadow: 0 8px 26px rgba(185,28,28,.3);
}
.career-shell button.bg-red-600::before, .auth-submit::before {
  content: ''; position: absolute; top: 0; left: -120%; width: 65%; height: 100%;
  background: linear-gradient(100deg, transparent, rgba(255,255,255,.26), transparent);
  transform: skewX(-20deg);
  transition: left .65s cubic-bezier(.16,1,.3,1);
}
.career-shell button.bg-red-600:hover:not(:disabled)::before, .auth-submit:hover:not(:disabled)::before { left: 150%; }
.career-shell button.bg-red-600:hover:not(:disabled) { box-shadow: 0 14px 36px rgba(220,38,38,.48); }

.ripple {
  position: absolute; border-radius: 50%; background: rgba(255,255,255,.32);
  transform: scale(0); animation: ripple .65s ease-out forwards; pointer-events: none;
}
@keyframes ripple { to { transform: scale(4); opacity: 0; } }

.career-shell input, .career-shell textarea, .career-shell select {
  background-color: rgba(255,255,255,.04) !important;
  border-color: rgba(255,255,255,.12) !important;
  transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease;
}
.career-shell input:focus, .career-shell textarea:focus, .career-shell select:focus {
  border-color: rgba(248,70,70,.85) !important;
  box-shadow: 0 0 0 4px rgba(220,38,38,.14), 0 0 28px rgba(220,38,38,.14);
  outline: none;
}
.career-shell select option { background-color: #111115; color: #fff; }
.career-shell ::selection, .auth-experience ::selection { background: rgba(239,68,68,.38); color: #fff; }

@keyframes float-y { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes pop-in { 0% { opacity: 0; transform: scale(.65) translateY(10px); } 70% { transform: scale(1.06); } 100% { opacity: 1; transform: scale(1); } }
@keyframes slide-in { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: none; } }
@keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-9px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(3px); } }
@keyframes form-pop { from { opacity: 0; transform: translateY(-12px) scale(.98); filter: blur(4px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes modal-in { from { opacity: 0; transform: scale(.94) translateY(12px); filter: blur(6px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,.48); } 100% { box-shadow: 0 0 0 20px rgba(239,68,68,0); } }
@keyframes sonar { 0% { transform: scale(.8); opacity: .7; } 100% { transform: scale(1.75); opacity: 0; } }
@keyframes bounce-dot { 0%,80%,100% { transform: translateY(0); opacity: .35; } 40% { transform: translateY(-7px); opacity: 1; } }
@keyframes msg-in { from { opacity: 0; transform: translateY(14px) scale(.96); } to { opacity: 1; transform: none; } }
@keyframes toast-in { from { opacity: 0; transform: translateY(28px) scale(.9); } to { opacity: 1; transform: none; } }
@keyframes toast-bar { from { transform: scaleX(1); } to { transform: scaleX(0); } }
@keyframes splash-out { to { opacity: 0; visibility: hidden; transform: scale(1.05); filter: blur(8px); } }
@keyframes bar-load { 0% { transform: translateX(-100%); } 100% { transform: translateX(260%); } }
@keyframes scan-beam { 0% { top: -6%; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { top: 104%; opacity: 0; } }
@keyframes orbit-spin { to { transform: rotate(360deg); } }
@keyframes auth-breathe { from { transform: translate3d(-25px,-12px,0) scale(.9); opacity: .5; } to { transform: translate3d(40px,35px,0) scale(1.16); opacity: 1; } }
@keyframes auth-rise { from { opacity: 0; transform: translateY(24px); filter: blur(5px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes avatar-spin { to { transform: rotate(360deg); } }

.float-icon { animation: float-y 3.2s ease-in-out infinite; }
.badge-pop { opacity: 0; animation: pop-in .48s cubic-bezier(.2,.9,.3,1.3) forwards; }
.item-slide { opacity: 0; animation: slide-in .5s cubic-bezier(.16,1,.3,1) forwards; transition: border-color .25s ease, transform .25s ease; }
.item-slide:hover { transform: translateX(5px); }
.shake { animation: shake .5s ease; }
.form-pop { animation: form-pop .45s cubic-bezier(.16,1,.3,1) both; }
.modal-in { animation: modal-in .32s cubic-bezier(.16,1,.3,1) both; }
.msg-in { animation: msg-in .4s cubic-bezier(.16,1,.3,1) both; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #ef4444; display: inline-block; animation: bounce-dot 1.2s infinite; }
.dot:nth-child(2) { animation-delay: .15s; }
.dot:nth-child(3) { animation-delay: .3s; }
.pulse-ring { animation: pulse-ring 2.1s ease-out infinite; }
.toast { animation: toast-in .45s cubic-bezier(.2,.9,.3,1.2) both; overflow: hidden; }
.toast-progress { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: currentColor; transform-origin: left; animation: toast-bar 3.6s linear forwards; opacity: .6; }

.scan-overlay { position: relative; overflow: hidden; }
.scan-beam {
  position: absolute; left: 0; right: 0; height: 3px; z-index: 20; pointer-events: none;
  background: linear-gradient(90deg, transparent, #ef4444, #fb923c, #ef4444, transparent);
  box-shadow: 0 0 24px 5px rgba(239,68,68,.55);
  animation: scan-beam 1.6s cubic-bezier(.4,0,.2,1) infinite;
}

.dropzone { position: relative; transition: all .32s cubic-bezier(.16,1,.3,1); overflow: hidden; }
.dropzone:hover, .dropzone.is-drag {
  background: rgba(220,38,38,.08);
  border-color: rgba(239,68,68,.88) !important;
  transform: scale(1.01);
  box-shadow: 0 0 48px rgba(220,38,38,.18) inset;
}
.dropzone:hover svg, .dropzone.is-drag svg { animation: float-y 1.3s ease-in-out infinite; }
.sonar-ring {
  position: absolute; width: 90px; height: 90px; border-radius: 50%;
  border: 1px solid rgba(239,68,68,.55); pointer-events: none; opacity: 0;
}
.dropzone:hover .sonar-ring, .dropzone.is-drag .sonar-ring { animation: sonar 1.8s ease-out infinite; }
.dropzone:hover .sonar-ring-2, .dropzone.is-drag .sonar-ring-2 { animation: sonar 1.8s .9s ease-out infinite; }

.career-shell {
  background:
    radial-gradient(ellipse at 10% 0%, rgba(220,38,38,.16), transparent 36%),
    radial-gradient(ellipse at 92% 20%, rgba(127,29,29,.14), transparent 32%),
    #050507;
}
.career-sidebar {
  position: fixed; inset: 0 auto 0 0; z-index: 50; display: flex; flex-direction: column;
  background: rgba(9,9,12,.88); border-right: 1px solid rgba(255,255,255,.08); backdrop-filter: blur(24px);
  transition: width .32s cubic-bezier(.16,1,.3,1);
}
.career-sidebar-bottom { margin-top: auto; padding: 14px; }
.career-side-link { position: relative; transition: background .25s ease, color .25s ease, transform .25s cubic-bezier(.16,1,.3,1); }
.career-side-link:hover { background: linear-gradient(90deg, rgba(220,38,38,.16), rgba(220,38,38,.025)); transform: translateX(4px) !important; }
.career-side-link.is-active { color: #fff; background: linear-gradient(90deg, rgba(220,38,38,.26), rgba(220,38,38,.04)); }
.career-side-link.is-active::before {
  content: ''; position: absolute; left: 0; top: 18%; bottom: 18%; width: 3px; border-radius: 4px;
  background: linear-gradient(180deg, #fb923c, #ef4444); box-shadow: 0 0 16px #ef4444;
  animation: pop-in .35s ease both;
}
.career-topbar {
  position: sticky; top: 0; z-index: 40; height: 74px; padding: 0 clamp(20px,4vw,52px);
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,.075); background: rgba(7,7,9,.78); backdrop-filter: blur(22px);
  transition: margin-left .32s cubic-bezier(.16,1,.3,1);
}
.career-main {
  position: relative; z-index: 10; padding: 34px clamp(20px,4vw,52px) 96px;
  transition: margin-left .32s cubic-bezier(.16,1,.3,1), width .32s cubic-bezier(.16,1,.3,1);
}
.career-main section { scroll-margin-top: 98px; }

.hero-kicker { display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border: 1px solid rgba(248,70,70,.3); border-radius: 999px; background: rgba(220,38,38,.1); font-size: 10px; letter-spacing: .2em; animation: auth-rise .7s .08s both; }
.hero-title { font-size: clamp(2.4rem, 5vw, 4.45rem); line-height: 1.04; max-width: 880px; margin-top: 14px; animation: auth-rise .85s .18s both; }
.hero-sub { max-width: 600px; font-size: 15px; line-height: 1.75; color: #9ca3af; animation: auth-rise .85s .32s both; }
.hero-actions { animation: auth-rise .85s .44s both; }

.avatar-ring { position: relative; }
.avatar-ring::before { content: ''; position: absolute; inset: -3px; border-radius: 50%; background: conic-gradient(#ef4444, transparent, #fb923c, transparent, #ef4444); animation: avatar-spin 4s linear infinite; z-index: -1; }

.scroll-bar { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 100; transform-origin: left; transform: scaleX(0); background: linear-gradient(90deg, #ef4444, #fb923c, #ef4444); box-shadow: 0 0 14px #ef4444; }
.busy-bar { position: fixed; top: 3px; left: 0; right: 0; height: 2px; z-index: 99; overflow: hidden; background: rgba(239,68,68,.12); }
.busy-bar::after { content: ''; position: absolute; inset: 0; width: 42%; background: linear-gradient(90deg, transparent, #ef4444, #fb923c, transparent); animation: bar-load 1.05s ease-in-out infinite; }
.splash { position: fixed; inset: 0; z-index: 200; background: radial-gradient(circle at center, #1b0709, #050507 65%); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; animation: splash-out .6s cubic-bezier(.16,1,.3,1) 1.05s forwards; }

@media (max-width: 900px) {
  .career-sidebar { position: relative; width: 100% !important; height: auto; border-right: 0; border-bottom: 1px solid rgba(255,255,255,.08); }
  .career-sidebar > div:first-child { padding: 14px 18px; }
  .career-sidebar > p, .career-sidebar-bottom, .sidebar-collapse-btn { display: none !important; }
  .career-sidebar nav { display: flex; overflow-x: auto; padding: 0 12px 12px; gap: 6px; }
  .career-sidebar nav button { width: auto; white-space: nowrap; padding: 9px 12px; }
  .career-topbar { margin-left: 0 !important; height: 64px; padding: 0 18px; }
  .career-main { margin-left: 0 !important; width: 100% !important; padding: 24px 16px 70px; }
}

.auth-experience { background: #050507; }
.auth-grid { background-image: linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px); background-size: 52px 52px; mask-image: radial-gradient(ellipse at center, black 35%, transparent 90%); }
.auth-glow { position: absolute; width: 540px; height: 540px; border-radius: 50%; filter: blur(110px); background: rgba(220,38,38,.18); pointer-events: none; animation: auth-breathe 8s ease-in-out infinite alternate; }
.auth-orbit { position: absolute; border: 1px solid rgba(255,255,255,.09); border-radius: 50%; animation: orbit-spin 32s linear infinite; }
.auth-orbit:before { content: ''; position: absolute; width: 9px; height: 9px; border-radius: 50%; background: #fb5555; box-shadow: 0 0 22px #ef4444; top: 12%; left: 18%; }
.auth-panel { background: linear-gradient(145deg, rgba(20,20,25,.92), rgba(9,9,12,.96)); border: 1px solid rgba(255,255,255,.11); box-shadow: 0 32px 110px rgba(0,0,0,.65), inset 0 1px rgba(255,255,255,.06); backdrop-filter: blur(26px); }
.auth-field { width: 100%; background: rgba(255,255,255,.045); border: 1px solid rgba(255,255,255,.10); border-radius: 14px; padding: 14px 16px; color: white; outline: none; transition: .25s cubic-bezier(.16,1,.3,1); }
.auth-field:focus { border-color: rgba(248,70,70,.85); box-shadow: 0 0 0 4px rgba(220,38,38,.12), 0 0 28px rgba(220,38,38,.14); background: rgba(255,255,255,.07); }
.auth-submit { background: linear-gradient(110deg, #f04444, #dc2626 55%, #b91c1c); box-shadow: 0 12px 32px rgba(185,28,28,.3); }
.auth-submit:hover:not(:disabled) { box-shadow: 0 16px 40px rgba(220,38,38,.48); }
.auth-feature { border: 1px solid rgba(255,255,255,.09); background: rgba(255,255,255,.035); backdrop-filter: blur(12px); transition: transform .35s cubic-bezier(.16,1,.3,1), border-color .3s ease, background-color .3s ease; }
.auth-feature:hover { transform: translateY(-6px); border-color: rgba(248,70,70,.45); background: rgba(239,68,68,.06); }
.auth-animate { animation: auth-rise .85s cubic-bezier(.16,1,.3,1) both; }
@media(max-width:900px) { .auth-showcase { display: none!important; } .auth-layout { grid-template-columns: 1fr!important; max-width: 520px!important; } }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1 !important; transform: none !important; filter: none !important; transition: none !important; }
  .career-shell *, .auth-experience *, .career-shell *::before, .career-shell *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
`;

/* ------------------------------------------------------------------ */
/*  APP                                                                */
/* ------------------------------------------------------------------ */

function App() {
  // AUTH STATES
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // RESUME STATES
  const [resumes, setResumes] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [analyzingResumeId, setAnalyzingResumeId] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // JOB MATCHING STATES
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [matchingResumeId, setMatchingResumeId] = useState(null);

  // RESUME VERSION COMPARISON STATES
  const [comparisonGroup, setComparisonGroup] = useState("");
  const [oldResumeId, setOldResumeId] = useState("");
  const [newResumeId, setNewResumeId] = useState("");
  const [comparisonResult, setComparisonResult] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  // RESUME CHATBOT STATES
  const [chatResumeId, setChatResumeId] = useState(null);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // JOB APPLICATION TRACKER STATES
  const [applications, setApplications] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [applicationSearch, setApplicationSearch] = useState("");
  const [applicationFilter, setApplicationFilter] = useState("All");
  const [applicationView, setApplicationView] = useState("kanban");
  const [draggedAppId, setDraggedAppId] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);
  const [applicationLoading, setApplicationLoading] = useState(false);

  // UI & IMMERSION STATES
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [toast, setToast] = useState(null);
  const [booting, setBooting] = useState(true);
  const [confirmModal, setConfirmModal] = useState(null);

  const playSound = useSoundFX(soundEnabled);

  const initialApplicationForm = {
    company: "",
    role: "",
    location: "",
    salary: "",
    jobUrl: "",
    jobDescription: "",
    status: "Saved",
    appliedDate: "",
    followUpDate: "",
    notes: "",
    resume: ""
  };

  const [applicationForm, setApplicationForm] = useState(initialApplicationForm);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`
    }),
    [token]
  );

  const notify = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    if (type === "success") playSound("success");
  };

  // LOAD RESUMES
  const loadResumes = async () => {
    try {
      const res = await axios.get(`${API}/resumes`, { headers });
      setResumes(res.data.resumes || []);
    } catch {
      setError("Could not load resumes.");
    }
  };

  // LOAD APPLICATIONS
  const loadApplications = async () => {
    try {
      const res = await axios.get(`${API}/applications`, { headers });
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
    }
  };

  // LOAD DATA AFTER LOGIN
  useEffect(() => {
    if (token) {
      loadResumes();
      loadApplications();
    }
  }, [token]);

  // SPLASH SCREEN
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1600);
    return () => clearTimeout(t);
  }, []);

  // TOAST AUTO-DISMISS
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(t);
  }, [toast]);

  // CLOSE MODALS WITH ESCAPE KEY
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowApplicationForm(false);
        setConfirmModal(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // CHAT AUTO-SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [chatMessages, chatLoading]);

  // GLOBAL SPOTLIGHT + BUTTON RIPPLE
  useEffect(() => {
    const onMove = (e) => {
      const el = e.target.closest?.(".spot");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };

    const onClick = (e) => {
      const btn = e.target.closest?.("button");
      if (!btn || btn.disabled) return;
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const dot = document.createElement("span");
      dot.className = "ripple";
      dot.style.width = dot.style.height = `${size}px`;
      dot.style.left = `${e.clientX - r.left - size / 2}px`;
      dot.style.top = `${e.clientY - r.top - size / 2}px`;
      btn.appendChild(dot);
      setTimeout(() => dot.remove(), 700);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onClick);
    };
  }, []);

  // SCROLL PROGRESS BAR
  useEffect(() => {
    if (!token) return;
    const onScroll = () => {
      const bar = document.getElementById("scroll-bar");
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [token]);

  // SCROLL SPY
  useEffect(() => {
    if (!token) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-36% 0px -55% 0px" }
    );
    NAV.forEach(([, , id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [token, analysis]);

  // OPEN ADD APPLICATION FORM
  const openApplicationForm = () => {
    playSound("click");
    setEditingApplication(null);
    setApplicationForm(initialApplicationForm);
    setShowApplicationForm(true);
  };

  // EDIT APPLICATION
  const editApplication = (application) => {
    playSound("click");
    setEditingApplication(application);
    setApplicationForm({
      ...initialApplicationForm,
      ...application,
      appliedDate: application.appliedDate
        ? application.appliedDate.slice(0, 10)
        : "",
      followUpDate: application.followUpDate
        ? application.followUpDate.slice(0, 10)
        : "",
      resume: application.resume?._id || application.resume || ""
    });
    setShowApplicationForm(true);
  };

  // SAVE APPLICATION
  const saveApplication = async (e) => {
    e.preventDefault();
    setApplicationLoading(true);
    setError("");

    try {
      const payload = {
        ...applicationForm,
        appliedDate: applicationForm.appliedDate || null,
        followUpDate: applicationForm.followUpDate || null,
        resume: applicationForm.resume || null
      };

      if (editingApplication) {
        await axios.put(
          `${API}/applications/${editingApplication._id}`,
          payload,
          { headers }
        );
      } else {
        await axios.post(`${API}/applications`, payload, { headers });
      }

      await loadApplications();
      setShowApplicationForm(false);
      setEditingApplication(null);
      setApplicationForm(initialApplicationForm);
      notify("Application saved.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save application.");
    } finally {
      setApplicationLoading(false);
    }
  };

  // UPDATE APPLICATION STATUS VIA KANBAN DRAG & DROP
  const updateApplicationStatus = async (app, newStatus) => {
    if (!app || app.status === newStatus) return;

    const previous = applications;
    setApplications((prev) =>
      prev.map((item) =>
        item._id === app._id ? { ...item, status: newStatus } : item
      )
    );

    try {
      const payload = {
        company: app.company || "",
        role: app.role || "",
        location: app.location || "",
        salary: app.salary || "",
        jobUrl: app.jobUrl || "",
        jobDescription: app.jobDescription || "",
        status: newStatus,
        appliedDate: app.appliedDate ? app.appliedDate.slice(0, 10) : null,
        followUpDate: app.followUpDate ? app.followUpDate.slice(0, 10) : null,
        notes: app.notes || "",
        resume: app.resume?._id || app.resume || null
      };

      await axios.put(`${API}/applications/${app._id}`, payload, { headers });
      notify(`Moved to ${newStatus}`);
    } catch (err) {
      setApplications(previous);
      setError(
        err.response?.data?.message || "Failed to update application status."
      );
    }
  };

  // DELETE APPLICATION (MODAL-CONFIRMED)
  const requestRemoveApplication = (app) => {
    playSound("click");
    setConfirmModal({
      title: "Delete Job Application",
      message: `Remove "${app.role}" at ${app.company}? This action cannot be undone.`,
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await axios.delete(`${API}/applications/${app._id}`, { headers });
          setApplications((prev) => prev.filter((item) => item._id !== app._id));
          notify("Application deleted.");
        } catch (err) {
          setError(
            err.response?.data?.message || "Failed to delete application."
          );
        }
      }
    });
  };

  // FILTER APPLICATIONS
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = `${app.company} ${app.role}`
      .toLowerCase()
      .includes(applicationSearch.toLowerCase());

    const matchesStatus =
      applicationFilter === "All" || app.status === applicationFilter;

    return matchesSearch && matchesStatus;
  });

  // APPLICATION STATISTICS
  const applicationStats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "Applied").length,
    interviews: applications.filter((a) => a.status === "Interview").length,
    offers: applications.filter((a) => a.status === "Offer").length
  };

  // REAL DASHBOARD METRICS
  const analyzedResumes = resumes.filter(
    (resume) => resume.analysis || resume.analysisStatus === "completed"
  );
  const scoredResumes = resumes.filter(
    (resume) => typeof resume.analysis?.ats_score === "number"
  );
  const averageResumeScore =
    scoredResumes.length > 0
      ? Math.round(
          scoredResumes.reduce((acc, r) => acc + r.analysis.ats_score, 0) /
            scoredResumes.length
        )
      : null;

  const upcomingFollowUps = applications
    .filter((app) => app.followUpDate && new Date(app.followUpDate) >= new Date())
    .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate))
    .slice(0, 4);

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    )
    .slice(0, 4);

  // Derived AI Recommendations from real user state
  const liveRecommendations = useMemo(() => {
    const recs = [];
    const activeAnalysis =
      analysis || scoredResumes[0]?.analysis || null;
    if (activeAnalysis?.improvement_suggestions?.length) {
      activeAnalysis.improvement_suggestions.slice(0, 2).forEach((s) =>
        recs.push({ tag: "RESUME AI", text: s })
      );
    }
    if (activeAnalysis?.missing_skills?.length) {
      recs.push({
        tag: "SKILL GAP",
        text: `Consider highlighting or developing: ${activeAnalysis.missing_skills
          .slice(0, 4)
          .join(", ")}.`
      });
    }
    if (upcomingFollowUps.length > 0) {
      const next = upcomingFollowUps[0];
      recs.push({
        tag: "FOLLOW-UP",
        text: `Prepare follow-up for ${next.role} at ${next.company} on ${new Date(
          next.followUpDate
        ).toLocaleDateString()}.`
      });
    }
    return recs;
  }, [analysis, scoredResumes, upcomingFollowUps]);

  const dashboardCards = [
    {
      label: "Total Resumes",
      value: resumes.length,
      icon: FileText,
      detail: `${analyzedResumes.length} AI analyzed`
    },
    {
      label: "Avg ATS Score",
      value: averageResumeScore,
      icon: Cpu,
      detail:
        scoredResumes.length > 0
          ? `Across ${scoredResumes.length} scored`
          : "Run analysis to score"
    },
    {
      label: "Applications",
      value: applicationStats.total,
      icon: Briefcase,
      detail: `${applicationStats.applied} active applied`
    },
    {
      label: "Interviews",
      value: applicationStats.interviews,
      icon: Target,
      detail: `${applicationStats.offers} offers · ${upcomingFollowUps.length} follow-ups`
    }
  ];

  // REGISTER / LOGIN
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        await axios.post(`${API}/auth/register`, form);
      }

      const res = await axios.post(`${API}/auth/login`, {
        email: form.email,
        password: form.password
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      playSound("success");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  // UPLOAD RESUME
  const processResumeFile = async (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5 MB.");
      return;
    }

    const data = new FormData();
    data.append("resume", file);

    setLoading(true);
    setError("");
    playSound("scan");

    try {
      const res = await axios.post(`${API}/resumes/upload`, data, { headers });
      await loadResumes();

      if (res.data.ragIndexed) {
        notify("Resume uploaded and indexed successfully!");
      } else {
        notify(
          "Resume uploaded, but AI indexing failed. You can retry later.",
          "warn"
        );
      }
    } catch (err) {
      console.error("Resume upload error:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Resume upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadResume = async (e) => {
    const file = e.target.files?.[0];
    await processResumeFile(file);
    e.target.value = "";
  };

  const handleDropResume = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    await processResumeFile(file);
  };

  // AI RESUME ANALYSIS
  const analyzeResume = async (id) => {
    setLoading(true);
    setAnalyzingResumeId(id);
    setError("");
    setAnalysis(null);
    setMatchResult(null);
    setSelectedResume(id);
    playSound("scan");

    setTimeout(() => {
      document.getElementById("resume-analysis")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 80);

    try {
      const res = await axios.post(
        `${API}/resumes/${id}/analyze`,
        {},
        { headers }
      );

      setAnalysis(res.data.analysis);
      await loadResumes();
      notify("AI Resume Analysis complete.");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Analysis failed."
      );
    } finally {
      setLoading(false);
      setAnalyzingResumeId(null);
    }
  };

  // JOB DESCRIPTION MATCHING
  const matchJob = async (id) => {
    if (jobDescription.trim().length < 30) {
      setError("Job description must contain at least 30 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setMatchResult(null);
    setMatchingResumeId(id);
    playSound("scan");

    try {
      const res = await axios.post(
        `${API}/resumes/${id}/match-job`,
        { jobDescription: jobDescription.trim() },
        { headers }
      );

      const result = res.data.result || {};
      // Normalize the AI service's response fields for the presentation layer.
      // The backend schema uses matched_skills, match_summary and
      // improvement_suggestions; older UI labels are mapped here without
      // changing the API contract.
      setMatchResult({
        ...result,
        matching_skills: result.matched_skills || result.matching_skills || [],
        summary: result.match_summary || result.summary || "",
        recommendations:
          result.improvement_suggestions || result.recommendations || [],
        verdict: result.recommendation || result.verdict || ""
      });
      notify("Job compatibility match complete.");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Job matching failed."
      );
    } finally {
      setLoading(false);
      setMatchingResumeId(null);
    }
  };

  // CHAT WITH RESUME
  const sendChatMessage = async (e, overrideQuestion = null) => {
    if (e) e.preventDefault();
    const raw = overrideQuestion ?? chatQuestion;
    if (!raw.trim() || !chatResumeId || chatLoading) return;

    const question = raw.trim();

    setChatMessages((prev) => [...prev, { role: "user", content: question }]);
    if (!overrideQuestion) setChatQuestion("");
    setChatLoading(true);
    setError("");
    playSound("click");

    try {
      const res = await axios.post(
        `${API}/resumes/${chatResumeId}/chat`,
        { question },
        { headers }
      );

      const result = res.data.result;

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          sources: result.sources || [],
          isNew: true
        }
      ]);
      playSound("success");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Chat request failed."
      );
    } finally {
      setChatLoading(false);
    }
  };

  // DELETE RESUME (MODAL-CONFIRMED)
  const requestDeleteResume = (resume) => {
    playSound("click");
    setConfirmModal({
      title: "Delete Resume Document",
      message: `Permanently delete "${resume.originalName}" (Version ${
        resume.version || 1
      }) and its vector index? This cannot be undone.`,
      onConfirm: async () => {
        const id = resume._id;
        setConfirmModal(null);
        setLoading(true);
        setError("");

        try {
          await axios.delete(`${API}/resumes/${id}`, { headers });

          setResumes((prev) => prev.filter((item) => item._id !== id));
          setComparisonResult(null);
          setComparisonGroup("");
          setOldResumeId("");
          setNewResumeId("");

          if (selectedResume === id) {
            setSelectedResume(null);
            setAnalysis(null);
            setMatchResult(null);
            setJobDescription("");
          }

          if (chatResumeId === id) {
            setChatResumeId(null);
            setChatMessages([]);
            setChatQuestion("");
          }

          notify("Resume deleted successfully!");
        } catch (err) {
          console.error("Delete resume error:", err);
          setError(err.response?.data?.message || "Failed to delete resume.");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // GET RESUME GROUPS
  const comparisonGroups = Object.values(
    resumes.reduce((groups, resume) => {
      if (!resume.versionGroup) return groups;
      if (!groups[resume.versionGroup]) {
        groups[resume.versionGroup] = [];
      }
      groups[resume.versionGroup].push(resume);
      return groups;
    }, {})
  )
    .filter((group) => group.length >= 2)
    .map((group) => group.sort((a, b) => (a.version || 1) - (b.version || 1)));

  const selectedComparisonGroup = comparisonGroups.find(
    (group) => group[0].versionGroup === comparisonGroup
  );

  // COMPARE RESUME VERSIONS
  const compareResumeVersions = async () => {
    if (!oldResumeId || !newResumeId || oldResumeId === newResumeId) {
      setError("Please select two different resume versions.");
      return;
    }

    setComparisonLoading(true);
    setComparisonResult(null);
    setError("");
    playSound("scan");

    try {
      const res = await axios.post(
        `${API}/resumes/compare`,
        { oldResumeId, newResumeId },
        { headers, timeout: 190000 }
      );

      setComparisonResult(res.data);
      notify("Version comparison complete.");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Resume comparison failed."
      );
    } finally {
      setComparisonLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setApplications([]);
    setToken(null);
    setResumes([]);
    setAnalysis(null);
    setMatchResult(null);
    setJobDescription("");
    setSelectedResume(null);
    setChatResumeId(null);
    setChatMessages([]);
    setChatQuestion("");
    setComparisonGroup("");
    setOldResumeId("");
    setNewResumeId("");
    setComparisonResult(null);
  };

  /* ================================================================ */
  /*  CINEMATIC SPLIT-SCREEN LOGIN / REGISTER                          */
  /* ================================================================ */
  if (!token) {
    const passLen = form.password.length;
    const passStrength =
      passLen === 0 ? 0 : passLen < 8 ? 35 : passLen < 12 ? 70 : 100;

    return (
      <div className="auth-experience min-h-screen text-white relative overflow-hidden">
        <style>{GLOBAL_CSS}</style>

        <CyberCursor />
        <NeuralUniverseCanvas intensity={1.15} showCore />
        <div className="auth-grid absolute inset-0 pointer-events-none" />
        <div className="auth-glow -top-48 -left-40" />
        <div
          className="auth-glow -bottom-64 right-0"
          style={{ animationDelay: "-4s" }}
        />

        <div className="relative z-10 min-h-screen max-w-[1440px] mx-auto px-5 py-7 lg:px-12 flex flex-col">
          <header className="flex items-center justify-between auth-animate">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-400/35 flex items-center justify-center pulse-ring">
                <Sparkles className="text-red-400" size={21} />
              </div>
              <span className="font-bold text-xl tracking-tight">
                Career<span className="text-red-400">OS</span>
                <span className="text-gray-600 text-[11px] ml-2 font-semibold tracking-widest">
                  AI LAB
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSoundEnabled((s) => !s)}
                aria-label={soundEnabled ? "Mute UI sounds" : "Enable UI sounds"}
                className="p-2.5 rounded-full border border-white/10 bg-white/[.03] text-gray-400 hover:text-white hover:border-red-500/40"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-300 border border-white/10 bg-white/[.02] backdrop-blur-md rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_12px_#34d399] animate-pulse" />
                NEURAL INTELLIGENCE ONLINE
              </div>
            </div>
          </header>

          <main className="auth-layout flex-1 grid grid-cols-[1.08fr_.92fr] items-center gap-12 lg:gap-20 max-w-6xl w-full mx-auto py-10">
            {/* LEFT SHOWCASE */}
            <section className="auth-showcase relative min-h-[600px] flex flex-col justify-center auth-animate">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="auth-orbit w-[470px] h-[470px]" />
                <div
                  className="auth-orbit w-[345px] h-[345px]"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "24s"
                  }}
                />
                <div
                  className="auth-orbit w-[215px] h-[215px]"
                  style={{ animationDuration: "18s" }}
                />
                <div className="absolute w-44 h-44 rounded-full bg-red-500/20 blur-3xl animate-pulse" />
                <div className="relative w-28 h-28 rounded-[30px] border border-red-400/40 bg-gradient-to-br from-red-500/25 to-black flex items-center justify-center shadow-[0_0_95px_rgba(220,38,38,.3)] float-icon pulse-ring">
                  <Brain size={54} className="text-red-300" />
                </div>

                {/* Floating AI intelligence telemetry chips */}
                <div className="absolute top-16 left-6 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md px-3.5 py-2 text-xs text-gray-300 flex items-center gap-2 float-icon">
                  <Cpu size={13} className="text-red-400" /> ATS Semantic Engine
                </div>
                <div
                  className="absolute top-28 right-4 rounded-xl border border-red-500/25 bg-black/60 backdrop-blur-md px-3.5 py-2 text-xs text-red-200 flex items-center gap-2 float-icon"
                  style={{ animationDelay: "1.1s" }}
                >
                  <Layers size={13} className="text-orange-400" /> Vector RAG Memory
                </div>
              </div>

              <div className="relative z-10 mt-[385px]">
                <p className="text-red-400 text-xs tracking-[.28em] font-bold mb-4">
                  NEXT-GENERATION CAREER PLATFORM
                </p>
                <h1 className="text-5xl xl:text-6xl font-bold leading-[1.05] max-w-xl">
                  YOUR CAREER. <br />
                  <Typewriter words={HERO_WORDS} />
                </h1>
                <p className="text-gray-400 text-base leading-7 mt-5 max-w-lg">
                  Decode your resume with AI, benchmark ATS compatibility,
                  converse with your document via RAG, and command your entire
                  application pipeline.
                </p>
                <div className="grid grid-cols-3 gap-3 mt-7 max-w-lg">
                  {[
                    ["01", "Deep ATS Diagnostics"],
                    ["02", "JD Match Telemetry"],
                    ["03", "Pipeline Command"]
                  ].map(([n, t], i) => (
                    <div
                      key={n}
                      className="auth-feature auth-animate rounded-xl p-3.5"
                      style={{ animationDelay: `${0.4 + i * 0.12}s` }}
                    >
                      <p className="text-red-400 text-xs font-bold">{n}</p>
                      <p className="text-gray-300 text-xs mt-1.5 leading-5">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* RIGHT AUTH GLASS CARD */}
            <section
              className="auth-panel aura auth-animate rounded-[28px] p-7 sm:p-9 w-full max-w-[470px] mx-auto"
              style={{ animationDelay: ".12s" }}
            >
              {/* Mode Switch Pill */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[.04] border border-white/10 mb-7">
                {[
                  ["Sign In", false],
                  ["Create Account", true]
                ].map(([label, regMode]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setIsRegister(regMode);
                      setError("");
                      playSound("click");
                    }}
                    className={`py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      isRegister === regMode
                        ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mb-7">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 border border-red-400/25 bg-red-500/10 text-red-300 text-[11px] font-semibold mb-4">
                  <Sparkles size={12} /> AI CAREER WORKSPACE
                </div>
                <h2
                  key={String(isRegister)}
                  className="text-3xl font-semibold form-pop"
                >
                  {isRegister ? "Initialize your profile." : "Welcome back."}
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  {isRegister
                    ? "Enter the next-generation workspace for your career."
                    : "Sign in to access your resume lab and pipeline."}
                </p>
              </div>

              <form
                key={isRegister ? "register" : "login"}
                onSubmit={handleAuth}
                className="space-y-4 form-pop"
              >
                {isRegister && (
                  <label className="block">
                    <span className="block text-[11px] font-semibold tracking-wider text-gray-400 mb-2">
                      FULL NAME
                    </span>
                    <input
                      className="auth-field"
                      placeholder="e.g. Alex Morgan"
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </label>
                )}

                <label className="block">
                  <span className="block text-[11px] font-semibold tracking-wider text-gray-400 mb-2">
                    EMAIL ADDRESS
                  </span>
                  <input
                    className="auth-field"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </label>

                <label className="block">
                  <div className="flex justify-between mb-2">
                    <span className="text-[11px] font-semibold tracking-wider text-gray-400">
                      PASSWORD
                    </span>
                    {isRegister && (
                      <span className="text-[11px] text-gray-500">
                        Min 8 characters
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      className="auth-field pr-12"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete={
                        isRegister ? "new-password" : "current-password"
                      }
                      minLength={8}
                      required
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {isRegister && passLen > 0 && (
                    <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passStrength < 50
                            ? "bg-red-500"
                            : passStrength < 90
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                        }`}
                        style={{ width: `${passStrength}%` }}
                      />
                    </div>
                  )}
                </label>

                {error && (
                  <div
                    key={error}
                    role="alert"
                    className="shake rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm px-4 py-3 flex items-center gap-2"
                  >
                    <AlertTriangle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Magnetic className="w-full pt-1">
                  <button
                    disabled={loading}
                    className="auth-submit w-full rounded-xl py-4 font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        {isRegister
                          ? "Create CareerOS Account"
                          : "Enter CareerOS"}
                        <span className="text-lg">→</span>
                      </>
                    )}
                  </button>
                </Magnetic>
              </form>

              <p className="text-center text-xs text-gray-500 mt-6 flex items-center justify-center gap-1.5">
                <ShieldCheck size={14} className="text-red-400" /> JWT Encrypted
                Session
              </p>
            </section>
          </main>

          <footer className="flex justify-between text-[11px] text-gray-600">
            <span>© 2026 CareerOS Intelligence</span>
            <span>Engineered for your next chapter.</span>
          </footer>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  AUTHENTICATED FUTURISTIC COMMAND CENTER                          */
  /* ================================================================ */
  const activeLabel =
    NAV.find((n) => n[2] === activeSection)?.[1] || "Overview";
  const busy =
    loading || comparisonLoading || chatLoading || applicationLoading;
  const sidebarWidth = sidebarCollapsed ? 86 : 260;

  return (
    <div className="career-shell min-h-screen bg-[#050507] text-white">
      <style>{GLOBAL_CSS}</style>

      <CyberCursor />
      <NeuralUniverseCanvas intensity={0.95} />
      <div id="scroll-bar" className="scroll-bar" />
      {busy && <div className="busy-bar" />}

      {/* CINEMATIC BOOT CURTAIN */}
      {booting && (
        <div className="splash">
          <AIOrb size={96} active />
          <p className="text-2xl font-bold tracking-tight">
            Career<span className="text-red-400">OS</span>
          </p>
          <p className="text-xs tracking-[0.25em] text-red-400/80">
            INITIALIZING INTELLIGENCE WORKSPACE
          </p>
          <div className="w-48 h-[3px] rounded bg-white/10 overflow-hidden relative">
            <div
              className="absolute inset-y-0 w-2/5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
              style={{ animation: "bar-load 1s ease-in-out infinite" }}
            />
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          key={toast.id}
          className={`toast fixed bottom-6 right-6 z-[170] flex items-center gap-3 rounded-2xl px-5 py-4 text-sm backdrop-blur-xl border shadow-2xl ${
            toast.type === "warn"
              ? "bg-amber-500/15 border-amber-500/35 text-amber-200"
              : "bg-emerald-500/15 border-emerald-500/35 text-emerald-200"
          }`}
        >
          {toast.type === "warn" ? (
            <AlertTriangle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{toast.message}</span>
          <div className="toast-progress" />
        </div>
      )}

      {/* CUSTOM CONFIRMATION MODAL (REPLACES window.confirm) */}
      {confirmModal && (
        <div
          className="fixed inset-0 z-[165] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setConfirmModal(null)}
        >
          <div
            className="modal-in aura glass-card bg-[#111116] border border-red-500/35 rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mb-4">
              <AlertTriangle className="text-red-400" size={22} />
            </div>
            <h4 className="text-xl font-bold">{confirmModal.title}</h4>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[.04] hover:bg-white/[.09] text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT APPLICATION MODAL */}
      {showApplicationForm && (
        <div
          className="fixed inset-0 z-[160] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowApplicationForm(false)}
        >
          <form
            onSubmit={saveApplication}
            onClick={(e) => e.stopPropagation()}
            className="modal-in aura glass-card bg-[#101014] border border-red-500/35 rounded-2xl p-6 sm:p-7 max-w-3xl w-full my-8"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-[11px] font-bold tracking-[0.22em] text-red-400">
                  PIPELINE RECORD
                </p>
                <h4 className="text-2xl font-bold mt-1">
                  {editingApplication
                    ? "Edit Application"
                    : "Add New Application"}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setShowApplicationForm(false)}
                className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-red-500/40"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                ["company", "Company Name", true],
                ["role", "Job Role", true],
                ["location", "Location", false],
                ["salary", "Salary", false],
                ["jobUrl", "Job URL", false]
              ].map(([field, placeholder, required]) => (
                <input
                  key={field}
                  type="text"
                  required={required}
                  placeholder={placeholder}
                  value={applicationForm[field]}
                  onChange={(e) =>
                    setApplicationForm({
                      ...applicationForm,
                      [field]: e.target.value
                    })
                  }
                  className="bg-[#18181d] border border-white/10 rounded-xl p-3.5 text-sm outline-none"
                />
              ))}

              <select
                value={applicationForm.status}
                onChange={(e) =>
                  setApplicationForm({
                    ...applicationForm,
                    status: e.target.value
                  })
                }
                className="bg-[#18181d] border border-white/10 rounded-xl p-3.5 text-sm outline-none"
              >
                {APPLICATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <div>
                <label className="text-gray-400 text-xs block mb-1.5">
                  Applied Date
                </label>
                <input
                  type="date"
                  value={applicationForm.appliedDate}
                  onChange={(e) =>
                    setApplicationForm({
                      ...applicationForm,
                      appliedDate: e.target.value
                    })
                  }
                  className="w-full bg-[#18181d] border border-white/10 rounded-xl p-3.5 text-sm"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs block mb-1.5">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={applicationForm.followUpDate}
                  onChange={(e) =>
                    setApplicationForm({
                      ...applicationForm,
                      followUpDate: e.target.value
                    })
                  }
                  className="w-full bg-[#18181d] border border-white/10 rounded-xl p-3.5 text-sm"
                />
              </div>

              <select
                value={applicationForm.resume}
                onChange={(e) =>
                  setApplicationForm({
                    ...applicationForm,
                    resume: e.target.value
                  })
                }
                className="md:col-span-2 bg-[#18181d] border border-white/10 rounded-xl p-3.5 text-sm"
              >
                <option value="">No linked resume</option>
                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.originalName} - Version {resume.version || 1}
                  </option>
                ))}
              </select>

              <textarea
                rows={3}
                placeholder="Job Description (optional)"
                value={applicationForm.jobDescription}
                onChange={(e) =>
                  setApplicationForm({
                    ...applicationForm,
                    jobDescription: e.target.value
                  })
                }
                className="md:col-span-2 bg-[#18181d] border border-white/10 rounded-xl p-3.5 text-sm outline-none"
              />

              <textarea
                rows={3}
                placeholder="Notes, interview details, reminders..."
                value={applicationForm.notes}
                onChange={(e) =>
                  setApplicationForm({
                    ...applicationForm,
                    notes: e.target.value
                  })
                }
                className="md:col-span-2 bg-[#18181d] border border-white/10 rounded-xl p-3.5 text-sm outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowApplicationForm(false)}
                className="px-5 py-3 rounded-xl border border-white/10 bg-white/[.04] hover:bg-white/[.08] text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={applicationLoading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
              >
                {applicationLoading && (
                  <Loader2 className="animate-spin" size={16} />
                )}
                {applicationLoading
                  ? "Saving..."
                  : editingApplication
                    ? "Update Application"
                    : "Save Application"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* COLLAPSIBLE FLOATING DARK GLASS SIDEBAR */}
      <aside
        className="career-sidebar"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="flex items-center justify-between gap-2 px-4 pt-6 pb-7">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-400 to-red-800 flex items-center justify-center shadow-lg shadow-red-950/60 pulse-ring shrink-0">
              <Sparkles size={20} className="text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-xl font-bold tracking-tight truncate">
                  Career<span className="text-red-400">OS</span>
                </p>
                <p className="text-[10px] tracking-[.22em] text-gray-500">
                  AI COMMAND
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setSidebarCollapsed((c) => !c);
              playSound("click");
            }}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="sidebar-collapse-btn p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-red-500/40 shrink-0"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={15} />
            ) : (
              <ChevronLeft size={15} />
            )}
          </button>
        </div>

        {!sidebarCollapsed && (
          <p className="px-5 mb-2.5 text-[10px] font-bold tracking-[.2em] text-gray-600">
            MODULES
          </p>
        )}

        <nav className="space-y-1 px-3">
          {NAV.map(([icon, label, id], i) => (
            <button
              key={id}
              title={label}
              onClick={() => {
                playSound("click");
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`career-side-link w-full flex items-center ${
                sidebarCollapsed ? "justify-center px-2" : "gap-3 px-4"
              } py-3 rounded-xl text-left text-sm hover:text-white ${
                activeSection === id ? "is-active" : "text-gray-400"
              }`}
              style={{
                animation: `slide-in .55s ${0.06 + i * 0.045}s cubic-bezier(.16,1,.3,1) both`
              }}
            >
              <span className="w-5 text-center text-base text-red-400 shrink-0">
                {icon}
              </span>
              {!sidebarCollapsed && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>

        <div className="career-sidebar-bottom">
          {!sidebarCollapsed && (
            <div className="rounded-2xl border border-white/[.08] bg-white/[.03] p-4 mb-3">
              <div className="flex items-center gap-2 text-xs text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                AI Core Connected
              </div>
              <p className="text-[11px] text-gray-500 leading-5 mt-1.5">
                {resumes.length} resume{resumes.length === 1 ? "" : "s"} ·{" "}
                {applications.length} tracked
              </p>
            </div>
          )}
          <button
            onClick={logout}
            title="Sign out"
            className={`w-full flex items-center ${
              sidebarCollapsed ? "justify-center" : "gap-3 px-4"
            } py-3 rounded-xl text-sm text-gray-400 hover:text-red-300 hover:bg-red-500/10`}
          >
            <LogOut size={17} />
            {!sidebarCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* TOPBAR */}
      <header
        className="career-topbar"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div>
          <p className="text-xs text-gray-500">
            WORKSPACE /{" "}
            <span
              key={activeLabel}
              className="text-red-300 uppercase inline-block form-pop font-semibold"
            >
              {activeLabel}
            </span>
          </p>
          <p className="text-sm font-semibold text-gray-200 mt-0.5">
            Career Intelligence Command
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            aria-label={soundEnabled ? "Mute UI sounds" : "Enable UI sounds"}
            title={soundEnabled ? "Sound FX On" : "Sound FX Muted"}
            className="p-2.5 rounded-full border border-white/10 bg-white/[.02] text-gray-400 hover:text-white hover:border-red-500/40"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <span className="hidden sm:inline-flex items-center gap-2 text-xs text-gray-300 border border-white/10 bg-white/[.02] rounded-full px-3.5 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {busy ? "Processing AI Task..." : "Systems Operational"}
          </span>

          <div className="avatar-ring">
            <div className="w-9 h-9 rounded-full border border-red-400/30 bg-[#150a0a] text-red-300 flex items-center justify-center text-sm font-bold">
              CO
            </div>
          </div>
        </div>
      </header>

      {/* MAIN COMMAND WORKSPACE */}
      <main
        className="career-main mx-auto"
        style={{
          marginLeft: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`
        }}
      >
        {/* HERO COMMAND HEADER */}
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/25 via-[#0b0b0f]/90 to-[#08080b]/95 p-7 sm:p-10 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <p className="hero-kicker text-red-400 tracking-widest mb-3">
                <Zap size={12} className="text-red-400" /> AI CAREER INTELLIGENCE
              </p>

              <h1 className="hero-title font-bold">
                Your career.
                <br />
                <Typewriter words={HERO_WORDS} />
              </h1>

              <p className="hero-sub mt-4">
                Analyze ATS compatibility with neural diagnostics, converse with
                your vector-indexed resumes, match roles against live job
                descriptions, and orchestrate your application pipeline.
              </p>

              <div className="hero-actions flex flex-wrap gap-3 mt-7">
                <Magnetic>
                  <button
                    onClick={() => {
                      playSound("click");
                      document
                        .getElementById("upload")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
                  >
                    <Upload size={16} /> Upload Resume
                  </button>
                </Magnetic>
                <Magnetic>
                  <button
                    onClick={openApplicationForm}
                    className="bg-white/[.05] hover:bg-white/[.1] border border-white/10 px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
                  >
                    <Plus size={16} className="text-red-400" /> Track Application
                  </button>
                </Magnetic>
                <Magnetic>
                  <button
                    onClick={() => {
                      playSound("click");
                      document
                        .getElementById("job-matcher")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-white/[.05] hover:bg-white/[.1] border border-white/10 px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
                  >
                    <Target size={16} className="text-red-400" /> Launch Matcher
                  </button>
                </Magnetic>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-4 shrink-0">
              <AIOrb size={128} active={busy} />
              <div className="rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md px-4 py-3 text-right">
                <p className="text-[10px] tracking-[0.2em] text-gray-500 font-bold">
                  LIVE READINESS
                </p>
                <p className="text-sm font-semibold text-gray-200 mt-0.5">
                  {averageResumeScore !== null
                    ? `Avg ATS Score: ${averageResumeScore}/100`
                    : `${resumes.length} Resumes · ${applicationStats.total} Apps`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div
            key={error}
            role="alert"
            className="shake bg-red-500/10 border border-red-500/35 text-red-300 p-4 rounded-xl mt-6 flex justify-between items-center gap-3 backdrop-blur-md"
          >
            <span className="text-sm flex items-center gap-2">
              <AlertTriangle size={16} /> {error}
            </span>
            <button onClick={() => setError("")} className="hover:text-white">
              <X size={18} />
            </button>
          </div>
        )}

        {/* DASHBOARD OVERVIEW & LIVE ANALYTICS */}
        <section id="overview" className="mt-12">
          <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
            <div>
              <p className="text-red-500 text-xs tracking-[0.2em] font-semibold">
                TELEMETRY OVERVIEW
              </p>
              <h3 className="text-2xl font-bold mt-1">Career Dashboard</h3>
            </div>
            <p className="text-gray-500 text-sm">
              Real-time metrics computed from your workspace
            </p>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardCards.map(({ label, value, icon: Icon, detail }, i) => (
              <Reveal key={label} delay={i * 80}>
                <TiltCard className={`${CARD} p-5 h-full`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-400 text-sm">{label}</span>
                    <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                      <Icon
                        size={18}
                        className="text-red-400 float-icon"
                        style={{ animationDelay: `${i * 0.35}s` }}
                      />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mt-4">
                    {value === null ? "—" : <CountUp value={value} />}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{detail}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          {/* DATA VISUALIZATION CHARTS */}
          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            <Reveal direction="left">
              <PipelineChart applications={applications} />
            </Reveal>
            <Reveal direction="right">
              <ResumeTrajectoryChart resumes={resumes} />
            </Reveal>
          </div>

          {/* FOLLOW-UPS, RECENT ACTIVITY & LIVE AI RECOMMENDATIONS */}
          <div className="grid lg:grid-cols-3 gap-4 mt-4">
            <Reveal direction="up" delay={40}>
              <div className={`${CARD} p-5 h-full`}>
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays size={18} className="text-red-400" />
                  <h4 className="font-semibold">Upcoming Follow-ups</h4>
                </div>
                {upcomingFollowUps.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No upcoming follow-ups scheduled.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {upcomingFollowUps.map((app, i) => (
                      <div
                        key={app._id}
                        className="item-slide flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                        style={{ animationDelay: `${i * 90}ms` }}
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">{app.company}</p>
                          <p className="text-gray-500 text-xs truncate">
                            {app.role}
                          </p>
                        </div>
                        <span className="text-red-400 text-xs font-semibold whitespace-nowrap">
                          {new Date(app.followUpDate).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal direction="up" delay={100}>
              <div className={`${CARD} p-5 h-full`}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-red-400" />
                  <h4 className="font-semibold">Recent Activity</h4>
                </div>
                {recentApplications.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Your recent applications will appear here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentApplications.map((app, i) => (
                      <div
                        key={app._id}
                        className="item-slide flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                        style={{ animationDelay: `${i * 90}ms` }}
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">{app.role}</p>
                          <p className="text-gray-500 text-xs truncate">
                            {app.company}
                          </p>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 whitespace-nowrap">
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal direction="up" delay={160}>
              <div className={`${CARD} p-5 h-full`}>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={18} className="text-red-400" />
                  <h4 className="font-semibold">AI Insights</h4>
                </div>
                {liveRecommendations.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Analyze a resume or schedule follow-ups to surface live AI
                    recommendations.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {liveRecommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-white/[.03] border border-white/5 p-3 text-xs text-gray-300 leading-relaxed"
                      >
                        <span className="text-[10px] font-bold tracking-wider text-red-400 block mb-1">
                          {rec.tag}
                        </span>
                        {rec.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* JOB APPLICATION TRACKER (KANBAN + LIST) */}
        <section id="applications" className="mt-14">
          <Reveal className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <p className="text-red-500 text-xs font-semibold tracking-[0.2em]">
                CAREER PIPELINE
              </p>
              <h3 className="text-2xl font-bold mt-1">
                Job Application Tracker
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Drag cards across stages on the Kanban board or switch to list
                view.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-xl border border-white/10 bg-[#111116] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setApplicationView("kanban");
                    playSound("click");
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    applicationView === "kanban"
                      ? "bg-red-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid size={14} /> Kanban
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setApplicationView("list");
                    playSound("click");
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    applicationView === "list"
                      ? "bg-red-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List size={14} /> List
                </button>
              </div>

              <Magnetic>
                <button
                  onClick={openApplicationForm}
                  className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl flex items-center gap-2 font-semibold text-sm"
                >
                  <Plus size={18} />
                  Add Application
                </button>
              </Magnetic>
            </div>
          </Reveal>

          {/* STATISTICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              ["Total Applications", applicationStats.total],
              ["Applied", applicationStats.applied],
              ["Interviews", applicationStats.interviews],
              ["Offers", applicationStats.offers]
            ].map(([title, value], i) => (
              <Reveal key={title} delay={i * 70}>
                <TiltCard className="spot glass-card bg-[#0d0d11]/90 border border-white/10 rounded-xl p-5 h-full">
                  <p className="text-gray-400 text-sm">{title}</p>
                  <h3 className="text-3xl font-bold mt-2">
                    <CountUp value={value} />
                  </h3>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          {/* SEARCH AND FILTER */}
          <Reveal className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-3.5 text-gray-500"
                size={18}
              />
              <input
                placeholder="Search company or role..."
                value={applicationSearch}
                onChange={(e) => setApplicationSearch(e.target.value)}
                className="w-full bg-[#111113] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none"
              />
            </div>

            <select
              value={applicationFilter}
              onChange={(e) => setApplicationFilter(e.target.value)}
              className="bg-[#111113] border border-white/10 rounded-xl px-5 py-3 text-sm outline-none"
            >
              {["All", ...APPLICATION_STATUSES].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Reveal>

          {/* KANBAN OR LIST VIEW */}
          {filteredApplications.length === 0 ? (
            <Reveal>
              <div className={`${CARD} p-10 text-center`}>
                <Briefcase
                  className="mx-auto text-red-500 mb-4 float-icon"
                  size={35}
                />
                <p className="text-gray-400">
                  No applications found. Add your first job application.
                </p>
              </div>
            </Reveal>
          ) : applicationView === "kanban" ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {APPLICATION_STATUSES.filter(
                (st) => applicationFilter === "All" || applicationFilter === st
              ).map((status) => {
                const colApps = filteredApplications.filter(
                  (a) => a.status === status
                );
                const isOver = dragOverStatus === status;
                return (
                  <div
                    key={status}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverStatus(status);
                    }}
                    onDragLeave={() => setDragOverStatus(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverStatus(null);
                      const app = applications.find(
                        (a) => a._id === draggedAppId
                      );
                      setDraggedAppId(null);
                      if (app) updateApplicationStatus(app, status);
                    }}
                    className={`min-w-[270px] w-[270px] shrink-0 rounded-2xl border p-3.5 transition-all ${
                      isOver
                        ? "border-red-500 bg-red-500/10 shadow-[0_0_25px_rgba(239,68,68,0.2)]"
                        : "border-white/10 bg-[#0c0c10]/85"
                    }`}
                  >
                    <div className="flex items-center justify-between px-1 mb-3">
                      <span className="text-xs font-bold tracking-wider uppercase text-gray-300">
                        {status}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                        {colApps.length}
                      </span>
                    </div>

                    <div className="space-y-3 min-h-[120px]">
                      {colApps.map((app) => (
                        <div
                          key={app._id}
                          draggable
                          onDragStart={() => setDraggedAppId(app._id)}
                          onDragEnd={() => {
                            setDraggedAppId(null);
                            setDragOverStatus(null);
                          }}
                          className="spot glass-card bg-[#141419] border border-white/10 hover:border-red-500/40 rounded-xl p-4 cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-xs font-bold text-red-300 shrink-0">
                                {(app.company || "?").slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-sm truncate">
                                  {app.role}
                                </p>
                                <p className="text-xs text-red-400 truncate">
                                  {app.company}
                                </p>
                              </div>
                            </div>
                          </div>

                          {(app.location || app.salary) && (
                            <p className="text-[11px] text-gray-500 mt-2.5 truncate">
                              {[app.location, app.salary]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}

                          {app.followUpDate && (
                            <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1.5">
                              <CalendarDays size={12} className="text-red-400" />
                              {app.followUpDate.slice(0, 10)}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                            {app.jobUrl ? (
                              <a
                                href={app.jobUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-red-400 hover:underline inline-flex items-center gap-1"
                              >
                                Link <ArrowUpRight size={11} />
                              </a>
                            ) : (
                              <span />
                            )}
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => editApplication(app)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-300"
                                title="Edit"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => requestRemoveApplication(app)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app, idx) => (
                <Reveal key={app._id} delay={Math.min(idx, 6) * 50}>
                  <div className="spot glass-card bg-[#0d0d11]/90 border border-white/10 hover:border-red-500/35 rounded-xl p-5">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-xs font-bold text-red-300 shrink-0">
                            {(app.company || "?").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold">{app.role}</h4>
                            <p className="text-red-400 text-sm font-medium">
                              {app.company}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 text-gray-500 text-sm mt-3">
                          {app.location && <span>{app.location}</span>}
                          {app.salary && <span>{app.salary}</span>}
                          {app.appliedDate && (
                            <span>
                              Applied: {app.appliedDate.slice(0, 10)}
                            </span>
                          )}
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 mt-4 px-3 py-1 rounded-lg text-xs border ${
                            app.status === "Offer"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : app.status === "Rejected"
                                ? "bg-red-500/10 text-red-400 border-red-500/30"
                                : app.status === "Interview"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                  : "bg-[#1f1f25] text-gray-300 border-white/10"
                          }`}
                        >
                          {(app.status === "Interview" ||
                            app.status === "Offer") && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                app.status === "Offer"
                                  ? "bg-emerald-400"
                                  : "bg-amber-400"
                              }`}
                            />
                          )}
                          {app.status}
                        </span>

                        {app.followUpDate && (
                          <p className="text-gray-400 text-sm mt-3 flex items-center gap-2">
                            <CalendarDays size={15} />
                            Follow-up: {app.followUpDate.slice(0, 10)}
                          </p>
                        )}

                        {app.notes && (
                          <p className="text-gray-400 text-sm mt-3">
                            {app.notes}
                          </p>
                        )}

                        {app.jobUrl && (
                          <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-red-400 text-sm mt-3 hover:underline"
                          >
                            View Job Posting <ArrowUpRight size={14} />
                          </a>
                        )}
                      </div>

                      <div className="flex gap-3 items-start">
                        <button
                          onClick={() => editApplication(app)}
                          className="bg-[#1e1e24] hover:bg-red-500/20 p-3 rounded-lg text-gray-300"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => requestRemoveApplication(app)}
                          className="bg-red-500/10 hover:bg-red-500/20 p-3 rounded-lg text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* DOCUMENT INTELLIGENCE UPLOAD CENTER */}
        <section id="upload" className="mt-14 grid md:grid-cols-3 gap-5">
          <Reveal direction="left" className="md:col-span-2">
            <div
              className={`${CARD} ${loading && !analyzingResumeId && !matchingResumeId ? "scan-overlay" : ""} p-7 h-full`}
            >
              {loading && !analyzingResumeId && !matchingResumeId && (
                <div className="scan-beam" />
              )}
              <div className="flex items-center gap-3 mb-5">
                <Upload className="text-red-500 float-icon" />
                <div>
                  <h3 className="text-xl font-semibold">
                    Document Intelligence Upload
                  </h3>
                  <p className="text-xs text-gray-500">
                    Automatic PDF text extraction & ChromaDB RAG vector indexing
                  </p>
                </div>
              </div>

              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDropResume}
                className={`dropzone ${isDragging ? "is-drag" : ""} border-2 border-dashed border-white/20 hover:border-red-500 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer`}
              >
                <div className="relative flex items-center justify-center mb-4">
                  <div className="sonar-ring" />
                  <div className="sonar-ring sonar-ring-2" />
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                    <FileText size={32} className="text-red-500" />
                  </div>
                </div>

                <span className="font-semibold">
                  {isDragging
                    ? "Drop PDF here to index"
                    : "Choose or Drag & Drop PDF Resume"}
                </span>

                <span className="text-gray-500 text-sm mt-2">
                  PDF format · Maximum 5 MB
                </span>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={uploadResume}
                  className="hidden"
                />
              </label>

              {loading && !analyzingResumeId && !matchingResumeId && (
                <p className="text-red-400 mt-4 flex items-center gap-2 text-sm">
                  <Loader2 className="animate-spin" size={18} />
                  Extracting PDF & building vector embeddings...
                </p>
              )}
            </div>
          </Reveal>

          <Reveal direction="right" delay={100}>
            <TiltCard
              className={`${CARD} p-7 h-full flex flex-col justify-between`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                  <FileText className="text-red-500 float-icon" size={26} />
                </div>
                <p className="text-gray-400">Indexed Documents</p>
                <h3 className="text-5xl font-bold mt-2">
                  <CountUp value={resumes.length} />
                </h3>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-500 space-y-1">
                <p>{analyzedResumes.length} AI analyzed</p>
                <p>{comparisonGroups.length} multi-version groups</p>
              </div>
            </TiltCard>
          </Reveal>
        </section>

        {/* MY RESUMES */}
        <section id="resumes" className="mt-14">
          <Reveal className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-red-500 text-xs font-semibold tracking-[0.2em]">
                DOCUMENT VAULT
              </p>
              <h3 className="text-2xl font-bold mt-1">My Resumes</h3>
            </div>
          </Reveal>

          {resumes.length === 0 ? (
            <Reveal>
              <div className={`${CARD} p-8 text-center text-gray-500`}>
                No resumes uploaded yet.
              </div>
            </Reveal>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume, idx) => (
                <Reveal key={resume._id} delay={Math.min(idx, 6) * 55}>
                  <div
                    className={`spot glass-card bg-[#0d0d11]/90 border border-white/10 rounded-xl p-5 flex flex-col lg:flex-row justify-between gap-4 ${
                      loading && selectedResume === resume._id
                        ? "scan-overlay"
                        : ""
                    }`}
                  >
                    {loading && selectedResume === resume._id && (
                      <div className="scan-beam" />
                    )}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center shrink-0">
                        <FileText
                          className="text-red-400 float-icon"
                          size={24}
                        />
                      </div>

                      <div>
                        <h4 className="font-semibold text-base">
                          {resume.originalName}
                        </h4>

                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <SkillBadge>Version {resume.version || 1}</SkillBadge>

                          {resume.isLatest !== false ? (
                            <SkillBadge type="success" i={1}>
                              Latest Version
                            </SkillBadge>
                          ) : (
                            <SkillBadge type="default" i={1}>
                              Previous Version
                            </SkillBadge>
                          )}

                          {typeof resume.analysis?.ats_score === "number" && (
                            <SkillBadge type="success" i={2}>
                              ATS {resume.analysis.ats_score}/100
                            </SkillBadge>
                          )}
                        </div>

                        <p className="text-gray-500 text-xs mt-2">
                          {(resume.fileSize / 1024).toFixed(1)} KB · Status:{" "}
                          {resume.analysisStatus}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 items-center">
                      <button
                        onClick={() => analyzeResume(resume._id)}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-sm"
                      >
                        <Brain size={16} />
                        Analyze
                      </button>

                      <button
                        onClick={() => {
                          playSound("click");
                          setSelectedResume(resume._id);
                          setMatchResult(null);
                          document
                            .getElementById("job-matcher")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        disabled={loading}
                        className="bg-[#1b1b22] border border-red-500/40 hover:bg-red-500/15 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm"
                      >
                        <Target size={16} />
                        Match Job
                      </button>

                      <button
                        onClick={() => {
                          playSound("click");
                          setChatResumeId(resume._id);
                          setChatMessages([]);
                          setChatQuestion("");
                          document
                            .getElementById("resume-chat")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        disabled={loading || chatLoading}
                        className="bg-[#1b1b22] border border-white/10 hover:border-red-500 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm"
                      >
                        <MessageCircle size={16} />
                        Chat
                      </button>

                      <button
                        onClick={() => requestDeleteResume(resume)}
                        disabled={loading || chatLoading}
                        className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* RESUME VERSION COMPARISON */}
        <Reveal
          as="section"
          id="versions"
          className={`aura glass-card ${comparisonLoading ? "scan-overlay" : ""} mt-14 bg-[#0d0d11]/90 border border-red-500/30 rounded-2xl p-7`}
        >
          {comparisonLoading && <div className="scan-beam" />}

          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-red-500 float-icon" size={28} />
            <div>
              <h3 className="text-2xl font-bold">
                Resume Version Comparison
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Compare two versions of your resume using AI.
              </p>
            </div>
          </div>

          {comparisonGroups.length === 0 ? (
            <p className="bg-[#17171c] rounded-xl p-5 text-gray-400 text-sm">
              Upload another version of an existing resume to enable AI version
              comparison.
            </p>
          ) : (
            <>
              <label className="block text-xs tracking-wider text-gray-400 mb-2">
                SELECT RESUME GROUP
              </label>

              <select
                value={comparisonGroup}
                onChange={(e) => {
                  const groupId = e.target.value;
                  const group = comparisonGroups.find(
                    (g) => g[0].versionGroup === groupId
                  );
                  setComparisonGroup(groupId);
                  setOldResumeId(group?.[0]?._id || "");
                  setNewResumeId(group?.[group.length - 1]?._id || "");
                  setComparisonResult(null);
                }}
                className="w-full bg-[#17171c] border border-white/10 rounded-xl p-4 outline-none mb-5 text-sm"
              >
                <option value="">Choose resume</option>
                {comparisonGroups.map((group, index) => (
                  <option key={index} value={group[0].versionGroup}>
                    {group[0].originalName} ({group.length} versions)
                  </option>
                ))}
              </select>

              {selectedComparisonGroup && (
                <div className="form-pop grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs tracking-wider text-gray-400 mb-2">
                      OLD VERSION
                    </label>
                    <select
                      value={oldResumeId}
                      onChange={(e) => {
                        setOldResumeId(e.target.value);
                        setComparisonResult(null);
                      }}
                      className="w-full bg-[#17171c] border border-white/10 rounded-xl p-4 outline-none text-sm"
                    >
                      {selectedComparisonGroup.map((resume) => (
                        <option key={resume._id} value={resume._id}>
                          Version {resume.version || 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs tracking-wider text-gray-400 mb-2">
                      NEW VERSION
                    </label>
                    <select
                      value={newResumeId}
                      onChange={(e) => {
                        setNewResumeId(e.target.value);
                        setComparisonResult(null);
                      }}
                      className="w-full bg-[#17171c] border border-white/10 rounded-xl p-4 outline-none text-sm"
                    >
                      {selectedComparisonGroup.map((resume) => (
                        <option key={resume._id} value={resume._id}>
                          Version {resume.version || 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button
                onClick={compareResumeVersions}
                disabled={
                  comparisonLoading ||
                  !comparisonGroup ||
                  !oldResumeId ||
                  !newResumeId ||
                  oldResumeId === newResumeId
                }
                className="mt-6 bg-red-600 hover:bg-red-700 disabled:opacity-40 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold text-sm"
              >
                {comparisonLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Comparing Versions...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Compare Versions
                  </>
                )}
              </button>
            </>
          )}

          {comparisonLoading && (
            <div className="mt-6">
              <ScanningHUD
                title="Comparing Resume Evolution"
                stages={[
                  "Aligning version skill matrices...",
                  "Computing ATS delta trajectory...",
                  "Identifying added & removed achievements..."
                ]}
              />
            </div>
          )}

          {comparisonResult?.result && (
            <div className="form-pop mt-8 border-t border-white/10 pt-7">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h4 className="text-xl font-bold">AI Comparison Results</h4>
                {typeof comparisonResult.result.new_ats_score === "number" &&
                  typeof comparisonResult.result.old_ats_score === "number" && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      Delta:{" "}
                      {comparisonResult.result.new_ats_score -
                        comparisonResult.result.old_ats_score >=
                      0
                        ? `+${
                            comparisonResult.result.new_ats_score -
                            comparisonResult.result.old_ats_score
                          }`
                        : comparisonResult.result.new_ats_score -
                          comparisonResult.result.old_ats_score}{" "}
                      pts
                    </span>
                  )}
              </div>

              <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                {comparisonResult.result.overall_summary}
              </p>

              <div className="grid md:grid-cols-2 gap-5">
                <TiltCard className="spot bg-[#17171c] border border-white/5 rounded-xl p-5 flex items-center gap-5">
                  <ScoreRing
                    score={comparisonResult.result.old_ats_score}
                    size={115}
                    color="#9ca3af"
                  />
                  <p className="text-gray-400">Old Resume ATS Score</p>
                </TiltCard>

                <TiltCard className="spot bg-[#17171c] border border-white/5 rounded-xl p-5 flex items-center gap-5">
                  <ScoreRing
                    score={comparisonResult.result.new_ats_score}
                    size={115}
                    color="#34d399"
                  />
                  <p className="text-gray-400">New Resume ATS Score</p>
                </TiltCard>
              </div>

              <ResultSection
                title="Improvements"
                icon={TrendingUp}
                items={comparisonResult.result.improvements}
                type="list"
              />
              <ResultSection
                title="New Skills"
                icon={CheckCircle2}
                items={comparisonResult.result.new_skills}
                type="success"
              />
              <ResultSection
                title="Removed Skills"
                icon={AlertTriangle}
                items={comparisonResult.result.removed_skills}
                type="danger"
              />
              <ResultSection
                title="New Information"
                icon={Lightbulb}
                items={comparisonResult.result.new_information}
                type="list"
              />
              <ResultSection
                title="Removed Information"
                icon={AlertTriangle}
                items={comparisonResult.result.removed_information}
                type="list"
              />

              <Reveal className="mt-7 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="text-emerald-400 float-icon" />
                  <h4 className="font-semibold text-emerald-400">
                    AI Recommendation
                  </h4>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {comparisonResult.result.recommendation}
                </p>
              </Reveal>

              <p className="text-gray-500 text-xs mt-5">
                ATS scores are AI-generated estimates, not actual ATS test
                results.
              </p>
            </div>
          )}
        </Reveal>

        {/* AI RESUME ANALYSIS LAB */}
        <section id="resume-analysis" className="mt-14">
          {analyzingResumeId && (
            <ScanningHUD title="Running Neural Resume Diagnostics" />
          )}

          {analysis && !analyzingResumeId && (
            <Reveal className="aura glass-card bg-[#0d0d11]/90 border border-red-500/30 rounded-2xl p-7 form-pop">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-red-500 float-icon" />
                <h3 className="text-2xl font-bold">AI Resume Analysis</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <TiltCard className="spot bg-[#17171c] border border-white/5 rounded-xl p-5 flex items-center gap-6">
                  <ScoreRing
                    score={analysis.ats_score}
                    size={145}
                    label="ATS SCORE"
                  />
                  <div>
                    <Target className="text-red-500 mb-2" />
                    <p className="text-gray-300 font-semibold">
                      ATS Readiness
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Benchmarked out of 100
                    </p>
                  </div>
                </TiltCard>

                <TiltCard className="spot bg-[#17171c] border border-white/5 rounded-xl p-5 flex flex-col justify-center">
                  <p className="text-gray-400 text-sm mb-2">Experience Level</p>
                  <h3 className="text-2xl font-bold grad-text">
                    {analysis.experience_level}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-gray-400">
                    <span>
                      Tech Skills: {(analysis.technical_skills || []).length}
                    </span>
                    <span>
                      Soft Skills: {(analysis.soft_skills || []).length}
                    </span>
                    <span>
                      Strengths: {(analysis.strengths || []).length}
                    </span>
                    <span>
                      Gaps: {(analysis.missing_skills || []).length}
                    </span>
                  </div>
                </TiltCard>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-lg mb-2">
                  Professional Summary
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {[
                ["Technical Skills", analysis.technical_skills, "default"],
                ["Soft Skills", analysis.soft_skills, "default"],
                ["Strengths", analysis.strengths, "success"],
                ["Weaknesses", analysis.weaknesses, "danger"],
                ["Missing Skills", analysis.missing_skills, "danger"],
                [
                  "Improvement Suggestions",
                  analysis.improvement_suggestions,
                  "default"
                ]
              ].map(([title, items, badgeType]) => (
                <Reveal key={title} className="mt-6">
                  <h4 className="font-semibold mb-3">{title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {(items || []).map((item, i) => (
                      <SkillBadge key={i} type={badgeType} i={i}>
                        {item}
                      </SkillBadge>
                    ))}
                  </div>
                </Reveal>
              ))}
            </Reveal>
          )}
        </section>

        {/* IMMERSIVE AI RESUME CHATBOT */}
        <Reveal
          as="section"
          id="resume-chat"
          className="aura glass-card mt-14 bg-[#0d0d11]/90 border border-red-500/30 rounded-2xl p-7"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <AIOrb size={56} active={chatLoading} />
              <div>
                <h3 className="text-2xl font-bold">AI Resume Chatbot</h3>
                <p className="text-gray-500 text-sm">
                  Converse with your vector-indexed resume using RAG citations.
                </p>
              </div>
            </div>

            {resumes.length > 0 && (
              <select
                value={chatResumeId || ""}
                onChange={(e) => {
                  setChatResumeId(e.target.value || null);
                  setChatMessages([]);
                  setChatQuestion("");
                }}
                className="bg-[#17171c] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none max-w-xs"
              >
                <option value="">Select resume for chat...</option>
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.originalName} (v{r.version || 1})
                  </option>
                ))}
              </select>
            )}
          </div>

          {!chatResumeId ? (
            <p className="text-gray-500 bg-[#17171c] p-5 rounded-xl text-sm">
              Select a resume above or click Chat on any resume card to begin.
            </p>
          ) : (
            <>
              <div className="text-emerald-400 text-xs mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                RAG Context Active:{" "}
                {resumes.find((r) => r._id === chatResumeId)?.originalName}
              </div>

              {/* Suggested Questions */}
              <div className="flex flex-wrap gap-2 mb-4">
                {CHAT_SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={chatLoading}
                    onClick={() => sendChatMessage(null, q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/[.03] hover:border-red-500/45 hover:bg-red-500/10 text-gray-300"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="bg-[#141418] border border-white/5 rounded-xl p-4 min-h-52 max-h-96 overflow-y-auto space-y-4">
                {chatMessages.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-10">
                    Ask a question below or pick one of the suggested prompts.
                  </p>
                )}

                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`msg-in p-4 rounded-xl max-w-[90%] ${
                      message.role === "user"
                        ? "bg-red-600/20 border border-red-500/25 ml-auto"
                        : "bg-[#202026] border border-white/5 mr-auto"
                    }`}
                  >
                    <p className="text-[11px] text-red-400 mb-1.5 font-semibold tracking-wider">
                      {message.role === "user" ? "YOU" : "CAREEROS AI"}
                    </p>

                    {message.role === "assistant" ? (
                      <TypewriterMessage
                        text={message.content}
                        animate={
                          Boolean(message.isNew) &&
                          index === chatMessages.length - 1
                        }
                      />
                    ) : (
                      <p className="text-gray-100 text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    )}

                    {message.sources?.length > 0 && (
                      <div className="mt-4 border-t border-white/10 pt-3 space-y-2">
                        <p className="text-[11px] text-gray-400 font-semibold">
                          RAG Source References:
                        </p>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {message.sources.map((source, i) => (
                            <div
                              key={i}
                              className="text-xs text-gray-400 bg-black/30 border border-white/5 rounded-lg p-2.5"
                            >
                              <span className="text-red-400 font-semibold">
                                Chunk {source.chunk}:
                              </span>{" "}
                              {source.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {chatLoading && (
                  <div className="msg-in bg-[#202026] border border-white/5 mr-auto rounded-xl px-5 py-4 inline-flex gap-1.5 items-center">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              <form onSubmit={sendChatMessage} className="mt-4 flex gap-3">
                <input
                  type="text"
                  placeholder="Ask a question about this resume..."
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  className="flex-1 bg-[#17171c] border border-white/10 rounded-xl p-4 text-sm text-white outline-none"
                />

                <button
                  type="submit"
                  disabled={chatLoading || !chatQuestion.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-40 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm"
                >
                  {chatLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Send size={16} /> Send
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </Reveal>

        {/* AI JOB DESCRIPTION MATCHER */}
        <Reveal
          as="section"
          id="job-matcher"
          className={`aura glass-card ${loading && matchingResumeId ? "scan-overlay" : ""} mt-14 bg-[#0d0d11]/90 border border-red-500/30 rounded-2xl p-7`}
        >
          {loading && matchingResumeId && <div className="scan-beam" />}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Target className="text-red-500 float-icon" size={28} />
              <div>
                <h3 className="text-2xl font-bold">Job Description Matcher</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Paste a target job description to evaluate compatibility.
                </p>
              </div>
            </div>

            {resumes.length > 0 && (
              <select
                value={selectedResume || resumes[0]._id}
                onChange={(e) => setSelectedResume(e.target.value)}
                className="bg-[#17171c] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none max-w-xs"
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.originalName} (v{r.version || 1})
                  </option>
                ))}
              </select>
            )}
          </div>

          {resumes.length === 0 ? (
            <p className="text-gray-500 bg-[#17171c] p-5 rounded-xl text-sm">
              Upload a resume first to use the job matcher.
            </p>
          ) : (
            <>
              <textarea
                rows={6}
                placeholder="Paste job description here (minimum 30 characters)..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-[#17171c] border border-white/10 rounded-xl p-4 text-sm text-white outline-none resize-none"
              />

              <div className="mt-4 flex flex-wrap gap-4 items-center justify-between">
                <p className="text-gray-500 text-xs">
                  {jobDescription.trim().length} / 30 min characters · Target:{" "}
                  {resumes.find(
                    (r) => r._id === (selectedResume || resumes[0]._id)
                  )?.originalName || "Active"}
                </p>

                <Magnetic>
                  <button
                    onClick={() => matchJob(selectedResume || resumes[0]._id)}
                    disabled={loading || jobDescription.trim().length < 30}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-40 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 text-sm"
                  >
                    {loading && matchingResumeId ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Matching...
                      </>
                    ) : (
                      <>
                        <Target size={18} />
                        Run Job Match
                      </>
                    )}
                  </button>
                </Magnetic>
              </div>

              {loading && matchingResumeId && (
                <div className="mt-6">
                  <ScanningHUD
                    title="Computing Role Compatibility Matrix"
                    stages={[
                      "Parsing target role requirements...",
                      "Cross-referencing resume skill graph...",
                      "Calculating match score & gaps..."
                    ]}
                  />
                </div>
              )}

              {matchResult && !(loading && matchingResumeId) && (
                <div className="form-pop mt-8 border-t border-white/10 pt-7">
                  <div className="grid md:grid-cols-2 gap-5">
                    <TiltCard className="spot bg-[#17171c] border border-white/5 rounded-xl p-5 flex items-center gap-6">
                      <ScoreRing
                        score={matchResult.match_score}
                        size={135}
                        label="MATCH"
                      />
                      <div>
                        <p className="text-gray-300 font-semibold">
                          Compatibility Score
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(matchResult.matching_skills || []).length} matched ·{" "}
                          {(matchResult.missing_skills || []).length} missing
                        </p>
                      </div>
                    </TiltCard>

                    <TiltCard className="spot bg-[#17171c] border border-white/5 rounded-xl p-5 flex flex-col justify-center">
                      <p className="text-gray-400 text-sm">Overall Fit</p>
                      <p className="text-sm leading-relaxed mt-2 text-emerald-300">
                        {matchResult.verdict || "Review the skill breakdown below."}
                      </p>
                    </TiltCard>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Match Analysis</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {matchResult.summary}
                    </p>
                  </div>

                  <ResultSection
                    title="Matching Skills"
                    icon={CheckCircle2}
                    items={matchResult.matching_skills}
                    type="success"
                  />
                  <ResultSection
                    title="Missing Skills"
                    icon={AlertTriangle}
                    items={matchResult.missing_skills}
                    type="danger"
                  />
                  <ResultSection
                    title="Relevant Experience"
                    icon={Briefcase}
                    items={matchResult.relevant_experience}
                    type="list"
                  />
                  <ResultSection
                    title="Skill Gaps"
                    icon={AlertTriangle}
                    items={matchResult.skill_gaps}
                    type="list"
                  />
                  <ResultSection
                    title="Recommendations"
                    icon={Lightbulb}
                    items={matchResult.recommendations}
                    type="list"
                  />
                </div>
              )}
            </>
          )}
        </Reveal>
      </main>
    </div>
  );
}

export default App;

