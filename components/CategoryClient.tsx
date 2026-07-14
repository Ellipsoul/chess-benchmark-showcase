"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { getCategory, getIndex } from "@/lib/data";
import { CATEGORY_ORDER } from "@/lib/outcome";
import type { CategoryData, IndexData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LazyMount } from "./LazyMount";
import { PositionSection } from "./PositionSection";

const PREFIX_RE = /^(structural|motifs|short_tactics|position_judgement|semantic)_/;

/** Scroll to a section and keep re-snapping briefly: sections above the target mount
 *  lazily and change height, which would otherwise leave the viewport stranded. */
function scrollToSection(id: string) {
  const started = performance.now();
  const step = () => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (Math.abs(top) > 6) el.scrollIntoView({ block: "start" });
    // setTimeout (not rAF): must keep firing in background tabs so a deep link
    // opened in a new tab is already positioned when the user switches to it.
    if (performance.now() - started < 1600) setTimeout(step, 120);
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
  const [eagerTask, setEagerTask] = useState<string | null>(null);
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

  // initialHash sections are already eager-mounted via the LazyMount prop below.
  useEffect(() => {
    if (data && initialHash) scrollToSection(initialHash);
  }, [data, initialHash]);

  const navigate = (taskId: string) => {
    setEagerTask(taskId); // mount the target section immediately
    setTocOpen(false);
    history.replaceState(null, "", `#${taskId}`); // keep the URL shareable
    scrollToSection(taskId);
  };

  if (!data || !index) return <p className="p-8 text-muted-foreground">Loading positions…</p>;
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
            <LazyMount key={task.task_id} id={task.task_id} eager={task.task_id === initialHash || task.task_id === eagerTask || i === 0}>
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
