# AGENTS.md

Repository guide for coding agents working in `globe-rush`.

## 1) Project Snapshot

- Stack: Nuxt 4 + Vue 3 + TypeScript + Nuxt UI + Tailwind CSS 4.
- Package manager: `pnpm` (lockfile: `pnpm-lock.yaml`).
- App source is under `app/`.
- Important configs:
  - `nuxt.config.ts`
  - `eslint.config.mjs` (Nuxt-integrated ESLint)
  - `eslint.config.js` (Antfu base config)
  - `tsconfig.json` (Nuxt-generated references)

## 2) Install / Run / Build Commands

Run all commands from repository root.

### Install

- `pnpm install`

### Development

- `pnpm dev` - start local dev server.
- `pnpm preview` - preview built app.

### Production Build

- `pnpm build` - create production build.
- `pnpm generate` - generate static output.

### Lint

- `pnpm lint` - run ESLint on repo.
- `pnpm lint:fix` - run ESLint with autofix.

### Tests (Current State)

- There is currently no project test framework configured in `package.json` scripts.
- No repo test files were found under common patterns (`*.test.*`, `*.spec.*`).

### Single Test Execution (When Tests Are Added)

If Vitest is introduced (recommended for Nuxt/Vue unit tests), use:

- `pnpm vitest` - run all tests.
- `pnpm vitest path/to/file.test.ts` - run one file.
- `pnpm vitest path/to/file.test.ts -t "test name"` - run one test case by name.
- `pnpm vitest --watch path/to/file.test.ts` - watch one file.

If tests are added via scripts instead, prefer script commands from `package.json`.

## 3) Repository Structure

- `app/pages/` - route pages (`index.vue`, `play/[region].vue`).
- `app/components/` - UI components organized by domain (`game/`, `play/`, `the/`, `base/`).
- `app/composables/` - composition logic (`useGame.ts`).
- `app/utils/` - shared data/constants/helpers (`countries.ts`, `playable-regions.ts`).
- `app/assets/css/main.css` - Tailwind/Nuxt UI imports and app-level styles.
- `app/countries.json` - source dataset used by gameplay.

## 4) Auto-Import Rules (Nuxt)

- Do **not** import from `/composables` manually in most cases.
- Do **not** import from `/utils` manually in most cases.
- In this repo, functions/constants from those directories are auto-imported by Nuxt.
- Prefer direct usage (for example `useGame`, `countries`, `playableRegions`) unless a specific explicit import is required for tooling edge cases.
- Continue to import types from external modules when needed (for example `import type { NuxtError } from '#app'`).

## 5) Code Style Conventions

Follow existing patterns in the repository first; use these as defaults.

### Language and Framework

- Use TypeScript for logic files and `<script setup lang="ts">` in Vue SFCs.
- Keep components/composables small and focused.
- Prefer Vue/Nuxt composables (`ref`, `computed`, `useRoute`, `useSeoMeta`, etc.) over custom alternatives unless required.

### Imports

- Rely on Nuxt auto-imports for Vue/Nuxt APIs and local `app/composables` + `app/utils` exports.
- Use explicit imports when auto-import does not apply (external libs, types, JSON, or clarity-critical cases).
- Use `import type` for type-only imports.
- Keep imports minimal and remove unused imports.

### Formatting

- Use ESLint as source of truth (`pnpm lint`).
- Use 2-space indentation.
- Prefer single quotes in TS/JS as used in current files.
- Keep trailing commas where lint/style expects them.
- Keep line length readable; split long object literals and props across lines.

### Types

- Avoid `any`; prefer explicit interfaces/types.
- Define domain types in shared files when reused (example: `Country` in `app/utils/countries.ts`).
- Use generics where they improve type safety (`shuffle<T>` pattern).
- Treat nullable/optional values explicitly (`if (!question.value) return`).

### Naming

- Components: PascalCase file names (`GameHeader.vue`, `PlayHeaderCard.vue`).
- Composables: `useX` naming (`useGame.ts`).
- Utilities/constants: kebab-case file names with descriptive exports.
- Variables/functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` for fixed values (`CHOICE_COUNT`, `ADVANCE_DELAY`).
- Route params: normalize early (see region slug lowercasing pattern).

### Vue SFC Patterns

- Order: `<script setup>` first, `<template>` second, optional `<style>` last.
- Keep template conditions clear (`v-if`/`v-else`) and avoid deeply nested branching.
- Use computed values for derived UI/state rather than inline complex expressions.
- Use emitted events for parent-child actions (`back`, `retry`, etc.).

### State and Data Flow

- Keep game/session logic in composables, not in page templates.
- Prefer immutable transforms for arrays (`filter`, `map`, `slice`) unless mutation is intentional and local.
- Reset all related state in restart flows (`retry` resets index/questions/errors/pause).

### Error Handling

- In pages, throw Nuxt errors via `createError` for invalid route state.
- Provide status code and status message for user-facing errors.
- Guard against missing data before accessing nested values.
- Fail early with explicit checks.

### Accessibility and UX

- Preserve reduced-motion handling in CSS (`prefers-reduced-motion`).
- Keep image `loading="lazy"` and `decoding="async"` behavior when rendering many flags/cards.
- Maintain semantic labels/text for actionable buttons.

## 6) Agent Workflow Expectations

- Before edits: inspect nearby files for established conventions.
- After edits: run `pnpm lint` at minimum.
- If build-sensitive changes are made: run `pnpm build`.
- If tests are introduced later: run the narrowest relevant test first, then broader suite.
- Avoid large unrelated refactors in the same change.

## 7) Cursor / Copilot Rules

- No `.cursorrules` file was found.
- No `.cursor/rules/` directory rules were found.
- No `.github/copilot-instructions.md` was found.
- If any of these files are added later, treat them as higher-priority agent instructions and update this document.

## 8) Quick Command Reference

- Install deps: `pnpm install`
- Start dev: `pnpm dev`
- Lint: `pnpm lint`
- Lint + fix: `pnpm lint:fix`
- Build: `pnpm build`
- Generate static site: `pnpm generate`
- Preview build: `pnpm preview`
- Single test file (future Vitest): `pnpm vitest path/to/file.test.ts`
- Single named test (future Vitest): `pnpm vitest path/to/file.test.ts -t "name"`

Keep this file updated when scripts, tooling, or folder conventions change.
