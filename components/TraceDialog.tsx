"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTraces } from "@/lib/data";
import type { TaskResult } from "@/lib/types";

const FIDELITY_LABELS: Record<string, string> = {
  full_text: "full unedited stream",
  summary: "provider-summarized",
  plain: "plain-text reasoning",
  untyped: "untyped reasoning",
  encrypted_only: "encrypted (not viewable)",
  none: "no trace returned",
};

export function TraceDialog({ taskId, result, runName }: {
  taskId: string;
  result: TaskResult;
  runName: string;
}) {
  const [open, setOpen] = useState(false);
  const [trace, setTrace] = useState<{ content: string; response: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || trace) return;
    getTraces(taskId)
      .then((data) => setTrace(data.traces[result.run] ?? { content: "", response: "" }))
      .catch((err) => setError(String(err)));
  }, [open, trace, taskId, result.run]);

  const fidelity = FIDELITY_LABELS[result.thinking_source ?? "none"] ?? result.thinking_source;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[11px] text-muted-foreground">
            Thoughts · {fidelity} · {result.thinking_chars.toLocaleString()} chars
          </Button>
        }
      />
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-base">{runName}</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {taskId} · {fidelity} · {result.thinking_chars.toLocaleString()} chars
          </DialogDescription>
        </DialogHeader>
        {result.outcome === "capped" && (
          <p className="rounded-md bg-amber-100 px-3 py-2 text-sm font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            Hit the 32K token ceiling mid-thought — no answer was ever produced.
          </p>
        )}
        {error && <p className="text-sm text-destructive">Failed to load trace: {error}</p>}
        {!trace && !error && <p className="text-sm text-muted-foreground">Loading…</p>}
        {trace && (
          <ScrollArea className="max-h-[65vh] rounded-md border bg-muted/40">
            <div className="p-3">
              <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed">
                {trace.content || "(no thinking trace returned)"}
              </pre>
              {trace.response && (
                <>
                  <h4 className="mt-4 mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Final response
                  </h4>
                  <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed">
                    {trace.response}
                  </pre>
                </>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
