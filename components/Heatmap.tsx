"use client";

import { OUTCOME_META } from "@/lib/outcome";
import type { IndexData } from "@/lib/types";

// Cells sit on a dark "board wall" (stone-800 shows through the 1px gaps), which is
// what guarantees the >=3:1 cell contrast in both themes — see lib/outcome.ts.
export function Heatmap({ index }: { index: IndexData }) {
  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-px rounded-lg bg-stone-800 p-1 dark:bg-stone-800">
        <thead>
          <tr>
            <th className="sticky left-0 bg-stone-800 pr-2 text-left text-xs font-normal text-stone-300">model \ task</th>
            {index.tasks.map((task) => (
              <th key={task.task_id} className="p-0 text-[9px] font-normal text-stone-400">
                <div className="h-16 w-4 [writing-mode:vertical-rl]" title={task.task_type}>{task.task_type.slice(0, 22)}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {index.runs.map((run) => (
            <tr key={run.slug}>
              <th className="sticky left-0 bg-stone-800 pr-2 text-left text-xs font-normal text-stone-300 whitespace-nowrap">{run.display_name}</th>
              {index.tasks.map((task) => {
                const outcome = task.outcomes[run.slug];
                return (
                  <td key={task.task_id} className="p-0">
                    <a href={`/category/${task.category_slug}?run=${run.slug}#${task.task_id}`}
                       title={`${run.display_name} · ${task.task_type}: ${OUTCOME_META[outcome].label}`}
                       className={`block h-4 w-4 ${OUTCOME_META[outcome].cellClass} hover:opacity-70`} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-stone-600 dark:text-stone-400">
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
