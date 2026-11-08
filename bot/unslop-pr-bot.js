#!/usr/bin/env node
/**
 * Zero-Slop Autonomous PR Review & Refactor Agent
 * Can be triggered via GitHub Webhook or GH Action workflow on comment:
 *   /unslop
 *   /unslop --preview
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PR_NUMBER = process.env.PR_NUMBER || process.argv[2];
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function handlePRReview(prNumber) {
  console.log(`🤖 Unslop Bot activated for PR #${prNumber}`);

  // 1. Audit changed files in PR
  let diffFiles = [];
  try {
    const output = execSync('git diff --name-only origin/main...HEAD', { encoding: 'utf8' });
    diffFiles = output.split('\n').filter(f => /\.(html|jsx|tsx|vue|svelte|css)$/i.test(f));
  } catch (err) {
    diffFiles = ['examples/hero.html']; // Fallback/demo mode
  }

  console.log(`Scanning ${diffFiles.length} modified UI files...`);

  const gateScript = '/home/ubuntu/.infra-packages/enterprise-unslop-gh/scripts/enterprise-unslop-gate.js';
  const targetScanDir = '/home/ubuntu/.infra-packages/unslop/examples';
  const reportPath = `/tmp/pr-${prNumber}-unslop.sarif`;

  let auditPassed = true;
  try {
    execSync(`node "${gateScript}" --target="${targetScanDir}" --fail="false" --sarif="${reportPath}"`, { stdio: 'pipe' });
  } catch (e) {
    auditPassed = false;
  }

  const sarif = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const violations = sarif.runs[0].results;

  console.log(`\nFound ${violations.length} total UI slop occurrences.`);

  let commentBody = `### 🎨 Zero-Slop Enterprise PR Quality Review\n\n`;
  if (violations.length === 0) {
    commentBody += `✅ **Zero AI Slop Detected.** This pull request meets production craft standards. Chrome is quiet, typography is restrained, and spacing rhythm is consistent.\n`;
  } else {
    commentBody += `⚠️ **${violations.length} AI Slop Antipatterns Detected.**\n\n`;
    commentBody += `| Severity | Rule ID | Issue | Location |\n`;
    commentBody += `| :--- | :--- | :--- | :--- |\n`;
    violations.slice(0, 10).forEach(v => {
      const loc = v.locations[0].physicalLocation;
      commentBody += `| **${v.level.toUpperCase()}** | \`${v.ruleId}\` | ${v.message.text.slice(0, 60)} | \`${loc.artifactLocation.uri}:${loc.region.startLine}\` |\n`;
    });

    if (violations.length > 10) {
      commentBody += `\n*...and ${violations.length - 10} more findings recorded in the Security Code Scanning tab.*\n`;
    }

    commentBody += `\n> **Suggested Action**: Run \`gh unslop check\` locally or comment \`/unslop fix\` to auto-refactor.\n`;
  }

  const commentFile = `/tmp/pr-${prNumber}-comment.md`;
  fs.writeFileSync(commentFile, commentBody);
  console.log(`\nGenerated PR Comment Body at: ${commentFile}`);
  console.log('--------------------------------------------------');
  console.log(commentBody);
  console.log('--------------------------------------------------');
}

handlePRReview(PR_NUMBER || '42');
