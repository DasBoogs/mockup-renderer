/**
 * Base AI Provider Interface
 */
class AIProvider {
  /**
   * Generate HTML mockup from description
   * @param {string} description - User's mockup description
   * @param {Array} conversationHistory - Optional array of previous {description, html} pairs
   * @returns {Promise<string>} - Generated HTML mockup
   */
  async generateMockup(description, conversationHistory = []) {
    throw new Error('generateMockup must be implemented by subclass');
  }

  /**
   * Build messages array with system prompt, conversation history, and current request
   * @param {string} systemPrompt - System prompt for the AI
   * @param {Array} conversationHistory - Array of previous {description, html} pairs
   * @param {string} currentDescription - Current user description
   * @returns {Array} - Array of message objects with role and content
   */
  buildMessagesWithHistory(systemPrompt, conversationHistory, currentDescription) {
    const messages = [{ role: 'system', content: systemPrompt }];
    
    // Add previous conversation history
    for (const item of conversationHistory) {
      messages.push({ role: 'user', content: item.description });
      messages.push({ role: 'assistant', content: item.html });
    }
    
    // Add current user message
    messages.push({ role: 'user', content: currentDescription });
    
    return messages;
  }

  /**
   * Get provider name
   * @returns {string} - Provider name
   */
  getName() {
    throw new Error('getName must be implemented by subclass');
  }

  /**
   * Extract HTML from API response content
   * Removes markdown code blocks if present
   * @param {string} content - Raw content from API
   * @returns {string} - Extracted HTML
   */
  extractHTML(content) {
    // Remove markdown code blocks if present
    const htmlMatch = content.match(/```html\n?([\s\S]*?)```/);
    if (htmlMatch) {
      return htmlMatch[1].trim();
    }

    // Remove any other code block markers
    const codeMatch = content.match(/```\n?([\s\S]*?)```/);
    if (codeMatch) {
      return codeMatch[1].trim();
    }

    // Return as-is if no code blocks found
    return content.trim();
  }
}

module.exports = AIProvider;
