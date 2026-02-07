# MyGain

Enterprise-grade repository for the MyGain platform.

## Structure

- `frontend/`: Frontend application (Vite + React)

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

## Notes

This repository currently contains only the frontend. Backend services should be added as separate, well-isolated modules.

## CI/CD (Development)

GitHub Actions runs E2E auth tests on the `development` branch. Configure these secrets in GitHub:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`
