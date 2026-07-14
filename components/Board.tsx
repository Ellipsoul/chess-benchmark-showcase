"use client";

import { Chessboard } from "react-chessboard";
import type { BoardOverlay } from "@/lib/board";

export function Board({ fen, orientation, overlay, maxWidth = 400 }: {
  fen: string;
  orientation: "white" | "black";
  overlay?: BoardOverlay;
  maxWidth?: number;
}) {
  return (
    <div style={{ maxWidth }} className="w-full select-none">
      <Chessboard
        options={{
          position: fen,
          boardOrientation: orientation,
          allowDragging: false,
          arrows: overlay?.arrows ?? [],
          squareStyles: overlay?.squareStyles ?? {},
        }}
      />
    </div>
  );
}
