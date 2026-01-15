require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const ProviderFactory = require('./providers/ProviderFactory');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Store mockup history in memory (for iteration support)
const mockupHistory = new Map();

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    provider: process.env.AI_PROVIDER || 'not configured',
    supportedProviders: ProviderFactory.getSupportedProviders()
  });
});

/**
 * Generate mockup endpoint
 */
app.post('/api/generate', async (req, res) => {
  try {
    const { description, provider, sessionId } = req.body;

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({ 
        error: 'Description is required and must be a non-empty string' 
      });
    }

    // Determine which provider to use
    const providerType = provider || process.env.AI_PROVIDER || 'xai';

    // Create provider instance
    const aiProvider = ProviderFactory.createProvider(providerType, process.env);

    console.log(`Generating mockup using ${aiProvider.getName()} provider...`);

    // Generate mockup
    const html = await aiProvider.generateMockup(description);

    // Store in history if sessionId provided, otherwise generate a new one
    const id = sessionId || crypto.randomBytes(16).toString('hex');
    if (!mockupHistory.has(id)) {
      mockupHistory.set(id, []);
    }
    mockupHistory.get(id).push({
      description,
      html,
      timestamp: new Date().toISOString(),
      provider: aiProvider.getName()
    });

    res.json({
      success: true,
      html,
      sessionId: id,
      provider: aiProvider.getName(),
      historyCount: mockupHistory.get(id).length
    });

  } catch (error) {
    console.error('Error generating mockup:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get mockup history endpoint
 */
app.get('/api/history/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const history = mockupHistory.get(sessionId);

  if (!history) {
    return res.status(404).json({
      error: 'Session not found'
    });
  }

  res.json({
    success: true,
    history: history
  });
});

/**
 * Get list of supported providers
 */
app.get('/api/providers', (req, res) => {
  res.json({
    success: true,
    providers: ProviderFactory.getSupportedProviders(),
    current: process.env.AI_PROVIDER || 'xai'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mockup Renderer Server running on port ${PORT}`);
  console.log(`Default AI Provider: ${process.env.AI_PROVIDER || 'xai'}`);
  console.log(`Open http://localhost:${PORT} to use the application`);
});

module.exports = app;
