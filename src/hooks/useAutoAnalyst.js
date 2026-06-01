import { useState, useCallback } from "react";
import { computeStats } from "../utils/statsEngine";
import { buildPrompt } from "../utils/promptBuilder";
import { createClient } from "../utils/supabase/client";

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

      const supabase = createClient();
      const { data, error: fnError } = await supabase.functions.invoke("analyze", {
        body: { prompt },
      });

      if (fnError) throw new Error(fnError.message);

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
