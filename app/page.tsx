"use client";

import { useEffect, useState } from "react";
import { getIndex } from "@/lib/data";
import type { IndexData } from "@/lib/types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heatmap } from "@/components/Heatmap";
import { RunSummaryTable } from "@/components/RunSummaryTable";
import { FleetTableSkeleton, HeatmapSkeleton } from "@/components/Skeletons";
import { EXHIBITS } from "@/exhibits";

export default function Home() {
  const [index, setIndex] = useState<IndexData | null>(null);
  useEffect(() => { getIndex().then(setIndex); }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">ChessQA Explorer</h1>
      <p className="mt-3 max-w-3xl text-foreground/80">
        Sixteen frontier-model configurations, fifty chess questions, every answer and every unedited thought
        stream. Built on the <a className="underline" href="https://arxiv.org/abs/2510.23948">ChessQA benchmark</a> by
        CSSLab, University of Toronto. A browser for model behavior, not a leaderboard — counts, never percentages.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Every attempt at a glance</h2>
      <p className="mb-3 mt-1 text-sm text-muted-foreground">
        Click any cell to jump to that model&apos;s answer and thoughts on that position.
      </p>
      {index ? <Heatmap index={index} /> : <HeatmapSkeleton />}
      <h2 className="mt-12 text-xl font-semibold">The fleet</h2>
      <div className="mt-3">
        {index ? <RunSummaryTable runs={index.runs} /> : <FleetTableSkeleton />}
      </div>
      <h2 className="mt-12 text-xl font-semibold">Exhibits</h2>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {EXHIBITS.map((exhibit) => (
          <a key={exhibit.href} href={exhibit.href} className="group">
            <Card className="h-full gap-2 py-4 shadow-none transition-colors group-hover:border-ring">
              <CardHeader className="px-4">
                <CardTitle className="text-[15px]">{exhibit.title}</CardTitle>
                <CardDescription className="text-sm">{exhibit.blurb}</CardDescription>
              </CardHeader>
            </Card>
          </a>
        ))}
      </div>
    </main>
  );
}
