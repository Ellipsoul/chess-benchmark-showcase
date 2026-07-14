"use client";

import { OUTCOME_META } from "@/lib/outcome";
import type { IndexData } from "@/lib/types";

export function Heatmap({ index }: { index: IndexData }) {
  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-px">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white pr-2 text-left text-xs font-normal text-slate-500">model \ task</th>
            {index.tasks.map((task) => (
              <th key={task.task_id} className="p-0 text-[9px] font-normal text-slate-400">
                <div className="h-16 w-4 [writing-mode:vertical-rl]" title={task.task_type}>{task.task_type.slice(0, 22)}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {index.runs.map((run) => (
            <tr key={run.slug}>
              <th className="sticky left-0 bg-white pr-2 text-left text-xs font-normal text-slate-600 whitespace-nowrap">{run.display_name}</th>
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
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
        {Object.entries(OUTCOME_META).map(([key, meta]) => (
          <span key={key} className="flex items-center gap-1"><span className={`inline-block h-3 w-3 ${meta.cellClass}`} />{meta.label}</span>
        ))}
      </div>
    </div>
  );
}
