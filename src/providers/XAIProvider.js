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

  async generateMockup(description) {
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
- Not include any JavaScript unless specifically requested

Return ONLY the HTML code, nothing else.`;

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: description }
          ],
          temperature: 0.7,
          max_tokens: 4000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content returned from X.AI API');
      }

      return this.extractHTML(content);
    } catch (error) {
      if (error.response) {
        throw new Error(`X.AI API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      throw new Error(`X.AI request failed: ${error.message}`);
    }
  }
}

module.exports = XAIProvider;
