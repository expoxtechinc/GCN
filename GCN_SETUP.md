# Global Connectivity Network (GCN)

A futuristic, AI-powered social media ecosystem.

## Environment Variables
- `GEMINI_API_KEY`: Required for AI Assistant and Chat features.
- `APP_URL`: The hosted URL (automatically set in AI Studio).

## Setup
1. Ensure Firebase is provisioned (already done for this project).
2. The server runs on `tsx server.ts` in development.
3. Build uses `vite build` and `esbuild` to bundle the server into `dist/server.cjs`.

## Features
- **AI Refinement**: Use the Sparkles icon on new posts to refine your content with Gemini.
- **AI Assistant**: Message the AI Bot in the Messenger for help or smart suggestions.
- **Hardened Security**: Firestore rules implement zero-trust access control.
- **Glassmorphism UI**: High-end modern design with smooth animations.
