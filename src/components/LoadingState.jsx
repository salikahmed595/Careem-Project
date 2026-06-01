const STEPS = [
  "Parsing data structure...",
  "Computing statistics...",
  "Detecting patterns and anomalies...",
  "Writing AI insights...",
];

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-6 py-14">
      <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      <div className="space-y-1.5 text-center">
        {STEPS.map((step, i) => (
          <p key={i} className="text-slate-500 text-sm">
            {step}
          </p>
        ))}
      </div>
    </div>
  );
}
