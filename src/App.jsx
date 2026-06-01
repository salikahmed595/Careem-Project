import { useState } from "react";
import { BrainCircuit, RotateCcw } from "lucide-react";
import LandingPage from "./components/LandingPage";
import KPICards from "./components/KPICards";
import TrendChart from "./components/TrendChart";
import InsightPanel from "./components/InsightPanel";
import LoadingState from "./components/LoadingState";
import { useAutoAnalyst } from "./hooks/useAutoAnalyst";

export default function App() {
  const { status, stats, aiResult, error, analyze, reset } = useAutoAnalyst();
  const [rows, setRows]             = useState(null);
  const [datasetName, setDatasetName] = useState("");

  const handleData = (newRows, name) => {
    setRows(newRows);
    setDatasetName(name);
    analyze(newRows, name);
  };

  const handleReset = () => {
    setRows(null);
    setDatasetName("");
    reset();
  };

  if (status === "idle") {
    return <LandingPage onData={handleData} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrainCircuit size={22} className="text-indigo-400" />
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">Auto-Analyst</h1>
            <p className="text-slate-500 text-xs">AI-Powered Data Insight Engine</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <RotateCcw size={14} />
          New Analysis
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {datasetName && (
          <p className="text-slate-500 text-sm">
            Analyzing:{" "}
            <span className="text-indigo-400 font-medium">{datasetName}</span>
            {rows && <span className="text-slate-600"> — {rows.length} rows</span>}
          </p>
        )}

        {status === "analyzing" && <LoadingState />}

        {status === "error" && (
          <div className="bg-red-900/20 border border-red-800 rounded-2xl p-5 text-red-300 space-y-2">
            <p className="font-semibold">Analysis failed</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={handleReset}
              className="text-sm text-red-400 hover:text-white underline"
            >
              Try again
            </button>
          </div>
        )}

        {status === "done" && (
          <>
            <KPICards stats={stats} />
            <TrendChart rows={rows} />
            <InsightPanel aiResult={aiResult} />
          </>
        )}
      </main>
    </div>
  );
}
