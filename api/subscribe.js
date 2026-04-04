export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  // Validate email
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email address is required" });
  }

  const API_KEY = process.env.CONVERTKIT_API_KEY;
  const FORM_ID = "9259710";
  const API_URL = "https://api.kit.com/v4";

  // Check if API key exists
  if (!API_KEY) {
    console.error("CONVERTKIT_API_KEY is not set");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    // Step 1: Create subscriber as 'inactive'
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

    // Step 2: Add subscriber to form (triggers confirmation email)
    const formResponse = await fetch(
      `${API_URL}/forms/${FORM_ID}/subscribers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Kit-Api-Key": API_KEY,
        },
        body: JSON.stringify({
          email_address: email,
        }),
      },
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
