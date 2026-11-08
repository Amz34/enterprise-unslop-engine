#!/usr/bin/env node
/**
 * Enterprise Visual Regression Engine
 * Compares before/after renders and highlights slop delta.
 */

const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatchModule = require(path.resolve(__dirname, '../node_modules/pixelmatch'));
const pixelmatch = pixelmatchModule.default || pixelmatchModule;

function compareSnapshots(img1Path, img2Path, diffOutputPath, threshold = 0.1) {
  if (!fs.existsSync(img1Path) || !fs.existsSync(img2Path)) {
    console.error(`Error: One or both image files do not exist: ${img1Path}, ${img2Path}`);
    process.exit(1);
  }

  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));

  const width = Math.min(img1.width, img2.width);
  const height = Math.min(img1.height, img2.height);

  // Resize buffers to common intersection if needed
  function cropTo(img, w, h) {
    if (img.width === w && img.height === h) return img;
    const cropped = new PNG({ width: w, height: h });
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idxFrom = (img.width * y + x) << 2;
        const idxTo = (w * y + x) << 2;
        cropped.data[idxTo] = img.data[idxFrom];
        cropped.data[idxTo + 1] = img.data[idxFrom + 1];
        cropped.data[idxTo + 2] = img.data[idxFrom + 2];
        cropped.data[idxTo + 3] = img.data[idxFrom + 3];
      }
    }
    return cropped;
  }

  const cropped1 = cropTo(img1, width, height);
  const cropped2 = cropTo(img2, width, height);
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    cropped1.data,
    cropped2.data,
    diff.data,
    width,
    height,
    { threshold }
  );

  const totalPixels = width * height;
  const mismatchPercentage = ((numDiffPixels / totalPixels) * 100).toFixed(2);

  fs.mkdirSync(path.dirname(diffOutputPath), { recursive: true });
  fs.writeFileSync(diffOutputPath, PNG.sync.write(diff));

  console.log(`\n======================================================`);
  console.log(`  VISUAL REGRESSION & REDLINE ANALYSIS`);
  console.log(`  Baseline:   ${img1Path}`);
  console.log(`  Candidate:  ${img2Path}`);
  console.log(`  Diff Map:   ${diffOutputPath}`);
  console.log(`  Pixel Delta: ${numDiffPixels} / ${totalPixels} (${mismatchPercentage}%)`);
  console.log(`======================================================\n`);

  return { numDiffPixels, mismatchPercentage, diffOutputPath };
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Usage: node visual-diff.js <baseline.png> <candidate.png> [diff-output.png]");
  process.exit(0);
}

const baseline = args[0];
const candidate = args[1];
const diffOut = args[2] || './visual-audits/diff.png';

compareSnapshots(baseline, candidate, diffOut);
