"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RunSummary } from "@/lib/types";

export function RunSummaryTable({ runs }: { runs: RunSummary[] }) {
  const sorted = [...runs].sort((a, b) => b.n_correct - a.n_correct);
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead>Correct</TableHead>
            <TableHead>Capped</TableHead>
            <TableHead>Illegal</TableHead>
            <TableHead>Avg tokens</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Traces</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((run) => (
            <TableRow key={run.slug}>
              <TableCell>
                <a className="font-medium hover:underline" href={`/model/${run.slug}`}>{run.display_name}</a>
              </TableCell>
              <TableCell className="font-mono">{run.n_correct}/{run.n_results}</TableCell>
              <TableCell className="font-mono">{run.n_capped || "—"}</TableCell>
              <TableCell className="font-mono">{run.n_illegal || "—"}</TableCell>
              <TableCell className="font-mono">{run.avg_completion_tokens?.toLocaleString() ?? "—"}</TableCell>
              <TableCell className="font-mono">{run.total_cost_usd != null ? `$${run.total_cost_usd.toFixed(2)}` : "n/a"}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {Object.entries(run.thinking_sources).map(([k, v]) => `${k}×${v}`).join(" ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
