# Documentation map

This repository intentionally keeps its local documentation thin. The public product
description and development commands live in `../README.md`; contributor and agent rules
live in `../AGENTS.md`. Durable research, experiment, and exporter-design records live in
the sibling `../../chessqa-benchmark` repository so the producer contract and its
rationale are documented together.

## Start a session

1. Read [`../AGENTS.md`](../AGENTS.md).
2. Read [`../README.md`](../README.md) for current public framing and features.
3. For cross-repository work, read
   [`../../chessqa-benchmark/docs/STATUS.md`](../../chessqa-benchmark/docs/STATUS.md).
4. Load only the relevant source below, then verify it against current code.

## Cross-repository sources

| Document | Use it for |
|---|---|
| [`../../chessqa-benchmark/docs/README.md`](../../chessqa-benchmark/docs/README.md) | Lifecycle-aware index of all research and implementation documentation |
| [`../../chessqa-benchmark/docs/STATUS.md`](../../chessqa-benchmark/docs/STATUS.md) | Current project state, open decisions, and repository ownership |
| [`../../chessqa-benchmark/docs/superpowers/specs/2026-07-13-chessqa-explorer-design.md`](../../chessqa-benchmark/docs/superpowers/specs/2026-07-13-chessqa-explorer-design.md) | Approved v1 product, data, loading, and operations decisions |
| [`../../chessqa-benchmark/eval/export_web.py`](../../chessqa-benchmark/eval/export_web.py) | Producer-side static JSON contract and chess-answer parsing |
| [`../../chessqa-benchmark/tests/test_export_web.py`](../../chessqa-benchmark/tests/test_export_web.py) | Executable producer-contract examples and regression coverage |

The dated implementation plans in the benchmark repository record how v1 was built.
They contain original `web/` and `src/` paths that were superseded when this became a
separate root-layout repository. Do not use those paths as current instructions.

## Ownership rule

If a change alters how chess answers are interpreted, legality is determined, outcomes
are assigned, prompts are resolved, or fields are exported, make it in the benchmark
repository first. If it changes how an existing field is presented or interacted with,
make it here. Contract changes require verification on both sides.

`public/data/` is a generated, reviewable release artifact. Refresh it through the
sibling exporter; do not edit JSON by hand.
