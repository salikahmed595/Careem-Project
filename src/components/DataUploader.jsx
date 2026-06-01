import { useRef } from "react";
import { Upload, Play } from "lucide-react";
import { parseCSV } from "../utils/csvParser";
import { DEMO_DATA, DEMO_META } from "../data/demo_ecommerce";

export default function DataUploader({ onData, disabled }) {
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const rows = await parseCSV(file);
      if (!rows || rows.length === 0) throw new Error("The CSV file is empty or could not be parsed.");
      onData(rows, file.name.replace(/\.csv$/i, ""));
    } catch (err) {
      alert(`Could not read file: ${err.message}`);
    }
  };

  const loadDemo = () => {
    onData(DEMO_DATA, DEMO_META.name);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-10 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900/40">
      <div className="text-center space-y-1">
        <p className="text-white font-semibold text-base">Upload a dataset to begin</p>
        <p className="text-slate-400 text-sm">
          Any CSV with at least one numeric column. Try the built-in demo to see an example.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => inputRef.current.click()}
          disabled={disabled}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50"
        >
          <Upload size={16} />
          Upload CSV
        </button>
        <button
          onClick={loadDemo}
          disabled={disabled}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50"
        >
          <Play size={16} />
          Try Demo Data
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFile}
        className="hidden"
      />
      <p className="text-slate-600 text-xs">
        Supported format: .csv with a header row
      </p>
    </div>
  );
}
