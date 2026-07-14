"use client";

import { useEffect, useState } from "react";
import { getIndex } from "@/lib/data";
import type { IndexData } from "@/lib/types";
import { Heatmap } from "@/components/Heatmap";
import { RunSummaryTable } from "@/components/RunSummaryTable";
import { EXHIBITS } from "@/exhibits";

export default function Home() {
  const [index, setIndex] = useState<IndexData | null>(null);
  useEffect(() => { getIndex().then(setIndex); }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">ChessQA Explorer</h1>
      <p className="mt-3 max-w-3xl text-stone-700 dark:text-stone-300">
        Sixteen frontier-model configurations, fifty chess questions, every answer and every unedited thought
        stream. Built on the <a className="underline" href="https://arxiv.org/abs/2510.23948">ChessQA benchmark</a> by
        CSSLab, University of Toronto.
      </p>
      <div className="mt-4 max-w-3xl rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <strong>What this is (and isn&apos;t):</strong> a browser for model behavior, not a leaderboard. Each model saw a
        50-task smoke sample — one position per task type — so category-level numbers are anecdotes with wide error
        bars. Counts are shown everywhere instead of percentages for exactly that reason.
      </div>
      {index ? (
        <>
          <h2 className="mt-10 text-xl font-semibold">The fleet</h2>
          <RunSummaryTable runs={index.runs} />
          <h2 className="mt-10 text-xl font-semibold">Every attempt at a glance</h2>
          <p className="mb-2 text-sm text-stone-600 dark:text-stone-400">Click any cell to see that model&apos;s answer and thoughts on that position.</p>
          <Heatmap index={index} />
        </>
      ) : (
        <p className="mt-10 text-stone-500 dark:text-stone-400">Loading results…</p>
      )}
      <h2 className="mt-10 text-xl font-semibold">Exhibits</h2>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {EXHIBITS.map((exhibit) => (
          <a key={exhibit.href} href={exhibit.href} className="rounded-lg border border-stone-200 dark:border-stone-800 p-4 hover:border-stone-400 dark:hover:border-stone-500">
            <h3 className="font-medium">{exhibit.title}</h3>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{exhibit.blurb}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
