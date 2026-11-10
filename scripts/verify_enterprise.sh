#!/usr/bin/env bash
# ==============================================================================
# Enterprise Verification Suite - Frictionless Offline / Mock Verification
# Usage: ./scripts/verify_enterprise.sh [--mock]
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

export MOCK_MODE=1

echo "======================================================================"
echo "⚡ RUNNING ENTERPRISE VERIFICATION SUITE: enterprise-unslop-engine"
echo "   Mode: MOCK_MODE=${MOCK_MODE} (Zero Credentials / Offline Verification)"
echo "   Root: ${REPO_ROOT}"
echo "======================================================================"

cd "${REPO_ROOT}"

echo ""
echo "[Step 1/3] Running Enterprise Unslop Gate Scanner on repository..."
SARIF_OUT="/tmp/enterprise-unslop-verify.sarif"
node scripts/enterprise-unslop-gate.js --target="${REPO_ROOT}" --fail=false --sarif="${SARIF_OUT}"
test -f "${SARIF_OUT}" && echo "✓ SARIF report generated successfully at ${SARIF_OUT}"

echo ""
echo "[Step 2/3] Validating Unslop Detection Rules against Slop & Clean Fixtures..."
node -e '
const fs = require("fs");
const path = require("path");

// Mock slop fixture violating gradient and superlative rules
const slopSample = `
<div class="bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl">
  <span class="rounded-full border px-3 py-1 text-xs">🚀 AI Powered</span>
  <h1>Supercharge and revolutionize your enterprise workflow!</h1>
</div>
`;

// Clean enterprise fixture
const cleanSample = `
<div class="bg-slate-900 border border-slate-800 text-slate-100 p-6">
  <span class="text-sm font-semibold tracking-wide uppercase text-blue-400">Telemetry</span>
  <h2>Deterministic Distributed State Engine</h2>
</div>
`;

const tmpSlop = "/tmp/slop_fixture.html";
const tmpClean = "/tmp/clean_fixture.html";
fs.writeFileSync(tmpSlop, slopSample);
fs.writeFileSync(tmpClean, cleanSample);

const { execSync } = require("child_process");
try {
  execSync(`node scripts/enterprise-unslop-gate.js --target=${tmpSlop} --fail=true`, { stdio: "pipe" });
  console.error("FAIL: Expected slop fixture to be flagged!");
  process.exit(1);
} catch (e) {
  console.log("✓ Correctly detected and rejected slop infractions in fixture (exit code != 0)");
}

try {
  execSync(`node scripts/enterprise-unslop-gate.js --target=${tmpClean} --fail=true`, { stdio: "pipe" });
  console.log("✓ Correctly passed pristine clean enterprise fixture (exit code 0)");
} catch (e) {
  console.error("FAIL: Clean fixture failed unslop gate!", e.message);
  process.exit(1);
}
'

echo ""
echo "[Step 3/3] Validating Enterprise Proxy Gateway Syntax & Handlers..."
node -c proxy/gateway.js
echo "✓ Proxy gateway syntax validated"

echo ""
echo "======================================================================"
echo "✅ ENTERPRISE VERIFICATION SUITE PASSED (enterprise-unslop-engine)"
echo "======================================================================"
