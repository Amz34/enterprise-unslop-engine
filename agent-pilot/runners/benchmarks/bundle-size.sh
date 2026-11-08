#!/usr/bin/env bash
# Evaluates total raw bytes of HTML/JS/CSS assets
TARGET="$1"
if [ ! -f "$TARGET" ]; then
  echo "SCORE: 999999"
  exit 0
fi
BYTES=$(wc -c < "$TARGET" | tr -d ' ')
echo "SCORE: $BYTES"
