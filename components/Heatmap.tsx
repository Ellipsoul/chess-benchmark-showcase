"use client";

import { OUTCOME_META } from "@/lib/outcome";
import type { IndexData } from "@/lib/types";

const PREFIX_RE = /^(structural|motifs|short_tactics|position_judgement|semantic)_/;

// Cells sit on a dark "board wall" (stone-800 shows through the 1px gaps), which is
// what guarantees the >=3:1 cell contrast in both themes — see lib/outcome.ts.
export function Heatmap({ index }: { index: IndexData }) {
  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-px rounded-lg bg-stone-800 p-1.5">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-stone-800 pr-3 text-left align-bottom text-xs font-normal text-stone-400">
              model \ task
            </th>
            {index.tasks.map((task) => (
              <th key={task.task_id} className="p-0 align-bottom text-[10px] font-normal text-stone-300">
                {/* Fixed-height, clipped label box: vertical text must never spill into the grid below */}
                <div className="mx-auto h-32 w-5 overflow-hidden pb-1 [writing-mode:vertical-rl]" title={task.task_type}>
                  {task.task_type.replace(PREFIX_RE, "").slice(0, 24)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {index.runs.map((run) => (
            <tr key={run.slug}>
              <th className="sticky left-0 z-10 whitespace-nowrap bg-stone-800 pr-3 text-left text-[13px] font-normal text-stone-100">
                {run.display_name}
              </th>
              {index.tasks.map((task) => {
                const outcome = task.outcomes[run.slug];
                return (
                  <td key={task.task_id} className="p-0">
                    <a
                      href={`/category/${task.category_slug}?run=${run.slug}#${task.task_id}`}
                      title={`${run.display_name} · ${task.task_type}: ${OUTCOME_META[outcome].label}`}
                      className={`block h-5 w-5 ${OUTCOME_META[outcome].cellClass} hover:opacity-70`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-foreground/80">
        {Object.entries(OUTCOME_META).map(([key, meta]) => (
          <span key={key} className="flex items-center gap-1">
            <span className={`inline-block h-3.5 w-3.5 rounded-[2px] ring-2 ring-stone-800 ${meta.cellClass}`} />
            {meta.label}
          </span>
        ))}
      </div>
    </div>
  );
}
