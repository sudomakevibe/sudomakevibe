cat > ~/Developer/sudomakevibe/scripts/compile-broadcast.js << 'ENDOFFILE'
#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Parse YAML frontmatter from a markdown file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    throw new Error('No frontmatter found');
  }
  const yaml = match[1];
  const data = {};
  yaml.split('\n').forEach(line => {
    if (!line.trim()) return;
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();
    value = value.replace(/^["']|["']$/g, '');
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map(v => v.trim().replace(/^["']|["']$/g, ''));
    }
    data[key] = value;
  });
  return data;
}
/**
 * Generate subject line (lowercase, max 40 chars)
 */
function generateSubjectLine(title) {
  const base = `new post: ${title}`.toLowerCase();
  return base.length <= 40 ? base : base.substring(0, 37) + '...';
}
/**
 * Build the email content from template
 */
function buildEmailContent(frontmatter, noteContent) {
  const {
    title,
    description,
    slug,
  } = frontmatter;
  const readingTime = frontmatter.readingTime || '5 min read';
  const template = `
<html>
<body style="font-family: 'JetBrains Mono', monospace; color: #000; background-color: #fff; line-height: 1.6;">
<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 40px;">
    <code style="color: #318BBF;">$ sudo get updates</code><br/>
    <small style="color: #666;">longer reads | deeper breaths | sudo make calm</small>
  </div>
  <!-- Main content -->
  <div style="margin-bottom: 40px;">
    <h2 style="font-size: 20px; margin: 20px 0 10px 0;">${title}</h2>
    <p style="color: #666; margin: 0 0 15px 0;">${description}</p>
    <p style="margin: 15px 0;">
      <a href="https://sudomakevibe.com/blog/${slug}" style="color: #318BBF; text-decoration: none; border-bottom: 1px solid #318BBF;">
        Read on the site →
      </a>
    </p>
  </div>
  <!-- Personal note -->
  <div style="background-color: #f9f9f9; padding: 20px; border-left: 3px solid #318BBF; margin-bottom: 40px;">
    <h3 style="font-size: 14px; margin: 0 0 10px 0;">A note from me</h3>
    <p style="margin: 0; font-size: 14px; color: #333;">
      ${noteContent.replace(/\n/g, '<br/>')}
    </p>
    <p style="margin: 10px 0 0 0; font-size: 14px;">— Farooq</p>
  </div>
  <!-- Footer -->
  <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 12px; color: #999;">
    <p style="margin: 5px 0;">sudomakevibe.com — where the command line meets the creative line</p>
    <p style="margin: 5px 0;">One email every two weeks.</p>
  </div>
</div>
</body>
</html>
`;
  return template.trim();
}
/**
 * Main
 */
async function main() {
  const [, , postFile, noteFile, outputFile] = process.argv;
  if (!postFile || !noteFile || !outputFile) {
    console.error('Usage: compile-broadcast.js <post-file> <note-file> <output-file>');
    process.exit(1);
  }
  try {
    const postContent = fs.readFileSync(postFile, 'utf-8');
    const noteContent = fs.readFileSync(noteFile, 'utf-8');
    const frontmatter = parseFrontmatter(postContent);
    const subjectLine = generateSubjectLine(frontmatter.title);
    const emailHtml = buildEmailContent(frontmatter, noteContent);
    // TEST MODE: Schedule for 10 minutes from now instead of Saturday 9 AM
    const now = new Date();
    const scheduledAt = new Date(now.getTime() + 10 * 60 * 1000);
    const scheduledAtISO = scheduledAt.toISOString();
    const broadcast = {
      slug: frontmatter.slug,
      subject: subjectLine,
      preview_text: frontmatter.description.substring(0, 100),
      content: emailHtml,
      scheduled_at: scheduledAtISO,
      form_id: parseInt(process.env.KIT_FORM_ID || '9259710'),
      frontmatter: frontmatter,
      compiled_at: new Date().toISOString(),
    };
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(broadcast, null, 2));
    console.log(`✅ Compiled: ${path.basename(outputFile)}`);
    console.log(`   Subject: ${broadcast.subject}`);
    console.log(`   Scheduled: ${scheduledAt.toLocaleString('en-US', { timeZone: 'America/New_York' })} ET`);
  } catch (error) {
    console.error(`❌ Error compiling broadcast: ${error.message}`);
    process.exit(1);
  }
}
main();
ENDOFFILE
