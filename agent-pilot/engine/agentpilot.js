#!/usr/bin/env node
/**
 * AgentPilot Optimization Engine
 * Implements the Dual-Model Iterative Hill-Climbing loop:
 *  - Evaluates objective scoring function on each candidate attempt
 *  - Manages branch state and score registry
 *  - Prunes regressions and promotes winning code candidates
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
let targetFile = '';
let scoreCommand = '';
let maxAttempts = 3;
let direction = 'maximize'; // 'maximize' or 'minimize'

args.forEach(arg => {
  if (arg === 'optimize') return;
  if (arg.startsWith('--target=')) targetFile = arg.split('=')[1];
  else if (arg.startsWith('--score-cmd=')) scoreCommand = arg.split('=')[1];
  else if (arg.startsWith('--max-attempts=')) maxAttempts = parseInt(arg.split('=')[1], 10);
  else if (arg.startsWith('--direction=')) direction = arg.split('=')[1];
  else if (!targetFile && !arg.startsWith('-')) targetFile = arg;
});

if (!targetFile || !scoreCommand) {
  console.log(`
AgentPilot Engine - Goal-Driven Dual-Model Optimizer

Usage:
  agentpilot optimize <target-file> --score-cmd="<cmd>" [--max-attempts=3] [--direction=minimize|maximize]
`);
  process.exit(1);
}

function runScore(cmd) {
  try {
    const raw = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    const match = raw.match(/SCORE[:=]\s*([0-9.]+)/i);
    if (match) return parseFloat(match[1]);
    const num = parseFloat(raw.trim().split('\n').pop());
    return isNaN(num) ? 0 : num;
  } catch (err) {
    if (err.stdout) {
      const match = err.stdout.match(/SCORE[:=]\s*([0-9.]+)/i);
      if (match) return parseFloat(match[1]);
    }
    return direction === 'minimize' ? 999999 : 0;
  }
}

function isBetter(newScore, currentBest) {
  return direction === 'minimize' ? newScore < currentBest : newScore > currentBest;
}

const absTarget = path.resolve(targetFile);
if (!fs.existsSync(absTarget)) {
  console.error(`Target file does not exist: ${absTarget}`);
  process.exit(1);
}

const originalContent = fs.readFileSync(absTarget, 'utf8');
const baselineScore = runScore(scoreCommand);

console.log(`\n======================================================`);
console.log(` 🚀 AGENTPILOT ITERATIVE SEARCH ENGINE`);
console.log(` Target:         ${absTarget}`);
console.log(` Scoring Metric: ${scoreCommand}`);
console.log(` Optimization:   ${direction.toUpperCase()}`);
console.log(` Baseline Score: ${baselineScore}`);
console.log(` Max Attempts:   ${maxAttempts}`);
console.log(`======================================================\n`);

let bestScore = baselineScore;
let bestContent = originalContent;
let attemptHistory = [{ attempt: 0, score: baselineScore, status: 'baseline' }];

for (let i = 1; i <= maxAttempts; i++) {
  console.log(`\n--- [Attempt ${i} / ${maxAttempts}] ---`);

  // Run codemod / refinement step using the centralized unfazed unslop tool
  const tempCandidate = `/tmp/agentpilot-attempt-${i}-${path.basename(absTarget)}`;
  fs.writeFileSync(tempCandidate, bestContent);

  // Invoke refactor pass
  const autofixScript = '/home/ubuntu/.infra-packages/enterprise-unslop-gh/autofix/autofix.js';
  try {
    execSync(`node "${autofixScript}" "${tempCandidate}" -o "${tempCandidate}"`, { stdio: 'pipe' });
  } catch (e) {}

  const scoreCmdWithCandidate = scoreCommand.replace(new RegExp(absTarget, 'g'), tempCandidate);
  const score = runScore(scoreCmdWithCandidate);

  console.log(`Candidate Score: ${score} (Current Best: ${bestScore})`);

  if (isBetter(score, bestScore)) {
    console.log(`✅ Improvement detected (${bestScore} -> ${score}). Branch accepted.`);
    bestScore = score;
    bestContent = fs.readFileSync(tempCandidate, 'utf8');
    attemptHistory.push({ attempt: i, score, status: 'promoted' });
  } else {
    console.log(`⚠️  No improvement or regression (${score}). Pruning branch.`);
    attemptHistory.push({ attempt: i, score, status: 'pruned' });
  }
}

// Write winning iteration to destination
fs.writeFileSync(absTarget, bestContent);

console.log(`\n======================================================`);
console.log(` 🏆 OPTIMIZATION COMPLETE`);
console.log(` Baseline:    ${baselineScore}`);
console.log(` Best Score:  ${bestScore} (${direction === 'minimize' ? ((baselineScore - bestScore)/baselineScore*100).toFixed(1) : ((bestScore - baselineScore)/baselineScore*100).toFixed(1)}% improvement)`);
console.log(` Output:      ${absTarget}`);
console.log(`======================================================\n`);
console.log("Branch Trajectory:", JSON.stringify(attemptHistory, null, 2));
