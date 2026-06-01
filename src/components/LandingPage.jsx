import { useRef, useEffect, useState } from "react";
import {
  BrainCircuit, Upload, Play, TrendingUp, TrendingDown,
  BarChart3, Lightbulb, Zap, Shield, ArrowRight,
  CheckCircle, AlertTriangle, Activity, FileText,
  ChevronDown, Lock, Eye, Cpu,
} from "lucide-react";
import { parseCSV } from "../utils/csvParser";
import { DEMO_DATA, DEMO_META } from "../data/demo_ecommerce";

/* ════════════════════════════════════════════════════════════════
   HOOKS
════════════════════════════════════════════════════════════════ */

function useTypewriter(words, typeSpeed = 80, deleteSpeed = 45, pause = 1800) {
  const [text, setText]       = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
      return;
    }
    const t = setTimeout(
      () => setText(deleting ? text.slice(0, -1) : word.slice(0, text.length + 1)),
      deleting ? deleteSpeed : typeSpeed
    );
    return () => clearTimeout(t);
  }, [text, deleting, wordIdx, words, typeSpeed, deleteSpeed, pause]);

  return text;
}

function useMouseTilt(strength = 11) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setTilt({
        x: ((e.clientY - r.top)  / r.height - 0.5) * -strength,
        y: ((e.clientX - r.left) / r.width  - 0.5) *  strength,
      });
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", () => setTilt({ x: 0, y: 0 }));
    return () => el.removeEventListener("mousemove", onMove);
  }, [strength]);

  return { ref, tilt };
}

