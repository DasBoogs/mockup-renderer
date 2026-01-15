const axios = require('axios');
const AIProvider = require('./AIProvider');

/**
 * X.AI Provider Implementation
 */
class XAIProvider extends AIProvider {
  constructor(apiKey, apiUrl, model) {
    super();
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.model = model;
  }

  getName() {
    return 'x.ai';
  }

  async generateMockup(description, conversationHistory = []) {
    if (!this.apiKey) {
      throw new Error('X.AI API key is not configured');
    }

    const systemPrompt = `You are an expert UI/UX designer and HTML developer. Generate a complete, self-contained HTML mockup based on the user's description. The HTML should:
- Be a complete, valid HTML5 document
- Include embedded CSS styles (no external stylesheets)
- Be visually appealing and modern
- Include proper semantic HTML
- Be responsive when appropriate
- Include placeholder text and images where needed
- Not include any JavaScript unless specifically required for layout

Return ONLY the HTML code, nothing else.`;

    // Build messages array with conversation history using base class method
    const messages = this.buildMessagesWithHistory(systemPrompt, conversationHistory, description);

    const requestPayload = {
      model: this.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 4000
    };

    // Log the request being sent to the model
    console.log('\n=== X.AI API Request ===');
    console.log('URL:', this.apiUrl);
    console.log('Model:', this.model);
    console.log('Request Payload:', JSON.stringify(requestPayload, null, 2));
    console.log('========================\n');

    try {
      console.log('Sending request to X.AI...');
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
      console.log('\n=== X.AI API Response ===');
      console.log('Status:', response.status);
      console.log('Full Response:', JSON.stringify(response.data, null, 2));
      console.log('=========================\n');

      const content = response.data.choices?.[0]?.message?.content;
      if (!content) {
        console.error('ERROR: No content returned from X.AI API');
        throw new Error('No content returned from X.AI API');
      }

      // Log the extracted content
      console.log('\n=== Streaming Response Content ===');
      console.log(content);
      console.log('\n=== End of Response ===\n');

      const extractedHTML = this.extractHTML(content);
      console.log('Successfully extracted HTML (length:', extractedHTML.length, 'characters)\n');

      return extractedHTML;
    } catch (error) {
      console.error('\n=== X.AI API Error ===');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        console.error('======================\n');
        throw new Error(`X.AI API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      console.error('Error Message:', error.message);
      console.error('======================\n');
      throw new Error(`X.AI request failed: ${error.message}`);
    }
  }
}

module.exports = XAIProvider;
