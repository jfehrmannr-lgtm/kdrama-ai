# Agent Instructions

## Project

- This is a single-package React + TypeScript application built with Vite that provides personalized Korean drama recommendations using the YouTube Data API v3 and Google OAuth authentication.
- This is Only a demo so isn't connected with a real database or API Rest responses.

## Technology Stack

- React 19, TypeScript 6, and Vite 8.
- TanStack Query handles remote video fetching; Framer Motion handles UI transitions; Tailwind CSS v4 is integrated through `@tailwindcss/vite`; Vitest runs tests.
- Use existing dependencies when they already provide the required functionality.

## Commands

- Development: `npm run start`
- Lint: `npm run lint`
- Tests: `npm test`
- Build/verification: `npm run build` (runs `tsc -b` before `vite build`)
- Preview: `npm run preview`
- Run `npm test`, `npm run lint`, and `npm run build` before considering a change verified.
- Husky `pre-commit` runs `npm run lint`; `commit-msg` runs Commitlint. Use `npm run commit` for the Commitizen prompt.

## Runtime Configuration

- Real integrations require `VITE_GOOGLE_CLIENT_ID` and `VITE_YOUTUBE_API_KEY` in `.env.local`; `VITE_MUNDOPELIS_CHANNEL_ID` is optional. Use `.env.example` as the safe template.
- Google Identity Services credentials are decoded in memory only; never put the Google credential or ID token in `localStorage`.
- YouTube access is limited to public metadata, thumbnails, and links. Genre classification is local and recommendation ranking is deterministic.

## Constraints

- TypeScript includes `src/` and enables `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, and `erasableSyntaxOnly`; remove unused symbols before building.
- `npm install` updates the committed `package-lock.json`; do not add credentials or real environment values to tracked files.
- New dependencies require explicit user authorization and must remain compatible with the current React/Vite stack.
- Use Conventional Commits: `fix`/`perf`/`refactor` are patch-level changes, `feat` is minor-level, and `!` or `BREAKING CHANGE` is major-level under SemVer `MAJOR.MINOR.PATCH`.

## Code Conventions

- Prioritize readable, maintainable code over clever abstractions or micro-optimizations.
- Use descriptive names and avoid unnecessary abbreviations.
- Declare functions and React components using arrow functions.
- Use `lowerCamelCase` for functions, utilities, variables, hooks, and constants.
- Use `UpperCamelCase` for React components and component files.
- Do not use global variables or global mutable state.
- Keep constants scoped as locally as possible.
- Prefer early returns and extracted logic over deeply nested conditions.
- Avoid overly compact one-liners when they reduce readability.
- Prefer Tailwind CSS built-in utilities, naming conventions, and design patterns instead of creating custom alternatives.
- When custom Tailwind theme tokens, colors, utilities, or animations are required, define them in `index.css` and reuse them consistently across the project instead of duplicating them locally.

### Documentation

- Document functions, hooks, services, repositories, utilities, and React components using TSDoc.
- Document parameters, return values, behavior, and relevant constraints when they are not obvious from the code.
- Use inline comments only for non-obvious logic, architectural decisions, workarounds, or external integration behavior.
- Do not add comments that simply restate the code.
- Keep documentation concise and synchronized with the implementation.
