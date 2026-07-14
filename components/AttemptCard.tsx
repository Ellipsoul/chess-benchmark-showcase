"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { OUTCOME_META } from "@/lib/outcome";
import type { RunSummary, TaskResult } from "@/lib/types";
import { TraceDialog } from "./TraceDialog";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-[11px] text-muted-foreground">
      {label} <span className="font-medium text-foreground/80">{value}</span>
    </span>
  );
}

export function AttemptCard({ taskId, result, run, selected, onSelect, onHover }: {
  taskId: string;
  result: TaskResult;
  run: RunSummary;
  selected: boolean;
  onSelect: () => void;
  onHover: (slug: string | null) => void;
}) {
  const meta = OUTCOME_META[result.outcome];
  const answerColor =
    result.outcome === "correct"
      ? "text-emerald-700 dark:text-emerald-400"
      : result.extracted
        ? "text-red-700 dark:text-red-400"
        : "text-muted-foreground italic";
  return (
    <Card
      id={`${taskId}--${run.slug}`}
      onMouseEnter={() => onHover(run.slug)}
      onMouseLeave={() => onHover(null)}
      onClick={onSelect}
      className={cn(
        "cursor-pointer gap-0.5 rounded-lg px-2.5 py-1.5 shadow-none transition-shadow hover:ring-foreground/30",
        selected && "ring-2 ring-primary/70 hover:ring-primary/70",
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[13px] font-medium leading-tight">{run.display_name}</span>
        <Badge className={cn("h-4 rounded px-1 text-[10px]", meta.badgeClass)}>{meta.label}</Badge>
        {result.legality === "illegal" && result.outcome !== "illegal" && (
          <Badge className="h-4 rounded bg-fuchsia-100 px-1 text-[10px] text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300">
            illegal move
          </Badge>
        )}
        {result.legality === "unparseable" && (
          <Badge className="h-4 rounded bg-stone-200 px-1 text-[10px] text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            not UCI
          </Badge>
        )}
      </div>
      <p className={cn("truncate font-mono text-xs", answerColor)} title={result.extracted ?? undefined}>
        {result.extracted ? result.extracted : "no answer"}
      </p>
      <div className="flex flex-wrap items-center gap-x-2.5">
        {result.cost_usd != null && <Stat label="cost" value={`$${result.cost_usd.toFixed(4)}`} />}
        {result.completion_tokens != null && <Stat label="tok" value={result.completion_tokens.toLocaleString()} />}
        {result.latency_ms != null && <Stat label="time" value={`${(result.latency_ms / 1000).toFixed(1)}s`} />}
        <span onClick={(e) => e.stopPropagation()} className="ml-auto">
          <TraceDialog taskId={taskId} result={result} runName={run.display_name} />
        </span>
      </div>
    </Card>
  );
}
