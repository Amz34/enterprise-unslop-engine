#!/usr/bin/env bash
TARGET="$1"
COUNT=$(node /home/ubuntu/.local/bin/unslop audit "$TARGET" --json 2>/dev/null | grep -o '"total_findings": [0-9]*' | awk '{print $2}')
if [ -z "$COUNT" ]; then
  COUNT=0
fi
echo "SCORE: $COUNT"
