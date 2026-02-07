# Railway Deployment

This repo is a monorepo with the frontend in `frontend/`. Railway uses the root `package.json` and `railway.json` to build and serve the static app.

## Build/Start

- Build: `npm run build` (installs frontend deps and builds `frontend/dist`)
- Start: `npm run start` (serves `frontend/dist` on `$PORT`)

## Branch Mapping

- Production environment → GitHub branch `main`
- Development environment → GitHub branch `development`

Configure this in Railway Service → Settings → Source.

## Notes

- Ensure `PORT` is provided by Railway (it is by default).
- If you add a backend later, create a separate Railway service for it.
