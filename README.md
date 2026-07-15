# ChessQA Explorer

**A behavior browser for how frontier LLMs think about chess — not a leaderboard.**

Sixteen frontier-model configurations answered fifty chess questions from the
[ChessQA benchmark](https://arxiv.org/abs/2510.23948). This site shows every one of
those 800 attempts on a real board: the answer, what it cost, how long it took, and —
the centerpiece — the unedited thinking trace behind it, including the runs that burned
their entire 32K-token budget mid-thought and never produced an answer at all.

## What's inside

- **The heatmap** — all 800 attempts at a glance (16 models × 50 positions), color-coded
  by outcome. Every cell is a deep link to that model's answer and thoughts on that
  position.
- **Five category pages** — the benchmark's categories of ascending abstraction
  (Structural → Motifs → Short Tactics → Position Judgement → Semantic), each position
  rendered on a real board. The correct answer is drawn in green; hover any model's card
  to overlay its answer — green if right, red if wrong. State-tracking questions get a
  move-by-move stepper and a side-by-side diff of the model's imagined board against
  reality.
- **Thinking traces** — one click per attempt opens the full reasoning stream, labeled
  with its fidelity tier (see below). The 266,000-character trace where Gemini 3.1 Pro
  circles one defensive puzzle until its budget runs out is preserved in full.
- **Model pages** — exact provenance per run: reasoning payload sent, backend, harness
  commit, run date, real measured API cost, and a filterable list of all 50 attempts.
- **Exhibits** — hand-picked deep links to the most telling behavior: illegal moves,
  confidently announced mates that don't exist, boards drifting from reality.

## Why counts, never percentages

Each model saw a 50-task smoke sample — exactly **one position per task type** — so
category-level numbers are anecdotes with wide error bars, not rankings. The UI shows
counts ("23/24") everywhere for exactly that reason. The full 3,500-task run comes
later; this site is the seed of the explorer that will browse it.

## Two details worth knowing

- **Illegal moves are first-class.** Every single-move answer is checked against the
  position with [python-chess](https://github.com/niklasf/python-chess) at export time.
  A wrong answer that isn't even a legal move gets its own badge and heatmap color —
  41 of the 158 wrong Short Tactics answers in this sample are illegal. This is the
  first mechanical verification from the project's reasoning-trace analysis roadmap.
- **Trace fidelity varies by provider.** `full_text` is the raw, unedited chain of
  thought (Gemini 3.x, the open-weight reasoners). `summary` is provider-summarized
  reasoning (OpenAI models; Anthropic models from the adaptive-thinking generation
  onward never expose raw CoT). `plain` is reasoning written directly into visible
  output. Every trace is labeled with its tier — no summary is ever passed off as a
  full stream.

## How the data gets here

This is a fully static site: no server, no database, no tracking. Everything under
[`public/data/`](public/data) (~16 MB of JSON, committed deliberately so what's publicly
visible is reviewable in diffs) is produced by the exporter in the sibling harness repo,
[Ellipsoul/chessqa-benchmark](https://github.com/Ellipsoul/chessqa-benchmark):

```
chessqa-benchmark $ make export-web    # SQLite results DB → ../chess-benchmark-showcase/public/data/
```

The export contract, defined in `eval/export_web.py` over there:

- Runs are selected by rule (`status='complete'` and ≥ 50 results), never by
  hard-coded ids.
- All chess intelligence happens at export time — answers are parsed into render
  primitives (arrows, square highlights, board diffs) per task family, so this frontend
  never parses chess notation.
- Output is byte-deterministic; re-exporting unchanged data produces identical files.
- Raw provider payloads are never exported. Prompts, answers, traces, and costs are.

Pages load light: category pages fetch ~10–40 KB (wire) of core data; traces live in
per-task files fetched lazily on first open or during browser idle time.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # vitest — board-overlay and outcome-mapping logic
npm run lint
npm run build   # static export to out/
```

Built with [Next.js](https://nextjs.org) (App Router, `output: "export"`),
[React](https://react.dev), [Tailwind CSS](https://tailwindcss.com),
[shadcn/ui](https://ui.shadcn.com), and
[react-chessboard](https://github.com/Clariity/react-chessboard) +
[chess.js](https://github.com/jhlywa/chess.js) for the boards. Deployed on
[Vercel](https://vercel.com) as pure static output.

## Attribution

The [ChessQA benchmark](https://arxiv.org/abs/2510.23948) is by **CSSLab, University of
Toronto** — upstream at
[CSSLab/chessqa-benchmark](https://github.com/CSSLab/chessqa-benchmark) (MIT). The
evaluation harness fork, results, and exporter live at
[Ellipsoul/chessqa-benchmark](https://github.com/Ellipsoul/chessqa-benchmark). All costs
shown are real measured API spend, as reported by the gateway per call.
