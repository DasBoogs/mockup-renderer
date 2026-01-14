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
}

module.exports = AIProvider;
