# ⚡ Enterprise Unslop Engine & AgentPilot Optimizer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![SARIF: v2.1.0](https://img.shields.io/badge/SARIF-OASIS_v2.1.0-green.svg)](https://github.com/oasis-tcs/sarif-spec)
[![Architecture: Dual--Model](https://img.shields.io/badge/Architecture-Dual--Model_MCTS-orange.svg)](#architecture)

An enterprise-grade UI craft governance platform and autonomous search optimizer built for engineering organizations. It eliminates AI-generated "UI slop" (gratuitous purple/indigo gradients, blur orbs, cliché emojis, hyper-rounded pill bloat, and hollow marketing buzzwords) while providing continuous hill-climbing optimization via **AgentPilot**.

---

## 🏛️ High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│             ENTERPRISE UI CRAFT & AGENT OPTIMIZATION MESH             │
└────────────────────────────────────────────────────────────────────────┘
       │
       ├── 1. IDE AST Layer (eslint-plugin-unslop)
       │      └─ In-editor real-time AST linting preventing AI UI anti-patterns
       │
       ├── 2. Git Pre-Commit Hook (git-hooks/pre-commit)
       │      └─ Deterministically rejects staged commits containing raw AI slop
       │
       ├── 3. CI/CD & SARIF Gate (GitHub Actions Composite Action)
       │      └─ Emits OASIS SARIF v2.1.0 reports directly into GitHub Code Scanning
       │
       ├── 4. Visual Regression Engine (Pixelmatch + Headless Chromium)
       │      └─ Generates sub-pixel visual delta maps against design baselines
       │
       ├── 5. Autonomous PR Bot & Webhook Daemon (:9095 & :9090 Gateway)
       │      └─ Formats PR review comments & triggers automated codemods
       │
       └── 6. Dual-Model Optimizer (AgentPilot)
              └─ Hill-climbs against objective performance & craft benchmarks
```

---

## 🚀 Key Subsystems

### 1. Zero-Slop AST & Codemod Engine
Detects and refactors:
- **Color**: Replaces clichéd purple/indigo AI gradients with quiet canvas neutrals (`#090a0f`, zinc/slate) and a single brand accent.
- **Lighting**: Replaces high-radius blur orbs and pulsing glow buttons with crisp optical micro-shadows (`shadow-craft-sm`).
- **Clutter**: Purges clichéd AI emojis (`✨, 🚀, ⚡, 🔥`) from headings, badges, and navigation.
- **Copy**: Rewrites hollow marketing superlatives (*"Supercharge Your X with AI"*) into clear, domain-specific functional statements.

### 2. Dual-Model Search Optimizer (`AgentPilot`)
Implements iterative tree search / hill-climbing:
- **Lightweight Evaluator (9B / Compact Model)**: Assesses score deltas, budgets trials, and prunes regressions.
- **Frontier Coder**: Synthesizes clean code diffs for promising candidate branches.
- **Benchmark Suite**: Supports composite craft indices (0–100), bundle size minimization, and sub-pixel visual regression tolerances.

### 3. GitHub Actions & SARIF Gate
Easily integrates into existing CI/CD pipelines:
```yaml
- name: Run Enterprise Unslop Gate
  uses: Amz34/enterprise-unslop-engine/actions/unslop-gate@main
  with:
    target-path: '.'
    fail-on-findings: 'true'
    sarif-output: 'unslop-results.sarif'
```

---

## 💻 CLI Quickstart

```bash
# Scan a directory or component for slop
unslop audit ./src/components

# Enforce strict zero-tolerance CI gate
unslop qa ./src/pages/index.tsx

# Programmatic Dual-Model Optimization
agentpilot optimize ./src/pages/dashboard.tsx \
  --score-cmd="npm run test:craft-score" \
  --direction=maximize \
  --max-attempts=3
```

---

## 🛡️ Engineering Philosophy

> *"Never let an AI agent guess what deterministic code and static ASTs can verify."*

Authored & Engineered by **[Aamir Zameer](https://github.com/Amz34)**  
*Principal AI Architect & Enterprise Forward Deployed Engineer*
