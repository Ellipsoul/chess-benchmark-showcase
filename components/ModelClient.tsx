"use client";

import { useEffect, useState } from "react";
import { getCategory, getIndex } from "@/lib/data";
import { CATEGORY_ORDER, OUTCOME_META } from "@/lib/outcome";
import type { IndexData, Outcome, RunSummary } from "@/lib/types";

interface AttemptRow { task_id: string; task_type: string; category_slug: string; extracted: string | null; outcome: Outcome }

export function ModelClient({ slug }: { slug: string }) {
  const [run, setRun] = useState<RunSummary | null>(null);
  const [index, setIndex] = useState<IndexData | null>(null);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [filter, setFilter] = useState<Outcome | "all">("all");

  useEffect(() => {
    getIndex().then((idx) => {
      setIndex(idx);
      setRun(idx.runs.find((r) => r.slug === slug) ?? null);
    });
    Promise.all(CATEGORY_ORDER.map(({ slug: cat }) => getCategory(cat))).then((categories) => {
      setAttempts(categories.flatMap((category) =>
        category.tasks.map((task) => {
          const result = task.results.find((r) => r.run === slug)!;
          return { task_id: task.task_id, task_type: task.task_type, category_slug: category.slug,
                   extracted: result.extracted, outcome: result.outcome };
        })));
    });
  }, [slug]);

  if (!run || !index) return <p className="p-8 text-stone-500 dark:text-stone-400">Loading…</p>;
  const shown = attempts.filter((a) => filter === "all" || a.outcome === filter);
  const byCategory = CATEGORY_ORDER.map(({ slug: cat, name }) => {
    const rows = attempts.filter((a) => a.category_slug === cat);
    return { name, correct: rows.filter((a) => a.outcome === "correct").length, total: rows.length };
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{run.display_name}</h1>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
        <div><dt className="text-stone-500 dark:text-stone-400">Model id</dt><dd className="font-mono">{run.model}</dd></div>
        <div><dt className="text-stone-500 dark:text-stone-400">Backend</dt><dd className="font-mono">{run.backend}</dd></div>
        <div><dt className="text-stone-500 dark:text-stone-400">Reasoning payload</dt><dd className="font-mono">{run.reasoning_config ? JSON.stringify(run.reasoning_config) : "none"}</dd></div>
        <div><dt className="text-stone-500 dark:text-stone-400">Run date</dt><dd>{run.started_at?.slice(0, 10) ?? "—"}</dd></div>
        <div><dt className="text-stone-500 dark:text-stone-400">Harness commit</dt><dd className="font-mono">{run.git_commit?.slice(0, 8) ?? "—"}</dd></div>
        <div><dt className="text-stone-500 dark:text-stone-400">Total cost</dt><dd className="font-mono">{run.total_cost_usd != null ? `$${run.total_cost_usd.toFixed(2)}` : "n/a"}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {byCategory.map((c) => (
          <span key={c.name} className="rounded border border-stone-200 dark:border-stone-800 px-2 py-1">{c.name}: <span className="font-mono">{c.correct}/{c.total}</span></span>
        ))}
      </div>
      <div className="mt-6 flex gap-2 text-xs">
        {(["all", "correct", "wrong", "illegal", "capped", "format_error"] as const).map((option) => (
          <button key={option} type="button" onClick={() => setFilter(option)}
                  className={`rounded border px-2 py-1 ${filter === option ? "border-stone-700 dark:border-stone-300 font-medium" : "border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400"}`}>
            {option === "all" ? "all" : OUTCOME_META[option].label.toLowerCase()}
          </button>
        ))}
      </div>
      <ul className="mt-3 divide-y divide-stone-100 dark:divide-stone-800 text-sm">
        {shown.map((attempt) => (
          <li key={attempt.task_id} className="flex items-center justify-between gap-2 py-2">
            <a className="hover:underline" href={`/category/${attempt.category_slug}?run=${slug}#${attempt.task_id}`}>{attempt.task_type}</a>
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs text-stone-500 dark:text-stone-400">{attempt.extracted ?? "—"}</span>
              <span className={`rounded px-1.5 py-0.5 text-xs ${OUTCOME_META[attempt.outcome].badgeClass}`}>{OUTCOME_META[attempt.outcome].label}</span>
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
