# Mockup Renderer

An AI-powered UI mockup generator that creates complete HTML mockups from natural language descriptions. Supports both X.AI and Z.AI endpoints for flexible model selection.

## Features

- 🎨 Generate complete HTML mockups from text descriptions
- 🤖 Support for multiple AI providers (X.AI and Z.AI)
- 🔄 Iterative design refinement
- 📝 Session-based history tracking
- 💾 Download or copy generated HTML
- 🎯 Modern, responsive UI
- ⚡ Fast and easy to use

## Prerequisites

- Node.js (v14 or higher)
- API keys for X.AI and/or Z.AI

## Installation

1. Clone the repository:
```bash
git clone https://github.com/DasBoogs/mockup-renderer.git
cd mockup-renderer
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` file with your API credentials:
```env
# Choose your AI provider: 'xai' or 'zai'
AI_PROVIDER=xai

# X.AI Configuration
XAI_API_KEY=your_xai_api_key_here
XAI_API_URL=https://api.x.ai/v1/chat/completions
XAI_MODEL=grok-beta

# Z.AI Configuration
ZAI_API_KEY=your_zai_api_key_here
ZAI_API_URL=https://api.z.ai/v1/chat/completions
ZAI_MODEL=default

# Server Configuration
PORT=3000
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Enter a description of your desired UI mockup in the text area

4. Select your preferred AI provider (X.AI or Z.AI)

5. Click "Generate Mockup" to create your HTML mockup

6. Use "Iterate on Design" to refine the mockup with additional instructions

7. Download or copy the generated HTML using the buttons in the preview panel

## Example Prompts

- "Create a modern login page with email and password fields, a 'Remember me' checkbox, and a blue 'Sign In' button"
- "A dashboard with a sidebar, top navigation bar, and cards showing metrics"
- "A pricing page with three tiers: Basic, Pro, and Enterprise with feature lists"
- "A blog post layout with hero image, article content, and author bio section"

## API Endpoints

### POST /api/generate
Generate a new mockup from a description.

**Request Body:**
```json
{
  "description": "Your mockup description",
  "provider": "xai" | "zai",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "html": "<html>...</html>",
  "sessionId": "session-id",
  "provider": "xai",
  "historyCount": 1
}
```

### GET /api/history/:sessionId
Retrieve mockup history for a session.

### GET /api/providers
Get list of supported AI providers.

### GET /api/health
Check server health and configuration.

## Architecture

### Project Structure
```
mockup-renderer/
├── src/
│   ├── providers/
│   │   ├── AIProvider.js       # Base provider interface
│   │   ├── XAIProvider.js      # X.AI implementation
│   │   ├── ZAIProvider.js      # Z.AI implementation
│   │   └── ProviderFactory.js  # Provider factory
│   └── server.js               # Express server
├── public/
│   └── index.html              # Web UI
├── .env.example                # Environment template
├── .gitignore
├── package.json
└── README.md
```

### AI Providers

The application uses an abstract provider pattern that allows easy integration of different AI services:

- **AIProvider**: Base class defining the interface
- **XAIProvider**: Implementation for X.AI endpoints
- **ZAIProvider**: Implementation for Z.AI endpoints
- **ProviderFactory**: Factory for creating provider instances

Both providers support the same API format and return complete HTML mockups.

## Configuration

### AI Provider Selection

You can configure the default provider in `.env`:
```env
AI_PROVIDER=xai  # or 'zai'
```

Users can also override this selection in the UI when generating mockups.

### API Configuration

Each provider requires:
- API Key: Your authentication key
- API URL: The endpoint URL
- Model: The model name to use

Refer to your AI provider's documentation for the correct values.

## Development

The application is built with:
- **Backend**: Node.js with Express
- **Frontend**: Vanilla JavaScript with modern CSS
- **AI Integration**: Axios for HTTP requests

To modify the system prompt or generation parameters, edit the respective provider files in `src/providers/`.

## Troubleshooting

### "API key is not configured"
- Ensure your `.env` file has the correct API key for your selected provider
- Verify the environment variable names match those in `.env.example`

### "No content returned from API"
- Check that your API key is valid
- Verify the API URL is correct
- Ensure you have sufficient API credits/quota

### Mockup doesn't render properly
- The AI might have included markdown formatting - the app automatically strips common markdown code blocks
- Try regenerating with a more detailed description
- Use the "Iterate on Design" feature to refine the output

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.