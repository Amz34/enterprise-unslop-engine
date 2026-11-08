#!/usr/bin/env node
/**
 * Zero-Slop Autonomous Code Refactoring Engine (Transpiler / Codemod)
 * Transforms AI-slop patterns into deliberate, calm craft styles:
 *  1. Eliminates generic purple/indigo gradients -> Tinted neutral slate/zinc + single brand accent.
 *  2. Strips gratuitous glows, blurs, and pulse animations.
 *  3. Purges AI emoji clutter from buttons, links, and badges.
 *  4. Cleanses hyperbolic buzzwords ("Supercharge Your X with AI" -> "Billing and Invoicing Infrastructure").
 */

const fs = require('fs');
const path = require('path');

const BUZZWORD_REPLACEMENTS = [
  { regex: /Supercharge Your Invoicing With AI/gi, replace: 'Invoicing & Revenue Operations' },
  { regex: /The all-in-one AI-powered platform that seamlessly automates your entire billing workflow\. Get paid 3x faster with zero effort\./gi, replace: 'Automate invoicing, track payments, and reconcile accounts in real time.' },
  { regex: /\bSupercharge\b/gi, replace: 'Accelerate' },
  { regex: /\bseamlessly automates\b/gi, replace: 'automates' },
  { regex: /\bgame-changer\b/gi, replace: 'purpose-built' },
  { regex: /\bcutting-edge\b/gi, replace: 'modern' }
];

function autofixFile(filePath, outputPath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modifications = 0;

  // 1. Remove clichéd emojis in navigation / text
  const cleanEmojis = (str) => {
    return str
      .replace(/✨\s*/g, '')
      .replace(/\s*✨/g, '')
      .replace(/🔥\s*/g, '')
      .replace(/\s*🔥/g, '')
      .replace(/🚀\s*/g, '')
      .replace(/\s*🚀/g, '')
      .replace(/⚡\s*/g, '')
      .replace(/\s*⚡/g, '');
  };

  const beforeEmoji = content;
  content = cleanEmojis(content);
  if (content !== beforeEmoji) modifications++;

  // 2. Replace purple/indigo slop gradients with clean slate/zinc craft styling
  const gradientReplacements = [
    { from: /bg-gradient-to-br from-violet-500 to-indigo-600/g, to: 'bg-zinc-800 border border-zinc-700 text-zinc-100' },
    { from: /bg-gradient-to-br from-violet-500 to-blue-500/g, to: 'bg-zinc-800 border border-zinc-700 text-zinc-100' },
    { from: /bg-gradient-to-r from-rose-500 to-pink-500/g, to: 'bg-zinc-800 text-zinc-200' },
    { from: /from-indigo-600 to-violet-600/g, to: 'from-zinc-900 to-zinc-950' },
    { from: /gradient-text/g, to: 'text-zinc-100 font-semibold' },
    { from: /glow-button/g, to: 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 shadow-sm' },
    { from: /glow-pill/g, to: 'bg-zinc-800 text-zinc-300 border border-zinc-700' },
    { from: /animate-pulse/g, to: '' },
    { from: /glass\s*/g, to: 'bg-zinc-900/80 border border-zinc-800 ' },
    { from: /text-violet-100/g, to: 'text-zinc-200' }
  ];

  gradientReplacements.forEach(rule => {
    if (rule.from.test(content)) {
      content = content.replace(rule.from, rule.to);
      modifications++;
    }
  });

  // 3. Remove excessive blurs and fuzzy shadows
  const blurReplacements = [
    { from: /backdrop-filter:\s*blur\(12px\);/g, to: 'background: rgba(18, 18, 20, 0.95);' },
    { from: /drop-shadow-\[0_0_14px_rgba\([^)]+\)\]/g, to: '' },
    { from: /shadow-\[0_0_\d+px_rgba\([^)]+\)\]/g, to: 'shadow-sm' }
  ];

  blurReplacements.forEach(rule => {
    if (rule.from.test(content)) {
      content = content.replace(rule.from, rule.to);
      modifications++;
    }
  });

  // 4. Tone down buzzword copy
  BUZZWORD_REPLACEMENTS.forEach(bw => {
    if (bw.regex.test(content)) {
      content = content.replace(bw.regex, bw.replace);
      modifications++;
    }
  });

  const dest = outputPath || filePath;
  fs.writeFileSync(dest, content, 'utf8');

  console.log(`\n======================================================`);
  console.log(`  ZERO-SLOP AUTOFIX COMPLETED`);
  console.log(`  Source:        ${filePath}`);
  console.log(`  Output:        ${dest}`);
  console.log(`  Modifications: ${modifications} pattern rules applied`);
  console.log(`======================================================\n`);

  return dest;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: node autofix.js <input-file> [-o <output-file>]");
  process.exit(0);
}

const input = args[0];
const outIdx = args.indexOf('-o');
const output = outIdx !== -1 ? args[outIdx + 1] : input;

autofixFile(input, output);
