# Reddoor Starter and Site Scaffold

## Purpose

A forkable starting point for all SvelteKit, Tailwind + Prismic sites developed at Reddoor.

## Stack

- **[SvelteKit](https://kit.svelte.dev/)** — Frontend framework with excellent DX and component-driven design
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first CSS
- **[Prismic CMS](https://prismic.io/)** — Headless CMS with Slice Machine for flexible content modeling
- **[Netlify](https://www.netlify.com/)** — Deployment and hosting
- **[Vitest](https://vitest.dev/)** — Unit testing

## Components

A library of responsive, reusable components designed to be used within Prismic Slices or standalone:

- **Animation** — `AnimateIn`, `AnimateInTriggered`, `AnimateOutTriggered`, `Slider`, `TriggerTransitionOnMount`
- **Layout** — `ContentWidth`, `ScreenWidthMedia`, `TransitionOverlay`
- **UI** — `Accordion`, `DefaultButton`, `DelayedLink`, `LandscapeModal`, `Nav`, `Footer`, `ScaleTextToContainer`

This library grows as new interactive functions or layouts are needed, allowing work from different projects to carry over rather than rebuilding from scratch.

## Getting Started

1. Fork/clone this repo and init a new project
2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create a new Prismic repository
4. Update `slicemachine.config.json` with your new Prismic repo name
5. Start the dev server (runs Vite + Slice Machine concurrently):

   ```bash
   yarn dev
   ```

6. Push your custom types/slices to Prismic
7. Build your site using slices for complex CMS needs, or custom types for simpler setups

## Scripts

| Command | Description |
| --- | --- |
| `yarn dev` | Start dev server + Slice Machine |
| `yarn build` | Production build |
| `yarn preview` | Preview production build |
| `yarn check` | Svelte type checking |
| `yarn lint` | Lint with ESLint + Prettier |
| `yarn format` | Auto-format with Prettier |
| `yarn test` | Run tests with Vitest |
| `yarn slicemachine` | Start Slice Machine UI |

## Project Structure

```text
src/
├── lib/
│   ├── assets/          # Icons, images, placeholders
│   ├── components/      # Reusable Svelte components
│   ├── utils/           # Utility functions
│   └── prismicio.js     # Prismic client config
├── routes/              # SvelteKit routes + Prismic preview
├── params/              # Route param matchers
└── app.css              # Global styles (Tailwind)
customtypes/             # Prismic custom type definitions
static/                  # Static assets (favicon, robots.txt)
```
