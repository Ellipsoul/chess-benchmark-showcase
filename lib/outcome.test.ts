import { describe, expect, it } from "vitest";
import { OUTCOME_META } from "@/lib/outcome";
import type { Outcome } from "@/lib/types";

describe("OUTCOME_META", () => {
  it("covers every outcome code with label and colors", () => {
    const outcomes: Outcome[] = ["correct", "wrong", "illegal", "capped", "format_error"];
    for (const outcome of outcomes) {
      expect(OUTCOME_META[outcome].label).toBeTruthy();
      expect(OUTCOME_META[outcome].cellClass).toMatch(/^bg-/);
      expect(OUTCOME_META[outcome].badgeClass).toBeTruthy();
    }
  });
});
