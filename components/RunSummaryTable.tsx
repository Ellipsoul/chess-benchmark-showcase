"use client";

import type { RunSummary } from "@/lib/types";

export function RunSummaryTable({ runs }: { runs: RunSummary[] }) {
  const sorted = [...runs].sort((a, b) => b.n_correct - a.n_correct);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2 pr-4">Model</th><th className="pr-4">Correct</th><th className="pr-4">Capped</th>
            <th className="pr-4">Illegal</th><th className="pr-4">Avg tokens</th><th className="pr-4">Cost</th><th>Traces</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((run) => (
            <tr key={run.slug} className="border-b border-slate-100">
              <td className="py-2 pr-4"><a className="font-medium hover:underline" href={`/model/${run.slug}`}>{run.display_name}</a></td>
              <td className="pr-4 font-mono">{run.n_correct}/{run.n_results}</td>
              <td className="pr-4 font-mono">{run.n_capped || "—"}</td>
              <td className="pr-4 font-mono">{run.n_illegal || "—"}</td>
              <td className="pr-4 font-mono">{run.avg_completion_tokens?.toLocaleString() ?? "—"}</td>
              <td className="pr-4 font-mono">{run.total_cost_usd != null ? `$${run.total_cost_usd.toFixed(2)}` : "n/a"}</td>
              <td className="text-xs text-slate-500">{Object.entries(run.thinking_sources).map(([k, v]) => `${k}×${v}`).join(" ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
