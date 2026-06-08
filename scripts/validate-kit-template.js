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
    
    const template = await response.json();
    console.log(`✅ Using template: "${template.name}" (ID: ${template.id})`);
    
    // Critical check: does template have the placeholder?
    if (!template.content?.includes('{{ message_content }}')) {
      console.warn('⚠️ Template missing {{ message_content }} variable — content may not render');
    }
    
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
