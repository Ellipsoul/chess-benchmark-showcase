// Mirrors eval/export_web.py output in the chessqa-benchmark repo; do not rename fields.
export type Outcome = "correct" | "wrong" | "illegal" | "capped" | "format_error";
export type Legality = "legal" | "illegal" | "unparseable" | null;
export type ThinkingSource = "full_text" | "summary" | "plain" | "untyped" | "encrypted_only" | "none" | null;

export interface ArrowSpec { from: string; to: string; promotion?: string }
export type Primitives =
  | { type: "moves"; arrows: ArrowSpec[] }
  | { type: "chain"; arrows: ArrowSpec[] }
  | { type: "squares"; squares: string[] }
  | { type: "pieces"; items: { color: string; piece: string; square: string }[] }
  | { type: "fen"; fen: string; diff_squares: string[] }
  | { type: "eval"; value: number }
  | { type: "choice"; letter: string }
  | { type: "none" }
  | { type: "text"; text: string };

export interface RunSummary {
  slug: string; display_name: string; model: string; backend: string;
  enable_thinking: boolean; reasoning_config: Record<string, unknown> | null;
  git_commit: string | null; started_at: string | null;
  n_results: number; n_correct: number; n_capped: number; n_illegal: number;
  total_cost_usd: number | null; avg_completion_tokens: number | null;
  thinking_sources: Record<string, number>;
}

export interface TaskSummary {
  task_id: string; task_type: string; task_category: string; category_slug: string;
  fen: string; answer_type: "single" | "multi"; outcomes: Record<string, Outcome>;
}

export interface IndexData { generated_at: string; dataset_hash: string | null; runs: RunSummary[]; tasks: TaskSummary[] }

export interface TaskResult {
  run: string; extracted: string | null; error_type: string; outcome: Outcome;
  legality: Legality; primitives: Primitives; cost_usd: number | null;
  completion_tokens: number | null; reasoning_tokens: number | null; latency_ms: number | null;
  n_attempts: number | null; thinking_source: ThinkingSource; thinking_chars: number;
}

export interface TaskDetail {
  task_id: string; task_type: string; task_category: string; question: string;
  resolved_prompt: string; input_fen: string; input_moves: string[];
  metadata: Record<string, unknown> | null; correct_answer: string;
  answer_type: "single" | "multi"; correct_primitives: Primitives; results: TaskResult[];
}

export interface CategoryData { category: string; slug: string; tasks: TaskDetail[] }
export interface TraceData {
  task_id: string;
  traces: Record<string, { thinking_source: ThinkingSource; content: string; response: string }>;
}
