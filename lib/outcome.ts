import type { Outcome } from "./types";

// Heatmap cells sit on a dark stone-800 (#292524) well; every cell color below is
// >=3:1 against it (verified at design time), and the critical correct/wrong pair
// differs in lightness as well as hue for red-green color blindness.
export const OUTCOME_META: Record<Outcome, { label: string; badgeClass: string; cellClass: string }> = {
  correct: {
    label: "Correct",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    cellClass: "bg-[#059669]",
  },
  wrong: {
    label: "Wrong",
    badgeClass: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
    cellClass: "bg-[#fb7185]",
  },
  illegal: {
    label: "Illegal move",
    badgeClass: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300",
    cellClass: "bg-[#d946ef]",
  },
  capped: {
    label: "Ran out of tokens",
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    cellClass: "bg-[#fcd34d]",
  },
  format_error: {
    label: "Format error",
    badgeClass: "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
    cellClass: "bg-[#78716c]",
  },
};

export const CATEGORY_ORDER: { slug: string; name: string }[] = [
  { slug: "structural", name: "Structural" },
  { slug: "motifs", name: "Motifs" },
  { slug: "short-tactics", name: "Short Tactics" },
  { slug: "position-judgement", name: "Position Judgement" },
  { slug: "semantic", name: "Semantic" },
];
