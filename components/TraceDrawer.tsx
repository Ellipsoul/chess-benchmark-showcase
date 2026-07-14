"use client";

import { useEffect, useState } from "react";
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

export function TraceDrawer({ taskId, result }: { taskId: string; result: TaskResult }) {
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
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-sm underline decoration-dotted text-slate-600 hover:text-slate-900"
      >
        {open ? "Hide thoughts" : `Show thoughts (${fidelity}, ${result.thinking_chars.toLocaleString()} chars)`}
      </button>
      {open && (
        <div className="mt-2 rounded border border-slate-200 bg-slate-50 p-3 text-sm">
          {result.outcome === "capped" && (
            <p className="mb-2 rounded bg-amber-100 px-2 py-1 font-medium text-amber-900">
              Hit the 32K token ceiling mid-thought — no answer was ever produced.
            </p>
          )}
          {error && <p className="text-rose-700">Failed to load trace: {error}</p>}
          {!trace && !error && <p className="text-slate-500">Loading…</p>}
          {trace && (
            <>
              <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed">
                {trace.content || "(no thinking trace returned)"}
              </pre>
              {trace.response && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-slate-600">Final response text</summary>
                  <pre className="mt-1 max-h-60 overflow-y-auto whitespace-pre-wrap break-words font-mono text-xs">{trace.response}</pre>
                </details>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
