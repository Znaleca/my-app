# Copilot instructions for this codebase

## Project overview
- Next.js App Router project. Pages live in `app/` and are React components; `app/layout.jsx` defines the root layout and global body classes.
- Global styles come from Tailwind CSS v4 via `@import "tailwindcss"` in `assets/styles/globals.css`, which is imported by the root layout.
- The current homepage is a client component with Framer Motion animations in `app/page.jsx`.

## Key files & patterns
- `app/layout.jsx`: loads `next/font` (Geist) and sets CSS variables on the `<body>`; keep font variables consistent with `assets/styles/globals.css`.
- `app/page.jsx`: marked with `"use client"` because it uses React state and Framer Motion. Follow this pattern for any interactive/animated UI.
- `assets/styles/globals.css`: defines CSS variables and base `body` styles; prefer Tailwind utility classes for component styling.
- `components/` exists but is currently empty; create reusable UI components here when extracting pieces from pages.

## Styling conventions
- Use Tailwind utility classes in JSX; avoid adding bespoke CSS unless it’s truly global.
- Theme is light-first; dark mode is handled via body classes in `app/layout.jsx`.

## Animations & interactivity
- Use Framer Motion (`motion.*`) for animations and `useMemo` to precompute randomized UI values (see `app/page.jsx`).
- Keep motion config co-located with the component for readability.

## Assets
- Static files belong in `public/` (served at `/`), while design resources can live under `assets/` and be imported directly.

## Developer workflows
- Dev server: `npm run dev`
- Build: `npm run build`
- Production start: `npm run start`

## Notes for changes
- Preserve the App Router structure; add new routes under `app/` using folder-based routing.
- When adding client-side logic (state, effects, animations), include `"use client"` at the top of the file.