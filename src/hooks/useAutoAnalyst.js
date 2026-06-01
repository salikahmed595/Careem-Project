import { useState, useCallback } from "react";
import { computeStats } from "../utils/statsEngine";
import { buildPrompt } from "../utils/promptBuilder";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function useAutoAnalyst() {
  const [status, setStatus] = useState("idle");
  const [stats, setStats] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (rows, datasetName) => {
    setStatus("analyzing");
    setError(null);

    try {
      const computedStats = computeStats(rows);
      setStats(computedStats);

      const prompt = buildPrompt(computedStats, datasetName);

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(`Server error ${response.status}: ${errBody?.error || response.statusText}`);
      }

      const data = await response.json();
      const parsed = JSON.parse(data.text);
      setAiResult(parsed);
      setStatus("done");
    } catch (err) {
      console.error("Auto-Analyst error:", err);
      setError(err.message);
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setStats(null);
    setAiResult(null);
    setError(null);
  }, []);

  return { status, stats, aiResult, error, analyze, reset };
}
