import { describe, expect, it } from "vitest";
import { CORRECT_COLOR, fenAfterMoves, mergeOverlays, primitivesToOverlay, sideToMove } from "@/lib/board";

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("primitivesToOverlay", () => {
  it("turns move/chain primitives into colored arrows", () => {
    const overlay = primitivesToOverlay({ type: "moves", arrows: [{ from: "h6", to: "h7" }] }, CORRECT_COLOR);
    expect(overlay.arrows).toEqual([{ startSquare: "h6", endSquare: "h7", color: CORRECT_COLOR }]);
  });
  it("turns squares into background styles and pieces into rings", () => {
    const squares = primitivesToOverlay({ type: "squares", squares: ["f6", "f8"] }, CORRECT_COLOR);
    expect(Object.keys(squares.squareStyles)).toEqual(["f6", "f8"]);
    const pieces = primitivesToOverlay({ type: "pieces", items: [{ color: "White", piece: "Knight", square: "f6" }] }, CORRECT_COLOR);
    expect(pieces.squareStyles.f6.boxShadow).toContain(CORRECT_COLOR);
  });
  it("returns an empty overlay for non-board primitives", () => {
    for (const p of [{ type: "eval", value: 200 }, { type: "choice", letter: "A" }, { type: "none" }, { type: "text", text: "hi" }] as const) {
      expect(primitivesToOverlay(p, CORRECT_COLOR)).toEqual({ arrows: [], squareStyles: {} });
    }
  });
});

describe("board helpers", () => {
  it("sideToMove reads the FEN", () => {
    expect(sideToMove(START)).toBe("white");
    expect(sideToMove("8/8/8/8/8/8/8/K6k b - - 0 1")).toBe("black");
  });
  it("fenAfterMoves applies a uci prefix", () => {
    const after = fenAfterMoves(START, ["e2e4", "e7e5"], 1);
    expect(after.split(" ")[1]).toBe("b"); // one move applied -> black to move
    expect(after.startsWith("rnbqkbnr/pppppppp/8/8/4P3/")).toBe(true);
    expect(fenAfterMoves(START, ["e2e4", "e7e5"], 0)).toBe(START);
  });
  it("mergeOverlays concatenates arrows and merges styles", () => {
    const a = primitivesToOverlay({ type: "moves", arrows: [{ from: "e2", to: "e4" }] }, "#111111");
    const b = primitivesToOverlay({ type: "squares", squares: ["d4"] }, "#222222");
    const merged = mergeOverlays(a, b);
    expect(merged.arrows).toHaveLength(1);
    expect(merged.squareStyles.d4).toBeDefined();
  });
  it("mergeOverlays dedupes identical arrows, first overlay wins (correct-answer green beats model overlay)", () => {
    // model answered the same move as the correct answer -> only one arrow, in the first color
    const correct = primitivesToOverlay({ type: "moves", arrows: [{ from: "d2", to: "b3" }] }, "#16a34a");
    const model = primitivesToOverlay({ type: "moves", arrows: [{ from: "d2", to: "b3" }] }, "#dc2626");
    const merged = mergeOverlays(correct, model);
    expect(merged.arrows).toHaveLength(1);
    expect(merged.arrows[0].color).toBe("#16a34a");
  });
  it("mergeOverlays keeps the first squareStyle for a square (correct highlight beats model highlight)", () => {
    const correct = primitivesToOverlay({ type: "squares", squares: ["b3"] }, "#16a34a");
    const model = primitivesToOverlay({ type: "squares", squares: ["b3"] }, "#dc2626");
    const merged = mergeOverlays(correct, model);
    expect(merged.squareStyles.b3.backgroundColor).toContain("22, 163, 74"); // 0x16a34a as rgb
  });
  it("primitivesToOverlay dedupes repeated arrows within one answer", () => {
    const overlay = primitivesToOverlay(
      { type: "moves", arrows: [{ from: "e2", to: "e4" }, { from: "e2", to: "e4" }] },
      "#111111",
    );
    expect(overlay.arrows).toHaveLength(1);
  });
});
