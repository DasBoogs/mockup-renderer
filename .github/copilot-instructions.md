# GitHub Copilot Instructions for Mockup Renderer

## Project Overview

This is an AI-powered UI mockup generator that creates complete HTML mockups from natural language descriptions. The application supports multiple AI providers (X.AI and Z.AI) through an abstract provider pattern.

## Architecture

### Project Structure
- `src/server.js` - Express server with API endpoints
- `src/providers/` - AI provider implementations
  - `AIProvider.js` - Abstract base class defining the provider interface
  - `XAIProvider.js` - X.AI implementation
  - `ZAIProvider.js` - Z.AI implementation
  - `ProviderFactory.js` - Factory pattern for creating provider instances
- `public/` - Static web UI files
- `.env` - Environment configuration (not committed)

### Design Patterns
- **Factory Pattern**: `ProviderFactory` creates provider instances based on configuration
- **Abstract Base Class**: `AIProvider` defines the interface that all providers must implement
- **Strategy Pattern**: Providers are interchangeable implementations of the same interface

## Coding Conventions

### JavaScript Style
- Use **ES6+ syntax** (const/let, arrow functions, async/await)
- Use **JSDoc comments** for classes and methods
- Use **descriptive variable names** (e.g., `providerType`, `sessionId`, not `pt`, `sid`)
- Prefer **const** over let when variables won't be reassigned

### Error Handling
- Always use try-catch blocks for async operations
- Return meaningful error messages in API responses
- Log errors to console for debugging
- Use appropriate HTTP status codes (400 for client errors, 500 for server errors)

### API Conventions
- All API endpoints are under `/api/` prefix
- Use JSON for request and response bodies
- Include `success` boolean in all API responses
- Return consistent error structure: `{ error: "message" }`

## Adding New AI Providers

To add a new AI provider:

1. Create a new class in `src/providers/` that extends `AIProvider`
2. Implement required methods:
   - `generateMockup(description)` - Main generation logic
   - `getName()` - Return provider name
3. Use the `extractHTML()` helper to handle markdown code blocks
4. Update `ProviderFactory` to support the new provider
5. Add the provider to `getSupportedProviders()` array
6. Add corresponding environment variables to `.env.example`

Example structure:
```javascript
const AIProvider = require('./AIProvider');
const axios = require('axios');

class NewProvider extends AIProvider {
  constructor(apiKey, apiUrl, model) {
    super();
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.model = model;
  }

  async generateMockup(description) {
    // Implementation here
    // Use this.extractHTML() to clean response
  }

  getName() {
    return 'New Provider';
  }
}

module.exports = NewProvider;
```

## Environment Configuration

- Use `dotenv` for environment variable management
- Never commit `.env` files (listed in `.gitignore`)
- Update `.env.example` when adding new configuration options
- Access environment variables through `process.env`

## API Endpoints

### POST /api/generate
Generate HTML mockup from description
- Required: `description` (string)
- Optional: `provider` ('xai' or 'zai'), `sessionId` (string)
- Returns: `{ success, html, sessionId, provider, historyCount }`

### GET /api/history/:sessionId
Retrieve mockup generation history for a session
- Returns: `{ success, history: [...] }`

### GET /api/providers
Get supported providers
- Returns: `{ success, providers: [...], current }`

### GET /api/health
Health check and configuration status
- Returns: `{ status, provider, supportedProviders }`

## Session Management

- Sessions are stored in-memory using a Map
- Each session contains an array of mockup generation history
- SessionIds are generated using `crypto.randomBytes(16).toString('hex')`
- History includes: description, html, timestamp, provider

## Development Workflow

### Running the Application
```bash
npm start          # Start the server
```

### Testing
- Manual testing: Start server and open http://localhost:3000
- Test API endpoints using curl or Postman
- Verify both X.AI and Z.AI providers work correctly

### Common Tasks
- **Adding features**: Follow the existing architectural patterns
- **Debugging**: Check console logs for detailed error information
- **Configuration**: Update `.env` file for local development

## Dependencies

- **express** - Web server framework
- **dotenv** - Environment variable management
- **axios** - HTTP client for AI API requests

Keep dependencies minimal. Only add new dependencies when absolutely necessary.

## Code Quality

- Follow the existing code style and patterns
- Write clear, self-documenting code
- Add JSDoc comments for public APIs
- Use meaningful variable and function names
- Keep functions focused and single-purpose
- Avoid deep nesting (max 3 levels)

## Security Considerations

- Never log or expose API keys
- Validate all user inputs (especially `description` in POST /api/generate)
- Use environment variables for sensitive configuration
- Implement rate limiting if deploying to production
- Sanitize any user-provided content before rendering

## When Making Changes

1. **Understand the provider pattern** before modifying provider logic
2. **Maintain backward compatibility** with existing API contracts
3. **Test both providers** (X.AI and Z.AI) when changing core logic
4. **Update documentation** when adding new features or endpoints
5. **Follow the factory pattern** when adding new provider types
