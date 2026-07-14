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
});
