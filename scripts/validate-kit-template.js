#!/usr/bin/env node
export async function validateTemplate(apiKey, templateId) {
  try {
    const response = await fetch(`https://api.kit.com/v4/email_templates/${templateId}`, {
      headers: { 'X-Kit-Api-Key': apiKey }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Template ${templateId} not found — check your KIT_TEMPLATE_ID env variable`);
      }
      throw new Error(`Template validation failed: ${response.status}`);
    }
    
    const response_data = await response.json();
    const template = response_data.email_template;
    
    if (!template) {
      throw new Error(`Invalid template response — no email_template field`);
    }
    
    console.log(`✅ Template validated: "${template.name}" (ID: ${template.id})`);
    
    return { valid: true, template };
  } catch (error) {
    console.error('❌ Template validation failed:', error.message);
    return { valid: false, error: error.message };
  }
}

// Allow script to be run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const apiKey = process.env.KIT_API_KEY;
  const templateId = process.env.KIT_TEMPLATE_ID;
  
  if (!apiKey || !templateId) {
    console.error('❌ Missing environment variables: KIT_API_KEY and/or KIT_TEMPLATE_ID');
    process.exit(1);
  }
  
  const result = await validateTemplate(apiKey, templateId);
  process.exit(result.valid ? 0 : 1);
}
