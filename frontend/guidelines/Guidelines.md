# MyGain Frontend Guidelines

## Purpose

These guidelines define engineering and UX standards for the MyGain frontend. They are designed for enterprise-grade delivery with a focus on maintainability, consistency, and safety.

## Engineering Standards

- Prefer composition over inheritance.
- Keep components small and focused. If a component exceeds ~200 lines, extract sub-components.
- Avoid business logic in UI-only components.
- Keep state close to where it is used; elevate only when necessary.
- Use explicit typing for public APIs and context values.
- Avoid hard-coded magic numbers; prefer named constants.

## Architecture

- `src/app`: application entry and routing state
- `src/app/components`: feature components and shared UI
- `src/app/contexts`: React contexts and providers
- `src/styles`: global styles, tokens, and theme

## Design System

- Typography scale is defined in `src/styles/theme.css`.
- Avoid introducing new colors without updating the theme.
- Buttons, inputs, and form elements should use consistent spacing and focus states.
- Use motion sparingly and consistently for key transitions.

## Accessibility

- All interactive elements must be keyboard accessible.
- Provide visible focus states on inputs and buttons.
- Use semantic HTML elements where possible.
- Ensure color contrast meets WCAG AA.

## Quality Gate

- No UI strings in Portuguese. All UI and documentation must be English.
- No debug logs in production-facing components.
- Ensure data examples avoid sensitive or real customer data.
