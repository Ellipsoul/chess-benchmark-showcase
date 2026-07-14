"use client";

import { useEffect, useMemo, useState } from "react";
import { Board } from "./Board";
import { AttemptCard } from "./AttemptCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CORRECT_COLOR, WRONG_COLOR, diffOverlay, fenAfterMoves, mergeOverlays, primitivesToOverlay, sideToMove } from "@/lib/board";
import { getTraces } from "@/lib/data";
import type { RunSummary, TaskDetail } from "@/lib/types";

const EMPTY_OVERLAY = { arrows: [], squareStyles: {} };

function ConsensusRow({ options, correct, picks }: {
  options: string[];
  correct: string;
  picks: { name: string; value: string }[];
}) {
  return (
    <div className="flex gap-1 text-xs">
      {options.map((option) => {
        const names = picks.filter((p) => p.value === option).map((p) => p.name);
        return (
          <div
            key={option}
            className={`flex-1 rounded border p-1 text-center ${option === correct ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50" : "border-border"}`}
            title={names.join(", ")}
          >
            <div className="font-mono">{option}</div>
            <div className="text-muted-foreground">{names.length > 0 ? `${names.length} model${names.length > 1 ? "s" : ""}` : "—"}</div>
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
  const [hoveredRun, setHoveredRun] = useState<string | null>(null);
  const [showCorrect, setShowCorrect] = useState(true);
  const [moveIndex, setMoveIndex] = useState(task.input_moves.length); // state-tracking: start at the final position

  const displayFen = task.input_moves.length > 0 ? fenAfterMoves(task.input_fen, task.input_moves, moveIndex) : task.input_fen;
  const orientation = sideToMove(task.input_fen);
  const activeRun = hoveredRun ?? selectedRun;
  const active = task.results.find((r) => r.run === activeRun);

  // Correct answer is always green; the active model's answer is green when it was
  // correct, red otherwise. mergeOverlays is first-wins, so green keeps priority
  // when a model played exactly the correct move.
  const overlay = useMemo(() => mergeOverlays(
    showCorrect ? primitivesToOverlay(task.correct_primitives, CORRECT_COLOR) : EMPTY_OVERLAY,
    active ? primitivesToOverlay(active.primitives, active.outcome === "correct" ? CORRECT_COLOR : WRONG_COLOR) : EMPTY_OVERLAY,
  ), [showCorrect, active, task.correct_primitives]);

  // Speculative prefetch (traces load during idle time for mounted, i.e. near-view, sections).
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
    .map((r) => ({ name: displayName(r.run), value: String((r.primitives as { value: number }).value) }));
  const choicePicks = task.results
    .filter((r) => r.primitives.type === "choice")
    .map((r) => ({ name: displayName(r.run), value: (r.primitives as { letter: string }).letter }));
  const question = task.question.replace("CONTEXT_PLACEHOLDER", "").split("Analyze step by step")[0].trim();

  return (
    <section className="border-t py-6">
      <h3 className="font-mono text-sm text-muted-foreground">{task.task_type}</h3>
      <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(300px,400px)_1fr]">
        {/* Left column: board + prompt + metadata */}
        <div className="min-w-0">
          <Board fen={displayFen} orientation={orientation} overlay={overlay} />
          {task.input_moves.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Button variant="outline" size="sm" className="h-6 w-6 p-0" disabled={moveIndex === 0} onClick={() => setMoveIndex(moveIndex - 1)}>‹</Button>
              <span className="font-mono text-xs">{moveIndex}/{task.input_moves.length} moves</span>
              <Button variant="outline" size="sm" className="h-6 w-6 p-0" disabled={moveIndex === task.input_moves.length} onClick={() => setMoveIndex(moveIndex + 1)}>›</Button>
            </div>
          )}
          {active?.primitives.type === "fen" && (
            <div className="mt-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">What this model imagined (differences in red):</p>
              <Board fen={active.primitives.fen} orientation={orientation} overlay={diffOverlay(active.primitives.diff_squares)} maxWidth={300} />
            </div>
          )}
          <label className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Checkbox checked={showCorrect} onCheckedChange={(checked) => setShowCorrect(checked === true)} className="size-3.5" />
            show correct answer (green)
          </label>

          <p className="mt-3 whitespace-pre-wrap text-sm">{question}</p>
          <p className="mt-2 text-sm">
            Correct answer: <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">{task.correct_answer}</span>
          </p>
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline" size="sm" className="mt-2 h-6 px-2 text-[11px]">
                  View full prompt
                </Button>
              }
            />
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle className="font-mono text-base">Full resolved prompt</DialogTitle>
                <DialogDescription className="font-mono text-xs">{task.task_id}</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[65vh] rounded-md border bg-muted/40">
                <pre className="whitespace-pre-wrap break-words p-3 font-mono text-xs leading-relaxed">{task.resolved_prompt}</pre>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {puzzleId && (
              <a className="underline" href={`https://lichess.org/training/${puzzleId}`} target="_blank" rel="noreferrer">
                Lichess puzzle {puzzleId}
              </a>
            )}
            {typeof meta.rating === "number" && <span>puzzle rating {meta.rating}</span>}
            {typeof meta.depth === "number" && <span>Stockfish depth {meta.depth}</span>}
            {themes.map((theme) => (
              <Badge key={theme} variant="secondary" className="h-4 rounded px-1 text-[10px] font-normal">{theme}</Badge>
            ))}
          </div>
          {bestLine && <p className="mt-1 font-mono text-xs text-muted-foreground">engine line: {bestLine}</p>}
          {evalPicks.length > 0 && (
            <div className="mt-3">
              <ConsensusRow options={["-400", "-200", "0", "200", "400"]} correct={String(Number(task.correct_answer))} picks={evalPicks} />
            </div>
          )}
          {choicePicks.length > 0 && (
            <div className="mt-3">
              <ConsensusRow options={["A", "B", "C", "D"]} correct={task.correct_answer.trim().toUpperCase()} picks={choicePicks} />
            </div>
          )}
        </div>

        {/* Right column: one compact card per run; hovering previews that answer on the board */}
        <div className="grid content-start gap-1.5 md:grid-cols-2">
          {task.results.map((result) => (
            <AttemptCard
              key={result.run}
              taskId={task.task_id}
              result={result}
              run={runs.find((run) => run.slug === result.run)!}
              selected={selectedRun === result.run}
              onSelect={() => setSelectedRun(selectedRun === result.run ? null : result.run)}
              onHover={setHoveredRun}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
