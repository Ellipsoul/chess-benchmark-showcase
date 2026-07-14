"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCategory, getIndex } from "@/lib/data";
import { CATEGORY_ORDER } from "@/lib/outcome";
import type { CategoryData, IndexData } from "@/lib/types";
import { LazyMount } from "./LazyMount";
import { PositionSection } from "./PositionSection";

export function CategoryClient({ slug }: { slug: string }) {
  const [data, setData] = useState<CategoryData | null>(null);
  const [index, setIndex] = useState<IndexData | null>(null);
  const [initialHash] = useState(() => (typeof window === "undefined" ? "" : window.location.hash.slice(1)));
  const preselectRun = useSearchParams().get("run") ?? undefined;

  useEffect(() => {
    Promise.all([getCategory(slug), getIndex()]).then(([category, idx]) => {
      setData(category);
      setIndex(idx);
    });
  }, [slug]);

  useEffect(() => {
    if (data && initialHash) document.getElementById(initialHash)?.scrollIntoView();
  }, [data, initialHash]);

  if (!data || !index) return <p className="p-8 text-slate-500">Loading positions…</p>;
  const categoryName = CATEGORY_ORDER.find((c) => c.slug === slug)?.name ?? data.category;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{categoryName}</h1>
      <p className="mt-1 text-sm text-slate-600">{data.tasks.length} positions · 16 model attempts each · one position per task type</p>
      <nav className="sticky top-0 z-10 -mx-4 mt-4 overflow-x-auto border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur">
        <ul className="flex gap-3 whitespace-nowrap text-xs">
          {data.tasks.map((task) => (
            <li key={task.task_id}>
              <a className="text-slate-600 underline-offset-2 hover:underline" href={`#${task.task_id}`}>
                {task.task_type.replace(/^(structural|motifs|short_tactics|position_judgement|semantic)_/, "")}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {data.tasks.map((task) => (
        <LazyMount key={task.task_id} eager={task.task_id === initialHash || data.tasks.indexOf(task) === 0}>
          <PositionSection task={task} runs={index.runs} preselectRun={preselectRun} />
        </LazyMount>
      ))}
    </main>
  );
}