function useCountUp(target, duration = 1800) {
  const elRef    = useRef(null);
  const started  = useRef(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (elRef.current) obs.observe(elRef.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return { value, ref: elRef };
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return y;
}

/* ════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
════════════════════════════════════════════════════════════════ */

/* Animated counter */
function Counter({ target, prefix = "", suffix = "" }) {
  const { value, ref } = useCountUp(target);
  return <span ref={ref}>{prefix}{value.toLocaleString()}{suffix}</span>;
}

/* Horizontal marquee row */
function MarqueeRow({ items, reverse = false }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div className={`flex gap-3 whitespace-nowrap ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-4 py-2 glass border border-slate-700/50 rounded-full text-slate-400 text-sm flex-shrink-0"
          >
            <CheckCircle size={11} className="text-indigo-400 flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Dashboard mockup card — receives tilt from parent */
function DashboardPreview({ tilt }) {
  const bars = [42, 39, 51, 48, 56, 61, 28, 31, 30, 35, 34, 40];
  return (
    <div
      className="glass border border-slate-700/60 rounded-2xl p-5 shadow-2xl glow-border"
      style={{
        transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.12s ease-out",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-white text-sm font-semibold">E-Commerce Sales — Jan–Jun 2024</span>
        <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
          Done
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Revenue", value: "297K", change: "+44.7%", up: true  },
          { label: "Orders",  value: "4.2K", change: "+42.3%", up: true  },
          { label: "Returns", value: "228",  change: "-25%",   up: false },
        ].map((k) => (
          <div key={k.label} className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/40">
            <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">{k.label}</p>
            <p className="text-white text-xl font-bold font-mono">{k.value}</p>
            <div className={`flex items-center gap-1 text-xs mt-0.5 ${k.up ? "text-emerald-400" : "text-red-400"}`}>
              {k.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {k.change}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-700/30">
        <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Trend</p>
        <div className="flex items-end gap-1 h-14">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${(h / 61) * 100}%`,
                background: i % 2 === 0
                  ? "linear-gradient(to top,#4f46e5,#818cf8)"
                  : "linear-gradient(to top,#059669,#34d399)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="bg-indigo-900/30 border border-indigo-700/40 rounded-xl p-3">
        <div className="flex items-start gap-3">
          <Activity size={15} className="text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-white text-xs leading-relaxed flex-1">
            Electronics grew 44.7% over 6 months while Apparel returns signal a quality issue.
          </p>
          <div className="text-right flex-shrink-0">
            <p className="text-slate-500 text-xs">Health</p>
            <p className="text-emerald-400 text-xl font-bold font-mono">72</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 3D-tilt feature card */
function FeatureCard({ icon: Icon, color, title, description }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        setTilt({
          x: ((e.clientY - r.top)  / r.height - 0.5) * -7,
          y: ((e.clientX - r.left) / r.width  - 0.5) *  7,
        });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="glass border border-slate-700/50 rounded-2xl p-5 hover:border-indigo-500/40 transition-colors duration-300 cursor-default"
      style={{
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.1s ease-out, border-color 0.3s",
      }}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

/* Numbered step */
function Step({ number, icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
          <Icon size={28} className="text-indigo-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-indigo-500/40">
          {number}
        </div>
        {number === 1 && (
          <div className="absolute inset-0 rounded-2xl animate-ping-slow border border-indigo-400/40" />
        )}
      </div>
      <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed max-w-[210px]">{description}</p>
    </div>
  );
}

/* Sticky bottom CTA bar */
function StickyBar({ visible, onDemo, onUpload }) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="glass border-t border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 flex-1">
            <BrainCircuit size={16} className="text-indigo-400" />
            <p className="text-white text-sm font-medium">Auto-Analyst — upload any CSV, get AI insights instantly</p>
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={onDemo}
              className="flex items-center gap-1.5 px-4 py-2.5 btn-shine text-white rounded-xl text-sm font-semibold btn-glow"
            >
              <Play size={13} /> Try Demo — Free
            </button>
            <button
              onClick={onUpload}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white/8 hover:bg-white/15 text-white border border-white/10 rounded-xl text-sm transition-all"
            >
              <Upload size={13} /> Upload CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════ */

const MARQUEE_1 = ["Excel exports","Google Sheets","Kaggle datasets","Sales reports","Analytics exports","Financial data","Operations data","HR reports"];
const MARQUEE_2 = ["E-commerce data","Marketing metrics","Product data","Support tickets","Revenue sheets","Inventory CSV","Web analytics","CRM exports"];

const FEATURES = [
  { icon: BarChart3,     color: "bg-indigo-600",  title: "KPI Cards",          description: "Auto-detects every numeric column. Shows total, trend direction, and change percentage." },
  { icon: TrendingUp,    color: "bg-violet-600",  title: "Trend Chart",         description: "A line chart over time so you can see when things went up, down, or sideways." },
  { icon: Lightbulb,     color: "bg-amber-600",   title: "Key Insights",        description: "Three or more specific observations backed by real numbers from your data." },
  { icon: AlertTriangle, color: "bg-red-600",     title: "Risk Flags",          description: "Anomaly detection flags values more than two standard deviations from normal." },
  { icon: Zap,           color: "bg-emerald-600", title: "Recommended Actions", description: "Concrete, specific next steps written by AI based on what the data shows." },
  { icon: Activity,      color: "bg-cyan-600",    title: "Health Score",        description: "A 0-100 score telling you at a glance how healthy the overall data looks." },
  { icon: Shield,        color: "bg-slate-600",   title: "Private by Design",   description: "Your raw data never leaves your browser. Only statistics reach the AI." },
  { icon: FileText,      color: "bg-pink-600",    title: "Category Breakdown",  description: "If your CSV has text columns, the AI groups and compares metrics by category." },
];

export default function LandingPage({ onData }) {
  const inputRef = useRef();
  const scrollY  = useScrollY();
  const { ref: tiltRef, tilt } = useMouseTilt(12);
  const typeText = useTypewriter(["Sales Data","Analytics","Any CSV","Reports","Spreadsheets"]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const rows = await parseCSV(file);
      if (!rows || rows.length === 0) throw new Error("File is empty or unreadable.");
      onData(rows, file.name.replace(/\.csv$/i, ""));
    } catch (err) {
      alert("Could not read file: " + err.message);
    }
  };

  const loadDemo   = () => onData(DEMO_DATA, DEMO_META.name);
  const openUpload = () => inputRef.current.click();

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ── Ambient background ──────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="animate-orb-a absolute top-[-200px] right-[-100px] w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,.22) 0%,transparent 70%)" }} />
        <div className="animate-orb-b absolute bottom-[-150px] left-[-150px] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(139,92,246,.18) 0%,transparent 70%)" }} />
        <div className="animate-orb-c absolute top-[40%] left-[35%] w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(16,185,129,.08) 0%,transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
      </div>

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="relative z-20 border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <BrainCircuit size={22} className="text-indigo-400" />
              <div className="absolute inset-0 animate-ping-slow rounded-full bg-indigo-400 opacity-20" />
            </div>
            <span className="text-white font-bold tracking-tight">Auto-Analyst</span>
          </div>

          {/* Trust badges */}
          <div className="hidden md:flex items-center gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Lock size={11} className="text-emerald-500" /> No login needed</span>
            <span className="flex items-center gap-1.5"><Shield size={11} className="text-indigo-400" /> 100% private</span>
            <span className="flex items-center gap-1.5"><Zap size={11} className="text-amber-400" /> Instant results</span>
          </div>

          {/* Header CTA */}
          <button
            onClick={loadDemo}
            className="flex items-center gap-2 px-4 py-2 btn-shine text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-transform"
          >
            Try Free <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: copy ─────────────────────────────────── */}
          <div>
            {/* Live badge */}
            <div className="animate-slide-up inline-flex items-center gap-2 px-3 py-1.5 mb-7 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-indigo-400" />
              </span>
              Powered by OpenAI GPT-4o
            </div>

            {/* Headline with typewriter */}
            <h1 className="animate-slide-up-1 text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Upload Your
              <br />
              <span className="shimmer-text">
                {typeText}
                <span className="animate-blink not-shimmer" style={{ WebkitTextFillColor: "#a5b4fc" }}>|</span>
              </span>
              <br />
              Get AI Insights.
            </h1>

            {/* Sub */}
            <p className="animate-slide-up-2 text-slate-400 text-lg leading-relaxed mb-10 max-w-[480px]">
              Drop any CSV and Auto-Analyst writes a complete business report — KPI cards, trend chart, key findings, risk flags, and recommended actions — all AI-generated in seconds. No setup. No login.
            </p>

            {/* CTAs — directional */}
            <div className="animate-slide-up-3 relative flex flex-wrap gap-3 mb-10">
              {/* "Start here" annotation */}
              <div className="absolute -top-10 left-1 flex items-center gap-1.5 pointer-events-none select-none">
                <svg width="32" height="26" viewBox="0 0 32 26" fill="none" className="text-yellow-400 -rotate-6">
                  <path d="M4 4 C10 12 18 18 27 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" />
                  <path d="M27 22 L22 17 M27 22 L22 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-yellow-400 text-xs font-semibold -rotate-2">Click here first</span>
              </div>

              <button
                onClick={loadDemo}
                className="relative flex items-center gap-2 px-7 py-3.5 btn-shine text-white rounded-xl font-bold text-sm btn-glow hover:-translate-y-0.5 transition-transform"
              >
                <Play size={16} />
                Try Demo — Free
                <ArrowRight size={14} />
              </button>

              <button
                onClick={openUpload}
                className="flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
              >
                <Upload size={16} />
                Upload Your CSV
              </button>
            </div>

            {/* Trust micro row */}
            <div className="animate-slide-up-4 flex flex-wrap gap-5 mb-8">
              {[
                { icon: CheckCircle, text: "No login required",          color: "text-emerald-500" },
                { icon: Lock,        text: "Data stays in your browser", color: "text-indigo-400"  },
                { icon: Zap,         text: "Results in under 10 seconds", color: "text-amber-400"  },
              ].map(({ icon: Icon, text, color }) => (
                <span key={text} className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Icon size={13} className={color} />
                  {text}
                </span>
              ))}
            </div>

            {/* Built-with strip */}
            <div className="animate-fade-in flex items-center gap-3 pt-5 border-t border-white/5">
              <span className="text-slate-600 text-xs">Built with</span>
              {["OpenAI","React","Supabase","Vite"].map((t) => (
                <span key={t} className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/50 rounded-lg text-slate-400 text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: interactive 3D preview ───────────────── */}
          <div ref={tiltRef} className="hidden lg:block animate-fade-in">
            <div className="relative h-[530px]">

              {/* Main dashboard — tilts with mouse */}
              <div className="absolute inset-x-0 top-0 animate-float">
                <DashboardPreview tilt={tilt} />
              </div>

              {/* Floating: risk */}
              <div className="absolute -left-10 top-[37%] animate-float-alt z-10">
                <div className="glass border border-red-800/60 rounded-xl px-3 py-2.5 shadow-xl">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle size={11} className="text-red-400" />
                    <p className="text-red-400 text-xs font-semibold">Risk Flag</p>
                  </div>
                  <p className="text-slate-300 text-xs">Apparel returns trending up</p>
                </div>
              </div>

              {/* Floating: action */}
              <div className="absolute -left-4 bottom-12 animate-float-slow z-10">
                <div className="glass border border-emerald-700/50 rounded-xl px-3 py-2.5 shadow-xl glow-border-emerald">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap size={11} className="text-emerald-400" />
                    <p className="text-emerald-400 text-xs font-semibold">Action</p>
                  </div>
                  <p className="text-slate-300 text-xs">Increase Electronics inventory Q3</p>
                </div>
              </div>

              {/* Floating: health score */}
              <div className="absolute right-2 bottom-6 animate-float z-10" style={{ animationDelay: "1.5s" }}>
                <div className="glass border border-indigo-700/50 rounded-xl px-4 py-3 shadow-xl glow-border">
                  <p className="text-slate-500 text-xs mb-1">Business Health</p>
                  <p className="text-emerald-400 text-3xl font-black font-mono leading-none">72</p>
                  <p className="text-slate-600 text-xs">out of 100</p>
                </div>
              </div>

              {/* Hover hint */}
              <p className="absolute bottom-0 left-0 right-0 text-center text-slate-600 text-xs">
                Move your mouse over the card
              </p>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="flex flex-col items-center mt-16 gap-2 opacity-40">
          <p className="text-slate-500 text-xs uppercase tracking-widest">Scroll to learn more</p>
          <ChevronDown size={18} className="text-slate-500 animate-bounce" />
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────── */}
      <section className="relative z-10 border-y border-white/5 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { target:10,  prefix:"< ", suffix:"s",   label:"Average analysis time" },
              { target:100, prefix:"",   suffix:"%",   label:"Free to use"           },
              { target:4,   prefix:"",   suffix:"",    label:"AI report sections"    },
              { target:0,   prefix:"",   suffix:" setup", label:"Required to start"  },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-white text-4xl font-black mb-1">
                  <Counter target={s.target} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="text-slate-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────── */}
      <section className="relative z-10 py-8 space-y-3 overflow-hidden border-b border-white/5">
        <p className="text-center text-slate-600 text-xs uppercase tracking-widest mb-5">Works with data from</p>
        <MarqueeRow items={MARQUEE_1} />
        <MarqueeRow items={MARQUEE_2} reverse />
      </section>

      {/* ── TRUST / SECURITY ────────────────────────────────── */}
      <section className="relative z-10 border-b border-white/5 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-slate-500 text-xs uppercase tracking-widest mb-10">Why you can trust it</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Lock,   title: "Data never leaves your browser", sub: "Only anonymous statistics go to the AI — your raw rows stay on your machine." },
              { icon: Shield, title: "No account, no tracking",        sub: "Nothing is stored. Refresh the page and everything is gone."                  },
              { icon: Eye,    title: "Fully open source",              sub: "The full source code is public on GitHub. Nothing hidden, nothing shady."      },
              { icon: Cpu,    title: "OpenAI GPT-4o inside",           sub: "The same model trusted by millions of professionals — running your report."    },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="glass border border-slate-700/50 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-indigo-400" />
                </div>
                <p className="text-white text-sm font-semibold mb-1.5">{title}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl font-bold text-white mb-3">Three steps. That is all.</h2>
          <p className="text-slate-400 max-w-md mx-auto">Follow these steps. The whole process takes under 30 seconds.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 relative">
          {/* Connector */}
          <div className="hidden md:block absolute top-8 left-[calc(33%-24px)] right-[calc(33%-24px)] h-px bg-gradient-to-r from-indigo-500/40 via-violet-500/60 to-indigo-500/40" />

          <Step number={1} icon={Upload}       title="Upload your data"   description='Click "Try Demo — Free" to load sample data instantly, or click "Upload Your CSV" to use your own file.' />
          <Step number={2} icon={BrainCircuit}  title="AI reads it"        description="Your statistics are computed in your browser, then a structured summary is sent to OpenAI for analysis." />
          <Step number={3} icon={FileText}      title="Read your report"   description="A full business report appears: KPI cards, trend chart, findings, recommended actions, risk flags, and a health score." />
        </div>

        {/* Directional CTA below steps */}
        <div className="text-center mt-16">
          <p className="text-slate-500 text-sm mb-5">That is it. Try it now — it is completely free.</p>
          <button
            onClick={loadDemo}
            className="inline-flex items-center gap-2 px-8 py-4 btn-shine text-white rounded-xl font-bold btn-glow hover:-translate-y-0.5 transition-transform"
          >
            <Play size={18} />
            Try Demo Now — Free
            <ArrowRight size={16} />
          </button>
          <p className="text-slate-600 text-xs mt-4">No signup. No credit card. Results in under 10 seconds.</p>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-3">What You Get</p>
          <h2 className="text-3xl font-bold text-white mb-3">A full analyst report. In seconds.</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Everything a senior business analyst would write — done by AI the moment you upload.
            Hover over each card to interact.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-28 text-center">
        <div className="glass border border-indigo-500/20 rounded-3xl p-12 glow-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle size={12} className="text-emerald-400" />
            Free — no card, no signup, no waiting
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            See your data
            <br />
            <span className="shimmer-text">like never before.</span>
          </h2>
          <p className="text-slate-400 mb-8">
            Drop a CSV. Read your AI-written business report. Done.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={loadDemo}
              className="flex items-center gap-2 px-8 py-4 btn-shine text-white rounded-xl font-bold text-base btn-glow hover:-translate-y-0.5 transition-transform"
            >
              <Play size={18} />
              Start Analyzing — Free
            </button>
            <button
              onClick={openUpload}
              className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5"
            >
              <Upload size={18} />
              Upload CSV
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrainCircuit size={16} className="text-indigo-400" />
            <span className="text-slate-500 text-sm">Auto-Analyst</span>
          </div>
          <p className="text-slate-600 text-sm">
            Made by Salik Ahmed —{" "}
            <a href="mailto:salikahmed595@gmail.com" className="text-slate-500 hover:text-white transition-colors">
              salikahmed595@gmail.com
            </a>{" "}
            for Careem demo project
          </p>
          <a
            href="https://github.com/salikahmed595/Careem-Project"
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 hover:text-white text-sm transition-colors"
          >
            View source on GitHub
          </a>
        </div>
      </footer>

      {/* Sticky bottom bar — appears after scrolling past hero */}
      <StickyBar visible={scrollY > 700} onDemo={loadDemo} onUpload={openUpload} />

      <input ref={inputRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
    </div>
  );
}
