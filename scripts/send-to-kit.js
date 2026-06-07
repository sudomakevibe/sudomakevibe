#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function kitApiRequest(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.KIT_API_KEY;
    if (!apiKey) {
      return reject(new Error('KIT_API_KEY environment variable not set'));
    }
    const options = {
      hostname: 'api.kit.com',
      path: `/v4${endpoint}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': apiKey,
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`Kit API error (${res.statusCode}): ${parsed.message || data}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Failed to parse Kit API response: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}
async function sendBroadcast(broadcastData) {
  try {
    const now = new Date();
    const payload = {
      broadcast: {
        subject: broadcastData.subject,
        preview_text: broadcastData.preview_text,
        message_content: broadcastData.content,
        public: false,
        published_at: now.toISOString(),
        email_template_id: 4627610,
      },
    };
    console.log(`📤 Sending to Kit: ${broadcastData.subject}`);
    console.log(`   Template ID: 4627610`);
    console.log(`   Scheduled: ${broadcastData.scheduled_at}`);
    const response = await kitApiRequest('POST', '/broadcasts', payload);
    console.log(`✅ Broadcast created`);
    console.log(`   Broadcast ID: ${response.broadcast?.id}`);
    if (response.broadcast?.id) {
      const schedulePayload = {
        public: true,
        send_at: broadcastData.scheduled_at,
      };
      await kitApiRequest('PUT', `/broadcasts/${response.broadcast.id}`, schedulePayload);
      console.log(`✅ Broadcast scheduled`);
    }
    return response;
  } catch (error) {
    console.error(`❌ Failed to send broadcast: ${error.message}`);
    throw error;
  }
}
async function main() {
  const broadcastFiles = process.argv.slice(2);
  if (broadcastFiles.length === 0) {
    console.log('No broadcasts to send');
    process.exit(0);
  }
  let successCount = 0;
  let failureCount = 0;
  for (const file of broadcastFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const broadcastData = JSON.parse(content);
      await sendBroadcast(broadcastData);
      successCount++;
    } catch (error) {
      console.error(`❌ Error processing ${file}: ${error.message}`);
      failureCount++;
    }
  }
  console.log(`\n📊 Summary: ${successCount} sent, ${failureCount} failed`);
  if (failureCount > 0) {
    process.exit(1);
  }
}
main();
