"use client";

import { useEffect, useMemo, useState } from "react";
import { Board } from "./Board";
import { AttemptCard } from "./AttemptCard";
import { CORRECT_COLOR, MODEL_COLOR, diffOverlay, fenAfterMoves, mergeOverlays, primitivesToOverlay, sideToMove } from "@/lib/board";
import { getTraces } from "@/lib/data";
import type { RunSummary, TaskDetail } from "@/lib/types";

function ChoicePicks({ correct, picks }: { correct: string; picks: { name: string; letter: string }[] }) {
  return (
    <div className="flex gap-1 text-xs">
      {["A", "B", "C", "D"].map((letter) => {
        const names = picks.filter((p) => p.letter === letter).map((p) => p.name);
        return (
          <div key={letter}
               className={`flex-1 rounded border p-1 text-center ${letter === correct ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}
               title={names.join(", ")}>
            <div className="font-mono">{letter}</div>
            <div className="text-slate-500">{names.length > 0 ? `${names.length} model${names.length > 1 ? "s" : ""}` : "—"}</div>
          </div>
        );
      })}
    </div>
  );
}

function EvalScale({ correct, picks }: { correct: number; picks: { name: string; value: number }[] }) {
  const buckets = [-400, -200, 0, 200, 400];
  return (
    <div className="flex gap-1 text-xs">
      {buckets.map((bucket) => {
        const names = picks.filter((p) => p.value === bucket).map((p) => p.name);
        return (
          <div key={bucket}
               className={`flex-1 rounded border p-1 text-center ${bucket === correct ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}
               title={names.join(", ")}>
            <div className="font-mono">{bucket > 0 ? `+${bucket}` : bucket}</div>
            <div className="text-slate-500">{names.length > 0 ? `${names.length} model${names.length > 1 ? "s" : ""}` : "—"}</div>
          </div>
        );
      })}
    </div>
  );
}

export function PositionSection({ task, runs, preselectRun }: {
  task: TaskDetail;
  runs: RunSummary[];
  preselectRun?: string;
}) {
  const [selectedRun, setSelectedRun] = useState<string | null>(preselectRun ?? null);
  const [showCorrect, setShowCorrect] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [moveIndex, setMoveIndex] = useState(task.input_moves.length); // state-tracking: start at the final position

  const displayFen = task.input_moves.length > 0 ? fenAfterMoves(task.input_fen, task.input_moves, moveIndex) : task.input_fen;
  const orientation = sideToMove(task.input_fen);
  const selected = task.results.find((r) => r.run === selectedRun);

  const overlay = useMemo(() => mergeOverlays(
    showCorrect ? primitivesToOverlay(task.correct_primitives, CORRECT_COLOR) : { arrows: [], squareStyles: {} },
    selected ? primitivesToOverlay(selected.primitives, MODEL_COLOR) : { arrows: [], squareStyles: {} },
  ), [showCorrect, selected, task.correct_primitives]);

  // Speculative prefetch (spec: traces load during idle time for in-view positions).
  // LazyMount only mounts sections near the viewport, so mount ≈ in view.
  useEffect(() => {
    const prefetch = () => { getTraces(task.task_id).catch(() => undefined); };
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(prefetch);
      return () => window.cancelIdleCallback(handle);
    }
    const timeout = window.setTimeout(prefetch, 2000); // Safari has no requestIdleCallback
    return () => window.clearTimeout(timeout);
  }, [task.task_id]);

  const meta = task.metadata ?? {};
  const puzzleId = typeof meta.puzzle_id === "string" ? meta.puzzle_id : null;
  const themes = Array.isArray(meta.themes) ? (meta.themes as string[]) : [];
  const bestLine = typeof meta.best_line === "string" ? meta.best_line : null;
  const displayName = (slug: string) => runs.find((run) => run.slug === slug)?.display_name ?? slug;
  const evalPicks = task.results
    .filter((r) => r.primitives.type === "eval")
    .map((r) => ({ name: displayName(r.run), value: (r.primitives as { value: number }).value }));
  const choicePicks = task.results
    .filter((r) => r.primitives.type === "choice")
    .map((r) => ({ name: displayName(r.run), letter: (r.primitives as { letter: string }).letter }));

  return (
    <section id={task.task_id} className="scroll-mt-20 border-t border-slate-200 py-8">
      <h3 className="font-mono text-sm text-slate-500">{task.task_type}</h3>
      <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(280px,420px)_1fr]">
        <div>
          <Board fen={displayFen} orientation={orientation} overlay={overlay} />
          {task.input_moves.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <button type="button" className="rounded border px-2" disabled={moveIndex === 0} onClick={() => setMoveIndex(moveIndex - 1)}>‹</button>
              <span className="font-mono">{moveIndex}/{task.input_moves.length} moves</span>
              <button type="button" className="rounded border px-2" disabled={moveIndex === task.input_moves.length} onClick={() => setMoveIndex(moveIndex + 1)}>›</button>
            </div>
          )}
          {selected?.primitives.type === "fen" && (
            <div className="mt-3">
              <p className="mb-1 text-xs font-medium text-slate-600">What this model imagined (differences in red):</p>
              <Board fen={selected.primitives.fen} orientation={orientation} overlay={diffOverlay(selected.primitives.diff_squares)} maxWidth={300} />
            </div>
          )}
          <label className="mt-2 flex items-center gap-1 text-xs text-slate-600">
            <input type="checkbox" checked={showCorrect} onChange={(e) => setShowCorrect(e.target.checked)} />
            show correct answer (green)
          </label>
        </div>
        <div>
          <p className="whitespace-pre-wrap text-sm">{task.question.replace("CONTEXT_PLACEHOLDER", "").split("Analyze step by step")[0].trim()}</p>
          <p className="mt-2 text-sm">Correct answer: <span className="font-mono font-semibold text-emerald-700">{task.correct_answer}</span></p>
          <button type="button" className="mt-1 text-xs underline decoration-dotted text-slate-500" onClick={() => setShowPrompt(!showPrompt)}>
            {showPrompt ? "hide full prompt" : "show full prompt"}
          </button>
          {showPrompt && <pre className="mt-1 max-h-60 overflow-y-auto whitespace-pre-wrap rounded bg-slate-50 p-2 font-mono text-xs">{task.resolved_prompt}</pre>}
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            {puzzleId && <a className="underline" href={`https://lichess.org/training/${puzzleId}`} target="_blank" rel="noreferrer">Lichess puzzle {puzzleId}</a>}
            {typeof meta.rating === "number" && <span>puzzle rating {meta.rating}</span>}
            {typeof meta.depth === "number" && <span>Stockfish depth {meta.depth}</span>}
            {themes.map((theme) => <span key={theme} className="rounded bg-slate-100 px-1.5">{theme}</span>)}
          </div>
          {bestLine && <p className="mt-1 font-mono text-xs text-slate-500">engine line: {bestLine}</p>}
          {evalPicks.length > 0 && (
            <div className="mt-3"><EvalScale correct={Number(task.correct_answer)} picks={evalPicks} /></div>
          )}
          {choicePicks.length > 0 && (
            <div className="mt-3"><ChoicePicks correct={task.correct_answer.trim().toUpperCase()} picks={choicePicks} /></div>
          )}
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {task.results.map((result) => (
              <AttemptCard key={result.run} taskId={task.task_id} result={result}
                           run={runs.find((run) => run.slug === result.run)!}
                           selected={selectedRun === result.run}
                           onSelect={() => setSelectedRun(selectedRun === result.run ? null : result.run)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
