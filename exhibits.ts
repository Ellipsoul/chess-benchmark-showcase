export interface Exhibit { title: string; blurb: string; href: string }

// NOTE for reviewer (Aron): blurb wording makes chess claims — please verify before launch.
export const EXHIBITS: Exhibit[] = [
  {
    title: "266,000 characters of re-examining the king's desperation",
    blurb: "Gemini 3.1 Pro burns its entire 32K-token budget circling one defensive puzzle — and never produces an answer.",
    href: "/category/short-tactics?run=google_gemini-3.1-pro-preview-thinking#short_tactics_theme_defensiveMove_0024",
  },
  {
    title: "A confidently announced mate that doesn't exist",
    blurb: "DeepSeek R1 narrates a forced mate-in-two and commits to it. The line is unsound — the real answer was the queen check.",
    href: "/category/short-tactics?run=deepseek_deepseek-r1-thinking#short_tactics_theme_mateIn2_0013",
  },
  {
    title: "A rook that phases through its own pawn",
    blurb: "Haiku 4.5 answers f8f5 — through White's own pawn on f7. One of 41 illegal moves models played in this smoke set.",
    href: "/category/short-tactics?run=anthropic_claude-haiku-4.5-thinking#short_tactics_theme_advancedPawn_0001",
  },
  {
    title: "The imagined board drifts from reality",
    blurb: "Asked to track a long move sequence, Haiku's mental board ends with the king on the wrong square and a bishop vanished entirely — shown side by side with the truth.",
    href: "/category/structural?run=anthropic_claude-haiku-4.5#structural_state_tracking_long_0049",
  },
];
