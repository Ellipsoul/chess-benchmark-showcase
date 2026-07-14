"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { getCategory, getIndex } from "@/lib/data";
import { CATEGORY_ORDER } from "@/lib/outcome";
import type { CategoryData, IndexData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CategorySkeleton } from "./Skeletons";
import { LazyMount } from "./LazyMount";
import { PositionSection } from "./PositionSection";

const PREFIX_RE = /^(structural|motifs|short_tactics|position_judgement|semantic)_/;

/** One scroll plus a few gentle corrections. This must never fight lazy mounting —
 *  the caller eager-mounts every section above the target first, so heights are final
 *  and the corrections are a no-op safety net (24px tolerance, 6 checks max), not a
 *  re-snap loop. setTimeout (not rAF) so it also works in background tabs. */
function settleScroll(id: string) {
  let checks = 0;
  const step = () => {
    const el = document.getElementById(id);
    if (!el) return;
    if (Math.abs(el.getBoundingClientRect().top) > 24) el.scrollIntoView({ block: "start" });
    if (++checks < 6) setTimeout(step, 150);
  };
  step();
}

function TocLinks({ tasks, onNavigate }: {
  tasks: { task_id: string; task_type: string }[];
  onNavigate: (taskId: string) => void;
}) {
  return (
    <ul className="space-y-0.5 text-xs">
      {tasks.map((task) => (
        <li key={task.task_id}>
          <button
            type="button"
            onClick={() => onNavigate(task.task_id)}
            className="w-full rounded px-2 py-1 text-left text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {task.task_type.replace(PREFIX_RE, "")}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function CategoryClient({ slug }: { slug: string }) {
  const [data, setData] = useState<CategoryData | null>(null);
  const [index, setIndex] = useState<IndexData | null>(null);
  // Highest section index that must be mounted (monotonic). Navigation mounts every
  // section up to the target BEFORE scrolling: placeholders above the target growing
  // to full height mid-scroll is what caused the scroll to oscillate between puzzles.
  const [eagerUpTo, setEagerUpTo] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [initialHash] = useState(() => (typeof window === "undefined" ? "" : window.location.hash.slice(1)));
  // Read ?run= from location directly: on the static export useSearchParams proved
  // unreliable after hydration, and this page is fully client-rendered anyway.
  const [preselectRun] = useState(() =>
    typeof window === "undefined" ? undefined : new URLSearchParams(window.location.search).get("run") ?? undefined,
  );

  useEffect(() => {
    Promise.all([getCategory(slug), getIndex()]).then(([category, idx]) => {
      setData(category);
      setIndex(idx);
    });
  }, [slug]);

  // Deep link: mount everything above the target, then scroll once layout is final.
  // (setState deferred to a timeout — the lint rule forbids synchronous setState here.)
  useEffect(() => {
    if (!data || !initialHash) return;
    const targetIndex = data.tasks.findIndex((t) => t.task_id === initialHash);
    const timeout = setTimeout(() => {
      if (targetIndex >= 0) setEagerUpTo((prev) => Math.max(prev, targetIndex));
      setTimeout(() => settleScroll(initialHash), 60);
    }, 0);
    return () => clearTimeout(timeout);
  }, [data, initialHash]);

  const navigate = (taskId: string) => {
    const targetIndex = data?.tasks.findIndex((t) => t.task_id === taskId) ?? -1;
    if (targetIndex >= 0) setEagerUpTo((prev) => Math.max(prev, targetIndex));
    setTocOpen(false);
    history.replaceState(null, "", `#${taskId}`); // keep the URL shareable
    setTimeout(() => settleScroll(taskId), 60); // one render for the eager mounts first
  };

  if (!data || !index) return <CategorySkeleton />;
  const categoryName = CATEGORY_ORDER.find((c) => c.slug === slug)?.name ?? data.category;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{categoryName}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {data.tasks.length} positions · 16 model attempts each · one position per task type
      </p>

      <div className="mt-4 grid gap-8 lg:grid-cols-[200px_1fr]">
        {/* Desktop contents sidebar */}
        <nav className="hidden lg:block">
          <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-lg border bg-card p-2">
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Contents</p>
            <TocLinks tasks={data.tasks} onNavigate={navigate} />
          </div>
        </nav>

        <main className="min-w-0">
          {data.tasks.map((task, i) => (
            <LazyMount key={task.task_id} id={task.task_id} eager={i <= eagerUpTo || task.task_id === initialHash}>
              <PositionSection task={task} runs={index.runs} preselectRun={preselectRun} />
            </LazyMount>
          ))}
        </main>
      </div>

      {/* Small screens: contents drawer that slides in from the left edge; the peeking
          tab is the indicator — hovering (or tapping) it slides the panel into view. */}
      <div
        className="fixed inset-y-0 left-0 z-40 flex items-center lg:hidden"
        onMouseEnter={() => setTocOpen(true)}
        onMouseLeave={() => setTocOpen(false)}
      >
        <div
          className={cn(
            "flex max-h-[70vh] transition-transform duration-300 ease-out",
            tocOpen ? "translate-x-0" : "-translate-x-[calc(100%-1.75rem)]",
          )}
        >
          <div className="w-60 overflow-y-auto rounded-r-lg border bg-card p-2 shadow-lg">
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Contents</p>
            <TocLinks tasks={data.tasks} onNavigate={navigate} />
          </div>
          <button
            type="button"
            aria-label={tocOpen ? "Hide contents" : "Show contents"}
            aria-expanded={tocOpen}
            onClick={() => setTocOpen(!tocOpen)}
            className="h-16 w-7 self-center rounded-r-md border border-l-0 bg-card shadow-lg"
          >
            <ChevronRight className={cn("mx-auto size-4 text-muted-foreground transition-transform", tocOpen && "rotate-180")} />
          </button>
        </div>
      </div>
    </div>
  );
}
