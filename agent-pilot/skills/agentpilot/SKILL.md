---
name: agentpilot
description: Autonomous iterative optimization engine using dual-model architecture (compact evaluator + frontier coder). Iteratively mutates code, scores results against objective benchmark scripts (speed, bundle size, craft score, test pass rate), and explores candidate trees to hill-climb toward optimal solutions.
license: MIT
---

# AgentPilot Skill

AgentPilot enables goal-driven, test-scored iterative programming across multiple attempts:
1. Takes a target file or project and an objective scoring test script.
2. Evaluates the baseline score (e.g., benchmark ms, craft violations, memory bytes).
3. Frontier model generates targeted code modifications.
4. Compact evaluator assesses score deltas, records branch history, and prunes regressions.
5. Emits the best-performing iteration with zero slop and maximum benchmark performance.

## Usage

```bash
agentpilot optimize <target-file> --score-cmd="<command>" [--max-attempts=5]
```
