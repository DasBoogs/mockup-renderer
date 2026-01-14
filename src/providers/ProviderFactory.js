const XAIProvider = require('./XAIProvider');
const ZAIProvider = require('./ZAIProvider');

/**
 * Factory for creating AI provider instances
 */
class ProviderFactory {
  /**
   * Create an AI provider based on configuration
   * @param {string} providerType - 'xai' or 'zai'
   * @param {Object} config - Provider configuration
   * @returns {AIProvider} - AI provider instance
   */
  static createProvider(providerType, config) {
    const type = providerType.toLowerCase();

    switch (type) {
      case 'xai':
        return new XAIProvider(
          config.XAI_API_KEY,
          config.XAI_API_URL,
          config.XAI_MODEL
        );
      case 'zai':
        return new ZAIProvider(
          config.ZAI_API_KEY,
          config.ZAI_API_URL,
          config.ZAI_MODEL
        );
      default:
        throw new Error(`Unknown provider type: ${providerType}. Supported types: xai, zai`);
    }
  }

  /**
   * Get list of supported providers
   * @returns {string[]} - Array of provider names
   */
  static getSupportedProviders() {
    return ['xai', 'zai'];
  }
}

module.exports = ProviderFactory;
