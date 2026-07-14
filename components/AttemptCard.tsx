"use client";

import { OUTCOME_META } from "@/lib/outcome";
import type { RunSummary, TaskResult } from "@/lib/types";
import { TraceDrawer } from "./TraceDrawer";

function Stat({ label, value }: { label: string; value: string }) {
  return <span className="text-xs text-stone-500 dark:text-stone-400">{label} <span className="font-medium text-stone-700 dark:text-stone-300">{value}</span></span>;
}

export function AttemptCard({ taskId, result, run, selected, onSelect }: {
  taskId: string;
  result: TaskResult;
  run: RunSummary;
  selected: boolean;
  onSelect: () => void;
}) {
  const meta = OUTCOME_META[result.outcome];
  return (
    <div id={`${taskId}--${run.slug}`}
         className={`rounded-lg border p-3 ${selected ? "border-orange-400 ring-1 ring-orange-300" : "border-stone-200 dark:border-stone-800"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onSelect} className="font-medium hover:underline">{run.display_name}</button>
        <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${meta.badgeClass}`}>{meta.label}</span>
        {result.legality === "illegal" && result.outcome !== "illegal" && (
          <span className="rounded bg-fuchsia-100 px-1.5 py-0.5 text-xs text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300">illegal move</span>
        )}
        {result.legality === "unparseable" && (
          <span className="rounded bg-stone-200 px-1.5 py-0.5 text-xs text-stone-700 dark:bg-stone-800 dark:text-stone-300">not UCI</span>
        )}
      </div>
      <p className="mt-1 font-mono text-sm">
        {result.extracted ? result.extracted : <span className="italic text-stone-400 dark:text-stone-500">no answer</span>}
      </p>
      <div className="mt-1 flex flex-wrap gap-3">
        {result.cost_usd != null && <Stat label="cost" value={`$${result.cost_usd.toFixed(4)}`} />}
        {result.completion_tokens != null && <Stat label="tokens" value={result.completion_tokens.toLocaleString()} />}
        {result.latency_ms != null && <Stat label="time" value={`${(result.latency_ms / 1000).toFixed(1)}s`} />}
      </div>
      <TraceDrawer taskId={taskId} result={result} />
    </div>
  );
}
