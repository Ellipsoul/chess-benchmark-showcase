// The only place primitives meet react-chessboard's prop shapes.
import { Chess } from "chess.js";
import type { CSSProperties } from "react";
import type { Primitives } from "./types";

export interface BoardArrow { startSquare: string; endSquare: string; color: string }
export interface BoardOverlay { arrows: BoardArrow[]; squareStyles: Record<string, CSSProperties> }

export const CORRECT_COLOR = "#16a34a";
export const WRONG_COLOR = "#dc2626";

function hexToRgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

// react-chessboard keys arrows by their squares (`chessboard-arrow-<from>-<to>`), so
// duplicate from/to pairs break React key uniqueness — dedupe everywhere, first wins.
function dedupeArrows(arrows: BoardArrow[]): BoardArrow[] {
  const seen = new Set<string>();
  return arrows.filter((a) => {
    const key = `${a.startSquare}-${a.endSquare}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function primitivesToOverlay(p: Primitives | null | undefined, color: string): BoardOverlay {
  const overlay: BoardOverlay = { arrows: [], squareStyles: {} };
  if (!p) return overlay;
  if (p.type === "moves" || p.type === "chain") {
    overlay.arrows = dedupeArrows(p.arrows.map((a) => ({ startSquare: a.from, endSquare: a.to, color })));
  } else if (p.type === "squares") {
    for (const square of p.squares) overlay.squareStyles[square] = { backgroundColor: hexToRgba(color, 0.4) };
  } else if (p.type === "pieces") {
    for (const item of p.items) overlay.squareStyles[item.square] = { boxShadow: `inset 0 0 0 3px ${color}` };
  }
  return overlay; // fen/eval/choice/none/text are rendered outside the board
}

export function mergeOverlays(...overlays: BoardOverlay[]): BoardOverlay {
  // First overlay wins on conflicts for both arrows and square styles, so the
  // correct-answer overlay (merged first) is never repainted by a model overlay.
  const squareStyles: Record<string, CSSProperties> = {};
  for (const overlay of overlays) {
    for (const [square, style] of Object.entries(overlay.squareStyles)) {
      if (!(square in squareStyles)) squareStyles[square] = style;
    }
  }
  return {
    arrows: dedupeArrows(overlays.flatMap((o) => o.arrows)),
    squareStyles,
  };
}

export function diffOverlay(diffSquares: string[]): BoardOverlay {
  const overlay: BoardOverlay = { arrows: [], squareStyles: {} };
  for (const square of diffSquares) overlay.squareStyles[square] = { backgroundColor: "rgba(220, 38, 38, 0.45)" };
  return overlay;
}

export function sideToMove(fen: string): "white" | "black" {
  return fen.split(" ")[1] === "b" ? "black" : "white";
}

export function fenAfterMoves(fen: string, moves: string[], count: number): string {
  if (count === 0) return fen;
  const chess = new Chess(fen);
  for (const move of moves.slice(0, count)) {
    chess.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: move[4] as "q" | "r" | "b" | "n" | undefined });
  }
  return chess.fen();
}
