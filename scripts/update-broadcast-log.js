#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Update broadcast log
 */
async function main() {
  const broadcastFiles = process.argv.slice(2);

  if (broadcastFiles.length === 0) {
    console.log('No broadcasts to log');
    process.exit(0);
  }

  const logFile = 'broadcasts/BROADCASTS.log';

  fs.mkdirSync('broadcasts', { recursive: true });

  let logContent = '';
  if (fs.existsSync(logFile)) {
    logContent = fs.readFileSync(logFile, 'utf-8');
  } else {
    logContent = `# Newsletter Broadcasts

Log of all scheduled newsletter broadcasts.

---

`;
  }

  for (const file of broadcastFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const broadcastData = JSON.parse(content);

      const {
        slug,
        subject,
        scheduled_at,
        frontmatter,
      } = broadcastData;

      const scheduledDate = new Date(scheduled_at);
      const dateStr = scheduledDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      const timeStr = scheduledDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/New_York',
      });

      const logEntry = `## ${dateStr} | ${frontmatter.title}
- Post: https://sudomakevibe.com/blog/${slug}
- Broadcast: https://raw.githubusercontent.com/sudomakevibe/sudomakevibe/main/broadcasts/${slug}.json
- Subject: "${subject}"
- Scheduled: ${timeStr} ET
- Status: scheduled

`;

      const lines = logContent.split('\n');
      const headerEndIndex = lines.findIndex(
        (line, idx) =>
          idx > 0 && line.trim() === '---' && lines[idx - 1].trim() === ''
      );

      if (headerEndIndex !== -1) {
        const header = lines.slice(0, headerEndIndex + 1).join('\n');
        const rest = lines.slice(headerEndIndex + 1).join('\n');
        logContent = header + '\n\n' + logEntry + rest;
      } else {
        logContent = logContent + '\n' + logEntry;
      }

      console.log(`✅ Logged: ${slug}`);
    } catch (error) {
      console.error(`❌ Error logging broadcast: ${error.message}`);
      process.exit(1);
    }
  }

  fs.writeFileSync(logFile, logContent);
  console.log(`\n✅ Broadcast log updated: ${logFile}`);
}

main();
