// In-memory rate limiter: max 5 requests per IP per 10 minutes.
// On Vercel, each serverless function instance is isolated, so this only
// prevents burst abuse within a single instance. For production-grade
// rate limiting across all instances, replace with Vercel KV or Upstash Redis.
const rateLimit = new Map();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry) {
    rateLimit.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (now - entry.windowStart > WINDOW_MS) {
    // Window expired — reset
    rateLimit.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Periodically clean up old entries to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimit.entries()) {
    if (now - entry.windowStart > WINDOW_MS) {
      rateLimit.delete(ip);
    }
  }
}, WINDOW_MS);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract IP — Vercel sets x-forwarded-for
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: "Too many requests. Please try again in a few minutes.",
    });
  }

  const { email } = req.body;

  if (!email || !email.includes("@") || email.length > 254) {
    return res.status(400).json({ error: "Valid email address is required" });
  }

  const API_KEY = process.env.CONVERTKIT_API_KEY;
  const FORM_ID = "9259710";
  const API_URL = "https://api.kit.com/v4";

  if (!API_KEY) {
    console.error("CONVERTKIT_API_KEY is not set");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    // Step 0: Check if subscriber already exists
    const checkResponse = await fetch(
      `${API_URL}/subscribers?email_address=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "X-Kit-Api-Key": API_KEY,
        },
      }
    );
    
    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      console.log(`DEBUG: Checked for ${email}, found ${checkData.subscribers?.length || 0} subscribers`);
      if (checkData.subscribers && checkData.subscribers.length > 0) {
        console.log(`DEBUG: Duplicate detected for ${email}, sending Postmark email`);
        // Subscriber already exists — send notification via Postmark
        const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY;
        if (POSTMARK_API_KEY) {
          try {
            const pmResponse = await fetch('https://api.postmarkapp.com/email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Postmark-Server-Token': POSTMARK_API_KEY,
              },
              body: JSON.stringify({
                From: 'noreply@sudomakevibe.com',
                To: email,
                Subject: 'You\'re already subscribed to sudo make vibe!',
                HtmlBody: `
                  <p>Hey there!</p>
                  <p>It looks like this email is already subscribed to our newsletter.</p>
                  <p>If you didn't receive a confirmation email, check your spam folder.</p>
                  <p>Can't find it? Just reply to this email and we'll send you a fresh confirmation link.</p>
                  <p>— Farooq</p>
                `,
                TextBody: 'You are already subscribed to sudo make vibe newsletter. Check your spam folder for the confirmation email.',
              }),
            });
            if (!pmResponse.ok) {
              const pmError = await pmResponse.json();
              console.error('Postmark API error:', pmResponse.status, pmError);
            } else {
              console.log('Postmark email sent successfully');
            }
          } catch (error) {
            console.error('Postmark fetch error:', error.message);
          }
        }
        return res.status(200).json({ 
          success: true, 
          message: "You are already subscribed!" 
        });
      }
    }
    
    // Step 1: Create subscriber as inactive
    const createResponse = await fetch(`${API_URL}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": API_KEY,
      },
      body: JSON.stringify({
        email_address: email,
        state: "inactive",
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(errorData.errors?.[0] || "Failed to create subscriber");
    }

    // Step 2: Add to form (triggers confirmation email)
    const formResponse = await fetch(
      `${API_URL}/forms/${FORM_ID}/subscribers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Kit-Api-Key": API_KEY,
        },
        body: JSON.stringify({ email_address: email }),
      }
    );

    if (formResponse.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorData = await formResponse.json();
      throw new Error(errorData.errors?.[0] || "Failed to add to form");
    }
  } catch (error) {
    console.error("ConvertKit error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
