import type { Outcome } from "./types";

export const OUTCOME_META: Record<Outcome, { label: string; badgeClass: string; cellClass: string }> = {
  correct:      { label: "Correct",           badgeClass: "bg-emerald-100 text-emerald-800", cellClass: "bg-emerald-500" },
  wrong:        { label: "Wrong",             badgeClass: "bg-rose-100 text-rose-800",       cellClass: "bg-rose-400" },
  illegal:      { label: "Illegal move",      badgeClass: "bg-fuchsia-100 text-fuchsia-800", cellClass: "bg-fuchsia-600" },
  capped:       { label: "Ran out of tokens", badgeClass: "bg-amber-100 text-amber-800",     cellClass: "bg-amber-400" },
  format_error: { label: "Format error",      badgeClass: "bg-slate-200 text-slate-700",     cellClass: "bg-slate-400" },
};

export const CATEGORY_ORDER: { slug: string; name: string }[] = [
  { slug: "structural", name: "Structural" },
  { slug: "motifs", name: "Motifs" },
  { slug: "short-tactics", name: "Short Tactics" },
  { slug: "position-judgement", name: "Position Judgement" },
  { slug: "semantic", name: "Semantic" },
];
