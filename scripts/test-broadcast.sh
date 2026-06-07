#!/bin/bash

# Local test script for newsletter broadcast compilation
# Run this before pushing to validate the broadcast will compile correctly
#
# Usage: ./scripts/test-broadcast.sh <post-file>
# Example: ./scripts/test-broadcast.sh src/content/posts/sudo-make-second-brain.md

set -e

POST_FILE="$1"

if [ -z "$POST_FILE" ]; then
  echo "Usage: ./scripts/test-broadcast.sh <post-file>"
  echo "Example: ./scripts/test-broadcast.sh src/content/posts/sudo-make-second-brain.md"
  exit 1
fi

if [ ! -f "$POST_FILE" ]; then
  echo "❌ Post file not found: $POST_FILE"
  exit 1
fi

# Extract filename without extension
filename=$(basename "$POST_FILE" .md)
note_file="src/content/posts/${filename}.note.md"

if [ ! -f "$note_file" ]; then
  echo "❌ Note file not found: $note_file"
  echo ""
  echo "Create the note file with 2-3 sentences:"
  echo "Origin: [how this project started]"
  echo "Surprise: [what surprised you]"
  echo "Next: [what's coming next]"
  exit 1
fi

echo "Testing broadcast compilation..."
echo ""
echo "📄 Post file: $POST_FILE"
echo "📝 Note file: $note_file"
echo ""

# Create temp output directory
mkdir -p /tmp/broadcast-test

# Run compilation script
export KIT_FORM_ID=9259710
node scripts/compile-broadcast.js "$POST_FILE" "$note_file" "/tmp/broadcast-test/${filename}.json"

if [ $? -ne 0 ]; then
  echo "❌ Compilation failed"
  exit 1
fi

echo ""
echo "✅ Compilation successful!"
echo ""

# Show preview
echo "📋 Broadcast Preview:"
echo "---"
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/tmp/broadcast-test/${filename}.json', 'utf-8'));
console.log('Subject: ' + data.subject);
console.log('Preview: ' + data.preview_text);
console.log('Scheduled: ' + new Date(data.scheduled_at).toLocaleString('en-US', { timeZone: 'America/New_York' }) + ' ET');
"
echo "---"
echo ""
echo "✅ Ready to push! The broadcast will be sent to Kit on Saturday 9 AM ET."
