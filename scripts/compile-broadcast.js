#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = match[1];
  const obj = {};
  const lines = fm.split('\n');
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (!key || !valueParts.length) continue;
    const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
    if (key.trim() === 'tags') {
      obj.tags = value.split(',').map(t => t.trim());
    } else if (key.trim() === 'pubDate') {
      obj.pubDate = value;
    } else {
      obj[key.trim()] = value;
    }
  }
  return obj;
}
function slugify(str) {
  return str.toLowerCase().replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '');
}
function generateEmailContent(frontmatter, noteContent) {
  const slug = slugify(frontmatter.title || 'post');
  const postUrl = `https://sudomakevibe.com/blog/${slug}`;
  return `<div style="margin-bottom: 40px;">
    <h2 style="font-size: 20px; margin: 20px 0 10px 0;">${frontmatter.title}</h2>
    <p style="color: #666; margin: 0 0 15px 0;">${frontmatter.description}</p>
    <p style="margin: 15px 0;">
      <a href="${postUrl}" style="color: #318BBF; text-decoration: none; border-bottom: 1px solid #318BBF;">
        Read on the site →
      </a>
    </p>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-left: 3px solid #318BBF; margin-bottom: 40px;">
    <h3 style="font-size: 14px; margin: 0 0 10px 0;">A note from me</h3>
    <p style="margin: 0; font-size: 14px; color: #333;">
      ${noteContent.trim()}<br/>
    </p>
    <p style="margin: 10px 0 0 0; font-size: 14px;">— Farooq</p>
  </div>`;
}
async function compileBroadcast(postPath, notePath, outputPath) {
  const postContent = fs.readFileSync(postPath, 'utf-8');
  const noteContent = fs.readFileSync(notePath, 'utf-8');
  const frontmatter = extractFrontmatter(postContent);
  const slug = path.basename(postPath, '.md');
  console.log(`DEBUG: slug="${slug}" for ${postPath}`);
  const subject = slug === 'welcome' 
    ? frontmatter.title 
    : `new post: ${frontmatter.title}`;
  const previewText = (frontmatter.description || '').substring(0, 100);
  const htmlContent = generateEmailContent(frontmatter, noteContent);
  const now = new Date();
  const broadcast = {
    subject,
    preview_text: previewText,
    content: htmlContent,
    frontmatter,
    compiled_at: now.toISOString(),
  };
  fs.writeFileSync(outputPath, JSON.stringify(broadcast, null, 2));
  console.log(`✅ Compiled: ${path.basename(outputPath)}`);
  console.log(`   Subject: "${subject}"`);
  console.log(`   Status: Ready for manual sending`);
}
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: compile-broadcast.js <post-path> <note-path> <output-path>');
  process.exit(1);
}
compileBroadcast(args[0], args[1], args[2]).catch(err => {
  console.error(`❌ Compilation failed: ${err.message}`);
  process.exit(1);
});