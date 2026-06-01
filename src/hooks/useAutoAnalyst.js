import { useState, useCallback } from "react";
import { computeStats } from "../utils/statsEngine";
import { buildPrompt } from "../utils/promptBuilder";

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

      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error("VITE_ANTHROPIC_API_KEY is not set in your .env file.");

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(`API error ${response.status}: ${errBody?.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const rawText = data.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("");

      const clean = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
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
