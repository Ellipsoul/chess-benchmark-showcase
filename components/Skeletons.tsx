"use client";

import { Skeleton } from "@/components/ui/skeleton";

/* Loading placeholders mirror the final layout dimensions so content swap-in causes
   no cumulative layout shift (the text loaders they replace collapsed to one line). */

export function HeatmapSkeleton() {
  // Same wrapper geometry as the real heatmap: label header (h-32) + 16 fluid
  // aspect-square rows. The inner grid reproduces the fluid height exactly.
  return (
    <div className="overflow-x-auto">
      <div className="w-full min-w-[880px] rounded-lg bg-stone-800 p-1.5">
        <div className="h-32" />
        <div className="grid grid-cols-[200px_repeat(50,1fr)] gap-px">
          {Array.from({ length: 16 }).map((_, row) => (
            <div key={row} className="col-span-full grid grid-cols-subgrid">
              <Skeleton className="h-full rounded-none bg-stone-700/60" />
              {Array.from({ length: 50 }).map((_, col) => (
                <Skeleton key={col} className="aspect-square w-full rounded-none bg-stone-700/60" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>
    </div>
  );
}

export function FleetTableSkeleton() {
  return (
    <div className="space-y-px">
      {Array.from({ length: 17 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-none first:rounded-t-md last:rounded-b-md" />
      ))}
    </div>
  );
}

export function PositionSectionSkeleton() {
  return (
    <div className="border-t py-6">
      <Skeleton className="h-5 w-64" />
      <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(300px,400px)_1fr]">
        <div>
          <Skeleton className="aspect-square w-full max-w-[400px]" />
          <Skeleton className="mt-3 h-4 w-48" />
          <Skeleton className="mt-3 h-16 w-full max-w-[400px]" />
          <Skeleton className="mt-2 h-6 w-32" />
        </div>
        <div className="grid content-start gap-1.5 md:grid-cols-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-80" />
      <div className="mt-4 grid gap-8 lg:grid-cols-[200px_1fr]">
        <div className="hidden lg:block">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
        <div>
          <PositionSectionSkeleton />
        </div>
      </div>
    </div>
  );
}

export function ModelSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Skeleton className="h-8 w-72" />
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-28" />
        ))}
      </div>
      <div className="mt-6 space-y-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    </div>
  );
}
