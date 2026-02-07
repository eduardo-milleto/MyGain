# MyGain Frontend

Enterprise-grade frontend for the MyGain platform. This workspace is organized for long-term maintainability, security, and clear ownership.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env.local
   ```

3. Add Supabase credentials:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (backend base URL)

4. Run the dev server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Scripts

- `npm run dev`: Start Vite dev server
- `npm run build`: Production build

## Project Structure

- `src/app`: Application modules and pages
- `src/app/components`: UI and feature components
- `src/app/contexts`: App contexts and providers
- `src/styles`: Global styles and theme tokens
- `guidelines/Guidelines.md`: Design and implementation guidelines
- `docs/`: Architecture and operational documentation

## Documentation

- `docs/ARCHITECTURE.md`: System overview and frontend boundaries
- `docs/ENVIRONMENT.md`: Environment and configuration guidelines
- `docs/PROJECT_STRUCTURE.md`: Folder and file conventions
- `TEST_USERS.md`: Test accounts and permissions matrix
- `ATTRIBUTIONS.md`: Third-party attributions

## Notes

This frontend is intentionally framework-light and avoids backend coupling to keep deployment independent. Any production secrets must be provided via environment variables and must never be committed.
