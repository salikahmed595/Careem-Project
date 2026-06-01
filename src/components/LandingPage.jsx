import { useRef } from "react";
import {
  BrainCircuit, Upload, Play, TrendingUp, TrendingDown,
  BarChart3, Lightbulb, Zap, Shield, ArrowRight,
  CheckCircle, AlertTriangle, Activity, FileText,
} from "lucide-react";
import { parseCSV } from "../utils/csvParser";
import { DEMO_DATA, DEMO_META } from "../data/demo_ecommerce";

/* ─── Floating dashboard preview ───────────────────────────── */
function DashboardPreview() {
  const bars = [42, 39, 51, 48, 56, 61, 28, 31, 30, 35, 34, 40];
  const max  = 61;

  return (
    <div className="relative w-full h-[540px] select-none pointer-events-none">

      {/* Main card */}
      <div
        className="absolute inset-x-0 top-0 glass border border-slate-700/60 rounded-2xl p-5 shadow-2xl glow-border animate-float"
        style={{ transform: "perspective(1100px) rotateX(4deg) rotateY(-7deg)" }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-white text-sm font-semibold">E-Commerce Sales — Jan–Jun 2024</span>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium">
            Analysis complete
          </span>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Revenue",   value: "297K", change: "+44.7%", up: true  },
            { label: "Orders",    value: "4.2K",  change: "+42.3%", up: true  },
            { label: "Returns",   value: "228",   change: "-25%",   up: false },
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

        {/* Mini bar chart */}
        <div className="bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-700/30">
          <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Trend Overview</p>
          <div className="flex items-end gap-1 h-14">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all"
                style={{
                  height: `${(h / max) * 100}%`,
                  background: i % 2 === 0
                    ? "linear-gradient(to top,#4f46e5,#818cf8)"
                    : "linear-gradient(to top,#059669,#34d399)",
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
        </div>

        {/* Headline insight */}
        <div className="bg-indigo-900/30 border border-indigo-700/40 rounded-xl p-3">
          <div className="flex items-start gap-3">
            <Activity size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-white text-xs leading-relaxed flex-1">
              Electronics revenue grew 44.7% over 6 months while Apparel return rates signal a quality issue requiring immediate action.
            </p>
            <div className="text-right flex-shrink-0">
              <p className="text-slate-500 text-xs">Health</p>
              <p className="text-emerald-400 text-xl font-bold font-mono">72</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge — Risk flag */}
      <div className="absolute -left-6 top-[38%] animate-float-alt z-10">
        <div className="glass border border-red-800/60 rounded-xl px-3 py-2 shadow-xl">
          <div className="flex items-center gap-1.5 mb-0.5">
            <AlertTriangle size={11} className="text-red-400" />
            <p className="text-red-400 text-xs font-semibold">Risk Flag</p>
          </div>
          <p className="text-slate-300 text-xs">Apparel returns trending up</p>
        </div>
      </div>

      {/* Floating badge — Action */}
      <div className="absolute -left-3 bottom-10 animate-float-slow z-10">
        <div className="glass border border-emerald-700/50 rounded-xl px-3 py-2 shadow-xl glow-border-emerald">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Zap size={11} className="text-emerald-400" />
            <p className="text-emerald-400 text-xs font-semibold">Action</p>
          </div>
          <p className="text-slate-300 text-xs">Increase Electronics inventory Q3</p>
        </div>
      </div>
    </div>
  );
}

/* ─── How it works step ─────────────────────────────────────── */
function Step({ number, icon: Icon, title, description, delay }) {
  return (
    <div className="animate-slide-up flex flex-col items-center text-center" style={{ animationDelay: delay }}>
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
          <Icon size={28} className="text-indigo-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
          {number}
        </div>
      </div>
      <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed max-w-[220px]">{description}</p>
    </div>
  );
}

/* ─── Feature card ──────────────────────────────────────────── */
function FeatureCard({ icon: Icon, color, title, description }) {
  return (
    <div className="glass border border-slate-700/50 rounded-2xl p-5 hover:border-indigo-500/30 transition-all duration-300 group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function LandingPage({ onData }) {
  const inputRef = useRef();

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

  const loadDemo = () => onData(DEMO_DATA, DEMO_META.name);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ── Ambient background ──────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="animate-orb-a absolute top-[-200px] right-[-100px] w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)" }} />
        <div className="animate-orb-b absolute bottom-[-150px] left-[-150px] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)" }} />
        <div className="animate-orb-c absolute top-[40%] left-[35%] w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)" }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="relative z-20 border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <BrainCircuit size={22} className="text-indigo-400" />
              <div className="absolute inset-0 animate-ping-slow rounded-full bg-indigo-400 opacity-20" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">Auto-Analyst</span>
          </div>
          <button
            onClick={loadDemo}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            Try Demo <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div>
            {/* Badge */}
            <div className="animate-slide-up inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
              </span>
              Powered by OpenAI GPT-4o
            </div>

            {/* Headline */}
            <h1 className="animate-slide-up-1 text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Upload Any Data.
              <br />
              <span className="shimmer-text">Get AI Insights.</span>
              <br />
              Instantly.
            </h1>

            {/* Sub */}
            <p className="animate-slide-up-2 text-slate-400 text-lg leading-relaxed mb-8 max-w-[480px]">
              Drop any CSV file and Auto-Analyst writes a complete business report for you — KPI cards, trend charts, findings, risk flags, and recommended actions — all generated by AI in seconds.
            </p>

            {/* CTAs */}
            <div className="animate-slide-up-3 flex flex-wrap gap-3 mb-10">
              <button
                onClick={loadDemo}
                className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                <Play size={16} />
                Try Demo — Free
              </button>
              <button
                onClick={() => inputRef.current.click()}
                className="flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <Upload size={16} />
                Upload Your CSV
              </button>
            </div>

            {/* Trust micro-copy */}
            <div className="animate-slide-up-4 flex flex-wrap gap-4">
              {["No login required", "Works with any CSV", "Private — data stays in browser"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <CheckCircle size={13} className="text-emerald-500" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating preview */}
          <div className="hidden lg:block animate-fade-in">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────── */}
      <section className="relative z-10 border-y border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "< 10s",  label: "Average analysis time" },
              { value: "Any CSV", label: "Format supported"        },
              { value: "4 AI",    label: "Report sections"        },
              { value: "0 Setup", label: "Required to start"      },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-white text-2xl font-bold mb-1">{s.value}</p>
                <p className="text-slate-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl font-bold text-white">Three steps. That is all.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 relative">
          {/* Connector lines */}
          <div className="hidden md:block absolute top-8 left-[33%] right-[33%] h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          <Step number="1" icon={Upload}    delay="0s"    title="Upload your data"     description="Drop any CSV file with a header row. Or click Try Demo to see it in action right now." />
          <Step number="2" icon={BrainCircuit} delay="0.15s" title="AI reads it"       description="Auto-Analyst computes statistics locally, then sends a structured summary to OpenAI." />
          <Step number="3" icon={FileText}  delay="0.3s"  title="Read your report"     description="Get a headline finding, key insights, recommended actions, risk flags, and a health score." />
        </div>
      </section>

      {/* ── What you get ────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-3">What You Get</p>
          <h2 className="text-3xl font-bold text-white">A full analyst report. In seconds.</h2>
          <p className="text-slate-400 mt-3 text-base max-w-xl mx-auto">
            Everything a senior business analyst would write — but done by AI the moment you upload.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={BarChart3}
            color="bg-indigo-600"
            title="KPI Cards"
            description="Auto-detects every numeric column and shows total, trend direction, and percentage change."
          />
          <FeatureCard
            icon={TrendingUp}
            color="bg-violet-600"
            title="Trend Chart"
            description="A line chart over time so you can see exactly when things went up, down, or sideways."
          />
          <FeatureCard
            icon={Lightbulb}
            color="bg-amber-600"
            title="AI Insights"
            description="Three or more specific observations backed by real numbers from your data."
          />
          <FeatureCard
            icon={AlertTriangle}
            color="bg-red-600"
            title="Risk Flags"
            description="Automatic anomaly detection finds values two standard deviations outside the normal range."
          />
          <FeatureCard
            icon={Zap}
            color="bg-emerald-600"
            title="Recommended Actions"
            description="Concrete, specific next steps written by AI based on what the data actually shows."
          />
          <FeatureCard
            icon={Activity}
            color="bg-cyan-600"
            title="Health Score"
            description="A 0–100 score that tells you at a glance how healthy the data looks overall."
          />
          <FeatureCard
            icon={Shield}
            color="bg-slate-600"
            title="Private by Design"
            description="Your raw data never leaves your browser. Only anonymous statistics are sent to the AI."
          />
          <FeatureCard
            icon={FileText}
            color="bg-pink-600"
            title="Category Breakdown"
            description="If your CSV has a text column, the AI automatically groups and compares by category."
          />
        </div>
      </section>

      {/* ── Trust section ───────────────────────────────────── */}
      <section className="relative z-10 border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-slate-500 text-xs uppercase tracking-widest mb-10">
            Works with data from
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {["Excel exports", "Google Sheets", "Kaggle datasets", "Internal reports", "Sales data", "Analytics exports", "Any spreadsheet"].map((t) => (
              <div key={t} className="px-4 py-2 glass border border-slate-700/50 rounded-full text-slate-400 text-sm">
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="glass border border-indigo-500/20 rounded-3xl p-12 glow-border">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Ready to see your data
            <br />
            <span className="shimmer-text">differently?</span>
          </h2>
          <p className="text-slate-400 mb-8 text-base">
            No account. No setup. No waiting. Just drop your CSV and read your report.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={loadDemo}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-base transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              <Play size={18} />
              Start Analyzing — Free
            </button>
            <button
              onClick={() => inputRef.current.click()}
              className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5"
            >
              <Upload size={18} />
              Upload CSV
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center">
        <p className="text-slate-600 text-sm">
          Built with React, Vite, Tailwind CSS, and OpenAI. Hosted on GitHub Pages + Supabase.
        </p>
      </footer>

      <input ref={inputRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
    </div>
  );
}
