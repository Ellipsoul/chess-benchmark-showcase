import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — ChessQA Explorer",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-semibold">About</h1>

      <h2 className="mt-8 text-lg font-semibold">What ChessQA measures</h2>
      <p className="mt-2 text-stone-700 dark:text-stone-300">
        ChessQA is a 3,500-item benchmark from CSSLab at the University of Toronto
        (<a className="underline" href="https://arxiv.org/abs/2510.23948">arXiv:2510.23948</a>) that probes
        LLM chess understanding across five categories of ascending abstraction:
        <strong> Structural</strong> (can the model read a board at all — piece placement, legal moves,
        checks), <strong>Motifs</strong> (recognizing pins, forks, skewers, batteries),
        <strong> Short Tactics</strong> (finding the best move in puzzle positions),
        <strong> Position Judgement</strong> (classifying a position&apos;s engine evaluation into five buckets),
        and <strong>Semantic</strong> (multiple-choice questions built from human game commentary).
        Every question is grounded in a concrete position, so answers are mechanically checkable.
      </p>

      <h2 className="mt-8 text-lg font-semibold">What this smoke campaign was</h2>
      <p className="mt-2 text-stone-700 dark:text-stone-300">
        In July 2026 we ran sixteen frontier-model configurations (fourteen distinct fleet configs plus two
        reused baselines) against a 50-task sample — exactly one position per task type, spanning all five
        categories. The point was to validate the harness, measure per-model cost and trace fidelity, and
        surface behavior worth studying before committing to the full 3,500-task run. That is why this site
        is a <em>behavior browser, not a leaderboard</em>: with one position per task type, category numbers
        are anecdotes. Counts (&quot;23/24&quot;) are shown everywhere instead of percentages.
      </p>

      <h2 className="mt-8 text-lg font-semibold">How answers were scored</h2>
      <p className="mt-2 text-stone-700 dark:text-stone-300">
        Answers are extracted from the model&apos;s final <code className="font-mono text-sm">FINAL ANSWER:</code> line
        and scored by exact match (set match for multi-answer questions), following the paper&apos;s protocol.
        Outcomes shown here collapse the harness&apos;s error taxonomy: <strong>correct</strong>,
        <strong> wrong</strong>, <strong>illegal move</strong> (a wrong single-move answer that is not even
        legal in the position — verified with python-chess at export time), <strong>ran out of tokens</strong>
        (the model burned its entire 32K thinking budget without producing an answer), and
        <strong> format error</strong> (no parseable answer). The legality check is the first mechanical
        trace/answer verification from our Phase 3 roadmap, shipped early.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Thinking traces and fidelity</h2>
      <p className="mt-2 text-stone-700 dark:text-stone-300">
        The centerpiece of this site is the unedited reasoning stream behind each answer. Providers differ in
        what they return: <strong>full_text</strong> is the raw, unedited chain of thought
        (Gemini 3.x and the open-weight reasoners return this); <strong>summary</strong> is a
        provider-generated summary of reasoning the provider keeps private (OpenAI models, and Anthropic
        models from the adaptive-thinking generation onward — Claude 5 family and Opus ≥ 4.7 — never expose raw
        CoT, so their traces here are provider-summarized); <strong>plain</strong> is reasoning the model wrote
        directly into its visible output; <strong>none</strong> means no trace was returned. Each trace drawer
        is labeled with its fidelity tier, and every model page records the exact reasoning payload sent.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Roadmap</h2>
      <p className="mt-2 text-stone-700 dark:text-stone-300">
        Next: the full 3,500-task run with proper uncertainty quantification, then reasoning-trace root-cause
        analysis — mechanically verifying every calculated line in the thinking traces with python-chess
        (illegal-line rates, break depth, phantom pieces) plus a failure-mode taxonomy calibrated against
        hand labels by a FIDE Master. This site will grow to browse those results.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Attribution</h2>
      <p className="mt-2 text-stone-700 dark:text-stone-300">
        The ChessQA benchmark is by CSSLab, University of Toronto —
        upstream at <a className="underline" href="https://github.com/CSSLab/chessqa-benchmark">github.com/CSSLab/chessqa-benchmark</a> (MIT
        license). Our harness fork, results, and the exporter that produced this site&apos;s data live
        at <a className="underline" href="https://github.com/Ellipsoul/chessqa-benchmark">github.com/Ellipsoul/chessqa-benchmark</a>.
        All costs shown are real measured API spend from the runs, as reported by the gateway per call.
      </p>
    </main>
  );
}
