#!/usr/bin/env bash
# Enterprise Pre-Commit Hook: Zero-Slop UI Gate
echo "🔍 Running Enterprise UI Slop Pre-Commit Validation..."

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(html|jsx|tsx|vue|svelte|css)$')

if [ -z "$STAGED_FILES" ]; then
  echo "✅ No staged UI files to audit."
  exit 0
fi

FAILED=0
for file in $STAGED_FILES; do
  if [ -f "$file" ]; then
    node /home/ubuntu/.infra-packages/enterprise-unslop-gh/scripts/enterprise-unslop-gate.js --target="$file" --fail="true" --sarif="/tmp/pre-commit-sarif.json"
    if [ $? -ne 0 ]; then
      FAILED=1
    fi
  fi
done

if [ $FAILED -ne 0 ]; then
  echo "❌ Commit rejected: AI UI slop detected. Refactor or run 'unslop fix' before committing."
  exit 1
fi

echo "✅ All staged UI files passed zero-slop craft standards."
exit 0
