# Dramalens

Frontend-only Korean drama recommendations powered by Google Identity Services and the YouTube Data API v3.

> **Demo project:** Dramalens was built to test an AI spec-driven development workflow. It demonstrates how a written product specification can be translated into a working interface, external integrations, local persistence, deterministic recommendation logic, and automated tests. It is not a production-ready authentication or data platform.

## What It Does

- Signs users in with the official Google Identity Services web client.
- Stores each user's basic profile and genre preferences locally by Google `sub` identifier.
- Fetches public video metadata and thumbnails from the MundoPelis YouTube channel.
- Classifies video genres locally from titles and descriptions.
- Ranks videos against the user's selected genres.
- Opens each recommendation at its original YouTube URL.
- Provides responsive login, profile, preference editing, recommendation, and logout flows.

The application has no backend, database, server-side session, or YouTube OAuth integration.

## Technology Stack

| Area | Technology |
| --- | --- |
| UI | React 19 with TypeScript 6 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 through `@tailwindcss/vite` |
| Remote data | TanStack Query |
| Motion | Framer Motion |
| Client state | React state; Zustand is available for future state needs |
| Authentication | Google Identity Services |
| Video data | YouTube Data API v3 |
| Testing | Vitest |
| Quality checks | ESLint and TypeScript project builds |

## Getting Started

### Prerequisites

- Node.js compatible with the installed Vite and Vitest versions
- A Google OAuth web client ID
- A YouTube Data API v3 key

### Installation

```bash
npm install
```

Copy the safe environment template:

```bash
copy .env.example .env.local
```

On macOS or Linux, use `cp .env.example .env.local` instead.

Set the values in `.env.local`:

```env
VITE_GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
VITE_YOUTUBE_API_KEY=your-youtube-data-api-key
VITE_MUNDOPELIS_CHANNEL_ID=
```

Configure the Google OAuth client with the development and deployment origins used by the app. Enable YouTube Data API v3 and restrict the API key to the allowed web origins. `VITE_MUNDOPELIS_CHANNEL_ID` is optional; when it is absent, the app resolves a channel named `MundoPelis` through a public YouTube search request.

### Run Locally

```bash
npm run start
```

The Vite development server will print the local URL in the terminal.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run start` | Start the Vite development server |
| `npm test` | Run the Vitest suite once |
| `npm run lint` | Run ESLint across the project |
| `npm run build` | Run TypeScript project checks and create the production bundle |
| `npm run preview` | Serve the production bundle locally |

Run the full verification sequence before submitting changes:

```bash
npm test
npm run lint
npm run build
```

## Project Structure

```text
src/
|-- modules/
|   |-- auth/          Google Identity Services and login UI
|   |-- dramas/        YouTube service, classification, ranking, and cards
|   `-- preferences/   Genre types and preference controls
|-- shared/            Reusable branding and profile components
|-- storage/           localStorage keys and user repositories
|-- App.tsx            Session orchestration
`-- main.tsx           React and TanStack Query bootstrap
```

Tests are colocated with the code they cover under `src/**/*.test.ts`.

## Security and Production Limitations

This demo intentionally keeps all integration logic in the browser. That makes it easy to run, but it also creates important risks that must be addressed before production use:

- **API key exposure:** Any `VITE_*` value is bundled into browser code. The YouTube key is not a secret in this architecture. A production system should proxy YouTube requests through a backend, enforce quotas and authorization server-side, and use strict origin restrictions as defense in depth.
- **Unverified profile claims:** The browser decodes the Google credential to obtain `sub`, name, email, and picture. Without a backend, the application does not cryptographically verify the JWT signature or issuer. A production backend must verify the token against Google's keys, issuer, audience, expiry, and nonce before trusting the subject.
- **localStorage exposure:** Profiles and preferences are readable by any JavaScript executing on the origin. An XSS vulnerability could expose or modify this data. Production applications should prevent XSS with a strict Content Security Policy, secure output handling, dependency controls, and a server-side persistence strategy for sensitive data.
- **No durable session security:** The current session exists only in React memory and is cleared on logout or reload. This is not a replacement for secure, server-managed sessions. Production authentication should use appropriate secure, HttpOnly, SameSite cookies and server-side session revocation.
- **No backend authorization boundary:** There is no server enforcing user ownership, rate limits, abuse controls, audit logging, or account deletion. Client-side subject keys must never be treated as authorization.
- **Third-party privacy and availability:** Google and YouTube receive requests from the browser and may expose metadata, quotas, referrer information, or availability changes. A production deployment needs a privacy review, data-minimization policy, consent decisions, failure handling, and compliance with Google's and YouTube's terms.
- **Untrusted external content:** Video titles, descriptions, thumbnails, and profile images come from external systems. They must remain treated as untrusted data, with safe rendering and appropriate image/content policies.

These limitations are part of the demo's purpose and should remain visible to anyone evaluating or extending it.

## Data Handling

- The app stores only the decoded basic profile and genre preferences in browser `localStorage`.
- Storage keys include the Google `sub` identifier to isolate users on the same browser profile.
- The Google credential and ID token are kept in memory only and are never written to storage.
- YouTube is used only for public metadata, thumbnails, and links; the app does not use YouTube OAuth.
- Clearing site storage removes the locally persisted profile and preferences.

## License

This repository is a demonstration project. Add the license terms appropriate for your intended distribution before publishing it as a reusable product.
