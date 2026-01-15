const axios = require('axios');
const AIProvider = require('./AIProvider');

/**
 * Z.AI Provider Implementation
 */
class ZAIProvider extends AIProvider {
  constructor(apiKey, apiUrl, model) {
    super();
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.model = model;
  }

  getName() {
    return 'z.ai';
  }

  async generateMockup(description, conversationHistory = []) {
    if (!this.apiKey) {
      throw new Error('Z.AI API key is not configured');
    }

    const systemPrompt = `You are an expert UI/UX designer and HTML developer. Generate a complete, self-contained HTML mockup based on the user's description. The HTML should:
- Be a complete, valid HTML5 document
- Include embedded CSS styles (no external stylesheets)
- Be visually appealing and modern
- Include proper semantic HTML
- Be responsive when appropriate
- Include placeholder text and images where needed
- Not include any JavaScript unless specifically requested

Return ONLY the HTML code, nothing else.`;

    // Build messages array with conversation history
    const messages = [{ role: 'system', content: systemPrompt }];
    
    // Add previous conversation history
    for (const item of conversationHistory) {
      messages.push({ role: 'user', content: item.description });
      messages.push({ role: 'assistant', content: item.html });
    }
    
    // Add current user message
    messages.push({ role: 'user', content: description });

    const requestPayload = {
      model: this.model,
      messages: messages,
      temperature: 1,
      stream: false
    };

    // Log the request being sent to the model
    console.log('\n=== Z.AI API Request ===');
    console.log('URL:', this.apiUrl);
    console.log('Model:', this.model);
    console.log('Request Payload:', JSON.stringify(requestPayload, null, 2));
    console.log('========================\n');

    try {
      console.log('Sending request to Z.AI...');
      const response = await axios.post(
        this.apiUrl,
        requestPayload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Log the response received
      console.log('\n=== Z.AI API Response ===');
      console.log('Status:', response.status);
      console.log('Full Response:', JSON.stringify(response.data, null, 2));
      console.log('=========================\n');

      const content = response.data.choices?.[0]?.message?.content;
      if (!content) {
        console.error('ERROR: No content returned from Z.AI API');
        throw new Error('No content returned from Z.AI API');
      }

      // Log the extracted content
      console.log('\n=== Streaming Response Content ===');
      console.log(content);
      console.log('\n=== End of Response ===\n');

      const extractedHTML = this.extractHTML(content);
      console.log('Successfully extracted HTML (length:', extractedHTML.length, 'characters)\n');

      return extractedHTML;
    } catch (error) {
      console.error('\n=== Z.AI API Error ===');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        console.error('======================\n');
        throw new Error(`Z.AI API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      console.error('Error Message:', error.message);
      console.error('======================\n');
      throw new Error(`Z.AI request failed: ${error.message}`);
    }
  }
}

module.exports = ZAIProvider;
