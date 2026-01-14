/**
 * Base AI Provider Interface
 */
class AIProvider {
  /**
   * Generate HTML mockup from description
   * @param {string} description - User's mockup description
   * @returns {Promise<string>} - Generated HTML mockup
   */
  async generateMockup(description) {
    throw new Error('generateMockup must be implemented by subclass');
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
