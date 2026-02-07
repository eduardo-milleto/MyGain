# Architecture

## Overview

The MyGain frontend is a Vite + React application. It is intentionally decoupled from backend services to enable independent deployments and parallel development.

## Key Boundaries

- UI state, navigation, and user role behavior live in `src/app`.
- Feature modules are composed in `src/app/components`.
- Shared app state is managed in `src/app/contexts`.
- Styling, tokens, and base typography are in `src/styles`.

## Data and State

- Local UI state is preferred for per-view concerns.
- Context providers are used for app-wide state such as authentication.
- Any future API integration must live behind a dedicated client layer (not yet implemented).

## Security Considerations

- No secrets are committed to source control.
- Production API endpoints must be sourced from environment variables.
- Do not log sensitive data in the browser console.
