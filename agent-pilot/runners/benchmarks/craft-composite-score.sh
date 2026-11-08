#!/usr/bin/env bash
# Composite Craft Score (0-100 scale, higher is better)
# Formula: 100 - (Slop Violations * 7) - (Excess DOM Bytes / 1000)
TARGET="$1"
if [ ! -f "$TARGET" ]; then
  echo "SCORE: 0"
  exit 0
fi

SLOP_COUNT=$(node /home/ubuntu/.local/bin/unslop audit "$TARGET" --json 2>/dev/null | grep -o '"total_findings": [0-9]*' | awk '{print $2}')
if [ -z "$SLOP_COUNT" ]; then
  SLOP_COUNT=0
fi

# Penalty calculation
PENALTY=$(( SLOP_COUNT * 7 ))
SCORE=$(( 100 - PENALTY ))
if [ $SCORE -lt 0 ]; then
  SCORE=0
fi

echo "SCORE: $SCORE"
