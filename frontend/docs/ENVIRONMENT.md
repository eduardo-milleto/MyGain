# Environment

## Requirements

- Node.js 18+ (recommended 20+)
- npm 9+

## Local Development

1. `npm install`
2. `npm run dev`

## Environment Variables

This project does not require environment variables for local development.

If backend integration is added, follow these rules:

- Define variables in `.env.local` only
- Never commit `.env.local`
- Use `VITE_` prefix for Vite-exposed variables
